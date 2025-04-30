"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
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
  ThumbsUp,
  ChevronLeft,
  ChevronRight,
  Store,
} from "lucide-react";
import { useCartStore } from "@/store/cart";
import { getRecomendaciones, deleteItem } from "@/api/carrito";
import { useAuthStore } from "@/store/auth";
import { addItem as addItemApi } from "@/api/carrito";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { crearVenta, crearVentaT, crearPago } from "@/api/venta";

// Definición de tipos mejorada
interface ProductoDetalle {
  marca: string;
  precio: number;
}

interface Categoria {
  nombre: string;
  descripcion: string;
}

interface CartItem {
  id: number;
  nombre: string;
  descripcion: string;
  proveedor: string;
  descuento: number | null;
  imagenes: string[];
  stock_total: number;
  quantity: number;
  detalle?: ProductoDetalle; // Made optional with ?
  categorias: Categoria[];
}

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
    ? (item.detalle?.precio ?? 0) -
      (item.detalle?.precio ?? 0) * ((item.descuento ?? 0) / 100)
    : item.detalle?.precio ?? 0;
  const itemTotal = discountedPrice * item.quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= item.stock_total) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const eliminarItem = async () => {
    try {
      await deleteItem(item.id);
      onRemove(item.id);
    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 py-4 border-b border-slate-700">
      <div className="col-span-2 bg-[#1a2035] rounded-md h-24 flex items-center justify-center">
        {item.imagenes?.length > 0 ? (
          <img
            src={item.imagenes[0]}
            alt={item.nombre}
            className="h-full w-full object-cover rounded-md"
          />
        ) : (
          <div className="text-slate-500 text-xs text-center">Sin imagen</div>
        )}
      </div>

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
              {item.detalle?.marca || "Sin marca"}
            </Badge>
            {item.categorias.map((category, index) => (
              <Badge
                key={`category-${item.id}-${index}`}
                variant="outline"
                className="bg-slate-700 border-slate-600 text-slate-300"
              >
                {category.nombre}
              </Badge>
            ))}
          </div>
        </div>
        <button
          onClick={eliminarItem}
          className="text-slate-400 hover:text-red-400 text-sm flex items-center w-fit"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Eliminar
        </button>
      </div>

      <div className="col-span-2 flex flex-col items-start justify-center">
        {hasDiscount && (
          <span className="text-slate-400 text-sm line-through">
            Bs. {(item.detalle?.precio ?? 0).toFixed(2)}
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

      <div className="col-span-1 flex items-center justify-end">
        <span className="text-white font-bold">Bs. {itemTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

const RecommendedProductCard = ({
  product,
  onAddToCart,
}: {
  product: CartItem;
  onAddToCart: (product: CartItem) => void;
}) => {
  // Add safe defaults for detalle
  const detalle = product.detalle || { marca: "Sin marca", precio: 0 };
  const hasDiscount = product.descuento && product.descuento > 0;
  const discountedPrice = hasDiscount
    ? detalle.precio - detalle.precio * ((product.descuento ?? 0) / 100)
    : detalle.precio;
  const { id_cart } = useAuthStore();

  const agregarCarro = async () => {
    try {
      const res = await addItemApi({
        producto: product.id,
        cantidad: 1,
        cart: id_cart,
      });

      if (res.data) {
        const newProduct = { ...product, id: res.data.id };
        onAddToCart(newProduct);
      }
    } catch (error) {
      console.error("Error al agregar al carrito:", error);
    }
  };

  return (
    <Card className="border-slate-700 bg-[#1e2745] hover:bg-[#232d4d] transition-colors duration-300 h-full flex flex-col">
      <div className="relative pt-[75%] bg-[#1a2035]">
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white font-medium">
            {product.descuento}% OFF
          </Badge>
        )}
        <div className="absolute top-2 left-2">
          <Badge
            variant="outline"
            className="bg-slate-700 border-slate-600 text-slate-300"
          >
            {detalle.marca}
          </Badge>
        </div>
        {product.imagenes?.length > 0 ? (
          <img
            src={product.imagenes[0]}
            alt={product.nombre}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-xs">
            Sin imagen
          </div>
        )}
      </div>

      <CardContent className="p-4 flex-grow">
        <h3 className="font-medium text-white line-clamp-1">
          {product.nombre}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-2 mt-1 mb-2">
          {product.descripcion}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div>
            {hasDiscount && (
              <span className="text-slate-400 text-xs line-through block">
                Bs. {detalle.precio.toFixed(2)}
              </span>
            )}
            <span className="text-white font-bold">
              Bs. {discountedPrice.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          onClick={agregarCarro}
          className="w-full bg-slate-600 hover:bg-slate-500 text-white"
          disabled={product.stock_total <= 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Añadir al carrito
        </Button>
      </CardFooter>
    </Card>
  );
};

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<CartItem[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("2"); // Efectivo por defecto
  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [isLoadingRecs, setIsLoadingRecs] = useState(true);
  const [recsError, setRecsError] = useState<string | null>(null);

  const productsPerPage = 4;
  const { id_cart } = useAuthStore();
  const {
    items,
    itemCount,
    subtotal,
    total,
    couponApplied,
    couponDiscount,
    updateQuantity,
    removeItem,
    addItem,
  } = useCartStore();

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      setIsLoadingRecs(true);
      setRecsError(null);
      try {
        const response = await getRecomendaciones();
        if (response.data && Array.isArray(response.data)) {
          setRecommendedProducts(response.data);
        } else {
          throw new Error("Formato de datos inválido");
        }
      } catch (error) {
        console.error("Error al cargar las recomendaciones:", error);
        setRecsError(
          error instanceof Error ? error.message : "Error desconocido"
        );
        setRecommendedProducts([]);
      } finally {
        setIsLoadingRecs(false);
      }
    };

    fetchRecommendedProducts();
  }, [id_cart]);

  const handleNextPage = () => {
    if ((currentPage + 1) * productsPerPage < recommendedProducts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleProcessSale = async () => {
    setIsLoading(true);
    try {
      const venta: crearVentaT = {
        sucursal_id: 1,
        metodo_id_pago: parseInt(paymentMethod),
        direccion_id: 1,
      };

      // Espera a que se cree la venta y obtén el id_pago
      const resVenta = await crearVenta(venta);
      const id_pago = resVenta?.data?.venta.pago;

      console.log(resVenta.data);

      if (!id_pago) {
        throw new Error("No se pudo obtener el ID de pago.");
      }

      // Espera a que se procese el pago con el id_pago
      alert("El pago se ha realizado con exito.");

      setDialogOpen(false);

      // Vacía el carrito una vez que se realiza la compra
      useCartStore.setState({ items: [] });
    } catch (error) {
      console.error("Error al procesar la venta:", error);
      alert("Ocurrió un error al procesar la venta. Inténtalo nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const currentProducts = recommendedProducts.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

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
                      key={`loading-${index}`}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      key={`cart-item-${item.id}`}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={removeItem}
                    />
                  ))}
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="border-slate-700 bg-[#1e2745] sticky top-6">
                <CardHeader className="border-b border-slate-700">
                  <CardTitle className="text-white">
                    Resumen del pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <Separator className="bg-slate-700" />

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

                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 text-white mt-4"
                      onClick={() => setDialogOpen(true)}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Confirmar compra
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ThumbsUp className="h-5 w-5 mr-2 text-slate-300" />
              <h2 className="text-xl font-bold text-white">
                Productos Recomendados
              </h2>
            </div>

            {recommendedProducts.length > productsPerPage && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-slate-400">
                  {currentPage + 1} /{" "}
                  {Math.ceil(recommendedProducts.length / productsPerPage)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={
                    (currentPage + 1) * productsPerPage >=
                    recommendedProducts.length
                  }
                  className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {isLoadingRecs ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Card
                  key={`skeleton-${i}`}
                  className="border-slate-700 bg-[#1e2745] h-full animate-pulse"
                >
                  <div className="pt-[75%] bg-slate-700"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-slate-700 rounded mb-2 w-3/4"></div>
                    <div className="h-3 bg-slate-700 rounded mb-3 w-1/2"></div>
                    <div className="h-4 bg-slate-700 rounded w-1/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : recsError ? (
            <div className="text-center py-8 text-slate-400">
              Error al cargar productos recomendados: {recsError}
            </div>
          ) : recommendedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentProducts.map((product) => (
                <RecommendedProductCard
                  key={`rec-${product.id}-${product.nombre}`}
                  product={product}
                  onAddToCart={(product) =>
                    addItem({
                      ...product,
                      detalle: product.detalle || {
                        marca: "Sin marca",
                        precio: 0,
                      },
                    })
                  }
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              No hay productos recomendados disponibles
            </div>
          )}
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-[#1e2745] border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Confirmar Compra
            </DialogTitle>
          </DialogHeader>

          <div className="max-h-[300px] overflow-y-auto pr-2 my-4">
            {items.map((item) => {
              const hasDiscount = item.descuento && item.descuento > 0;
              const discountedPrice = hasDiscount
                ? item.detalle.precio -
                  item.detalle.precio * ((item.descuento ?? 0) / 100)
                : item.detalle.precio;

              return (
                <div
                  key={`confirm-item-${item.id}`}
                  className="flex items-center gap-3 py-3 border-b border-slate-700"
                >
                  <div className="h-12 w-12 bg-[#1a2035] rounded-md overflow-hidden flex-shrink-0">
                    {item.imagenes?.length > 0 ? (
                      <img
                        src={item.imagenes[0]}
                        alt={item.nombre}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-slate-500 text-xs">
                        Sin imagen
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-sm line-clamp-1">
                      {item.nombre}
                    </p>
                    <p className="text-slate-400 text-xs">
                      Cantidad: {item.quantity} - Bs.{" "}
                      {discountedPrice.toFixed(2)} c/u
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">
                      Bs. {(discountedPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Separator className="bg-slate-700" />

          <div className="space-y-4 my-4">
            <div className="space-y-2">
              <Label htmlFor="payment-method">Método de pago</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Seleccionar método de pago" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="2">Efectivo</SelectItem>
                  <SelectItem value="1">Tarjeta de Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>¿Cómo deseas recibir tu compra?</Label>
              <RadioGroup
                value={deliveryMethod}
                onValueChange={setDeliveryMethod}
              >
                <div className="flex items-center space-x-2 rounded-md border border-slate-700 p-3">
                  <RadioGroupItem
                    id="delivery"
                    value="delivery"
                    className="text-slate-300"
                  />
                  <Label
                    htmlFor="delivery"
                    className="flex items-center cursor-pointer"
                  >
                    <Truck className="h-4 w-4 mr-2" />
                    Delivery (Envío a domicilio)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-md border border-slate-700 p-3">
                  <RadioGroupItem
                    id="pickup"
                    value="pickup"
                    className="text-slate-300"
                  />
                  <Label
                    htmlFor="pickup"
                    className="flex items-center cursor-pointer"
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Recoger en sucursal
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="font-medium">Total:</span>
            <span className="font-bold text-xl">Bs. {total.toFixed(2)}</span>
          </div>

          <DialogFooter>
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              onClick={handleProcessSale}
              disabled={isLoading}
            >
              {isLoading ? (
                "Procesando..."
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Procesar Venta
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
