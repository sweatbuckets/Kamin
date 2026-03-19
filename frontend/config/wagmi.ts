import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { http } from "viem";
import { mainnet, sepolia } from "wagmi/chains";

const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ??
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  "YOUR_PROJECT_ID";

export const config = getDefaultConfig({
  appName: "Week 06 My dApp",
  appDescription: "Week 06 wagmi + RainbowKit starter",
  appUrl: "http://localhost:3000",
  projectId,
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  ssr: true,
});
