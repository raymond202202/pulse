import type { ApiRequest, ApiResponse } from '../types'

export type CodeLanguage = 'curl' | 'python' | 'javascript' | 'go' | 'rust' | 'httpie'

export function generateCode(request: ApiRequest, lang: CodeLanguage): string {
  switch (lang) {
    case 'curl': return generateCurl(request)
    case 'python': return generatePython(request)
    case 'javascript': return generateJavaScript(request)
    case 'go': return generateGo(request)
    case 'rust': return generateRust(request)
    case 'httpie': return generateHttpie(request)
  }
}

function methodColor(m: string): string {
  const colors: Record<string, string> = { GET: '\\033[32m', POST: '\\033[33m', PUT: '\\033[34m', DELETE: '\\033[31m', PATCH: '\\033[35m' }
  return colors[m] || ''
}

function buildHeaders(request: ApiRequest): Record<string, string> {
  const h: Record<string, string> = {}
  request.headers.filter(kv => kv.enabled && kv.key).forEach(kv => { h[kv.key] = kv.value })
  if (request.auth?.authType === 'bearer' && request.auth.bearerToken) {
    h['Authorization'] = `Bearer ${request.auth.bearerToken}`
  } else if (request.auth?.authType === 'basic' && request.auth.basicUsername) {
    const creds = btoa(`${request.auth.basicUsername}:${request.auth.basicPassword || ''}`)
    h['Authorization'] = `Basic ${creds}`
  } else if (request.auth?.authType === 'apikey' && request.auth.apiKey && request.auth.apiKeyHeader) {
    h[request.auth.apiKeyHeader] = request.auth.apiKey
  }
  return h
}

function generateCurl(request: ApiRequest): string {
  const headers = buildHeaders(request)
  let cmd = `curl -X ${request.method} '${request.url}'`
  for (const [k, v] of Object.entries(headers)) {
    cmd += ` \\\n  -H '${k}: ${v}'`
  }
  if (request.body?.raw && request.body.mode !== 'none') {
    const escaped = request.body.raw.replace(/'/g, "'\\''")
    cmd += ` \\\n  -d '${escaped}'`
  }
  return cmd
}

function generatePython(request: ApiRequest): string {
  const headers = buildHeaders(request)
  const method = request.method.toLowerCase()
  let code = `import requests\n\nurl = '${request.url}'\n`
  if (Object.keys(headers).length > 0) {
    code += `\nheaders = {\n${Object.entries(headers).map(([k, v]) => `    '${k}': '${v.replace(/'/g, "\\'")}'`).join(',\n')}\n}\n`
  }
  let bodyVar = ''
  if (request.body?.raw && request.body.mode !== 'none') {
    bodyVar = 'data'
    const isJson = request.body.mode === 'json'
    if (isJson) {
      code += `\n${bodyVar} = ${request.body.raw}\n`
    } else {
      code += `\n${bodyVar} = '''${request.body.raw}'''\n`
    }
  }
  const h = Object.keys(headers).length > 0 ? ', headers=headers' : ''
  const d = bodyVar ? `, data=${bodyVar}` : ''
  code += `\nresponse = requests.${method}(url${h}${d})\n`
  code += `print(f'Status: {response.status_code}')\nprint(response.text)\n`
  return code
}

function generateJavaScript(request: ApiRequest): string {
  const headers = buildHeaders(request)
  let code = `fetch('${request.url}', {\n  method: '${request.method}',\n`
  if (Object.keys(headers).length > 0) {
    code += `  headers: {\n${Object.entries(headers).map(([k, v]) => `    '${k}': '${v.replace(/'/g, "\\'")}'`).join(',\n')}\n  },\n`
  }
  if (request.body?.raw && request.body.mode !== 'none') {
    code += `  body: ${request.body.mode === 'json' ? '' : "'"}${request.body.raw}${request.body.mode === 'json' ? '' : "'"},\n`
  }
  code += `})\n  .then(res => res.text())\n  .then(console.log)\n  .catch(console.error);\n`
  return code
}

function generateGo(request: ApiRequest): string {
  const headers = buildHeaders(request)
  const method = request.method
  let code = `package main\n\nimport (\n\t"fmt"\n\t"io"\n\t"net/http"\n\t"strings"\n)\n\nfunc main() {\n`
  if (request.body?.raw && request.body.mode !== 'none') {
    code += `\tpayload := strings.NewReader(\`${request.body.raw}\`)\n`
  }
  const bodyArg = (request.body?.raw && request.body.mode !== 'none') ? 'payload' : 'nil'
  code += `\treq, _ := http.NewRequest("${method}", "${request.url}", ${bodyArg})\n`
  for (const [k, v] of Object.entries(headers)) {
    code += `\treq.Header.Set("${k}", "${v}")\n`
  }
  code += `\tresp, _ := http.DefaultClient.Do(req)\n\tdefer resp.Body.Close()\n\tbody, _ := io.ReadAll(resp.Body)\n\tfmt.Println(string(body))\n}\n`
  return code
}

function generateRust(request: ApiRequest): string {
  const headers = buildHeaders(request)
  const method = request.method.toLowerCase()
  let code = `use reqwest;\n\n#[tokio::main]\nasync fn main() -> Result<(), reqwest::Error> {\n`
  let clientChain = `    let client = reqwest::Client::new();\n`
  clientChain += `    let resp = client.${method}("${request.url}")`
  for (const [k, v] of Object.entries(headers)) {
    clientChain += `\n        .header("${k}", "${v}")`
  }
  if (request.body?.raw && request.body.mode !== 'none') {
    clientChain += `\n        .body("${request.body.raw.replace(/"/g, '\\"')}")`
    if (request.body.mode === 'json') {
      clientChain += `\n        .header("Content-Type", "application/json")`
    }
  }
  clientChain += `\n        .send()\n        .await?;\n`
  code += clientChain
  code += `    let body = resp.text().await?;\n    println!("{{}}", body);\n    Ok(())\n}\n`
  return code
}

function generateHttpie(request: ApiRequest): string {
  const headers = buildHeaders(request)
  let cmd = `http ${request.method} '${request.url}'`
  for (const [k, v] of Object.entries(headers)) {
    cmd += ` ${k}:'${v}'`
  }
  if (request.body?.raw && request.body.mode !== 'none') {
    const bodyStr = request.body.raw.replace(/'/g, "'\\''")
    if (request.body.mode === 'json') {
      cmd += ` <<< '${bodyStr}'`
    } else {
      cmd += ` --raw '${bodyStr}'`
    }
  }
  return cmd
}
