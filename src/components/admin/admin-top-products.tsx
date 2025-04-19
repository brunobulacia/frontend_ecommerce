import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for top products
const topProducts = [
  {
    id: "1",
    name: 'MacBook Pro 14" M3 Pro',
    sales: 42,
    revenue: 83999.58,
  },
  {
    id: "2",
    name: "iPhone 15 Pro",
    sales: 68,
    revenue: 67999.32,
  },
  {
    id: "10",
    name: 'LG C3 65" OLED TV',
    sales: 24,
    revenue: 43199.76,
  },
  {
    id: "6",
    name: "Apple Watch Series 9",
    sales: 53,
    revenue: 21199.47,
  },
  {
    id: "3",
    name: "Sony WH-1000XM5",
    sales: 47,
    revenue: 16449.53,
  },
];

export function AdminTopProducts() {
  return (
    <div className="-mx-6">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-slate-700">
            <TableHead className="text-slate-400 font-medium">
              Product
            </TableHead>
            <TableHead className="text-slate-400 font-medium text-right">
              Sales
            </TableHead>
            <TableHead className="text-slate-400 font-medium text-right">
              Revenue
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topProducts.map((product) => (
            <TableRow
              key={product.id}
              className="hover:bg-slate-800/50 border-slate-700"
            >
              <TableCell className="font-medium text-white">
                {product.name}
              </TableCell>
              <TableCell className="text-slate-300 text-right">
                {product.sales}
              </TableCell>
              <TableCell className="text-slate-300 text-right">
                $
                {product.revenue.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
