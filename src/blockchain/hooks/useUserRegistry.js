import { useReadContract, useWriteContract, usePrepareContractWrite } from "wagmi";
import { contracts } from "./contracts";

export function useUserRegistry() {
  const { address, abi } = contracts.userRegistry;

  // Leer tipo de usuario
  function useGetUserType(userAddress) {
    return useReadContract({
      address,
      abi,
      functionName: "obtenerTipoUsuario", 
      args: [userAddress],
    });
  }


  function useRegisterUser(userAddress, userType) {
    // Preparar la escritura
    const { config, error: prepareError } = usePrepareContractWrite({
      address,
      abi,
      functionName: "registrarUsuario",
      args: [userAddress, userType],
    });

    // Ejecutar la escritura
    const { write, isLoading, isSuccess, error } = useWriteContract(config);

    return { write, isLoading, isSuccess, error, prepareError };
  }

  function useUpdateUser(userAddress, newUserType) {
    // Preparar la escritura
    const { config, error: prepareError } = usePrepareContractWrite({
      address,
      abi,
      functionName: "actualizarTipoUsuario",
      args: [userAddress, newUserType],
    });

    // Ejecutar la escritura
    const { write, isLoading, isSuccess, error } = useWriteContract(config);

    return { write, isLoading, isSuccess, error, prepareError };
  }

  return {
    useGetUserType,
    useRegisterUser,
    useUpdateUser
  };
}
