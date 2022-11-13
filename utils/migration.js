import { Contract, Provider } from 'ethers-multicall'
import { ethers } from 'ethers'
import contracts from '../contracts'
import { web3 } from '../utils/ethers'

const BigNumber = ethers.BigNumber

export const migrate = async (account) => {
  const { MIGRATOR, V1_DOLLAR, V1_DAO } = contracts()

  const oldDollar = new ethers.Contract(V1_DOLLAR.address, V1_DOLLAR.abi, web3)
  const oldDao = new ethers.Contract(V1_DAO.address, V1_DAO.abi, web3)

  const esdBalance = await oldDollar.balanceOf(account)
  const esdsBalance = await oldDao.balanceOf(account)

  const signer = web3.getSigner()
  const migrator = new ethers.Contract(MIGRATOR.address, MIGRATOR.abi, signer)
  try {
    return await migrator.migrate(esdBalance, esdsBalance)
  } catch (e) {
    // Parse Error & hit notification lib
    return e
  }
}
