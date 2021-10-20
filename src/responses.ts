
export function text (b: string, status = 200) {
  const r = new Response(b, { status })
  r.headers.set('content-type', 'text/plain')
  return r
}

export function json (b:unknown, status = 200) {
  const r = new Response(JSON.stringify(b), { status })
  r.headers.set('content-type', 'application/json')
  return r
}
