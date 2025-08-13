import { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'flowbite-react';
import { toast } from 'react-toastify';
import { useSupplyChainLogic } from '../blockchain/hooks';
import { formatFriendlyError } from '../utils/formatFriendlyError';
//Import
export function SupplyActionModal({ isOpen, onClose, action, onSubmit }) {
  const [idProducto, setIdProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [destino, setDestino] = useState('');

  const {
    isConfirming,
    isConfirmed,
    isPending,
    useResgisterProduct,
    useUpdateStateProduct,
    useTransferProduct,
    hash,
    status,
    error,
  } = useSupplyChainLogic();

  useEffect(() => {
    if (isOpen) {
      setIdProducto('');
      setDescripcion('');
      setNuevoEstado('');
      setDestino('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Transacción confirmada');
      onSubmit?.();
    }
  }, [isConfirmed]);

  const handleSubmit = async () => {
    if (!idProducto.trim()) {
      toast.error('Por favor ingresa el ID del producto.');
      return;
    }

    if (action === 'Registrar Producto') {
      if (!descripcion.trim()) {
        toast.error('Por favor ingresa la descripción.');
        return;
      }

      toast.promise(
        useResgisterProduct(idProducto, descripcion),
        {
          pending: 'Registrando producto...',
          success: 'Transacción enviada. Esperando confirmación...',
          error: {
            render({ data }) {
              return formatFriendlyError(data);
            },
          },
        }
      );

    } else if (action === 'Actualizar Estado') {
      if (!nuevoEstado.trim()) {
        toast.error('Por favor ingresa el nuevo estado.');
        return;
      }

      toast.promise(
        useUpdateStateProduct(idProducto, nuevoEstado),
        {
          pending: 'Actualizando estado...',
          success: 'Transacción enviada. Esperando confirmación...',
          error: {
            render({ data }) {
              return formatFriendlyError(data);
            },
          },
        }
      );

    } else if (action === 'Transferir Producto') {
      if (!destino.trim()) {
        toast.error('Por favor ingresa la dirección de destino.');
        return;
      }

      toast.promise(
        useTransferProduct(idProducto, destino),
        {
          pending: 'Transfiriendo producto...',
          success: 'Transacción enviada. Esperando confirmación...',
          error: {
            render({ data }) {
              return formatFriendlyError(data);
            },
          },
        }
      );
    }
  };

  const bgColor =
    action === 'Registrar Producto'
      ? 'bg-primary hover:bg-primary-hover'
      : action === 'Actualizar Estado'
      ? 'bg-secondary hover:bg-secondary-hover'
      : 'bg-warning hover:bg-warning/80';

  return (
    <Modal show={isOpen} onClose={onClose} size='md' popup>
      <ModalHeader>{action}</ModalHeader>
      <ModalBody>
        <div className='space-y-6'>
          <div>
            <label className='block mb-1 font-medium text-text-primary'>
              ID del producto
            </label>
            <input
              type='text'
              placeholder='Ej: PROD-001'
              value={idProducto}
              onChange={(e) => setIdProducto(e.target.value)}
              className='w-full p-2 border rounded border-border bg-background text-text-primary'
              required
            />
          </div>

          {action === 'Registrar Producto' && (
            <div>
              <label className='block mb-1 font-medium text-text-primary'>
                Descripción
              </label>
              <input
                type='text'
                placeholder='Descripción del producto'
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className='w-full p-2 border rounded border-border bg-background text-text-primary'
                required
              />
            </div>
          )}

          {action === 'Actualizar Estado' && (
            <div>
              <label className='block mb-1 font-medium text-text-primary'>
                Nuevo estado
              </label>
              <input
                type='text'
                placeholder='Ej: En tránsito, Entregado...'
                value={nuevoEstado}
                onChange={(e) => setNuevoEstado(e.target.value)}
                className='w-full p-2 border rounded border-border bg-background text-text-primary'
                required
              />
            </div>
          )}

          {action === 'Transferir Producto' && (
            <div>
              <label className='block mb-1 font-medium text-text-primary'>
                Dirección de destino
              </label>
              <input
                type='text'
                placeholder='0x1234...'
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                className='w-full p-2 border rounded border-border bg-background text-text-primary'
                required
              />
            </div>
          )}

          {hash && (
            <div className='p-3 mt-4 text-sm text-blue-800 break-all border border-blue-300 rounded bg-blue-50'>
              <strong>Hash de transacción:</strong><br />
              {hash}
            </div>
          )}

          {status === 'pending' && (
            <div className='p-3 mt-2 text-yellow-800 border border-yellow-300 rounded bg-yellow-50'>
              <strong>Estado:</strong> Transacción pendiente de confirmación...
            </div>
          )}

          {status === 'success' && (
            <div className='p-3 mt-2 text-green-800 border border-green-300 rounded bg-green-50'>
              <strong>Estado:</strong> Transacción confirmada exitosamente.
            </div>
          )}

          {status === 'error' && (
            <div className='p-3 mt-2 text-red-800 border border-red-300 rounded bg-red-50'>
              <strong>Error:</strong> {formatFriendlyError(error)}
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
