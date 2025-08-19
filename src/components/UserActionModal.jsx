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
    setLocalStatus(status);
    setLocalError(error);
  }, [status, error]);

  useEffect(() => {
    if (hash) {
      setLocalHash(hash);
    }
  }, [hash]);

  useEffect(() => {
    if (action === 'Registrar Usuario' || action === 'Actualizar Usuario') {
      if (localStatus === 'pending') {
        toast.info('Transacción enviada. Esperando confirmación...');
      } else if (localStatus === 'success') {
        toast.success('Transacción confirmada exitosamente.');
        onSubmit?.();
      } else if (localStatus === 'error') {
        toast.error(formatFriendlyError(localError));
      }
    }
  }, [localStatus]);

const handleSubmit = async () => {
  if (!userAddress.trim()) {
    toast.error('Por favor ingresa la dirección del usuario.');
    return;
  }

  if ((action === 'Registrar Usuario' || action === 'Actualizar Usuario') && userType === '0') {
    toast.error('Por favor selecciona un tipo válido.');
    return;
  }

  try {
    if (action === 'Registrar Usuario') {
      await useRegisterUser(userAddress, userType);
    } else if (action === 'Actualizar Usuario') {
      await useUpdateUser(userAddress, userType);
    } else if (action === 'Ver Tipo de Usuario') {
      toast.info('Consultando tipo de usuario...');
      const result = await userTypeQuery.refetch();
      if (result.data != null) {
        setUserTypeResult(result.data.toString());
        toast.success('Consulta completada');
      } else {
        toast.info('Usuario no registrado o tipo desconocido.');
      }
    }
  } catch (err) {
    toast.error(formatFriendlyError(err));
  }
};

  const tipoTexto = {
    '0': 'Ninguno',
    '1': 'Productor',
    '2': 'Transportista',
    '3': 'Distribuidor',
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
                <option value='1'>Productor</option>
                <option value='2'>Transportista</option>
                <option value='3'>Distribuidor</option>
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