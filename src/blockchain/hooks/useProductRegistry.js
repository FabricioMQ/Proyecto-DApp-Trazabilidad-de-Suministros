import { useReadContract } from "wagmi";
import { contracts } from "./contracts";

export function useProductRegistry() {
  const { address, abi } = contracts.productRegistry;

  function useCheckProductExists(idProduct) {
    return useReadContract({
      address,
      abi,
      functionName: "existeProducto",
      args: [idProduct],
    });
  }

  function useGetProductHolder(idProduct) {
    return useReadContract({
      address,
      abi,
      functionName: "obtenerPoseedor",
      args: [idProduct],
    });
  }

  function useGetProductDescription(idProduct) {
    return useReadContract({
      address,
      abi,
      functionName: "obtenerDescripcion",
      args: [idProduct],
    });
  }

  return { useCheckProductExists, useGetProductHolder, useGetProductDescription };
}

