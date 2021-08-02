import { Contract, Provider } from 'ethers-multicall'
import { ethers } from 'ethers'
import { web3 } from '../utils/ethers'
import { toDecimals } from '../utils/helpers'
import contracts from '../contracts'
const { CURVE_DSU, INCENTIVIZER_DSU, UNISWAP_DSU_ESS, STAKE, DOLLAR } =
  contracts

export const getCurveTVL = async (fixed) => {
  const curve = new ethers.Contract(CURVE_DSU.address, CURVE_DSU.abi, web3)

  const dsu = await curve.balances(0, { gasLimit: 100000 })
  const threeCrv = await curve.balances(1, { gasLimit: 100000 })

  const normalised = parseFloat(
    ethers.utils.formatUnits(dsu.add(threeCrv), 18)
  ).toFixedNoRounding(fixed ? fixed : 2)
  return normalised
}

// Specifically USDC/ESS
export const getUniPoolBalance = async () => {
  const dollarContract = new ethers.Contract(DOLLAR.address, DOLLAR.abi, web3)
  const stakeContract = new ethers.Contract(STAKE.address, STAKE.abi, web3)

  const dollarBal = ethers.utils.formatUnits(
    await dollarContract.balanceOf(UNISWAP_DSU_ESS.address, {
      gasLimit: 100000,
    }),
    18
  )
  const stakeBal = ethers.utils.formatUnits(
    await stakeContract.balanceOf(UNISWAP_DSU_ESS.address, {
      gasLimit: 100000,
    }),
    18
  )

  const essPrice = parseInt(dollarBal) / parseInt(stakeBal)
  return essPrice * parseInt(stakeBal) + parseInt(dollarBal)
}

export const getIncentivizerBalance = async (contract, account, fixed) => {
  if (!account) return { reward: 0, underlying: 0 }
  const curve = new ethers.Contract(contract.address, contract.abi, web3)

  const rewardResp = await curve.balanceOfReward(account, { gasLimit: 100000 })
  const underlyingResp = await curve.balanceOfUnderlying(account, {
    gasLimit: 100000,
  })

  const reward = parseFloat(
    ethers.utils.formatUnits(rewardResp, 18)
  ).toFixedNoRounding(fixed ? fixed : 4)
  const underlying = parseFloat(
    ethers.utils.formatUnits(underlyingResp, 18)
  ).toFixedNoRounding(fixed ? fixed : 4)
  return { reward, underlying }
}

export const depositToCrvPool = async (contract, value) => {
  const signer = web3.getSigner()
  const cont = new ethers.Contract(contract.address, contract.abi, signer)

  const response = await cont.stake(ethers.utils.parseUnits(value, 18))
  return response
}
export const withdrawFromCrvPool = async (contract, value) => {
  const signer = web3.getSigner()
  const cont = new ethers.Contract(contract.address, contract.abi, signer)

  const response = await cont.withdraw(ethers.utils.parseUnits(value, 18))
  return response
}

export const claimFromCrvPool = async (contract) => {
  const signer = web3.getSigner()
  const cont = new ethers.Contract(contract.address, contract.abi, signer)
  const response = await cont.claim()
  return response
}
export const exitFromCrvPool = async (contract) => {
  const signer = web3.getSigner()
  const cont = new ethers.Contract(contract.address, contract.abi, signer)
  const response = await cont.exit()
  return response
}
