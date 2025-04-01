import React, { useEffect, useState } from "react"
import { Box, Button, Center, Heading, Text, VStack } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { client } from "../../client"
import { Routes } from "../../routes"
import { TAuthStatus } from "../../types"
import { isError } from "../../lib"

export const AuthSuccess: React.FC = () => {
  const navigate = useNavigate()
  const [authStatus, setAuthStatus] = useState<TAuthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAuthStatus = async () => {
      setLoading(true)
      try {
        const result = await client.getAuthStatus()
        if (result.ok) {
          setAuthStatus(result.val as TAuthStatus)
        } else {
          setError("Authentication failed")
        }
      } catch (err) {
        setError(isError(err) ? err.message : "Unknown error occurred")
      }
      setLoading(false)
    }

    fetchAuthStatus()
  }, [])

  const handleContinue = () => {
    navigate(Routes.ROOT)
  }

  return (
    <Center h="100vh">
      <Box p={8} borderRadius="md" boxShadow="lg" bg="white" maxWidth="md" width="full">
        <Heading size="lg" marginBottom={6}>Authentication {loading ? "Processing" : authStatus?.authenticated ? "Successful" : "Failed"}</Heading>
        
        {loading ? (
          <Text>Verifying your authentication status...</Text>
        ) : error ? (
          <Box>
            <Text color="red.500">Error: {error}</Text>
            <Button mt={4} colorScheme="blue" onClick={handleContinue}>
              Return to Dashboard
            </Button>
          </Box>
        ) : authStatus?.authenticated ? (
          <Box textAlign="center">
            <Text>You have successfully authenticated with {authStatus.provider}.</Text>
            {authStatus.userInfo && (
              <Box mt={4}>
                <Text>Welcome, {authStatus.userInfo.name}!</Text>
                {authStatus.userInfo.email && <Text fontSize="sm" marginTop={2}>Email: {authStatus.userInfo.email}</Text>}
              </Box>
            )}
            <Button mt={6} colorScheme="blue" onClick={handleContinue}>
              Continue to Kled
            </Button>
          </Box>
        ) : (
          <Box>
            <Text color="orange.500">Authentication was not successful. Please try again.</Text>
            <Button mt={4} colorScheme="blue" onClick={() => client.initiateSlackAuth()}>
              Retry Authentication
            </Button>
            <Button mt={2} variant="outline" onClick={handleContinue}>
              Skip for Now
            </Button>
          </Box>
        )}
      </Box>
    </Center>
  )
}
