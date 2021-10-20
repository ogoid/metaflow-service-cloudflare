import { Router } from 'tiny-request-router'
import { Req } from '../requests'
import { json, text } from '../responses'
import { get, put, Type } from '../storage'

const router = new Router<Type>()

router.post('/flows/:flow/runs/:run/heartbeat', 'step')
router.post('/flows/:flow/runs/:run/steps/:step/task/:task/heartbeat', 'task')

export default async function handler (r: Req) {
  const match = router.match(r.method, r.path)
  if (!match) { return undefined }

  const { handler, params } = match

  const body = await get<Record<string, unknown>>(handler, params)
  if (!body) return text('missing', 400)

  body.last_heartbeat_ts = Date.now()

  await put(handler, params, body)

  return json({ wait_time_in_seconds: 10 })
}
