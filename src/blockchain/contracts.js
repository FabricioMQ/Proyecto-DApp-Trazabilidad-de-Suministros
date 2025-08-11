import UserRegistryAbi from "../abi/RegistroUsuarios.json";
import ProductRegistryAbi from "../abi/RegistroProductos.json";
import SupplyChainLogicAbi from "../abi/LogicaCadenaSuministro.json";
import PermissionManagerAbi from "../abi/GestorPermisos.json";
import AuditTrailAbi from "../abi/RegistroAuditoria.json";

export const contracts = {
  userRegistry: {
    address: import.meta.env.VITE_USER_REGISTRY_ADDRESS,
    data: UserRegistryAbi,
  },
  productRegistry: {
    address: import.meta.env.VITE_PRODUCT_REGISTRY_ADDRESS,
    data: ProductRegistryAbi,
  },
  supplyChainLogic: {
    address: import.meta.env.VITE_SUPPLY_CHAIN_LOGIC_ADDRESS,
    data: SupplyChainLogicAbi,
  },
  permissionManager: {
    address: import.meta.env.VITE_PERMISSION_MANAGER_ADDRESS,
    data: PermissionManagerAbi,
  },
  auditTrail: {
    address: import.meta.env.VITE_AUDIT_TRAIL_ADDRESS,
    data: AuditTrailAbi,
  },
};
