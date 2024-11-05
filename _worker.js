// 是否启用白名单检查。如果想放开所有请求，只需将 ENABLE_WHITELIST_CHECK 设置为 false。如果你想启用白名单检查，设置为 true。
const ENABLE_WHITELIST_CHECK = false

// 目标域名白名单
const targetDomains = [
  "https://github.com",
  "https://githubusercontent.com",
  "https://google.com",
  "https://huggingface.co"
//  "https://gist.githubusercontent.com"
]

let PADDING = 'xdfxdg'
// URL 白名单字符串
const urlWhitelist = [
  "user-id-1",
  "user-id-2"
]

export default {
  async fetch(request, environment, context) {
//async function handleRequest(request) {
  PADDING = environment.PADDING || PADDING;
  const url = new URL(request.url)
  const path = url.pathname + url.search

  // 分离出目标域名部分
  let targetUrl = path.substring(1) // 移除前导的 '/'


  // Check if the target domain is empty
  if (!targetUrl) {
    return new Response("None site https://google.com\n", { status: 400 })
  }

  //const targetUrl = path.substring(1) // 移除前导的 '/'
  //const targetUrl = Url.startsWith("https://") ? Url.slice(8) : Url

  const padding = targetUrl.split('/')[0] // 获取目标域名
  if(!(padding === PADDING)){
    return new Response(` Error: Invalid target domain.\npadding: ${padding}`, { status: 399 })
  }

  let httpsIndex = targetUrl.indexOf('https://');

  //if (httpsIndex !== -1) {
    // 去除 'https://' 之前的部分
    //const targetDomain = targetUrl.substring(httpsIndex);
  //}
  const targetDomain = targetUrl.substring(httpsIndex) // 获取目标域名
  //const targetDomain = targetUrl.split('/')[1] // 获取目标域名

  if (ENABLE_WHITELIST_CHECK) {
    // 判断目标域名是否在白名单中
    const isDomainAllowed = targetDomains.some(domain => targetDomain.startsWith(domain))
    if (!isDomainAllowed) {
      // 如要提示允许的目标地址，可以在 return 处加上 Allowed domains are: ${targetDomains.join(", ")}
      return new Response(` Error: Invalid target domain.\nPath: ${path}\ntargetUrl:${targetUrl}\ntargetDomain:${targetDomain}\nhttps://google.com\n`, { status: 400 })
    }

    // 判断 URL 是否包含白名单中的字符串（不区分大小写）
    //const isUrlAllowed = urlWhitelist.some(whitelistString =>
    //  targetUrl.toLowerCase().includes(whitelistString.toLowerCase())
    //)

    const isUrlAllowed=true
    if (!isUrlAllowed) {
      // 如要提示允许的白名单，可以在 return 处加上 URL must contain one of the following strings: ${urlWhitelist.join(", ")}
      return new Response(` Error: The URL is not in the whitelist.\n https://microsoft.com\n`, { status: 403 })
    }
  }

  const newUrl = targetDomain

  const modifiedRequest = new Request(newUrl, {
    method: request.method,
    headers: request.headers,
    body: request.body,
    redirect: 'follow'
  })

  return fetch(modifiedRequest)
}
}
