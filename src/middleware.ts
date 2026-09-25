import { createServerClient, type CookieOptions } from '@supabase/ssr'
import type { User } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } })
  const path = request.nextUrl.pathname
  const isAdminRoute = path.startsWith('/admin')
  const isExcluded =
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path.startsWith('/static') ||
    path.startsWith('/dev-login') ||
    path.includes('.')

  if (isExcluded) {
    return response
  }

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

  // Keep public pages available while a sleeping Supabase instance wakes up.
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeoutPromise = new Promise<NextResponse>((resolve) => {
    timeoutId = setTimeout(() => resolve(
      isAdminRoute
        ? NextResponse.redirect(new URL('/dev-login', request.url))
        : response
    ), 3000)
  })

  // Wrap the actual logic in an async function so we can race it
  const middlewareLogic = async () => {
    let user: User | null = null

    if (isAdminRoute) {
      const { data } = await supabase.auth.getUser()
      user = data.user
    }

    // --- NEW: BYPASS CHECK ---
    const isLocalBypass = process.env.NEXT_PUBLIC_DEV_OVERRIDE === "true";

    if (!isExcluded) {
      const { data: config } = await supabase
        .from('app_config')
        .select('is_active')
        .eq('key', 'maintenance_mode')
        .single()

      const isMaintenanceOn = isLocalBypass ? false : (config?.is_active ?? false)

      if (isMaintenanceOn) {
        if (path !== '/maintenance') {
          return NextResponse.redirect(new URL('/maintenance', request.url))
        }
      } else {
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

  try {
    return await Promise.race([middlewareLogic(), timeoutPromise])
  } catch (error) {
    console.warn('Middleware could not reach Supabase:', error)
    return isAdminRoute
      ? NextResponse.redirect(new URL('/dev-login', request.url))
      : response
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|error).*)',
  ],
}