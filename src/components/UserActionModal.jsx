import { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'flowbite-react';
import { toast } from 'react-toastify';
import { useUserRegistry } from '../blockchain/hooks';
import { formatFriendlyError } from '../utils/formatFriendlyError';

export function UserActionModal({ isOpen, onClose, action, onSubmit }) {
  const [userAddress, setUserAddress] = useState('');
  const [userType, setUserType] = useState('0');
  const [userTypeResult, setUserTypeResult] = useState(null);
  const [localHash, setLocalHash] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [localStatus, setLocalStatus] = useState('idle');

  const {
    isConfirming,
    isConfirmed,
    isPending,
    useRegisterUser,
    useUpdateUser,
    getUserType,
    hash,
    status,
    error,
  } = useUserRegistry();

  const userTypeQuery = getUserType(userAddress);

  useEffect(() => {
    if (isOpen) {
      setUserAddress('');
      setUserType('0');
      setUserTypeResult(null);
      setLocalHash(null);
      setLocalError(null);
      setLocalStatus('idle');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Transacción confirmada');
      onSubmit?.();
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (hash) {
      setLocalHash(hash);
    }
  }, [hash]);

  useEffect(() => {
    setLocalStatus(status);
    setLocalError(error);
  }, [status, error]);

  const handleSubmit = async () => {
    if (!userAddress.trim()) {
      toast.error('Por favor ingresa la dirección del usuario.');
      return;
    }

    if (action === 'Registrar Usuario') {
      if (userType === '0') {
        toast.error('Por favor selecciona un tipo válido.');
        return;
      }

      toast.promise(
        useRegisterUser(userAddress, userType),
        {
          pending: 'Registrando usuario...',
          success: 'Transacción enviada. Esperando confirmación...',
          error: {
            render({ data }) {
              return formatFriendlyError(data);
            },
          },
        }
      );

    } else if (action === 'Actualizar Usuario') {
      toast.promise(
        useUpdateUser(userAddress, userType),
        {
          pending: 'Actualizando usuario...',
          success: 'Transacción enviada. Esperando confirmación...',
          error: {
            render({ data }) {
              return formatFriendlyError(data);
            },
          },
        }
      );

    } else if (action === 'Ver Tipo de Usuario') {
      if (!userTypeQuery) {
        toast.error('No se pudo inicializar la consulta.');
        return;
      }

      toast.promise(
        (async () => {
          const result = await userTypeQuery.refetch();
          if (result.data != null) {
            setUserTypeResult(result.data.toString());
          } else {
            toast.info('Usuario no registrado o tipo desconocido.');
          }
        })(),
        {
          pending: 'Consultando tipo de usuario...',
          success: 'Consulta completada',
          error: {
            render({ data }) {
              return formatFriendlyError(data);
            },
          },
        }
      );
    }
  };

  const tipoTexto = {
    '0': 'Ninguno',
    '1': 'Producto',
    '2': 'Transportista',
    '3': 'Distribuidos',
  };

  const bgColor =
    action === 'Registrar Usuario'
      ? 'bg-primary hover:bg-primary-hover'
      : action === 'Actualizar Usuario'
      ? 'bg-secondary hover:bg-secondary-hover'
      : 'bg-warning hover:bg-warning/80';

  return (
    <Modal show={isOpen} onClose={onClose} size='md' popup>
      <ModalHeader>{action}</ModalHeader>
      <ModalBody>
        <div className='space-y-6'>
          <div>
            <label className='block mb-1 font-medium text-text-primary'>
              Dirección del usuario
            </label>
            <input
              type='text'
              placeholder='0x1234...'
              value={userAddress}
              onChange={(e) => setUserAddress(e.target.value)}
              className='w-full p-2 border rounded border-border bg-background text-text-primary'
              required
              disabled={userTypeResult !== null}
            />
          </div>

          {(action === 'Registrar Usuario' || action === 'Actualizar Usuario') && (
            <div>
              <label className='block mb-1 font-medium text-text-primary'>
                Tipo de usuario
              </label>
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                className='w-full p-2 border rounded border-border bg-background text-text-primary'
                required
                disabled={userTypeResult !== null}
              >
                <option value='0'>Ninguno</option>
                <option value='1'>Producto</option>
                <option value='2'>Transportista</option>
                <option value='3'>Distribuidos</option>
              </select>
            </div>
          )}

          {action === 'Ver Tipo de Usuario' && userTypeResult !== null && (
            <div className='p-3 mt-4 bg-gray-100 border border-gray-300 rounded'>
              <strong>Tipo de usuario:</strong> {tipoTexto[userTypeResult]}
            </div>
          )}

          {(action === 'Registrar Usuario' || action === 'Actualizar Usuario') && localHash && (
            <div className='p-3 mt-4 text-sm text-blue-800 break-all border border-blue-300 rounded bg-blue-50'>
              <strong>Hash de transacción:</strong><br />
              {localHash}
            </div>
          )}

          {(action === 'Registrar Usuario' || action === 'Actualizar Usuario') && (
            <>
              {localStatus === 'pending' && (
                <div className='p-3 mt-2 text-yellow-800 border border-yellow-300 rounded bg-yellow-50'>
                  <strong>Estado:</strong> Transacción pendiente de confirmación...
                </div>
              )}

              {localStatus === 'success' && (
                <div className='p-3 mt-2 text-green-800 border border-green-300 rounded bg-green-50'>
                  <strong>Estado:</strong> Transacción confirmada exitosamente.
                </div>
              )}

              {localStatus === 'error' && (
                <div className='p-3 mt-2 text-red-800 border border-red-300 rounded bg-red-50'>
                  <strong>Error:</strong> {formatFriendlyError(localError)}
                </div>
              )}
            </>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={handleSubmit}
          className={`text-white ${bgColor}`}
          disabled={isPending || isConfirming}
        >
          {isPending || isConfirming ? 'Procesando...' : 'Ejecutar'}
        </Button>
        <Button
          className='bg-cancel-btn text-cancel-btn-text hover:bg-cancel-btn-hover'
          onClick={onClose}
        >
          Cancelar
        </Button>
      </ModalFooter>
    </Modal>
  );
}