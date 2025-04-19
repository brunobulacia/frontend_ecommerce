"use client"

import { useState, useRef } from "react"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { getRelatedProducts } from "@/lib/products"

interface RelatedProductsProps {
  currentProductId: string
}

export function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  // Get related products
  const relatedProducts = getRelatedProducts(currentProductId)

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { scrollWidth, clientWidth } = containerRef.current
      const scrollAmount = clientWidth * 0.8

      if (direction === "left") {
        containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
        setScrollPosition(Math.max(0, scrollPosition - scrollAmount))
      } else {
        containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
        setScrollPosition(Math.min(scrollWidth - clientWidth, scrollPosition + scrollAmount))
      }
    }
  }

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Related Products</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={scrollPosition <= 0}
            className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Scroll left</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Scroll right</span>
          </Button>
        </div>
      </div>

      <div ref={containerRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {relatedProducts.map((product) => (
          <div key={product.id} className="min-w-[250px] max-w-[250px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  )
}
