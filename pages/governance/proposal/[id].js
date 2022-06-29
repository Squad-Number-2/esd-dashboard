import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ChakraUIRenderer from 'chakra-ui-markdown-renderer'

import { format, formatDistance } from 'date-fns'
import { useWeb3 } from '../../../contexts/useWeb3'
import useAlerts from '../../../contexts/useAlerts'

import Page from '../../../components/page'
import Section from '../../../components/section'
import Back from '../../../components/back'

import {
  fetchSingleProposal,
  castVote,
  queue,
  execute,
  fetchAddressProfile
} from '../../../utils/governor'
import { commas } from '../../../utils/helpers'
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
  Divider,
  Center,
  Skeleton,
  Avatar
} from '@chakra-ui/react'
import { isCommunityResourcable } from '@ethersproject/providers'

export default function Proposal() {
  const router = useRouter()
  const { web3, connectWallet, disconnectWallet, account, status } = useWeb3()
  const { watchTx } = useAlerts()

  const [proposal, setProposal] = useState({})
  const [proposer, setProposer] = useState({})

  const loadData = async () => {
    if (web3 && router.query.id) {
      console.log('Fetching Proposal')
      console.log(router.query)
      const id = router.query.id
      const prop = await fetchSingleProposal(id)
      setProposal(prop)
      console.log(prop)

      const user = await fetchAddressProfile(prop.proposer)
      setProposer(user)
    }
  }

  const vote = async (bool) => {
    const response = await castVote(router.query.id, bool)
    watchTx(response.hash, 'Casting Vote')
  }

  useEffect(() => {
    const func = async () => {
      if (web3) await loadData()
    }
    func()
  }, [web3, router])

  const subheading = (proposal) => {
    switch (proposal.state) {
      case 'Cancelled':
        return 'Cancelled'
        break
      case 'Pending':
        return `Pending - Starts at #${proposal.startBlock}`
        break
      case 'Active':
        return `Active - Voting ends at #${proposal.endBlock}`
        break
      case 'Defeated':
        return (
          'Defeated by ' +
          (proposal.against_votes - proposal.for_votes) +
          ' votes'
        )
        break
      case 'Succeeded':
        return 'Succeeded - Waiting for proposal to be Queued'
        break
      case 'Queued':
        const now = new Date().getTime()
        return proposal.eta * 1000 > now
          ? `Queued - Executable in ${formatDistance(proposal.eta * 1000, now)}`
          : `Queued - Ready to Execute`
        break
      case 'Expired':
        return 'Expired'
        break
      case 'Executed':
        return 'Executed - Proposal has been executed'
        break
      default:
        break
    }
  }

  const newTheme = {
    a: (props) => {
      const { children } = props
      return (
        <Link isExternal={true} {...props}>
          <Text as="span" color="gray.600" borderBottom="1px solid gray">
            {children}
          </Text>
        </Link>
      )
    }
  }

  return (
    <Page
      header={proposal.title}
      subheader={proposal.title ? subheading(proposal) : null}
      back
    >
      <Section>
        <Flex>
          <Box pr="2em" h="fit-content" w="70%">
            <Flex alignItems={'flex-end'}>
              <Back />
              <Heading fontSize="3xl" fontWeight={'400'}>
                {proposal.title}
              </Heading>
            </Flex>
            <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />

            {proposal.description ? (
              <ReactMarkdown
                plugins={[gfm]}
                components={ChakraUIRenderer(newTheme)}
                children={proposal.details}
              />
            ) : (
              <Box>
                <Skeleton h="20px" mb="5px" w="89%" />
                <Skeleton h="20px" mb="5px" w="78%" />
                <Skeleton h="20px" mb="5px" w="92%" />
                <Skeleton h="20px" mb="5px" w="78%" />
                <Skeleton h="20px" mb="5px" w="73%" />
              </Box>
            )}
            <Divider m="1em 0 0" />

            <Heading fontSize="md" m="1em 0 0.5em">
              Proposal Actions
            </Heading>
            {proposal.actions ? (
              proposal.actions.map((action, i) => (
                <Box key={i + 'Actions'} mb="0.5em">
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
          <Box m="0 0 0 1em" w="30%">
            <Heading fontSize="3xl" fontWeight={'400'}>
              Vote Information
            </Heading>
            <Divider mt="2" mb="4" borderWidth={1} borderColor={'black'} />
            <Flex p=".5em 0 0">
              <Avatar
                size={'lg'}
                src={proposer.image}
                alt={'Team Avatar'}
                pos={'relative'}
              />
              <Flex mx=".5em" flexDirection="column" justifyContent="center">
                <Heading fontSize={'2xl'} fontFamily={'body'} mb="1">
                  {proposer.name}
                </Heading>
                <Link
                  isExternal="true"
                  src={'https://twitter.com/' + proposer.twitter}
                >
                  <Text fontWeight={600} color={'gray.500'}>
                    {proposer.twitter}
                  </Text>
                </Link>
              </Flex>
            </Flex>
            <Divider m=".5em 0 0" />

            <Box p=".5em 0">
              <Heading fontSize="lg">Votes for:</Heading>
              <Text>{commas(proposal.for_votes)} ESS</Text>
              <Heading fontSize="lg">Votes against:</Heading>
              <Text>{commas(proposal.against_votes)} ESS</Text>
            </Box>

            {proposal.state === 'Active' ? (
              <>
                <Button
                  colorScheme="green"
                  w="100%"
                  m=".5em 0"
                  onClick={() => vote(true)}
                >
                  Vote for Proposal
                </Button>
                <Button
                  colorScheme="red"
                  w="100%"
                  m=".5em 0"
                  onClick={() => vote(false)}
                >
                  Vote against Proposal
                </Button>
              </>
            ) : null}
            {proposal.state === 'Succeeded' ? (
              <Button w="100%" m=".5em 0" onClick={() => queue(prop.id)}>
                Queue Proposal
              </Button>
            ) : null}

            {proposal.state === 'Queued' ? (
              <Button
                w="100%"
                m=".5em 0"
                colorScheme="green"
                onClick={() => execute(id)}
                disabled={proposal.eta * 1000 > new Date().getTime()}
              >
                Execute Proposal
              </Button>
            ) : null}
          </Box>
        </Flex>
      </Section>
    </Page>
  )
}
