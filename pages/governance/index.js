import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Link from 'next/link'

import { Row, Column } from '../../components/helpers'
import Page from '../../components/page'

import { useWeb3 } from '../../contexts/useWeb3'
import { zeroAddress } from '../../utils/ethers'

import {
  fetchProposals,
  fetchDelegate,
  fetchDelegations,
} from '../../utils/governor'

export default function Home() {
  const { web3, connectWallet, disconnectWallet, account } = useWeb3()

  const [delegations, setDelegations] = useState([])
  const [proposals, setProposals] = useState([])
  const [delegate, setDelegate] = useState('')

  useEffect(async () => {
    console.log('Fetching Proposals')
    setProposals(await fetchProposals())
    setDelegations(await fetchDelegations())
  }, [])

  useEffect(async () => {
    console.log('Fetching Delegate')
    setDelegate(await fetchDelegate(account))
  }, [account])

  const voteWeight = () => {
    if (account && delegations[0]) {
      try {
        return delegations.find((item) => account === item.delegate).vote_weight
      } catch (error) {
        return '0.0000'
      }
    }
  }

  const usersDelegate = () => {
    if (account === delegate) {
      return 'Self'
    } else if (delegate != '') {
      return delegate
    }
  }
  return (
    <Page>
      <Wrapper>
        <Column w={'100%'} style={{ maxWidth: '1200px' }} m={'50px 0 0'}>
          <Title>Protocol Governance</Title>
          <Subtitle>
            Propose & vote for governance actions that effect the protocol.
          </Subtitle>
        </Column>
      </Wrapper>

      <ContentWrapper ai={'center'}>
        <CardRow topRow>
          <Card h={'fit-content'} thin>
            <CardTitle>Your Wallet</CardTitle>
            {delegate != zeroAddress ? (
              <>
                <div>
                  <InfoTitle>Voting weight</InfoTitle>
                  <div>{voteWeight()} ESDS</div>
                </div>
                <div>
                  <InfoTitle>Delegating to:</InfoTitle>
                  <div>{usersDelegate()}</div>
                </div>
              </>
            ) : (
              <div>
                <InfoTitle>Delegate your vote</InfoTitle>
                <div>
                  In order to vote you need to delegate your vote weight. To do
                  this you need to either choose your own wallet or another
                  wallet to vote on your behalf.
                </div>
              </div>
            )}
          </Card>
          <Card wide>
            <CardTitle>Governance Proposals</CardTitle>
            {proposals.map((prop, id) => (
              <Link key={id + 'prop'} href={`/governance/proposal/${prop.id}`}>
                <a>
                  <InfoTitle>{prop.title}</InfoTitle>
                  <div>{prop.state}</div>
                </a>
              </Link>
            ))}
          </Card>
        </CardRow>
      </ContentWrapper>
    </Page>
  )
}

const Title = styled.h1`
  color: ${({ black }) => (black ? 'black' : 'white')};
  margin-bottom: 0px;
  font-weight: bold;
`
const CardTitle = styled.h2`
  margin: 0px;
  font-weight: bold;
`
const InfoTitle = styled.h3`
  font-weight: 400;
  margin-bottom: 10px;
  color: #00d661;
`
const Cta = styled.a`
  color: black;
  padding: 10px 0px;
`

const Subtitle = styled.p`
  color: white;
`
const ContentWrapper = styled(Column)`
  background: white;
  width: 100%;
  flex-grow: 1;
  margin: 150px 0 0;
  padding: 0 20px 50px;
  box-sizing: border-box;
`
const Infobox = styled(Column)`
  margin: 50px 0 0;
  max-width: 1200px;
  h3 {
    margin: 10px 0px 0px;
  }
  p {
    padding: 0px 10px;
    text-align: center;
    font-size: 14px;
    line-height: 32px;
  }
`
const InfoCard = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 30px;
  flex-grow: 1;
  :last-child {
    margin-right: 0px;
  }
`

const CardRow = styled(Row)`
  width: 100%;
  max-width: 1200px;
  margin: ${({ topRow }) => (topRow ? '-97px 0 20px' : 0)};
`

const Card = styled(Column)`
  background: #ffffff;
  border: 1px solid #e8e8e8;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 34px 68px;
  margin-right: 30px;
  flex-grow: 1;
  width: ${({ wide, thin }) => {
    if (wide) {
      return 'auto'
    } else if (thin) {
      return '40%'
    } else {
      return 'calc(50% - 15px)'
    }
  }};
  :last-child {
    margin-right: 0px;
  }
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  grid-auto-rows: minmax(70px, auto);
`
const Button = styled.button`
  color: #00d661;
  border: 1px solid;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 8px 16px 6px;
  background: none;
  font-size: 18px;
  outline: none;
  max-height: 40px;
`

const Wrapper = styled(Row)`
  width: 100%;
  padding: 0px 20px;
  box-sizing: border-box;
  justify-content: center;
`
