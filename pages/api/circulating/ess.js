// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import contracts from '../../../contracts'
import { getSupply, fetchBalance, apiProvider } from '../../../utils/ethers'

const { STAKE } = contracts()
const Route = async (req, res) => {
  apiProvider()

  const ownedWallets = [
    '0xc61d12896421613b30d56f85c093cdda43ab2ce7',
    '0x4f97622b8fe23de1abb44cc7fa84eb6b71d78311',
    '0x955f5bc8aa8528d0949ac88941f36c6c8dc38d72',
    '0x07b991579b4e1ee01d7a3342af93e96ecc59e0b3',
    '0x4078c4523af1a3288e48aaf82284e310f0d53a35',
    '0xd353a618abd6b39e8c334291c74a52ceb19b18fd',
    '0x460661bd4a5364a3abcc9cfc4a8ce7038d05ea22',
    '0xac4673a22a0a292da0c975690d1463253ad26ddf',
    '0xc6e09feb984acab2c956c9af56b9b3729a1bf3c8',
    '0x1f98407aab862cddef78ed252d6f557aa5b0f00d'
  ]
  const supply = await getSupply(STAKE)

  const balances = await Promise.all(
    ownedWallets.map((address) => fetchBalance(STAKE.address, address))
  )
  const circSupply =
    supply - balances.reduce((a, c) => parseFloat(a) + parseFloat(c))

  res.status(200)
  res.setHeader('Cache-Control', 's-maxage=3600')
  res.send(circSupply)
}
export default Route
