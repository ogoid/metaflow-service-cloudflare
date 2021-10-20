import { Req } from '../requests'
import admin from './admin'
import list from './list'
import read from './read'
import update from './update'
import write from './write'

type Handler = (req: Req) => Promise<Response|undefined>

const handlers: Handler[] = [
  read, write, list, update, admin
]

export default async function handler (req: Req) {
  for (const handler of handlers) {
    const res = await handler(req)
    if (res) return res
  }
}
