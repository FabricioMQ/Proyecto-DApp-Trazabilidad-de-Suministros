import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { contracts } from '../contracts';
import { useState, useMemo } from 'react';

export function useProductRegistry() {
  const {
    data: hash,
    isPending,
    writeContract,
    error: writeError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    isError: isFailed,
    error: txError,
  } = useWaitForTransactionReceipt({ hash });

  const [localError, setLocalError] = useState(null);

  // Registrar producto
  async function registerProduct(productId, name, owner) {
    try {
      setLocalError(null);
      await writeContract({
        address: contracts.productRegistry.address,
        abi: contracts.productRegistry.data.abi,
        functionName: 'registrarProducto',
        args: [productId, name, owner],
      });
    } catch (err) {
      setLocalError(err);
    }
  }

  // 2. Hook para obtener información de un producto
  function useProductInfo(productId) {
    return useReadContract({
      address: contracts.productRegistry.address,
      abi: contracts.productRegistry.data.abi,
      functionName: 'obtenerProducto',
      args: [productId],
      query: { enabled: !!productId },
    });
  }

  // 3. Hook para verificar existencia
  function useProductExists(productId) {
    return useReadContract({
      address: contracts.productRegistry.address,
      abi: contracts.productRegistry.data.abi,
      functionName: 'existeProducto',
      args: [productId],
      query: { enabled: !!productId },
    });
  }

  // 4. Hook para obtener poseedor
  function useProductOwner(productId) {
    return useReadContract({
      address: contracts.productRegistry.address,
      abi: contracts.productRegistry.data.abi,
      functionName: 'obtenerPoseedor',
      args: [productId],
      query: { enabled: !!productId },
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
    registerProduct,
    useProductInfo,
    useProductExists,
    useProductOwner,
    hash,
    status: txStatus,
    error: errorMessage,
  };
}
