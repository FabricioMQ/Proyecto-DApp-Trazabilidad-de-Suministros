import {
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { contracts } from '../contracts';

export function useProductRegistry() {

  function useCheckProductoExists(idProduct) {
    return useReadContract({
      address: contracts.productRegistry.address,
      abi: contracts.productRegistry.data.abi,
      functionName: 'existeProducto',
      args: [idProduct],
      enabled: !!idProduct,
    });
  }
  function useGetProductoHolder(idProduct) {
    return useReadContract({
      address: contracts.productRegistry.address,
      abi: contracts.productRegistry.data.abi,
      functionName: 'obtenerPoseedor',
      args: [idProduct],
      enabled: !!idProduct,
    });
  } 
  function useGetProductDescription(idProduct) {
    return useReadContract({
      address: contracts.productRegistry.address,
      abi: contracts.productRegistry.data.abi,
      functionName: 'existeProducto',
      args: [idProduct],
      enabled: !!idProduct,
    });
  }

  return {
    useCheckProductoExists,
    useGetProductDescription,
    useGetProductoHolder,
  };
}