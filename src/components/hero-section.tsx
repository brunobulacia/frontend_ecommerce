import { Link } from "react-router-dom";
export function HeroSection() {
  return (
    <div className="relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-transparent z-10" />
      <div className="absolute inset-0 bg-cover bg-center" />

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-20">
        <div className="max-w-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tecnología al Alcance de tu Mano
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Descubre los dispositivos electrónicos más innovadores, con
            tecnología de punta y calidad premium.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/productos"
              className="inline-flex items-center justify-center rounded-md bg-slate-600 px-6 py-3 text-white font-medium hover:bg-slate-500 transition-colors"
            >
              Comprar Ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
