import { Box, Code, Container, Link, Text, VStack } from "@chakra-ui/react"
import { useEffect, useMemo } from "react"
import { Link as RouterLink, useMatch, useRouteError } from "react-router-dom"
import {
  KledProvider,
  ProInstancesProvider,
  WorkspaceStore,
  WorkspaceStoreProvider,
  useChangeSettings,
} from "../contexts"
import { usePlatform } from "../contexts/PlatformContext"
import { Routes } from "../routes"
import { OSSApp } from "./OSSApp"
import { ProApp } from "./ProApp"
import { MobileApp } from "./MobileApp"
import { usePreserveLocation } from "./usePreserveLocation"
import { ErrorBoundary } from "react-error-boundary"
import { ErrorMessageBox } from "@/components"

export function App() {
  const routeMatchPro = useMatch(`${Routes.PRO}/*`)
  const { isMobile } = usePlatform()
  usePreserveLocation()
  usePartyParrot()

  const store = useMemo(() => {
    if (routeMatchPro == null) {
      return new WorkspaceStore()
    }
  }, [routeMatchPro])

  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <ErrorMessageBox
          error={error || new Error("Something went wrong. Please restart the application")}
        />
      )}>
      {isMobile ? (
        <MobileApp />
      ) : routeMatchPro == null ? (
        <WorkspaceStoreProvider store={store!}>
          <KledProvider>
            <ProInstancesProvider>
              <OSSApp />
            </ProInstancesProvider>
          </KledProvider>
        </WorkspaceStoreProvider>
      ) : (
        <ProApp />
      )}
    </ErrorBoundary>
  )
}

export function ErrorPage() {
  const error = useRouteError()
  const contentBackgroundColor = "white" // Simplified for now, will be updated with proper theming

  return (
    <Box height="100vh" width="100vw" backgroundColor={contentBackgroundColor}>
      <Container padding="16">
        <VStack>
          <Text>Whoops, something went wrong or this page doesn&apos;t exist.</Text>
          <Box paddingBottom="6">
            <Link href={Routes.ROOT}>
              Go back to home
            </Link>
          </Box>
          <Code>{JSON.stringify(error, null, 2)}</Code>{" "}
        </VStack>
      </Container>
    </Box>
  )
}

function usePartyParrot() {
  const { set: setSettings, settings } = useChangeSettings()

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.shiftKey && event.ctrlKey && event.key.toLowerCase() === "p") {
        const current = settings.partyParrot
        setSettings("partyParrot", !current)
      }
    }
    document.addEventListener("keyup", handler)

    return () => document.addEventListener("keyup", handler)
  }, [setSettings, settings.partyParrot])
}
