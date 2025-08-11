import { useState } from 'react';
import { Button } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import {UserActionModal} from '../components';
import { useUserRegistry } from '../blockchain/hooks/useUserRegistry';

export   function UserRegistryPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('Registrar Usuario');

  const { useRegisterUser, useUpdateUser, useGetUserType } = useUserRegistry();


  const handleSubmit = (data, error) => {
    if (error) {
      toast.error(error);
      return;
    }
     toast.success(error);
  };

  return (
    <div className='max-w-md p-6 mx-auto mt-10 border rounded-lg shadow-md bg-background border-border'>
      <h2 className='mb-6 text-2xl font-bold text-primary'>Menú de Usuario</h2>

      <div className='flex flex-col gap-4'>
        <Button
          className='text-white bg-primary hover:bg-primary-hover'
          onClick={() => {
            setModalAction('Registrar Usuario');
            setModalOpen(true);
          }}
        >
          Registrar Usuario
        </Button>

        <Button
          className='text-white bg-secondary hover:bg-secondary-hover'
          onClick={() => {
            setModalAction('Actualizar Usuario');
            setModalOpen(true);
          }}
        >
          Actualizar Usuario
        </Button>

        <Button
          className='text-white bg-warning hover:bg-warning/80'
          onClick={() => {
            setModalAction('Ver Tipo de Usuario');
            setModalOpen(true);
          }}
        >
          Ver Tipo de Usuario
        </Button>
      </div>

      <UserActionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        action={modalAction}
        onSubmit={handleSubmit}
        useRegisterUser={useRegisterUser}
        useUpdateUser={useUpdateUser}
        useGetUserType={useGetUserType}
      />

      <ToastContainer position='top-right' autoClose={4000} />
    </div>
  );
}
