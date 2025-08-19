import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'flowbite-react';
import { toast } from 'react-toastify';
import { useSupplyChainLogic } from '../blockchain/hooks';
import { formatFriendlyError } from '../utils/formatFriendlyError';

export function SupplyActionModal({ isOpen, onClose, action, onSubmit }) {
  const [idProducto, setIdProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [destino, setDestino] = useState('');

  const [localHash, setLocalHash] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [localStatus, setLocalStatus] = useState('idle');

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
    if (hash) setLocalHash(hash);
  }, [hash]);

  useEffect(() => {
    if (action === 'Registrar Producto' || action === 'Actualizar Estado' || action === 'Transferir Producto') {
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
    if (!idProducto.trim()) {
      toast.error('Por favor ingresa el ID del producto.');
      return;
    }

    try {
      if (action === 'Registrar Producto') {
        if (!descripcion.trim()) {
          toast.error('Por favor ingresa la descripción.');
          return;
        }
        await useResgisterProduct(idProducto, descripcion);
      } else if (action === 'Actualizar Estado') {
        if (!nuevoEstado.trim()) {
          toast.error('Por favor ingresa el nuevo estado.');
          return;
        }
        await useUpdateStateProduct(idProducto, nuevoEstado);
      } else if (action === 'Transferir Producto') {
        if (!destino.trim()) {
          toast.error('Por favor ingresa la dirección de destino.');
          return;
        }
        await useTransferProduct(idProducto, destino);
      }
    } catch (err) {
      toast.error(formatFriendlyError(err));
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
            <label className='block mb-1 font-medium text-text-primary'>ID del producto</label>
            <input
              type='text'
              placeholder='Ej: 1'
              value={idProducto}
              onChange={(e) => setIdProducto(e.target.value)}
              className='w-full p-2 border rounded border-border bg-background text-text-primary'
              required
            />
          </div>

          {action === 'Registrar Producto' && (
            <div>
              <label className='block mb-1 font-medium text-text-primary'>Descripción</label>
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
              <label className='block mb-1 font-medium text-text-primary'>Nuevo estado</label>
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
              <label className='block mb-1 font-medium text-text-primary'>Dirección de destino</label>
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

          {localHash && (
            <div className='p-3 mt-4 text-sm text-blue-800 break-all border border-blue-300 rounded bg-blue-50'>
              <strong>Hash de transacción:</strong><br />{localHash}
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