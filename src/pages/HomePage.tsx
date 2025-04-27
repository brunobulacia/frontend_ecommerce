import { HeroSection } from "@/components/hero-section.tsx";
import { Categories } from "@/components/categories.tsx";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/sonner";
import ProductsPage from "./ProductsPage";
export function Home() {
  return (
    <div className="flex flex-col gap-12 pb-12">
      <HeroSection />
      <div className="container mx-auto px-4">
        <Categories />
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6"></div>
        </section>
        <ProductsPage />
      </div>
    </div>
  );
}

export function StoreLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-200">
      <Navbar />
      <main className="flex-1">
        <Toaster />
        <Outlet />
      </main>
    </div>
  );
}
