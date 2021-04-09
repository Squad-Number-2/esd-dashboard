import React from 'react'
import { Flex, Box, Image, Link } from '@chakra-ui/react'
import { CheckCircleIcon, WarningTwoIcon, TimeIcon } from '@chakra-ui/icons'

import useAlerts from '../../contexts/useAlerts'

const Alerts = () => {
  const { alerts } = useAlerts()
  return (
    <Box position="fixed" bottom="130" right="0" p="10px 30px" zIndex="10">
      {alerts.reverse().map((item, i) => {
        switch (item.type) {
          case 'pending':
            return (
              <Box
                borderWidth="1px"
                borderColor="cream"
                borderRadius="10px"
                bg="white"
                p="3px 20px 5px"
                key={'alert' + i}
              >
                <TimeIcon color="palevioletred" mt="-2px" mr="5px" />{' '}
                {item.text} pending
              </Box>
            )
            break
          case 'success':
            return (
              <Box
                borderWidth="1px"
                borderColor="cream"
                borderRadius="10px"
                bg="white"
                p="3px 20px 5px"
                key={'alert' + i}
              >
                <CheckCircleIcon color="green" mt="-2px" mr="5px" /> {item.text}{' '}
                succeeded
              </Box>
            )
            break
          case 'fail':
            return (
              <Box
                borderWidth="1px"
                borderColor="cream"
                borderRadius="10px"
                bg="white"
                p="3px 20px 5px"
                key={'alert' + i}
              >
                <WarningTwoIcon color="red" mt="-2px" mr="5px" /> {item.text}{' '}
                failed
              </Box>
            )
            break
          default:
            return
            break
        }
      })}
    </Box>
  )
}

export default Alerts
