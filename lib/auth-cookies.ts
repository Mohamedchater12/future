// Edge-safe (no bcrypt/prisma imports) so middleware.ts can read the same
// cookie names as lib/auth.ts without pulling in Node-only dependencies.

export const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith("https://") ?? false;

const securePrefix = useSecureCookies ? "__Secure-" : "";
const hostPrefix = useSecureCookies ? "__Host-" : "";

// Admin and client each get their own cookie namespace so signing in to one
// section never overwrites (and logs out) the other's session in the same browser.
export const authCookieNames = {
  admin: {
    sessionToken: `${securePrefix}next-auth.admin-session-token`,
    callbackUrl: `${securePrefix}next-auth.admin-callback-url`,
    csrfToken: `${hostPrefix}next-auth.admin-csrf-token`,
  },
  client: {
    sessionToken: `${securePrefix}next-auth.client-session-token`,
    callbackUrl: `${securePrefix}next-auth.client-callback-url`,
    csrfToken: `${hostPrefix}next-auth.client-csrf-token`,
  },
} as const;

export function scopedCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: useSecureCookies,
  };
}
