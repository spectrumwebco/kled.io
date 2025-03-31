import { Box, Button, Center, Heading, Text, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { client } from "../../client/client"
import { TAuthStatus } from "../../types"
import { Return, Result } from "../../lib"

export function SlackAuth() {
  const [authStatus, setAuthStatus] = useState<TAuthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuthStatus = async () => {
      setLoading(true)
      const result = await client.getAuthStatus()
      if (result.ok) {
        setAuthStatus(result.val)
        setError(null)
      } else {
        setError(result.err.toString())
      }
      setLoading(false)
    }

    fetchAuthStatus()
    const interval = setInterval(fetchAuthStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleConnectWithSlack = () => {
    client.initiateSlackAuth()
  }

  if (loading) {
    return (
      <Center height="100%">
        <Text>Loading authentication status...</Text>
      </Center>
    )
  }

  if (error) {
    return (
      <Center height="100%">
        <Box>
          <Text color="red.500" marginBottom="4">Error: {error}</Text>
          <Button onClick={handleConnectWithSlack}>Try Again</Button>
        </Box>
      </Center>
    )
  }

  if (authStatus?.authenticated) {
    return (
      <Box p={6}>
        <Box>
          <Heading size="md" marginBottom="4">Connected to Slack</Heading>
          <Box marginBottom="4">
            <Text>You are authenticated as:</Text>
            <Text fontWeight="bold">{authStatus.userInfo?.name}</Text>
            <Text>{authStatus.userInfo?.email}</Text>
          </Box>
          <Text>
            You can now access the Kled.io community on Slack and receive support from our team.
          </Text>
        </Box>
      </Box>
    )
  }

  return (
    <Box p={6}>
      <Box>
        <Heading size="md" marginBottom="4">Connect with Slack</Heading>
        <Text marginBottom="4">
          Connect your Kled.io account with Slack to join our community and get support from our team.
        </Text>
        <Button colorScheme="purple" onClick={handleConnectWithSlack}>
          Connect with Slack
        </Button>
      </Box>
    </Box>
  )
}
