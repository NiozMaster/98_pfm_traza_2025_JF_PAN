import { ethers } from 'ethers'

export default class Web3Service {
  provider: any
  signer: any
  contract: any

  constructor() {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      this.provider = new ethers.BrowserProvider((window as any).ethereum)
    }
  }

  async connect() {
    if (!this.provider) throw new Error('No provider')
    const signer = await this.provider.getSigner()
    this.signer = signer
    return signer
  }
}
