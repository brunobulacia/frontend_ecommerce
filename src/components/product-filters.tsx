"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Laptop, Smartphone, Headphones, Watch, Tv, Camera, Gamepad, Speaker } from "lucide-react"

export function ProductFilters() {
  const [priceRange, setPriceRange] = useState([0, 2000])

  const categories = [
    { id: "laptops", label: "Laptops", icon: Laptop },
    { id: "smartphones", label: "Smartphones", icon: Smartphone },
    { id: "audio", label: "Audio", icon: Headphones },
    { id: "wearables", label: "Wearables", icon: Watch },
    { id: "tvs", label: "TVs", icon: Tv },
    { id: "cameras", label: "Cameras", icon: Camera },
    { id: "gaming", label: "Gaming", icon: Gamepad },
    { id: "speakers", label: "Speakers", icon: Speaker },
  ]

  const brands = [
    { id: "apple", label: "Apple" },
    { id: "samsung", label: "Samsung" },
    { id: "sony", label: "Sony" },
    { id: "lg", label: "LG" },
    { id: "bose", label: "Bose" },
    { id: "microsoft", label: "Microsoft" },
    { id: "google", label: "Google" },
    { id: "dell", label: "Dell" },
  ]

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value)
  }

  return (
    <div className="space-y-6">
      <Card className="border-slate-700 bg-slate-800 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  className="border-slate-600 data-[state=checked]:bg-slate-600 data-[state=checked]:border-slate-600"
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300 cursor-pointer"
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-700 bg-slate-800 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent>
          <Slider
            defaultValue={[0, 2000]}
            max={2000}
            step={10}
            value={priceRange}
            onValueChange={handlePriceChange}
            className="mb-6"
          />
          <div className="flex items-center justify-between">
            <div className="bg-slate-700 rounded px-2 py-1 text-sm text-slate-300">${priceRange[0]}</div>
            <div className="bg-slate-700 rounded px-2 py-1 text-sm text-slate-300">${priceRange[1]}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-700 bg-slate-800 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  className="border-slate-600 data-[state=checked]:bg-slate-600 data-[state=checked]:border-slate-600"
                />
                <label
                  htmlFor={`brand-${brand.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300 cursor-pointer"
                >
                  {brand.label}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-700 bg-slate-800 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center space-x-2">
                <Checkbox
                  id={`rating-${rating}`}
                  className="border-slate-600 data-[state=checked]:bg-slate-600 data-[state=checked]:border-slate-600"
                />
                <label
                  htmlFor={`rating-${rating}`}
                  className="flex items-center gap-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300 cursor-pointer"
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                  <span className="ml-1">& Up</span>
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button className="w-full bg-slate-600 hover:bg-slate-500 text-white">Apply Filters</Button>

      <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
        Reset Filters
      </Button>
    </div>
  )
}
