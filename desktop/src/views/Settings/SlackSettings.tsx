import { Box, Button, Heading, Text } from "@chakra-ui/react"
import { FaSlack } from "react-icons/fa"
import { useEffect, useState } from "react"
import { client } from "../../client/client"
import { Return } from "../../lib"
import { TAuthStatus } from "../../types"

export function SlackSettings() {
  const [authStatus, setAuthStatus] = useState<TAuthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuthStatus = async () => {
      setLoading(true)
      const result = await client.getAuthStatus()
      if (result.ok) {
        setAuthStatus(result.val)
      } else {
        console.error("Error fetching authentication status:", result.err)
        setError(result.err.toString())
      }
      setLoading(false)
    }

    fetchAuthStatus()
  }, [])

  const handleConnectWithSlack = () => {
    client.initiateSlackAuth()
  }

  if (loading) {
    return (
      <Box>
        <Text>Loading authentication status...</Text>
      </Box>
    )
  }

  if (authStatus?.authenticated) {
    return (
      <Box>
        <Heading size="md" marginBottom="4">Slack Connection</Heading>
        <Box marginBottom="4">
          <Text>Connected as: <strong>{authStatus.userInfo?.name}</strong></Text>
          {authStatus.userInfo?.email && <Text>Email: {authStatus.userInfo.email}</Text>}
        </Box>
        <Text marginBottom="4">
          You are connected to the Kled.io community on Slack.
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      <Heading size="md" marginBottom="4">Slack Connection</Heading>
      <Text marginBottom="4">
        Connect your Kled.io account with Slack to join our community and get support from our team.
      </Text>
      <Button 
        onClick={handleConnectWithSlack}>
        Connect with Slack
      </Button>
    </Box>
  )
}
