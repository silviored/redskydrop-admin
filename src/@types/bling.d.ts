type BlingAccessTokenRequest = {
  grant_type: string
  code: string
}
type BlingCallbackResponse = {
  state: string
  code: string
}