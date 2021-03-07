import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { Row, Column } from '../../../components/helpers'

import { useWeb3 } from '../../../contexts/useWeb3'

import useCurrentBlock from '../../../hooks/useCurrentBlock'

import Page from '../../../components/page'
import { fetchSingleProposal } from '../../../utils/governor'

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
export default function Proposal() {
  const router = useRouter()
  const { id } = router.query
  const { web3, connectWallet, disconnectWallet, account, status } = useWeb3()

  const [proposal, setProposal] = useState({})

  const loadData = async () => {
    if (web3 && id) {
      console.log('Fetching Proposal')
      const prop = await fetchSingleProposal(id)
      setProposal(prop)
      console.log(prop)
    }
  }

  useEffect(async () => {
    loadData()
  }, [])

  // wait for required items on cold load
  useEffect(async () => {
    loadData()
  }, [web3, id])

  return (
    <Page>
      <Wrapper>
        <Column w={'100%'} style={{ maxWidth: '1200px' }} m={'50px 0 0'}>
          <Title>{proposal.title}</Title>
          <Subtitle>{proposal.state} |</Subtitle>
        </Column>
      </Wrapper>

      <ContentWrapper ai={'center'}>
        <CardRow topRow>
          <Card wide>
            <CardTitle>Proposal Details</CardTitle>
            {proposal.description ? (
              <ReactMarkdown plugins={[gfm]} children={proposal.details} />
            ) : null}
          </Card>
          <Card thin>
            <CardTitle>Information</CardTitle>
            <div>
              <InfoTitle>For Votes</InfoTitle>
              <div>{proposal.for_votes} ESDS</div>
            </div>
            <div>
              <InfoTitle>Against Votes</InfoTitle>
              <div>{proposal.against_votes} ESDS</div>
            </div>
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
  min-width: ${({ wide, thin }) => {
    if (wide) {
      return 'auto'
    } else if (thin) {
      return '33%'
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
