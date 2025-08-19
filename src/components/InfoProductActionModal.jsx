import { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'flowbite-react';
import { toast } from 'react-toastify';
import {useProductRegistry} from '../blockchain/hooks';
import { formatFriendlyError } from '../utils/formatFriendlyError';

export function InfoProductActionModal({ isOpen, onClose, action }) {
const [idProduct, setidProduct] = useState('');
const [resultOp, setResultOp] = useState('');

  const {
    useCheckProductoExists,
    useGetProductDescription,
    useGetProductoHolder
  } = useProductRegistry();


const handleSubmit = async () => {
  if (idProduct === null){
    toast.error('Por favor ingresa el id del Producto.');
    return;
  }


  try {
    let result;
    toast.success('Consultando Información');
    if (action === 'Ver Existencia') {
      result = await useCheckProductoExists(idProduct).refetch;
    } else if (action === 'Ver Poseedor') {
      result = await  useGetProductoHolder(idProduct).refetch;
    } else if (action === 'Descripción Producto') {
        result = await useGetProductDescription(idProduct).refetch;
    }
    if (result.data != null) {
        setResultOp(result.data.toString());
        toast.success('Consulta completada');
      } else {
        toast.info('Producto no registrado.');
      }
  } catch (err) {
    toast.error(formatFriendlyError(err));
    alert(err)
  }
};
    const tipoTextoBool = {
    true: 'El producto existe',
    false: 'Producto no encontrado',
  };

    const tipoTitulo = {
    'Ver Existencia': 'Producto :',
    'Ver Poseedor': 'Poseedor :',
    'Ver Descripción': 'Descripción :',
  };

  const bgColor =
  action === 'Ver Producto'
    ? 'bg-primary hover:bg-primary-hover'
    : action === 'Visualizar Producto'
    ? 'bg-secondary hover:bg-secondary-hover'
    : 'bg-warning hover:bg-warning/80';
  return (
    <Modal show={isOpen} onClose={onClose} size='md' popup>
      <ModalHeader>{action}</ModalHeader>
      <ModalBody>
        <div className='space-y-6'>
          <div>
            <label className='block mb-1 font-medium text-text-primary'>
              ID del Producto
            </label>
            <input
              type='number'
              placeholder='001'
              value={idProduct}
              onChange={(e) => setidProduct(e.target.value)}
              className='w-full p-2 border rounded border-border bg-background text-text-primary'
              required
            />
          </div>

          {resultOp !== null  &&  (
            <div className='p-3 mt-4 bg-gray-100 border border-gray-300 rounded'>
              <strong>{tipoTitulo[action]}</strong> {tipoTextoBool[resultOp] ?? resultOp}
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
        className='text-white bg-secondary hover:bg-secondary-hover'
          onClick={handleSubmit}
        > Ejecutar
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