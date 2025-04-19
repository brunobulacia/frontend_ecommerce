export interface Product {
  id: string;
  nombre: string;
  descripcion: string;
  descuento: number;
  image?: string;
  categoria: string;
  stock: number;
  detalle_producto?: {
    marca: string;
    precio_compra: string;
    precio_venta: string;
  }[];
}
