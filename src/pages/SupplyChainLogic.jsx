import { useState } from 'react';
import { Button } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import { SupplyActionModal } from '../components/SupplyActionModal';
import { useSupplyChainLogic } from '../blockchain/hooks/useSupplyChainLogic';
// Comprobar
export function SupplyChainLogic() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('Registrar Producto');

  const {
    useResgisterProduct,
    useUpdateStateProduct,
    useTransferProduct,
  } = useSupplyChainLogic();

  const handleSubmit = (data, error) => {
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Operación completada');
  };

  return (
    <div className='max-w-md p-6 mx-auto mt-10 border rounded-lg shadow-md bg-background border-border'>
      <h2 className='mb-6 text-2xl font-bold text-primary'>Menú de Productos</h2>

      <div className='flex flex-col gap-4'>
        <Button
          className='text-white bg-primary hover:bg-primary-hover'
          onClick={() => {
            setModalAction('Registrar Producto');
            setModalOpen(true);
          }}
        >
          Registrar Producto
        </Button>

        <Button
          className='text-white bg-secondary hover:bg-secondary-hover'
          onClick={() => {
            setModalAction('Actualizar Estado');
            setModalOpen(true);
          }}
        >
          Actualizar Estado
        </Button>

        <Button
          className='text-white bg-warning hover:bg-warning/80'
          onClick={() => {
            setModalAction('Transferir Producto');
            setModalOpen(true);
          }}
        >
          Transferir Producto
        </Button>
      </div>

      <SupplyActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        action={modalAction}
        onSubmit={handleSubmit}
        useResgisterProduct={useResgisterProduct}
        useUpdateStateProduct={useUpdateStateProduct}
        useTransferProduct={useTransferProduct}
      />

      <ToastContainer position='top-right' autoClose={4000} />
    </div>
  );
}
