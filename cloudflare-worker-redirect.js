// Cloudflare Worker for domain redirect
// This should be deployed as a Worker and bound to ourgoal.pages.dev

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Check if request is coming to the old domain
  if (url.hostname === 'ourgoal.pages.dev') {
    // Construct new URL with the new domain
    const newUrl = `https://ourgoal.site${url.pathname}${url.search}${url.hash}`
    
    // Return 301 permanent redirect
    return Response.redirect(newUrl, 301)
  }
  
  // For any other requests, fetch normally
  return fetch(request)
}

// Alternative version with more detailed handling
/*
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Only redirect if hostname matches old domain
  if (url.hostname === 'ourgoal.pages.dev') {
    // Preserve the full path, query parameters, and hash
    const newUrl = new URL(request.url)
    newUrl.hostname = 'ourgoal.site'
    
    // Return 301 permanent redirect with proper headers
    return new Response(null, {
      status: 301,
      headers: {
        'Location': newUrl.toString(),
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      }
    })
  }
  
  // For requests to the new domain, fetch normally
  return fetch(request)
}
*/
