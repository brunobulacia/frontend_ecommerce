"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/lib/products";
import { Link } from "react-router-dom";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden border-slate-700 bg-slate-800 shadow-xl transition-all hover:shadow-2xl">
      <div className="relative">
        <Link to={`/products/${product.id}`}>
          <div className="aspect-square overflow-hidden bg-slate-700">
            <img
              src={product.image || "/placeholder.svg?height=300&width=300"}
              alt={product.nombre}
              width={300}
              height={300}
              className="h-full w-full object-cover transition-transform hover:scale-105"
            />
          </div>
        </Link>

        {/* {product.discount > 0 && (
          <Badge className="absolute bottom-2 left-2 bg-red-600">
            {product.discount}% OFF
          </Badge>
        )} */}
      </div>

      <CardContent className="p-4">
        <Link to={`/products/${product.id}`} className="hover:underline">
          <h3 className="font-medium text-white line-clamp-1">
            {product.nombre}
          </h3>
        </Link>
        <p className="text-sm text-slate-400 line-clamp-1 mt-1">
          {product.categoria}
        </p>

        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-white">
            ${product.detalle_producto?.precio_venta.toFixed(2) ?? "0.00"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-slate-600 hover:bg-slate-500 text-white"
          onClick={undefined}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}
