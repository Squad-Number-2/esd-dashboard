import { Contract, Provider } from 'ethers-multicall'
import { ethers } from 'ethers'
import { web3 } from '../utils/ethers'
import contracts from '../contracts'
const { CURVE_DSU, INCENTIVIZER_DSU } = contracts

export const getCurveTVL = async (fixed) => {
  const curve = new ethers.Contract(CURVE_DSU.address, CURVE_DSU.abi, web3)

  const dsu = await curve.balances(0, { gasLimit: 100000 })
  const threeCrv = await curve.balances(1, { gasLimit: 100000 })

  const normalised = parseFloat(
    ethers.utils.formatUnits(dsu.add(threeCrv), 18)
  ).toFixed(fixed ? fixed : 2)
  return normalised
}

export const getIncentivizerBalance = async (contract, account, fixed) => {
  const curve = new ethers.Contract(contract.address, contract.abi, web3)

  const rewardResp = await curve.balanceOfReward(account, { gasLimit: 100000 })
  const underlyingResp = await curve.balanceOfUnderlying(account, {
    gasLimit: 100000,
  })

  const reward = parseFloat(ethers.utils.formatUnits(rewardResp, 18)).toFixed(
    fixed ? fixed : 2
  )
  const underlying = parseFloat(
    ethers.utils.formatUnits(underlyingResp, 18)
  ).toFixed(fixed ? fixed : 2)
  return { reward, underlying }
}

export const depositToIncentivizer = async (contract, value) => {
  const signer = web3.getSigner()
  const cont = new ethers.Contract(contract.address, contract.abi, signer)

  const response = await cont.stake(ethers.utils.parseUnits(value, 18))
  return response
}
export const withdrawFromIncentivizer = async (contract, value) => {
  const signer = web3.getSigner()
  const cont = new ethers.Contract(contract.address, contract.abi, signer)

  const response = await cont.withdraw(ethers.utils.parseUnits(value, 18))
  return response
}

export const claimFromIncentivizer = async (contract) => {
  const signer = web3.getSigner()
  const cont = new ethers.Contract(contract.address, contract.abi, signer)
  const response = await cont.claim()
  return response
}
export const exitFromIncentivizer = async (contract) => {
  const signer = web3.getSigner()
  const cont = new ethers.Contract(contract.address, contract.abi, signer)
  const response = await cont.exit()
  return response
}
