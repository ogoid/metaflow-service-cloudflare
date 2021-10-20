import { createNameId } from 'mnemonic-id'
import { Params, Router } from 'tiny-request-router'
import { Req } from '../requests'
import { json, text } from '../responses'
import { put, Type } from '../storage'

const router = new Router<Type>()

router.post('/flows/:flow_id', 'flow')
router.post('/flows/:flow_id/run', 'run')
router.post('/flows/:flow_id/runs/:run_number/steps/:step_name/step', 'step')
router.post('/flows/:flow_id/runs/:run_number/steps/:step_name/task', 'task')
router.post('/flows/:flow_id/runs/:run_number/steps/:step_name/tasks/:task_id/metadata', 'metadata')
router.post('/flows/:flow_id/runs/:run_number/steps/:step_name/tasks/:task_id/artifact', 'artifact')

export default async function handler (r: Req) {
  const match = router.match(r.method, r.path)
  if (!match) return undefined

  const ct = r.headers.get('content-type')
  if (!ct?.startsWith('application/json')) return text('expecting json', 405)

  const body = r.json ? await r.json() : undefined

  if (!body) return text('invalid body', 405)

  const { handler, params } = match

  if (handler === 'artifact' && Array.isArray(body)) {
    return Promise.all(body.map(a => process(handler, params, a)))
      .then(() => json({ artifacts: body.length }, 202))
      .catch(e => text(e.message, 405))
  }

  return process(handler, params, body)
}

async function process (handler: Type, params:Params, body:any) {
  switch (handler) {
    case 'run':
      params.run_number = body.run_number || createNameId()
      break
    case 'task':
      params.task_id = body.task_id || createNameId()
      break
    case 'artifact':
      if (!body.name) throw Error('missing artifact name')
      params.name = body.name
      break
  }

  Object.assign(body, params)

  body.ts_epoch = Date.now()

  await put(handler, params, body)

  return json(body, 202)
}
