import { ProductGrid } from "@/components/product-grid";
import { HeroSection } from "@/components/hero-section.tsx";
import { Categories } from "@/components/categories.tsx";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";

export function Home() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <HeroSection />
      <div className="container mx-auto px-4">
        <Categories />
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Nuevos productos</h2>
            <a href="/products" className="text-slate-300 hover:text-white">
              Ver todos
            </a>
          </div>
          <ProductGrid />
        </section>
      </div>
    </div>
  );
}

export function StoreLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
