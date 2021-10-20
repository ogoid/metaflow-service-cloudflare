import { Router } from 'tiny-request-router'
import { Req } from '../requests'
import { json } from '../responses'
import { list, Type } from '../storage'

const router = new Router<Type>()

router.get('/flows', 'flow')
router.get('/flows/:flow/runs', 'run')
router.get('/flows/:flow/runs/:run/steps', 'step')
router.get('/flows/:flow/runs/:run/steps/:step/tasks', 'task')

router.get('/flows/:flow/runs/:run/steps/:step/tasks/:task/artifacts', 'artifact')
router.get('/flows/:flow/runs/:run/steps/:step/artifacts', 'artifact')
router.get('/flows/:flow/runs/:run/artifacts', 'artifact')

export default async function handler (r: Req) {
  const match = router.match(r.method, r.path)
  if (!match) return undefined

  const { handler, params } = match

  const res = await list(handler, params)

  return json(res)
}
