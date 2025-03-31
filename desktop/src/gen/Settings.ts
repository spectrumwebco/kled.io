// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { ColorMode } from "./ColorMode"
import type { SidebarPosition } from "./SidebarPosition"
import type { Zoom } from "./Zoom"

export interface Settings {
  sidebarPosition: SidebarPosition
  debugFlag: boolean
  partyParrot: boolean
  fixedIDE: boolean
  zoom: Zoom
  transparency: boolean
  autoUpdate: boolean
  additionalCliFlags: string
  additionalEnvVars: string
  dotfilesUrl: string
  sshKeyPath: string
  httpProxyUrl: string
  httpsProxyUrl: string
  noProxy: string
  experimental_multiDevcontainer: boolean
  experimental_fleet: boolean
  experimental_jupyterNotebooks: boolean
  experimental_vscodeInsiders: boolean
  experimental_cursor: boolean
  experimental_codium: boolean
  experimental_zed: boolean
  experimental_positron: boolean
  experimental_rstudio: boolean
  experimental_kledPro: boolean
  experimental_colorMode: ColorMode
}
