"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  CreditCard,
  Truck,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCartStore } from "@/store/cart";

// Definición de tipos
interface CartItem {
  id: number;
  nombre: string;
  descripcion: string;
  proveedor: string;
  descuento: number | null;
  imagenes: string[];
  stock_total: number;
  quantity: number;
  detalle: {
    marca: string;
    precio: number;
  };
  categorias: {
    nombre: string;
    descripcion: string;
  }[];
}

// Componente de elemento del carrito
const CartItemRow = ({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItem;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}) => {
  const hasDiscount = item.descuento && item.descuento > 0;
  const discountedPrice = hasDiscount
    ? item.detalle.precio - item.detalle.precio * ((item.descuento ?? 0) / 100)
    : item.detalle.precio;

  const itemTotal = discountedPrice * item.quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.stock_total) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 py-4 border-b border-slate-700">
      {/* Imagen del producto */}
      <div className="col-span-2 bg-[#1a2035] rounded-md h-24 flex items-center justify-center">
        {item.imagenes && item.imagenes.length > 0 ? (
          <img
            src={item.imagenes[0] || "/placeholder.svg"}
            alt={item.nombre}
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <div className="text-slate-500 text-xs text-center">Sin imagen</div>
        )}
      </div>

      {/* Información del producto */}
      <div className="col-span-5 flex flex-col justify-between">
        <div>
          <h3 className="font-medium text-white">{item.nombre}</h3>
          <p className="text-slate-400 text-sm line-clamp-1">
            {item.descripcion}
          </p>
          <div className="flex items-center mt-1 space-x-2">
            <Badge
              variant="outline"
              className="bg-slate-700 border-slate-600 text-slate-300"
            >
              {item.detalle.marca}
            </Badge>
            {item.categorias.map((category, index) => (
              <Badge
                key={index}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-slate-300"
              >
                {category.nombre}
              </Badge>
            ))}
          </div>
        </div>
        <button
          onClick={() => onRemove(item.id)}
          className="text-slate-400 hover:text-red-400 text-sm flex items-center w-fit"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Eliminar
        </button>
      </div>

      {/* Precio */}
      <div className="col-span-2 flex flex-col items-start justify-center">
        {hasDiscount && (
          <span className="text-slate-400 text-sm line-through">
            Bs. {item.detalle.precio.toFixed(2)}
          </span>
        )}
        <span className="text-white font-medium">
          Bs. {discountedPrice.toFixed(2)}
        </span>
        {hasDiscount && (
          <Badge className="mt-1 bg-red-600 hover:bg-red-700 text-white">
            {item.descuento}% OFF
          </Badge>
        )}
      </div>

      {/* Control de cantidad */}
      <div className="col-span-2 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            min="1"
            max={item.stock_total}
            value={item.quantity}
            onChange={(e) =>
              handleQuantityChange(Number.parseInt(e.target.value) || 1)
            }
            className="w-12 h-8 text-center bg-slate-700 border-slate-600 text-white"
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.stock_total}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Total */}
      <div className="col-span-1 flex items-center justify-end">
        <span className="text-white font-bold">Bs. {itemTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

// Componente principal del carrito
export default function CartPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState("");

  // Obtener datos del carrito desde Zustand
  const {
    items,
    itemCount,
    subtotal,
    total,
    couponApplied,
    couponDiscount,
    updateQuantity,
    removeItem,
    applyCoupon,
  } = useCartStore();

  // Simular carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Aplicar cupón de descuento
  const handleApplyCoupon = () => {
    if (couponCode.trim() === "") {
      alert("Por favor ingresa un código de cupón");
      return;
    }

    const success = applyCoupon(couponCode);

    if (success) {
      alert(`Se ha aplicado un descuento del ${couponDiscount}%`);
    } else {
      alert("El código ingresado no es válido");
    }
  };

  // Verificar si el carrito está vacío
  const isCartEmpty = items.length === 0;

  return (
    <div className="p-6 min-h-screen bg-[#1a2035]">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <ShoppingCart className="mr-2 h-6 w-6" />
            Carrito de Compras
            {!isLoading && !isCartEmpty && (
              <Badge className="ml-2 bg-slate-600 text-white">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </Badge>
            )}
          </h1>
          <Link
            to="/productos"
            className="text-slate-300 hover:text-white flex items-center"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Continuar comprando
          </Link>
        </div>

        {isLoading ? (
          // Estado de carga
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="border-slate-700 bg-[#1e2745]">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white">
                    Cargando carrito...
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {[...Array(2)].map((_, index) => (
                    <div
                      key={index}
                      className="py-4 animate-pulse flex space-x-4"
                    >
                      <div className="h-24 w-24 bg-slate-700 rounded"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                      </div>
                      <div className="w-24 space-y-2">
                        <div className="h-4 bg-slate-700 rounded"></div>
                        <div className="h-8 bg-slate-700 rounded"></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card className="border-slate-700 bg-[#1e2745] animate-pulse">
                <CardHeader className="border-b border-slate-700">
                  <div className="h-6 bg-slate-700 rounded w-1/2"></div>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-700 rounded"></div>
                  <div className="h-4 bg-slate-700 rounded"></div>
                  <div className="h-8 bg-slate-700 rounded"></div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : isCartEmpty ? (
          // Carrito vacío
          <Card className="border-slate-700 bg-[#1e2745]">
            <CardContent className="p-12 flex flex-col items-center justify-center">
              <ShoppingCart className="h-16 w-16 text-slate-500 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Tu carrito está vacío
              </h2>
              <p className="text-slate-400 text-center mb-6">
                Parece que aún no has añadido productos a tu carrito.
              </p>
              <Link to="/productos">
                <Button className="bg-slate-600 hover:bg-slate-500 text-white">
                  Explorar productos
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          // Carrito con productos
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de productos */}
            <div className="lg:col-span-2">
              <Card className="border-slate-700 bg-[#1e2745]">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white">
                    Productos en tu carrito
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-12 gap-4 pb-2 text-slate-400 text-sm">
                    <div className="col-span-2">Producto</div>
                    <div className="col-span-5">Detalles</div>
                    <div className="col-span-2">Precio</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-1 text-right">Total</div>
                  </div>

                  {items.map((item) => (
                    <CartItemRow
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Resumen del pedido */}
            <div>
              <Card className="border-slate-700 bg-[#1e2745] sticky top-6">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white">
                    Resumen del pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Cupón de descuento */}
                    <div>
                      <label className="text-sm text-slate-300 block mb-2">
                        Cupón de descuento
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Código de cupón"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
                        />
                        <Button
                          onClick={handleApplyCoupon}
                          className="bg-slate-600 hover:bg-slate-500 text-white whitespace-nowrap"
                        >
                          Aplicar
                        </Button>
                      </div>
                      {couponApplied && (
                        <p className="text-green-400 text-xs mt-1">
                          ¡Cupón aplicado! {couponDiscount}% de descuento
                        </p>
                      )}
                    </div>

                    <Separator className="bg-slate-700" />

                    {/* Detalles del precio */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Subtotal:</span>
                        <span className="text-white">
                          Bs. {subtotal.toFixed(2)}
                        </span>
                      </div>

                      {couponApplied && (
                        <div className="flex justify-between">
                          <span className="text-slate-300">Descuento:</span>
                          <span className="text-green-400">
                            - Bs.{" "}
                            {(subtotal * (couponDiscount / 100)).toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between">
                        <span className="text-slate-300">Envío:</span>
                        <span className="text-white">Gratis</span>
                      </div>

                      <Separator className="bg-slate-700" />

                      <div className="flex justify-between">
                        <span className="text-white font-medium">Total:</span>
                        <span className="text-white font-bold text-xl">
                          Bs. {total.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Botón de pago */}
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white mt-4">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Proceder al pago
                    </Button>

                    {/* Información adicional */}
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center text-slate-300 text-sm">
                        <Truck className="h-4 w-4 mr-2 text-slate-400" />
                        <span>Envío gratis en pedidos mayores a Bs. 500</span>
                      </div>
                      <div className="flex items-center text-slate-300 text-sm">
                        <ShieldCheck className="h-4 w-4 mr-2 text-slate-400" />
                        <span>Pago seguro garantizado</span>
                      </div>
                    </div>

                    {/* Alerta de ayuda */}
                    <Alert className="bg-slate-800 border-slate-700">
                      <AlertCircle className="h-4 w-4 text-slate-400" />
                      <AlertDescription className="text-slate-300 text-xs">
                        ¿Necesitas ayuda con tu pedido? Contáctanos al
                        <Link
                          to="tel:+59112345678"
                          className="text-blue-400 hover:text-blue-300 ml-1"
                        >
                          +591 12345678
                        </Link>
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
