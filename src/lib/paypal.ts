export function getPaypalBaseUrl(): string {
  const sandbox = (process.env.PAYPAL_SANDBOX || '').trim().toLowerCase()
  return sandbox === 'true' || sandbox === '1'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'
}

export function getPaypalClientId(): string {
  return process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ''
}

export function getPaypalClientSecret(): string {
  return process.env.PAYPAL_CLIENT_SECRET || ''
}
