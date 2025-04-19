"use client";

import type React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
// import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const formSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  originalPrice: z.coerce
    .number()
    .positive("Original price must be positive")
    .optional(),
  category: z.string().min(1, "Category is required"),
  stock: z.coerce
    .number()
    .int()
    .nonnegative("Stock must be a non-negative integer"),
  isNew: z.boolean(),
  featured: z.boolean(),
});

export function NewProductPage() {
  //   const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: undefined,
      category: "",
      stock: 0,
      isNew: false,
      featured: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    // Simulate API call
    /* setTimeout(() => {
      console.log(values)
      toast({
        title: "Product created",
        description: "The product has been created successfully.",
      })
      setIsSubmitting(false)
      // Redirect to products list would happen here
    }, 1500) */
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
          >
            <Link to="/admin/products">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to products</span>
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-white">Add New Product</h1>
        </div>
        <Button
          type="submit"
          form="product-form"
          className="bg-slate-600 hover:bg-slate-500 text-white"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Product
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="border-slate-700 bg-slate-800 shadow-xl">
            <div className="p-6">
              <Form {...form}>
                <form
                  id="product-form"
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">
                          Product Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter product name"
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-200">
                          Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter product description"
                            className="min-h-32 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">
                            Price ($)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="originalPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">
                            Original Price ($)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Optional"
                              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                              {...field}
                              value={field.value || ""}
                              onChange={(e) => {
                                const value =
                                  e.target.value === ""
                                    ? undefined
                                    : Number.parseFloat(e.target.value);
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription className="text-slate-400">
                            Set this for products on sale
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">
                            Category
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-slate-500">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-slate-800 border-slate-700 text-slate-200">
                              <SelectItem value="Laptops">Laptops</SelectItem>
                              <SelectItem value="Smartphones">
                                Smartphones
                              </SelectItem>
                              <SelectItem value="Audio">Audio</SelectItem>
                              <SelectItem value="Wearables">
                                Wearables
                              </SelectItem>
                              <SelectItem value="TVs">TVs</SelectItem>
                              <SelectItem value="Cameras">Cameras</SelectItem>
                              <SelectItem value="Gaming">Gaming</SelectItem>
                              <SelectItem value="Speakers">Speakers</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-200">
                            Stock
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="bg-slate-700" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="isNew"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-slate-200">
                              Mark as New
                            </FormLabel>
                            <FormDescription className="text-slate-400">
                              Display a "New" badge on this product
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-slate-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-slate-700 p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-slate-200">
                              Featured Product
                            </FormLabel>
                            <FormDescription className="text-slate-400">
                              Show this product in featured sections
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-slate-600"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
          </Card>
        </div>

        <div>
          <Card className="border-slate-700 bg-slate-800 shadow-xl">
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Product Image
                </h3>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Product preview"
                        className="mx-auto h-40 w-40 object-cover rounded-md"
                      />
                      <Button
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                        onClick={() => setImagePreview(null)}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="py-8">
                      <Upload className="h-10 w-10 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm text-slate-400 mb-2">
                        Drag and drop an image or click to browse
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="product-image"
                        onChange={handleImageChange}
                      />
                      <Button
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                        onClick={() =>
                          document.getElementById("product-image")?.click()
                        }
                      >
                        Upload Image
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">
                  Product Status
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
                    <span className="text-sm text-slate-300">Visibility</span>
                    <span className="text-sm font-medium text-white">
                      Public
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-700 rounded-md">
                    <span className="text-sm text-slate-300">Created</span>
                    <span className="text-sm font-medium text-white">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
