/* eslint-disable no-undef */

export type Type = 'flow' | 'run' | 'step' | 'task' | 'metadata' | 'artifact'

type Params = string[] | Record<string, string>

/**
 * Intented object address format:
 *   object_type/flow_id/run_number/step_name/task_id/artifact_name
 * Therefore by specifying a type and a subset of parameters
 * we can search the store for all matching entries. Eg,
 *   key('task', ['HelloFlow', 'Run1'])
 * matches all tasks for all steps in that run.
 * Caller must ensure parameters will be iterated in the correct order.
 */
const key = (t:Type, p:Params) =>
  [t, ...Object.values(p)].join('/')

export const get = <T>(t:Type, p:Params) =>
  METAFLOW.get<T>(key(t, p), 'json')

export const put = <T>(t:Type, p:Params, v:T) =>
  METAFLOW.put(key(t, p), JSON.stringify(v))

export const list = async <T> (t:Type, p:Params) => {
  let results: T[] = []
  let query = await METAFLOW.list({ prefix: key(t, p) })

  for (;;) {
    const reqs = query.keys.map(k => METAFLOW.get<T>(k.name, 'json'))
    const entries = await Promise.all(reqs)
    results = results.concat(entries.filter(notNull) as T[])
    if (query.list_complete) break
    query = await METAFLOW.list({ cursor: query.cursor })
  }

  return results
}

const notNull = <T>(v:T) => v !== null
