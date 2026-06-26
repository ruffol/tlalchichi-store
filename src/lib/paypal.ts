export function getPaypalBaseUrl(): string {
  const sandbox = (process.env.PAYPAL_SANDBOX || '').trim().toLowerCase()
  return sandbox === 'true' || sandbox === '1'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'
}
