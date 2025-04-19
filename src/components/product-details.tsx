"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShoppingCart, Heart, Star, Truck, RotateCcw, Shield } from "lucide-react"
import { useCart } from "@/components/cart-provider"
import type { Product } from "@/lib/products"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    })
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div className="space-y-4">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-700">
          <Image
            src={product.image || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            width={600}
            height={600}
            className="h-full w-full object-cover"
          />

          {product.isNew && <Badge className="absolute top-4 left-4 bg-slate-600">New</Badge>}

          {product.discount > 0 && <Badge className="absolute top-4 right-4 bg-red-600">{product.discount}% OFF</Badge>}
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="aspect-square overflow-hidden rounded-md bg-slate-700">
              <Image
                src={product.image || `/placeholder.svg?height=150&width=150&text=Image ${i}`}
                alt={`${product.name} - Image ${i}`}
                width={150}
                height={150}
                className="h-full w-full object-cover cursor-pointer hover:opacity-80"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{product.name}</h1>
          <p className="text-slate-400 mt-2">{product.category}</p>

          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`}
                />
              ))}
            </div>
            <span className="text-sm text-slate-400">({product.reviews} reviews)</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-3xl font-bold text-white">${product.price.toFixed(2)}</span>
          {product.originalPrice && (
            <span className="text-xl text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="rounded-r-none border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                -
              </Button>
              <div className="w-12 h-10 flex items-center justify-center border-y border-slate-700 text-white">
                {quantity}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
                className="rounded-l-none border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                +
              </Button>
            </div>

            <div className="text-sm text-slate-400">
              {product.stock > 0 ? (
                <span className="text-green-500">In Stock ({product.stock} available)</span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white"
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>

            <Button
              variant="outline"
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={toggleWishlist}
            >
              <Heart className={`mr-2 h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </Button>
          </div>
        </div>

        <Card className="border-slate-700 bg-slate-800 shadow-xl">
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="bg-slate-700 p-2 rounded-full">
                <Truck className="h-4 w-4 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Free Shipping</p>
                <p className="text-xs text-slate-400">On orders over $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-700 p-2 rounded-full">
                <RotateCcw className="h-4 w-4 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">30-Day Returns</p>
                <p className="text-xs text-slate-400">Hassle-free returns</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-slate-700 p-2 rounded-full">
                <Shield className="h-4 w-4 text-slate-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">2-Year Warranty</p>
                <p className="text-xs text-slate-400">Full coverage</p>
              </div>
            </div>
          </div>
        </Card>

        <Tabs defaultValue="description" className="w-full">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="description" className="data-[state=active]:bg-slate-700">
              Description
            </TabsTrigger>
            <TabsTrigger value="specifications" className="data-[state=active]:bg-slate-700">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-slate-700">
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4 text-slate-300">
            <p>{product.description}</p>
          </TabsContent>

          <TabsContent value="specifications" className="mt-4">
            <div className="space-y-2">
              {product.specifications?.map((spec, index) => (
                <div key={index} className="flex py-2 border-b border-slate-700">
                  <span className="w-1/3 font-medium text-white">{spec.name}</span>
                  <span className="w-2/3 text-slate-300">{spec.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`}
                    />
                  ))}
                </div>
                <span className="text-lg font-medium text-white">{product.rating.toFixed(1)}</span>
                <span className="text-sm text-slate-400">({product.reviews} reviews)</span>
              </div>

              <Button className="bg-slate-600 hover:bg-slate-500 text-white">Write a Review</Button>

              {/* Sample reviews */}
              <div className="space-y-4 mt-6">
                <div className="border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 5 ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white">John D.</span>
                    <span className="text-xs text-slate-400">2 weeks ago</span>
                  </div>
                  <h4 className="font-medium text-white mb-1">Amazing product!</h4>
                  <p className="text-sm text-slate-300">
                    This is exactly what I was looking for. Great quality and fast shipping.
                  </p>
                </div>

                <div className="border-b border-slate-700 pb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-white">Sarah M.</span>
                    <span className="text-xs text-slate-400">1 month ago</span>
                  </div>
                  <h4 className="font-medium text-white mb-1">Good value</h4>
                  <p className="text-sm text-slate-300">
                    Works as expected. Battery life could be better, but overall I'm satisfied.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
