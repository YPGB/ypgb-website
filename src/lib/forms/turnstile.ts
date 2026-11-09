// Cloudflare's published test keys: they always pass, so local forms work without an account.
const TEST_SITE_KEY = '1x00000000000000000000AA'
const TEST_SECRET_KEY = '1x0000000000000000000000000000000AA'

const isDev = process.env.NODE_ENV !== 'production'

export const turnstileSiteKey = () => process.env.TURNSTILE_SITE_KEY || (isDev ? TEST_SITE_KEY : undefined)

/** Fails closed: without a secret key in production, no submission gets through. */
export const verifyTurnstile = async (token: string): Promise<boolean> => {
  const secret = process.env.TURNSTILE_SECRET_KEY || (isDev ? TEST_SECRET_KEY : undefined)
  if (!secret) {
    console.error('TURNSTILE_SECRET_KEY is not set; refusing form submissions.')
    return false
  }
  if (!token) return false
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token }),
    })
    return Boolean(((await response.json()) as { success?: boolean }).success)
  } catch (error) {
    console.error('Turnstile verification failed', error)
    return false
  }
}
