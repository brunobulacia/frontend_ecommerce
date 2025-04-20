import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Category, updateCategory } from "@/api/categories";

interface DialogDemoProps {
  category: Category;
  onClose: () => void;
}

interface FormData {
  nombre: string;
  descripcion: string;
}

export function EditCategoryDialog({ category, onClose }: DialogDemoProps) {
  const { register, handleSubmit, reset } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const updatedCategory: Category = {
        id: category.id,
        nombre: data.nombre,
        descripcion: data.descripcion,
      };

      const res = await updateCategory(updatedCategory);
      console.log(res);
      reset();
      onClose();
    } catch (error) {
      console.error("Error de conexión:", error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>CATEGORIA</DialogTitle>
          <DialogDescription>
            Editar la categoria {category.nombre}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nombre" className="text-right">
                Nombre
              </Label>
              <Input
                id="nombre"
                className="col-span-3"
                type="text"
                {...register("nombre", { required: true })}
                value={category.nombre}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="descripcion" className="text-right">
                Descripcion
              </Label>
              <Input
                id="descripcion"
                placeholder="Ingrese la descripcion"
                className="col-span-3"
                type="text"
                {...register("descripcion", { required: true })}
                value={category.descripcion}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={onClose}>Cancelar</Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
