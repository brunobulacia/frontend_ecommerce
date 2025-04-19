import { Link } from "react-router-dom";
import { getCategories } from "@/api/categories";
import { Categorie } from "@/types/categories";
import { useEffect, useState } from "react";

export function Categories() {
  const [categoriesData, setCategoriesData] = useState<Categorie[]>([]);
  useEffect(() => {
    const getCategoriesData = async () => {
      try {
        const response = await getCategories();
        console.log(response.data);
        setCategoriesData(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    getCategoriesData();
  }, []);

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-white mb-6">
        Nuestras categorias
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
        {categoriesData.map((category) => (
          <Link
            key={category.nombre}
            to={"/"}
            className="flex flex-col items-center justify-center p-4 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            <div className="bg-slate-700 p-3 rounded-full mb-3">
              {/* <category.icon className="h-6 w-6 text-slate-300" /> */}
            </div>
            <span className="text-sm font-medium text-slate-300">
              {category.nombre}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
