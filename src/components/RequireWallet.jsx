// components/RequireWallet.jsx
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export function RequireWallet({ children }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <p className='mb-4 text-lg font-bold'>Conecta tu wallet para continuar</p>
        <ConnectButton />
      </div>
    );
  }

  return <>{children}</>;
}