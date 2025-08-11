import { createConfig } from 'wagmi'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { http } from 'viem'
import"@rainbow-me/rainbowkit/styles.css"
// Define tu cadena Ganache local
const ganacheChain = {
  id: 1337,
  name: 'Ganache Local',
  network: 'ganache',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL],
    },
  },
  testnet: true,
}

// Configura las cadenas manualmente (sin configureChains)
const chains = [ganacheChain]

// Define los transports con Viem
const transports = {
  [ganacheChain.id]: http(import.meta.env.VITE_RPC_URL),
}
const projectId = 'eefe4c42b8ba945ed80bfdc1c5b1eff9';
// Conectores (usa getDefaultWallets para RainbowKit)
const { connectors } = getDefaultWallets({
  appName: 'DApp de Trazabilidad de Suministros',
  projectId,
  chains,
})

// Crea la configuración Wagmi (v2)
 const wagmiConfig = createConfig({
  connectors,
  chains,
  transports
})

export { RainbowKitProvider, chains, wagmiConfig }
