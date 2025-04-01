// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs). Do not edit this file manually.
import type { Asset } from "./Asset"
import type { Author } from "./Author"

export interface Release {
  url: String
  html_url: string
  assets_url: string
  upload_url: string
  tarball_url: string | null
  zipball_url: string | null
  id: bigint
  node_id: string
  tag_name: string
  target_commitish: string
  name: string | null
  body: string | null
  draft: boolean
  prerelease: boolean
  created_at: string | null
  published_at: string | null
  author: Author
  assets: Array<Asset>
}
