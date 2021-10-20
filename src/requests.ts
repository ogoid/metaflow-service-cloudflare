import { Method } from 'tiny-request-router'

export type Req = Request & {path: string, method: Method}

export function toReq (r: Request): Req {
  const url = new URL(r.url)
  const r2 = r as Req
  r2.path = url.pathname
  return r2
}
