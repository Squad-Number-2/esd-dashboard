import { Contract, Provider } from 'ethers-multicall'
import { ethers } from 'ethers'
import contracts from '../contracts'
import { web3 } from '../utils/ethers'

const BigNumber = ethers.BigNumber

const { address, abi } = contracts.MIGRATOR

export const migrate = async (account) => {
  const oldDollar = new ethers.Contract(
    contracts.V1_DOLLAR.address,
    contracts.V1_DOLLAR.abi,
    web3
  )
  const oldDao = new ethers.Contract(
    contracts.V1_DAO.address,
    contracts.V1_DAO.abi,
    web3
  )

  const esdBalance = await oldDollar.balanceOf(account)
  const esdsBalance = await oldDao.balanceOf(account)

  const signer = web3.getSigner()
  const migrator = new ethers.Contract(address, abi, signer)
  try {
    return await migrator.migrate(esdBalance, esdsBalance)
  } catch (e) {
    // Parse Error & hit notification lib
    return e
  }
}
