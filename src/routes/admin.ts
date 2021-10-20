import { name, version } from '../../package.json'
import { Req } from '../requests'
import { json, text } from '../responses'

export default async function handler ({ path }: Req) {
  switch (path) {
    case '/ping': return text('pong', 202)
    case '/version': return text(`${name}:${version}`, 200)
    case '/healthcheck': return json({ status: 'UP' }, 202)
    case '/auth/token': return text('not implement', 500)
  }
}
