import { Contract, Provider } from 'ethers-multicall'
import { ethers } from 'ethers'
import contracts from '../contracts'
import { web3 } from '../utils/ethers'

const BigNumber = ethers.BigNumber

const { address, abi } = contracts.RESERVE

export const mint = async (rawAmount) => {
  const signer = web3.getSigner()
  // Token contract single
  const reserve = new ethers.Contract(address, abi, signer)
  const amount = ethers.utils.parseUnits(rawAmount, 18)
  try {
    const response = await reserve.mint(amount, { gasLimit: 500000 })
    return response
  } catch (e) {
    return e
  }
}

export const redeem = async (rawAmount) => {
  const signer = web3.getSigner()
  // Token contract single
  const reserve = new ethers.Contract(address, abi, signer)
  const amount = ethers.utils.parseUnits(rawAmount, 18)
  try {
    const response = await reserve.redeem(amount, { gasLimit: 500000 })
    return response
  } catch (e) {
    // Parse Error & hit notification lib
    return e
  }
}

export const getData = async (rawAmount) => {
  const reserve = new ethers.Contract(address, abi, web3)
  try {
    // Why do these calls return .value apart from rbResponse
    const rrResponse = await reserve.reserveRatio()
    const rbResponse = await reserve.reserveBalance()
    const rpResponse = await reserve.redeemPrice()
    return {
      ratio: ethers.utils.formatUnits(rrResponse.value, 18),
      balance: ethers.utils.formatUnits(rbResponse, 6),
      price: ethers.utils.formatUnits(rpResponse.value, 18),
    }
  } catch (e) {
    // Parse Error & hit notification lib
    return e
  }
}
