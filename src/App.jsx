import { useState } from "react";
import { Button } from "flowbite-react";


function MenuDapp() {
  const [action, setAction] = useState("");

  return (
    <div className="max-w-md p-6 mx-auto mt-10 border rounded-lg shadow-md bg-background border-border">
      <h2 className="mb-6 text-2xl font-bold text-primary">
        Menú de Producto
      </h2>

      <div className="flex flex-col gap-4">
        <Button
          className="text-white bg-primary hover:bg-primary-hover"
          onClick={() => setAction("Crear Producto")}
        >
          Crear Producto
        </Button>

        <Button
          className="text-white bg-secondary hover:bg-secondary-hover"
          onClick={() => setAction("Transferir")}
        >
          Transferir
        </Button>

        <Button
          className="text-white bg-warning hover:bg-warning/80"
          onClick={() => setAction("Estado Producto")}
        >
          Estado Producto
        </Button>
      </div>
      {action && (
        <p className="mt-6 font-semibold text-primary">
          Acción seleccionada: <span className="italic">{action}</span>
        </p>
      )}
    </div>
  );
}

export default MenuDapp;
