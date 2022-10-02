import { Contract, Provider } from 'ethers-multicall'
import { ethers } from 'ethers'
import contracts from '../contracts'
import { web3 } from '../utils/ethers'
import fetch from 'isomorphic-fetch'

const fetcher = (url) => fetch(url).then((res) => res.json())

const BigNumber = ethers.BigNumber

export const gasEstimates = async () => {
  const gas = await fetcher(
    'https://api.anyblock.tools/ethereum/ethereum/mainnet/gasprice'
  )
  const price = await fetcher(
    'https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD'
  )

  const gasPrice = ethers.utils.parseUnits(gas.fast.toString(), 'gwei')
  const redeem = ethers.utils.formatEther(gasPrice.mul('260000')) * price.USD
  const mint = ethers.utils.formatEther(gasPrice.mul('280000')) * price.USD
  const approve = ethers.utils.formatEther(gasPrice.mul('20000')) * price.USD

  return { mint, redeem, approve }
}

export const mint = async (rawAmount) => {
  const signer = web3.getSigner()
  // Token contract single
  const reserve = new ethers.Contract(
    contracts().RESERVE.address,
    contracts().RESERVE.abi,
    signer
  )
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
  const reserve = new ethers.Contract(
    contracts().RESERVE.address,
    contracts().RESERVE.abi,
    signer
  )
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
  const reserve = new ethers.Contract(
    contracts().RESERVE.address,
    contracts().RESERVE.abi,
    web3
  )
  const dollar = new ethers.Contract(
    contracts().DOLLAR.address,
    contracts().DOLLAR.abi,
    web3
  )
  const usdc = new ethers.Contract(
    contracts().USDC.address,
    contracts().USDC.abi,
    web3
  )
  try {
    // Why do these calls return .value apart from rbResponse
    const rrResponse = await reserve.reserveRatio()

    const rbResponse = await reserve.reserveBalance()
    const rpResponse = await reserve.redeemPrice()
    const tsResponse = await dollar.totalSupply()

    // Outsanding assets in the natcher
    const batcherBalance = await usdc.balanceOf(
      contracts().WRAP_ONLY_BATCHER.address
    )

    // Total DSU Debt mintable
    const totalDebt = await reserve.totalDebt()
    //  Supply minus Debt
    const trueBalance = tsResponse.sub(totalDebt)

    const revenue =
      parseFloat(ethers.utils.formatUnits(rbResponse, 6)) -
      parseFloat(ethers.utils.formatUnits(trueBalance, 18))
    return {
      ratio: ethers.utils.formatUnits(rrResponse.value, 18),
      balance: ethers.utils.formatUnits(rbResponse, 6),
      price: ethers.utils.formatUnits(rpResponse.value, 18),
      revenue,
      outstanding: ethers.utils.formatUnits(batcherBalance, 6),
      debt: ethers.utils.formatUnits(totalDebt, 18)
    }
  } catch (e) {
    // Parse Error & hit notification lib
    return e
  }
}
