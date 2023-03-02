export interface GTPResponse {
  platform: string,
  chain: string,
  action: string,
  relations: {
    relation: string,
    entity: string,
    value: string
  }[]
}
