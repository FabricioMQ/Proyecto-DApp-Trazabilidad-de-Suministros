import {
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { contracts } from '../contracts';
import { useState, useMemo } from 'react';

export function useSupplyChainLogic() {
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
    status,
  } = useWaitForTransactionReceipt({ hash });

  const [localError, setLocalError] = useState(null);

  async function useResgisterProduct(idProducto, descripcion) {
    try {
      setLocalError(null);
      await writeContract({
        address: contracts.supplyChainLogic.address,
        abi: contracts.supplyChainLogic.data.abi,
        functionName: 'crearProducto',
        args: [idProducto, descripcion],
      });
    } catch (err) {
      setLocalError(err);
    }
  }


  async function useUpdateStateProduct(idProducto, nuevoEstado) {
    try {
      setLocalError(null);
      await writeContract({
        address: contracts.supplyChainLogic.address,
        abi: contracts.supplyChainLogic.data.abi,
        functionName: 'actualizarEstadoProducto',
        args: [idProducto, nuevoEstado],
      });
    } catch (err) {
      setLocalError(err);
    }
  }

  async function useTransferProduct(idProducto, hacia) {
    try {
      setLocalError(null);
      await writeContract({
        address: contracts.supplyChainLogic.address,
        abi: contracts.supplyChainLogic.data.abi,
        functionName: 'transferirProducto',
        args: [idProducto, hacia],
      });
    } catch (err) {
      setLocalError(err);
    }
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
    useResgisterProduct,
    useUpdateStateProduct,
    useTransferProduct,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isFailed,
    status: txStatus,
    error: errorMessage,
  };
}