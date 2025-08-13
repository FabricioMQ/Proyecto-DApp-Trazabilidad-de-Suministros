import {
  useWaitForTransactionReceipt,
  useReadContract,
} from 'wagmi';
import { contracts } from '../contracts';

export function useProductRegistry() {
  const {
    data: hash,
    isPending
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });



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
  const txStatus = useMemo(() => {
    if (isPending || isConfirming) return 'pending';
    if (isConfirmed) return 'success';
    if (isFailed || localError || writeError || txError) return 'error';
    return 'idle';
  }, [isPending, isConfirming, isConfirmed, isFailed, localError, writeError, txError]);

  const errorMessage =
    localError?.message || writeError?.message || txError?.message || null;

  return {
    useCheckProductoExists,
    useGetProductDescription,
    useGetProductoHolder,
    isPending,
    isConfirming,
    isConfirmed,
    isFailed,
    status: txStatus,
    error: errorMessage,
  };
}