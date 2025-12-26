import { useWeb3 } from '../contexts/Web3Context'

export function useWallet() {
  const { account, connect, disconnect } = useWeb3()
  return { account, connect, disconnect }
}
