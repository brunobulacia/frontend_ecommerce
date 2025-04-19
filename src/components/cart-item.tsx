"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useCart, type CartItem as CartItemType } from "@/components/cart-provider"

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.id, newQuantity)
  }

  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-700">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-slate-700">
        <Link href={`/products/${item.id}`}>
          <Image
            src={item.image || "/placeholder.svg?height=80&width=80"}
            alt={item.name}
            width={80}
            height={80}
            className="h-full w-full object-cover"
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <Link href={`/products/${item.id}`} className="text-white font-medium hover:underline">
            {item.name}
          </Link>
          <span className="font-medium text-white">${(item.price * item.quantity).toFixed(2)}</span>
        </div>

        <div className="mt-1 text-sm text-slate-400">${item.price.toFixed(2)} each</div>

        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-r-none border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              -
            </Button>
            <div className="flex h-7 w-10 items-center justify-center border-y border-slate-700 text-sm text-white">
              {item.quantity}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7 rounded-l-none border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              +
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-slate-400 hover:text-white hover:bg-slate-700"
            onClick={() => removeItem(item.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
