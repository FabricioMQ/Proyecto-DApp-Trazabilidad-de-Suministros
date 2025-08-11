import { useEffect, useState } from 'react';
import { usePublicClient } from 'wagmi';
import { watchContractEvent } from '@wagmi/core';
import { decodeEventLog } from 'viem';
import { wagmiConfig } from '../provider';
import { contracts } from '../contracts';

export function useAuditTrail() {
  const client = usePublicClient();
  const [estadoLogs, setEstadoLogs] = useState([]);
  const [movimientoLogs, setMovimientoLogs] = useState([]);

  const contractAddress = contracts.auditTrail.address;
  const contractAbi = contracts.auditTrail.data.abi;

  useEffect(() => {
    async function fetchHistoricalLogs() {
      try {
        const rawLogs = await client.getLogs({
          address: contractAddress,
          fromBlock: 'earliest',
          toBlock: 'latest',
        });

        const decodedLogs = rawLogs
          .map(log => {
            try {
              const decoded = decodeEventLog({ abi: contractAbi, ...log });
              return { ...log, ...decoded };
            } catch {
              return null;
            }
          })
          .filter(Boolean);

        setEstadoLogs(decodedLogs.filter(log => log.eventName === 'EstadoCambiado'));
        setMovimientoLogs(decodedLogs.filter(log => log.eventName === 'ProductoMovido'));
      } catch (err) {
        console.error('Error al cargar logs históricos:', err);
      }
    }

    fetchHistoricalLogs();
  }, [client, contractAddress, contractAbi]);

  useEffect(() => {
    const unwatchEstado = watchContractEvent(wagmiConfig, {
      address: contractAddress,
      abi: contractAbi,
      eventName: 'EstadoCambiado',
      onLogs(newLogs) {
        const decoded = newLogs.map(log => {
          const d = decodeEventLog({ abi: contractAbi, ...log });
          return { ...log, ...d };
        });
        setEstadoLogs(prev => [...decoded, ...prev]);
      },
    });

    const unwatchMovimiento = watchContractEvent(wagmiConfig, {
      address: contractAddress,
      abi: contractAbi,
      eventName: 'ProductoMovido',
      onLogs(newLogs) {
        const decoded = newLogs.map(log => {
          const d = decodeEventLog({ abi: contractAbi, ...log });
          return { ...log, ...d };
        });
        setMovimientoLogs(prev => [...decoded, ...prev]);
      },
    });

    return () => {
      unwatchEstado();
      unwatchMovimiento();
    };
  }, [contractAddress, contractAbi]);

  return { estadoLogs, movimientoLogs };
}