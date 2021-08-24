// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { utils } from 'ethers'
import fetch from 'isomorphic-fetch'
const Route = async (req, res) => {
  const { body } = req

  const data = JSON.parse(body)
  const signer = utils.verifyMessage(data.message, data.signature)

  if (signer.toLowerCase() === data.address.toLowerCase()) {
    const resp = await fetch(
      `https://api.kvstore.io/collections/emptyset/items/${data.address.toLowerCase()}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'text/plain',
          kvstoreio_api_key: process.env.KVSTORE,
        },
        body: JSON.stringify(data.message),
      }
    )
    res.status(200)
    res.send({ status: 'success' })
  } else {
    res.status(401)
    res.send({ message: "Signatures didn't match", status: 'error' })
  }
}
export default Route
