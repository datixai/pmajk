// Shared by the proxy (edge) and the auth module. In production the __Host-
// prefix makes the browser refuse the cookie unless it is Secure, set on this
// exact host and for the whole site, so a subdomain cannot plant or read it.
const prod = process.env.NODE_ENV === "production";
export const SESSION_COOKIE = prod ? "__Host-pmo_session" : "pmo_session";
export const PENDING_COOKIE = prod ? "__Secure-pmo_2fa" : "pmo_2fa";
