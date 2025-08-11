import { configureChains, createConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";



const ganacheChain = {
  id: 1337,
  name: "Ganache Local",
  network: "ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ethereum",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: [import.meta.env.VITE_RPC_URL],
    },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ganacheChain],
  [
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id !== 1337) return null;
        return { http: import.meta.env.VITE_RPC_URL };
      },
    }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: " DApp de Trazabilidad de Suministros",
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});


export { RainbowKitProvider, chains ,wagmiConfig};
