// Cloudflare Pages Function for domain redirect
// This will run on every request and check for old domain

export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  
  // Check if request is coming to the old domain
  if (url.hostname === 'ourgoal.pages.dev') {
    // Construct new URL with the new domain
    const newUrl = `https://ourgoal.site${url.pathname}${url.search}${url.hash}`;
    
    // Return 301 permanent redirect
    return Response.redirect(newUrl, 301);
  }
  
  // Continue to next middleware/page
  return context.next();
}
