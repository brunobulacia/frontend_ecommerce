"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Laptop,
  Smartphone,
  Headphones,
  Watch,
  Tv,
  Camera,
  Gamepad,
  Speaker,
} from "lucide-react";

// Mock data for categories
const categories = [
  {
    id: "CAT-1",
    name: "Laptops",
    slug: "laptops",
    icon: Laptop,
    products: 24,
    featured: true,
  },
  {
    id: "CAT-2",
    name: "Smartphones",
    slug: "smartphones",
    icon: Smartphone,
    products: 36,
    featured: true,
  },
  {
    id: "CAT-3",
    name: "Audio",
    slug: "audio",
    icon: Headphones,
    products: 18,
    featured: true,
  },
  {
    id: "CAT-4",
    name: "Wearables",
    slug: "wearables",
    icon: Watch,
    products: 12,
    featured: true,
  },
  {
    id: "CAT-5",
    name: "TVs",
    slug: "tvs",
    icon: Tv,
    products: 15,
    featured: true,
  },
  {
    id: "CAT-6",
    name: "Cameras",
    slug: "cameras",
    icon: Camera,
    products: 9,
    featured: false,
  },
  {
    id: "CAT-7",
    name: "Gaming",
    slug: "gaming",
    icon: Gamepad,
    products: 14,
    featured: false,
  },
  {
    id: "CAT-8",
    name: "Speakers",
    slug: "speakers",
    icon: Speaker,
    products: 8,
    featured: false,
  },
];

export function AdminCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter categories based on search query
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Categorias</h1>
        <Button className="bg-slate-600 hover:bg-slate-500 text-white">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Categoria
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Buscar Categorias..."
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-slate-500 focus-visible:border-slate-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-800">
            <TableRow className="hover:bg-slate-800/50 border-slate-700">
              <TableHead className="text-slate-300">Categoria</TableHead>
              <TableHead className="text-slate-300">Productos</TableHead>
              <TableHead className="text-slate-300 text-right">
                Opciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow
                key={category.id}
                className="hover:bg-slate-800/50 border-slate-700"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-slate-700 flex items-center justify-center">
                      <category.icon className="h-5 w-5 text-slate-300" />
                    </div>
                    <div className="font-medium text-white">
                      {category.name}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-300">
                  {category.products}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-700"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-40 bg-slate-800 border-slate-700 text-slate-200"
                    >
                      <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="hover:bg-slate-700 cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 hover:bg-slate-700 hover:text-red-500 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
