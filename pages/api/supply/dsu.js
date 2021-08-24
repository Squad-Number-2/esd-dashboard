// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import contracts from '../../../contracts'
import { getSupply } from '../../../utils/ethers'

const { DOLLAR } = contracts
const Route = async (req, res) => {
  const supply = await getSupply(DOLLAR)
  res.status(200)
  res.setHeader('Cache-Control', 's-maxage=3600')
  res.send(supply)
}
export default Route
