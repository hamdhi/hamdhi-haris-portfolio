import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  // 1. BYPASS FOR ADMINS AND SYSTEM ASSETS
  // We don't want to check maintenance for the admin panel or images/css
  const isExcluded = 
    path.startsWith('/api') || 
    path.startsWith('/_next') || 
    path.startsWith('/static') || 
    path.startsWith('/dev-login') || 
    path.startsWith('/admin') ||
    path.includes('.') // for favicon, images, etc.

  if (!isExcluded) {
    // 2. CHECK MAINTENANCE STATUS FROM SUPABASE
    const { data: config } = await supabase
      .from('app_config')
      .select('is_active')
      .eq('key', 'maintenance_mode')
      .single()

    const isMaintenanceOn = config?.is_active ?? false

    if (isMaintenanceOn) {
      // Redirect public users to /maintenance if they aren't already there
      if (path !== '/maintenance') {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    } else {
      // If maintenance is OFF, don't let people manually visit the maintenance page
      if (path === '/maintenance') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  // 3. PROTECT ADMIN ROUTES (Your existing auth logic)
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/dev-login', request.url))
    }
  }

  return response
}

// Ensure the matcher catches all pages except specific static folders
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}