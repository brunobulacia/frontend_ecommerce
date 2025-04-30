import { create } from "zustand";
import { persist } from "zustand/middleware";

// Definición de tipos
interface ProductCategory {
  nombre: string;
  descripcion: string;
}

interface ProductDetail {
  marca: string;
  precio: number;
}

interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  proveedor: string;
  descuento: number | null;
  imagenes: string[];
  stock_total: number;
  detalle: ProductDetail;
  categorias: ProductCategory[];
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  total: number;
  couponApplied: boolean;
  couponDiscount: number;
}

interface CartActions {
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getCartItems: () => CartItem[];
  calculateTotals: () => void;
}

// Función para calcular el precio con descuento
const calculateDiscountedPrice = (
  price: number,
  discount: number | null
): number => {
  if (!discount) return price;
  return price - price * (discount / 100);
};

export const useCartStore = create(
  persist<CartState & CartActions>(
    (set, get) => ({
      // Estado inicial
      items: [],
      itemCount: 0,
      subtotal: 0,
      total: 0,
      couponApplied: false,
      couponDiscount: 0,
      couponCode: "",

      // Acciones
      addItem: (product: Product, quantity = 1) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (item) => item.id === product.id
        );

        let newItems: CartItem[];

        if (existingItemIndex >= 0) {
          // Si el producto ya existe en el carrito, actualizar la cantidad
          newItems = [...items];
          const newQuantity = newItems[existingItemIndex].quantity + quantity;

          // Asegurarse de no exceder el stock disponible
          newItems[existingItemIndex].quantity = Math.min(
            newQuantity,
            product.stock_total
          );
        } else {
          // Si es un producto nuevo, añadirlo al carrito
          const newItem: CartItem = {
            ...product,
            quantity: Math.min(quantity, product.stock_total),
          };
          newItems = [...items, newItem];
        }

        set({ items: newItems });
        get().calculateTotals();
      },

      removeItem: (id: number) => {
        const { items } = get();
        const newItems = items.filter((item) => item.id !== id);

        set({ items: newItems });
        get().calculateTotals();
      },

      updateQuantity: (id: number, quantity: number) => {
        const { items } = get();
        const newItems = items.map((item) => {
          if (item.id === id) {
            // Asegurarse de que la cantidad esté dentro de los límites
            const newQuantity = Math.max(
              1,
              Math.min(quantity, item.stock_total)
            );
            return { ...item, quantity: newQuantity };
          }
          return item;
        });

        set({ items: newItems });
        get().calculateTotals();
      },

      clearCart: () => {
        set({
          items: [],
          couponApplied: false,
          couponDiscount: 0,
        });
        get().calculateTotals();
      },

      applyCoupon: (code: string) => {
        // Validar el código de cupón (en un caso real, esto se haría con una API)
        const validCoupons: Record<string, number> = {
          descuento20: 20,
          descuento10: 10,
          verano25: 25,
        };

        if (validCoupons[code.toLowerCase()]) {
          set({
            couponApplied: true,
            couponDiscount: validCoupons[code.toLowerCase()],
          });
          get().calculateTotals();
          return true;
        }

        return false;
      },

      removeCoupon: () => {
        set({
          couponApplied: false,
          couponDiscount: 0,
        });
        get().calculateTotals();
      },

      getCartItems: () => {
        return get().items;
      },

      calculateTotals: () => {
        const { items, couponApplied, couponDiscount } = get();

        // Calcular el número total de items
        const itemCount = items.reduce(
          (count, item) => count + item.quantity,
          0
        );

        // Calcular el subtotal
        const subtotal = items.reduce((total, item) => {
          const price = calculateDiscountedPrice(
            item.detalle.precio,
            item.descuento
          );
          return total + price * item.quantity;
        }, 0);

        // Calcular el descuento del cupón
        const couponDiscountAmount = couponApplied
          ? subtotal * (couponDiscount / 100)
          : 0;

        // Calcular el total
        const total = subtotal - couponDiscountAmount;

        set({ itemCount, subtotal, total });
      },
    }),
    {
      name: "shopping-cart", // Nombre para localStorage
    }
  )
);

// Añadir una función para exportar el clearCart para uso externo
export const getCartActions = () => {
  const { clearCart } = useCartStore.getState();
  return { clearCart };
};
