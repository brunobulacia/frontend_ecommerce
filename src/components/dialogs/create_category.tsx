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
import { Category, createCategory } from "@/api/categories";

interface DialogCrearProps {
  onClose: () => void;
}

export function DialogCrearCat({ onClose }: DialogCrearProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Category>();

  // Handle the form submission
  const onSubmit: SubmitHandler<Category> = async (data) => {
    console.log(data);
    try {
      const res = await createCategory(data);
      console.log(res);
      alert("Categoria creada con exito");
    } catch (error) {
      console.error("Error de conexión:", error);
    }
    // Reset the form and close the dialog
    reset();
    window.location.reload();
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Categoria</DialogTitle>
          <DialogDescription>
            Introduzca el tipo de categoria que desea crear
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tipo" className="text-right">
              Nombre
            </Label>
            <Input
              id="tipo"
              placeholder="Ingrese el tipo de categoria"
              {...register("nombre", {
                required: "El tipo de categoria es obligatorio",
              })}
              className="col-span-3"
            />
            {errors.nombre && (
              <span className="text-red-500 text-sm">
                {errors.nombre.message}
              </span>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tipo" className="text-right">
              Descripcion
            </Label>
            <Input
              id="descripcion"
              placeholder="Ingrese la descripcion de categoria"
              {...register("descripcion", {
                required: "La descripcion es obligatoria",
              })}
              className="col-span-3"
            />
            {errors.descripcion && (
              <span className="text-red-500 text-sm">
                {errors.descripcion.message}
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
