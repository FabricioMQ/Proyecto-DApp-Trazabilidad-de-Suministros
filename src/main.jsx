import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { WagmiProvider } from 'wagmi';
import {
  RainbowKitProvider,
  chains,
  wagmiConfig,
} from './blockchain/provider.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RequireWallet } from './components';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <WagmiProvider config={wagmiConfig} reconnectOnMount={true}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact" chains={chains}>
          <RequireWallet>
            <App />
          </RequireWallet>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);