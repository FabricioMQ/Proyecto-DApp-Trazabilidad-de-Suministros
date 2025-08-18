import { useState } from 'react';
import { Button } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import { UserActionModal } from '../components';
import { useProductRegistry } from '../blockchain/hooks/useProductRegistry';

export function ProductRegistryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');
  const [productId, setProductId] = useState(null);

  const {
    registerProduct,
    useProductInfo,
    useProductExists,
    useProductOwner,
  } = useProductRegistry();

  // Ejecutamos hooks en nivel superior
  const productInfo = useProductInfo(productId);
  const productExists = useProductExists(productId);
  const productOwner = useProductOwner(productId);

  const handleSubmit = async (data, error) => {
    if (error) {
      toast.error(error);
      return;
    }
    toast.success('Acción realizada con éxito ');
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
            setModalAction('Ver Información');
            setModalOpen(true);
            setProductId('1'); //ejemplo: setear ID
          }}
        >
          Ver Información
        </Button>

        <Button
          className='text-white bg-warning hover:bg-warning/80'
          onClick={() => {
            setModalAction('Ver Existencia');
            setModalOpen(true);
            setProductId('1'); //ejemplo
          }}
        >
          Ver Existencia
        </Button>

        <Button
          className='text-white bg-success hover:bg-success/80'
          onClick={() => {
            setModalAction('Ver Poseedor');
            setModalOpen(true);
            setProductId('1'); //ejemplo
          }}
        >
          Ver Poseedor
        </Button>
      </div>

      <UserActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        action={modalAction}
        onSubmit={handleSubmit}
        registerProduct={registerProduct}
        productInfo={productInfo}
        productExists={productExists}
        productOwner={productOwner}
      />

      <ToastContainer position='top-right' autoClose={2000} />
    </div>
  );
}
