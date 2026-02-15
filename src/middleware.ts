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

  // --- NEW: BYPASS CHECK ---
  // This looks at your .env.local. If true, the middleware treats maintenance as OFF for you.
  const isLocalBypass = process.env.NEXT_PUBLIC_DEV_OVERRIDE === "true";

  const isExcluded = 
    path.startsWith('/api') || 
    path.startsWith('/_next') || 
    path.startsWith('/static') || 
    path.startsWith('/dev-login') || 
    path.startsWith('/admin') ||
    path.includes('.')

  if (!isExcluded) {
    const { data: config } = await supabase
      .from('app_config')
      .select('is_active')
      .eq('key', 'maintenance_mode')
      .single()

    // If local bypass is ON, we force isMaintenanceOn to be false
    const isMaintenanceOn = isLocalBypass ? false : (config?.is_active ?? false)

    if (isMaintenanceOn) {
      if (path !== '/maintenance') {
        return NextResponse.redirect(new URL('/maintenance', request.url))
      }
    } else {
      // If maintenance is OFF (or bypassed), kick users out of the /maintenance page back to home
      if (path === '/maintenance') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    }
  }

  // 3. PROTECT ADMIN ROUTES
  if (path.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/dev-login', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}