import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import { useWeb3 } from '../../../contexts/useWeb3'

import useCurrentBlock from '../../../hooks/useCurrentBlock'

import Page from '../../../components/page'
import { fetchSingleProposal, castVote } from '../../../utils/governor'

import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'

import {
  Flex,
  Grid,
  Box,
  Link,
  Heading,
  Text,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  Input,
  InputGroup,
  InputRightAddon,
  Divider,
  Center,
  Skeleton,
} from '@chakra-ui/react'

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

  const vote = async (bool) => {
    const response = await castVote(id, bool)
    alert('Vote pending.')
  }

  useEffect(async () => {
    loadData()
  }, [])

  // wait for required items on cold load
  useEffect(async () => {
    loadData()
  }, [web3, id])

  return (
    <Page
      header={proposal.title}
      subheader={
        proposal.title
          ? proposal.state + ' - Ends at #' + proposal.endBlock
          : null
      }
    >
      <Box m={'-97px 0 20px'}>
        <Flex>
          <Box
            bg="white"
            p="2em 4em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            h="fit-content"
            w="70%"
          >
            <Heading fontSize="xl" m="0 0 0.5em">
              Proposal Details
            </Heading>
            {proposal.description ? (
              <ReactMarkdown plugins={[gfm]} children={proposal.details} />
            ) : (
              <Box>
                <Skeleton h="20px" mb="5px" w="89%" />
                <Skeleton h="20px" mb="5px" w="78%" />
                <Skeleton h="20px" mb="5px" w="92%" />
                <Skeleton h="20px" mb="5px" w="78%" />
                <Skeleton h="20px" mb="5px" w="73%" />
              </Box>
            )}

            <Heading fontSize="md" m="1em 0 0.5em">
              Proposal Actions
            </Heading>
            {proposal.actions ? (
              proposal.actions.map((action) => (
                <Box mb="0.5em">
                  <Text>{action.signature}</Text>
                  <Text fontSize="xs">{action.target}</Text>
                  <Text fontSize="xs">
                    Call Data: {action.calldata.slice(0, 50)}...
                  </Text>
                </Box>
              ))
            ) : (
              <>
                <Box mb="0.5em">
                  <Skeleton h="25px" mb="5px" w="30%" />
                  <Skeleton h="18px" mb="2px" w="50%" />
                  <Skeleton h="18px" mb="5px" w="60%" />
                </Box>
              </>
            )}
          </Box>
          <Box
            bg="white"
            p="2em 2em"
            m="0 0 0 1em"
            border="1px solid #e8e8e8"
            borderRadius="lg"
            w="30%"
          >
            <Heading fontSize="xl">Information</Heading>
            <Box p="1em 0">
              <Heading fontSize="lg">Votes For</Heading>
              <Text>{proposal.for_votes} ESDS</Text>
              <Divider m=".5em 0" />
              <Heading fontSize="lg">Votes Against</Heading>
              <Text>{proposal.against_votes} ESDS</Text>
            </Box>
            <Button w="100%" m=".5em 0" onClick={() => vote(true)}>
              Vote for Proposal
            </Button>
            <Button w="100%" m=".5em 0" onClick={() => vote(false)}>
              Vote against Proposal
            </Button>
          </Box>
        </Flex>
      </Box>
    </Page>
    // <Page>
    //   <Wrapper>
    //     <Column w={'100%'} style={{ maxWidth: '1200px' }} m={'50px 0 0'}>
    //       <Title>{proposal.title}</Title>
    //       <Subtitle>{proposal.state} |</Subtitle>
    //     </Column>
    //   </Wrapper>

    //   <ContentWrapper ai={'center'}>
    //     <CardRow topRow>
    //       <Card wide>
    //         <CardTitle>Proposal Details</CardTitle>
    //         {proposal.description ? (
    //           <ReactMarkdown plugins={[gfm]} children={proposal.details} />
    //         ) : null}
    //       </Card>
    //       <Card thin>

    //       </Card>
    //     </CardRow>
    //   </ContentWrapper>
    // </Page>
  )
}
