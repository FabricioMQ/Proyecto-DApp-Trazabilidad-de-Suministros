import { NavLink } from "react-router-dom";
import { ConnectButton } from '@rainbow-me/rainbowkit';
export  function Navbar() {
  const baseClasses = "px-3 py-2 rounded-md text-sm font-medium";
  const activeClasses = "bg-primary text-white"; // color azul vibrante de tu config
  const inactiveClasses = "text-text-secondary hover:bg-primary-hover hover:text-white"; // texto gris y hover con azul oscuro + blanco texto

  return (
    <nav className="p-4 bg-background"> 
      <div className="container flex items-center justify-between mx-auto">
        <div className="text-xl font-bold text-text-primary">DApp Trazabilidad de Suministros</div> 
        <div className="flex space-x-4">
          <NavLink
            to="/usuario"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Usuario
          </NavLink>
          <NavLink
            to="/producto"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Producto
          </NavLink>
          <NavLink
            to="/suministro"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Suministro
          </NavLink>
          <NavLink
            to="/auditoria"
            className={({ isActive }) =>
              `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`
            }
          >
            Auditoria
          </NavLink>
          <ConnectButton />
         
        </div>
      </div>
    </nav>
  );
}
