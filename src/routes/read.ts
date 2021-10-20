import { Router } from 'tiny-request-router'
import { Req } from '../requests'
import { json, text } from '../responses'
import { get, Type } from '../storage'

const router = new Router<Type>()

router.get('/flows/:flow', 'flow')
router.get('/flows/:flow/runs/:run', 'run')
router.get('/flows/:flow/runs/:run/steps/:step', 'step')
router.get('/flows/:flow/runs/:run/steps/:step/tasks/:task', 'task')
router.get('/flows/:flow/runs/:run/steps/:step/tasks/:task/metadata', 'metadata')
router.get('/flows/:flow/runs/:run/steps/:step/tasks/:task/artifacts/:artifact', 'artifact')

export default async function handler (r: Req) {
  const match = router.match(r.method, r.path)
  if (!match) { return undefined }

  const v = await get(match.handler, match.params)
  return v ? json(v) : text('missing', 404)
}
