import { toReq } from './requests'
import { text } from './responses'
import handler from './routes'

addEventListener('fetch', event => {
  event.respondWith(
    handler(toReq(event.request))
      .then(r => r || text('not found', 404))
      // .catch(e => json(e, 500))
  )
})
