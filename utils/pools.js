import { Contract, Provider } from 'ethers-multicall'
import { ethers } from 'ethers'
import { web3 } from '../utils/ethers'
import { Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import contracts from '../contracts'
const {
  CURVE_DSU,
  INCENTIVIZER_DSU,
  UNISWAP_DSU_ESS,
  STAKE,
  DOLLAR,
  USDC,
  BATCHER,
  PROP1_INIT,
  UNIV3_POSITIONS,
  UNIV3_DSU_USDC,
  UNIV3_ESS_WETH,
  UNIV3_STAKER
} = contracts()

const dsu = [
  '0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e',
  '0x3432ef874A39BB3013e4d574017e0cCC6F937efD',
  1630272524,
  1638048524,
  '0xD05aCe63789cCb35B9cE71d01e4d632a0486Da4B'
]
const ess = [
  '0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e',
  '0xd2Ef54450ec52347bde3dab7B086bf2a005601d8',
  1630272524,
  1638048524,
  '0xD05aCe63789cCb35B9cE71d01e4d632a0486Da4B'
]
export const findV3Incentives = async () => {
  const Prop1 = new ethers.Contract(PROP1_INIT.address, PROP1_INIT.abi, web3)
  const incentives = await Prop1.filters.IncentivesInitialized()
  const data = (await Prop1.queryFilter(incentives, 13122700))[0]
  return { dsu: data.args.dsuIncentiveId, ess: data.args.essIncentiveId }
}

export const findIncentiveProgram = async () => {
  const staking = new ethers.Contract(
    UNIV3_STAKER.address,
    UNIV3_STAKER.abi,
    web3
  )
  const incentives = await staking.filters.IncentiveCreated()
  const data = await staking.queryFilter(incentives, 13122700)
  data.map((item) =>
    console.log([
      item.args.rewardToken,
      item.args.pool,
      item.args.startTime.toNumber(),
      item.args.endTime.toNumber(),
      item.args.refundee
    ])
  )

  return
}
export const getNFTApproval = async (account, operator) => {
  const v3Manger = new ethers.Contract(
    UNIV3_POSITIONS.address,
    UNIV3_POSITIONS.abi,
    web3
  )
  return await v3Manger.isApprovedForAll(
    account,
    operator ? operator : UNIV3_POSITIONS.address
  )
}
export const approveV3Staker = async () => {
  const signer = web3.getSigner()
  const v3Manger = new ethers.Contract(
    UNIV3_POSITIONS.address,
    UNIV3_POSITIONS.abi,
    signer
  )
  return await v3Manger.setApprovalForAll(UNIV3_POSITIONS.address, true)
}

export const transferNft = async (account, tokenId) => {
  const signer = web3.getSigner()

  const v3Manger = new ethers.Contract(
    UNIV3_POSITIONS.address,
    UNIV3_POSITIONS.abi,
    signer
  )
  const tx = await v3Manger['safeTransferFrom(address,address,uint256)'](
    account,
    UNIV3_STAKER.address,
    tokenId
  )
  return tx
}
export const stakeV3Token = async (program, tokenId) => {
  const signer = web3.getSigner()
  const staking = new ethers.Contract(
    UNIV3_STAKER.address,
    UNIV3_STAKER.abi,
    signer
  )

  const tx = await staking.stakeToken(program === 'DSU' ? dsu : ess, tokenId)
  return tx
}
export const unstakeV3Token = async (program, tokenId) => {
  const signer = web3.getSigner()
  const staking = new ethers.Contract(
    UNIV3_STAKER.address,
    UNIV3_STAKER.abi,
    signer
  )

  const tx = await staking.unstakeToken(program === 'DSU' ? dsu : ess, tokenId)
  return tx
}

export const withdrawV3Token = async (tokenId, address) => {
  const signer = web3.getSigner()
  const staking = new ethers.Contract(
    UNIV3_STAKER.address,
    UNIV3_STAKER.abi,
    signer
  )

  const tx = await staking.withdrawToken(tokenId, address, [])
  return tx
}

export const claimReward = async (address, amount) => {
  const signer = web3.getSigner()
  const staking = new ethers.Contract(
    UNIV3_STAKER.address,
    UNIV3_STAKER.abi,
    signer
  )

  const tx = await staking.claimReward(STAKE.address, address, amount)
  return tx
}

export const userRewards = async (address) => {
  const staking = new ethers.Contract(
    UNIV3_STAKER.address,
    UNIV3_STAKER.abi,
    web3
  )

  const tx = await staking.rewards(STAKE.address, address)
  return tx.toString()
}

export const findNFTByPool = async (address, pool, program) => {
  const v3Manger = new ethers.Contract(
    UNIV3_POSITIONS.address,
    UNIV3_POSITIONS.abi,
    web3
  )
  const staking = new ethers.Contract(
    UNIV3_STAKER.address,
    UNIV3_STAKER.abi,
    web3
  )
  const v3Pool = new ethers.Contract(pool, UNIV3_DSU_USDC.abi, web3)
  const batcher = new ethers.Contract(BATCHER.address, BATCHER.abi, web3)

  // Get pool tokens
  const a = await v3Pool.token0()
  const b = await v3Pool.token1()
  // Fetch all UNI V3 NFTs owned by the address
  let nftList = []
  const nfts = await batcher.getIds(UNIV3_POSITIONS.address, address)
  nfts.map((id) => nftList.push({ id: id.toNumber(), address }))
  const stakerNfts = await batcher.getIds(
    UNIV3_POSITIONS.address,
    UNIV3_STAKER.address
  )
  stakerNfts.map((id) =>
    nftList.push({ id: id.toNumber(), address: UNIV3_STAKER.address })
  )

  const fetchOne = async (owner, id) => {
    const pos = await v3Manger.positions(id)
    if (pos.liquidity.toString() === 0) return null
    if (pos.token0 != a && pos.token1 != a) return null
    if (pos.token0 != b && pos.token1 != b) return null

    const position = await staking.deposits(id)
    if (owner !== address && position.owner !== address) return null
    let deposited = position.tickLower != 0
    let staked = false
    let reward = null
    try {
      const [rewardNumber] = await staking.getRewardInfo(
        program === 'DSU' ? dsu : ess,
        id
      )
      reward = rewardNumber.toString()
      staked = true
    } catch {}
    return {
      id,
      deposited,
      reward,
      staked
    }
  }

  // Enumerate all active positions
  let positions = await Promise.all(
    nftList.map((item) => fetchOne(item.address, item.id))
  )

  return positions.filter((item) => item)
}

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
export const getV3DsuTvl = async () => {
  const dollarContract = new ethers.Contract(DOLLAR.address, DOLLAR.abi, web3)

  const dollarBal = ethers.utils.formatUnits(
    await dollarContract.balanceOf(UNIV3_DSU_USDC.address, {
      gasLimit: 100000
    }),
    18
  )

  return parseInt(dollarBal) * 2
}

// Specifically USDC/ESS
export const getUniPoolBalance = async () => {
  const dollarContract = new ethers.Contract(DOLLAR.address, DOLLAR.abi, web3)
  const stakeContract = new ethers.Contract(STAKE.address, STAKE.abi, web3)

  const dollarBal = ethers.utils.formatUnits(
    await dollarContract.balanceOf(UNISWAP_DSU_ESS.address, {
      gasLimit: 100000
    }),
    18
  )
  const stakeBal = ethers.utils.formatUnits(
    await stakeContract.balanceOf(UNISWAP_DSU_ESS.address, {
      gasLimit: 100000
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
    gasLimit: 100000
  })

  const reward = parseFloat(
    ethers.utils.formatUnits(rewardResp, 18)
  ).toFixedNoRounding(fixed ? fixed : 4)
  const underlying = parseFloat(
    ethers.utils.formatUnits(underlyingResp, 18)
  ).toFixedNoRounding(fixed ? fixed : 4)
  return { reward, underlying }
}

export const getIncentivizeRewards = async (contract) => {
  const incentivizer = new ethers.Contract(contract.address, contract.abi, web3)

  const rewardRate = await incentivizer.rewardRate()
  const rewardComplete = await incentivizer.rewardComplete()
  console.log(parseFloat(ethers.utils.formatUnits(rewardRate, 18)))
  return {
    rewardRate: parseFloat(ethers.utils.formatUnits(rewardRate, 18)),
    rewardComplete: parseFloat(ethers.utils.formatUnits(rewardComplete, 18))
  }
}

export const getV3EssTvl = async () => {
  const essPrice = await getESSPrice()
  const wethPrice = await getWETHPrice()

  const stakeContract = new ethers.Contract(STAKE.address, STAKE.abi, web3)
  const wethContract = new ethers.Contract(
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    DOLLAR.abi,
    web3
  )
  const stakeBal = ethers.utils.formatUnits(
    await stakeContract.balanceOf(UNIV3_ESS_WETH.address, {
      gasLimit: 100000
    }),
    18
  )

  const wethBal = ethers.utils.formatUnits(
    await wethContract.balanceOf(UNIV3_ESS_WETH.address, {
      gasLimit: 100000
    }),
    18
  )

  const tvl = parseInt(stakeBal) * essPrice + parseInt(wethBal) * wethPrice
  console.log(tvl)
  return tvl
}

export const getWETHPrice = async () => {
  const usdcContract = new ethers.Contract(
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    DOLLAR.abi,
    web3
  )
  const wethContract = new ethers.Contract(
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    STAKE.abi,
    web3
  )

  const dollarBal = ethers.utils.formatUnits(
    await usdcContract.balanceOf('0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc', {
      gasLimit: 100000
    }),
    6
  )
  const wethBal = ethers.utils.formatUnits(
    await wethContract.balanceOf('0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc', {
      gasLimit: 100000
    }),
    18
  )

  const wethPrice = parseInt(dollarBal) / parseInt(wethBal)
  console.log('WETH Price', wethPrice)
  return wethPrice
}

// V2 Price fetch
export const getESSPrice = async () => {
  const dollarContract = new ethers.Contract(DOLLAR.address, DOLLAR.abi, web3)
  const stakeContract = new ethers.Contract(STAKE.address, STAKE.abi, web3)

  const dollarBal = ethers.utils.formatUnits(
    await dollarContract.balanceOf(UNISWAP_DSU_ESS.address, {
      gasLimit: 100000
    }),
    18
  )
  const stakeBal = ethers.utils.formatUnits(
    await stakeContract.balanceOf(UNISWAP_DSU_ESS.address, {
      gasLimit: 100000
    }),
    18
  )

  const essPrice = parseInt(dollarBal) / parseInt(stakeBal)
  return essPrice
}

// V3 price fetch
export const getDSUPrice = async () => {
  const poolContract = new ethers.Contract(
    UNIV3_DSU_USDC.address,
    UNIV3_DSU_USDC.abi,
    web3
  )

  const [fee, liquidity, slot0] = await Promise.all([
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0()
  ])

  const TokenA = new Token(3, USDC.address, 6, 'USDC', 'USD Coin')
  const TokenB = new Token(
    3,
    DOLLAR.address,
    18,
    'DSU',
    'Digital Standard Unit'
  )

  const poolExample = new Pool(
    TokenA,
    TokenB,
    fee,
    slot0[0].toString(),
    liquidity.toString(),
    slot0[1]
  )

  return poolExample.token0Price
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
