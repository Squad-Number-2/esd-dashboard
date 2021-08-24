// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import contracts from '../../../contracts'
import { getSupply } from '../../../utils/ethers'

const { STAKE } = contracts
const Route = async (req, res) => {
  const supply = await getSupply(STAKE)
  res.status(200)
  res.setHeader('Cache-Control', 's-maxage=3600')
  res.send(supply)
}
export default Route
