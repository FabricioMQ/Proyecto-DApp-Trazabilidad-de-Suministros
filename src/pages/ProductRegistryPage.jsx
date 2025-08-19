import { useState } from 'react';
import { Button } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import { InfoProductActionModal } from '../components/InfoProductActionModal';

export function ProductRegistryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('Descripción Producto');

  return (
    <div className='max-w-md p-6 mx-auto mt-10 border rounded-lg shadow-md bg-background border-border'>
      <h2 className='mb-6 text-2xl font-bold text-primary'>Menú Informativo Productos</h2>

      <div className='flex flex-col gap-4'>
        <Button
          className='text-white bg-primary hover:bg-primary-hover'
          onClick={() => {
            setModalAction('Descripción Producto');
            setModalOpen(true);
          }}
        >
          Descripción
        </Button>

        <Button
          className='text-white bg-secondary hover:bg-secondary-hover'
          onClick={() => {
            setModalAction('Ver Poseedor');
            setModalOpen(true);
          }}
        >
          Ver Poseedor
        </Button>

        <Button
          className='text-white bg-warning hover:bg-warning/80'
          onClick={() => {
            setModalAction('Ver Existencia');
            setModalOpen(true);
          }}
        >
          Ver Existencia
        </Button>
      </div>

      <InfoProductActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        action={modalAction}
      />

      <ToastContainer position='top-right' autoClose={2000} />
    </div>
  );
}
