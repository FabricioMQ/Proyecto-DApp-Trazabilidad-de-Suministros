import { useState, useEffect, useCallback } from "react";
import { usePublicClient, useWatchContractEvent  } from "wagmi";
import { contracts } from "../contracts"; 

export function useAuditoriaLogs() {
  const publicClient = usePublicClient();
  const [logs, setLogs] = useState([]);

  // Cargar todos los eventos históricos una sola vez
  useEffect(() => {
    async function fetchLogs() {
      try {
        const filterParams = {
          address: contracts.auditTrail.address,
          abi: contracts.auditTrail.abi,
          fromBlock: 0n,
          toBlock: "latest",
        };

        const eventosEstado = await publicClient.getLogs({
          ...filterParams,
          eventName: "EstadoCambiado",
        });

        const eventosMovimiento = await publicClient.getLogs({
          ...filterParams,
          eventName: "ProductoMovido",
        });

        const allLogs = [...eventosEstado, ...eventosMovimiento].sort(
          (a, b) => Number(a.blockNumber) - Number(b.blockNumber)
        );

        setLogs(allLogs);
      } catch (err) {
        console.error("Error cargando eventos de auditoría:", err);
      }
    }

    fetchLogs();
  }, [publicClient]);

  // Escuchar en tiempo real eventos nuevos
  useWatchContractEvent ({
    address: contracts.auditTrail.address,
    abi: contracts.auditTrail.abi,
    eventName: "EstadoCambiado",
    listener(log) {
      setLogs((prev) => [...prev, ...log]);
    },
  });

  useWatchContractEvent ({
    address: contracts.auditTrail.address,
    abi: contracts.auditTrail.abi,
    eventName: "ProductoMovido",
    listener(log) {
      setLogs((prev) => [...prev, ...log]);
    },
  });

  // Función para filtrar por producto (idProducto)
  const filtrarPorProducto = useCallback(
    (idProducto) => {
      if (!idProducto) return logs;
      return logs.filter((l) => l.args?.idProducto === idProducto);
    },
    [logs]
  );

  return { logs, filtrarPorProducto };
}
