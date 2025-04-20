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
import { useForm, SubmitHandler } from "react-hook-form";
import { Category, deleteCategory } from "@/api/categories";

interface confirmar {
  confirmacion: string;
}

interface DialogCrearProps {
  category: Category;
  onClose: () => void;
}

export function DialogBorrarCat({ category, onClose }: DialogCrearProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<confirmar>();

  const onSubmit: SubmitHandler<confirmar> = async (data) => {
    if (data.confirmacion !== "Eliminar") {
      alert("La confirmación no es correcta");
      return;
    }
    try {
      await deleteCategory(category.id);
      alert("Categoria eliminada con exito");
    } catch (error) {
      console.error("Error de conexión:", error);
    }
    window.location.reload();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Eliminar Categoria</DialogTitle>
          <DialogDescription>
            Estas seguro que deseas eliminar la categoria {category.nombre}?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tipo" className="text-right">
              Escriba "Eliminar" para confirmar
            </Label>
            <Input
              id="confirmacion"
              {...register("confirmacion", {
                required: "La confirmación es obligatoria",
              })}
              className="col-span-3"
            />
            {errors.confirmacion && (
              <span className="text-red-500 text-sm">
                {errors.confirmacion.message}
              </span>
            )}
          </div>

          <DialogFooter>
            <Button className="hover:bg-green-600" type="submit">
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
