import { Box, Center, Heading, Spinner, Text, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { client } from "../../client/client"
import { Return, Result } from "../../lib"

export function AuthCallback() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        for (let i = 0; i < 5; i++) {
          const result = await client.getAuthStatus()
          
          if (result.ok) {
            if (result.val.authenticated) {
              navigate("/auth/success")
              return
            }
          }
          
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
        
        setError("Authentication timed out. Please try again.")
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [navigate])

  if (loading) {
    return (
      <Center height="100vh">
        <Box>
          <Spinner size="xl" marginBottom="4" />
          <Text>Completing authentication...</Text>
        </Box>
      </Center>
    )
  }

  return (
    <Box p={6}>
      <Box>
        <Heading size="md" marginBottom="4">Authentication Failed</Heading>
        <Text color="red.500" marginBottom="2">{error}</Text>
        <Text>
          Please close this window and try again from the Kled.io desktop application.
        </Text>
      </Box>
    </Box>
  )
}
