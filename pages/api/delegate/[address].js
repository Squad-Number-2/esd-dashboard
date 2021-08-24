require('dotenv').config()

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { utils } from 'ethers'
import fetch from 'isomorphic-fetch'
const Route = async (req, res) => {
  const { address } = req.query

  const resp = await fetch(
    `https://api.kvstore.io/collections/emptyset/items/${address.toLowerCase()}`,
    {
      headers: {
        kvstoreio_api_key: process.env.KVSTORE,
      },
    }
  ).then((res) => res.json())
  console.log()
  if (resp.status === 'error') {
    res.status(200)
    res.send({ message: "Can't find address profile", status: 'error' })
  } else {
    res.status(200)
    res.send(JSON.parse(resp.value))
  }
}
export default Route
