"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { filtrarProductos } from "@/api/products";
import ReactPaginate from "react-paginate";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { addItem as addItemApi, addItemCart } from "@/api/carrito";
// Definición de tipos
interface ProductCategory {
  nombre: string;
  descripcion: string;
}

interface ProductDetail {
  marca: string;
  precio: number;
}

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  proveedor: string;
  descuento: number | null;
  imagenes: string[];
  stock_total: number;
  detalle: ProductDetail;
  categorias: ProductCategory[];
}

// Componente de tarjeta de producto individual
const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCartStore();
  const hasDiscount = product.descuento && product.descuento > 0;
  const discountedPrice = hasDiscount
    ? product.detalle.precio -
      product.detalle.precio * ((product.descuento ?? 0) / 100)
    : product.detalle.precio;
  const { id_cart } = useAuthStore();

  const handleAddToCart = async () => {
    const res = await addItemApi({
      producto: product.id,
      cantidad: 1,
      cart: id_cart,
    });

    product.id = res.data.id;
    console.log(product.id);
    addItem(product, 1);
    alert(`${product.nombre} ha sido añadido a tu carrito.`);
  };

  return (
    <Card className="overflow-hidden border-slate-700 bg-[#1e2745] hover:bg-[#232d4d] transition-colors duration-300 h-full flex flex-col">
      <div className="relative pt-[56.25%] bg-[#1a2035]">
        {hasDiscount && (
          <Badge className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white font-medium">
            {product.descuento}% OFF
          </Badge>
        )}
        <div className="absolute top-2 left-2 flex space-x-1">
          {product.categorias.map((category, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-slate-700 border-slate-600 text-slate-300"
            >
              {category.nombre}
            </Badge>
          ))}
        </div>
        {/* Placeholder para imágenes */}
        <button className="absolute bottom-2 right-2 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white">
          <Heart className="h-5 w-5" />
        </button>
      </div>

      <CardContent className="p-4 flex-grow">
        <div className="flex items-center mb-1">
          <Badge
            variant="outline"
            className="bg-slate-700 border-slate-600 text-slate-300 mr-2"
          >
            {product.detalle.marca}
          </Badge>
          {product.stock_total > 0 ? (
            <Badge className="bg-green-700 hover:bg-green-600 text-white">
              En Stock
            </Badge>
          ) : (
            <Badge className="bg-red-700 hover:bg-red-600 text-white">
              Agotado
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg text-white mb-1 line-clamp-2">
          {product.nombre}
        </h3>
        <p className="text-slate-300 text-sm line-clamp-2 mb-2">
          {product.descripcion}
        </p>
      </CardContent>

      <CardFooter className="p-4 pt-0 border-t border-slate-700 flex items-center justify-between">
        <div>
          {hasDiscount && (
            <p className="text-slate-400 text-sm line-through">
              Bs. {product.detalle.precio.toFixed(2)}
            </p>
          )}
          <p className="text-white font-bold text-lg">
            Bs. {discountedPrice.toFixed(2)}
          </p>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={product.stock_total <= 0}
          className="bg-slate-600 hover:bg-slate-500 text-white p-2 rounded-md flex items-center"
        >
          <ShoppingCart className="h-5 w-5 mr-1" />
          <span className="text-sm">Añadir</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

// Componente de grid de productos con paginación
export default function CategoryProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchParams] = useSearchParams();

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 8; // Número de productos por página
  const pageCount = Math.ceil(totalProducts / productsPerPage);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // En un caso real, pasarías los parámetros de paginación a tu API
        // const response = await getProducts({ page: currentPage + 1, limit: productsPerPage })
        console.log(searchParams.toString());
        const response = await filtrarProductos(searchParams.toString());
        console.log(response.data);
        // Simulando paginación del lado del cliente (en un caso real, esto lo haría tu API)
        const allProducts = response.data;
        setTotalProducts(allProducts.length);

        const paginatedProducts = allProducts.slice(
          currentPage * productsPerPage,
          (currentPage + 1) * productsPerPage
        );

        setProducts(paginatedProducts);
        setIsLoading(false);
      } catch (err) {
        setError("Error al cargar los productos");
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchProducts();
  }, [currentPage]); // Recargar cuando cambie la página actual

  // Manejar cambio de página
  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
    // Scroll al inicio de los productos
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (error) {
    return (
      <div className="p-6 text-center text-red-400 bg-[#1a2035]">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#1a2035]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Nuestros productos</h2>
        <div className="text-slate-300 text-sm">
          Mostrando {currentPage * productsPerPage + 1}-
          {Math.min((currentPage + 1) * productsPerPage, totalProducts)} de{" "}
          {totalProducts} productos
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(productsPerPage)].map((_, index) => (
            <Card
              key={index}
              className="border-slate-700 bg-[#1e2745] h-[380px] animate-pulse"
            >
              <div className="h-48 bg-slate-700"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </CardContent>
              <CardFooter className="p-4 border-t border-slate-700">
                <div className="h-6 bg-slate-700 rounded w-1/3"></div>
                <div className="h-8 bg-slate-700 rounded w-1/4 ml-auto"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Paginación */}
          <div className="mt-8 flex justify-center">
            <ReactPaginate
              previousLabel={<ChevronLeft className="h-5 w-5" />}
              nextLabel={<ChevronRight className="h-5 w-5" />}
              breakLabel="..."
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageChange}
              forcePage={currentPage}
              containerClassName="flex items-center space-x-1"
              pageClassName="flex"
              pageLinkClassName="flex items-center justify-center h-9 w-9 rounded-md border border-slate-700 bg-[#1e2745] text-white hover:bg-[#232d4d] transition-colors"
              activeClassName="active"
              activeLinkClassName="bg-slate-600 hover:bg-slate-500"
              previousClassName="flex"
              nextClassName="flex"
              previousLinkClassName="flex items-center justify-center h-9 w-9 rounded-md border border-slate-700 bg-[#1e2745] text-white hover:bg-[#232d4d] transition-colors"
              nextLinkClassName="flex items-center justify-center h-9 w-9 rounded-md border border-slate-700 bg-[#1e2745] text-white hover:bg-[#232d4d] transition-colors"
              disabledClassName="opacity-50 cursor-not-allowed"
              disabledLinkClassName="hover:bg-[#1e2745] cursor-not-allowed"
              breakClassName="flex"
              breakLinkClassName="flex items-center justify-center h-9 w-9 rounded-md border border-slate-700 bg-[#1e2745] text-white"
            />
          </div>
        </>
      )}
    </div>
  );
}
