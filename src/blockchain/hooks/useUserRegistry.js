import {
  useWaitForTransactionReceipt,
  useWriteContract,
  useReadContract,
} from 'wagmi';
import { contracts } from '../contracts';
import { useState, useMemo } from 'react';

export function useUserRegistry() {
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

  async function useRegisterUser(userAddress, userType) {
    try {
      setLocalError(null);
      await writeContract({
        address: contracts.userRegistry.address,
        abi: contracts.userRegistry.data.abi,
        functionName: 'registrarUsuario',
        args: [userAddress, userType],
      });
    } catch (err) {
      setLocalError(err);
    }
  }

  async function useUpdateUser(userAddress, newUserType) {
    try {
      setLocalError(null);
      await writeContract({
        address: contracts.userRegistry.address,
        abi: contracts.userRegistry.data.abi,
        functionName: 'actualizarTipoUsuario',
        args: [userAddress, newUserType],
      });
    } catch (err) {
      setLocalError(err);
    }
  }

  function getUserType(userAddress) {
    return useReadContract({
      address: contracts.userRegistry.address,
      abi: contracts.userRegistry.data.abi,
      functionName: 'obtenerTipoUsuario',
      args: [userAddress],
      enabled: !!userAddress,
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
    useRegisterUser,
    useUpdateUser,
    getUserType,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    isFailed,
    status: txStatus,
    error: errorMessage,
  };
}