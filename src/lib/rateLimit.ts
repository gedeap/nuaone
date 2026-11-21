/**
 * Application-Level Rate Limiter
 * Designed to operate within zero-cost memory boundaries without external paid Redis/KV services.
 * Protects against brute-force, spam submissions, and uncontrolled resource consumption.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired tokens every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of memoryStore.entries()) {
    if (value.resetAt < now) {
      memoryStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export interface RateLimitOptions {
  limit: number;      // Maximum requests allowed in window
  windowMs: number;   // Window in milliseconds (e.g. 60,000 = 1 minute)
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 10, windowMs: 60 * 1000 }
): { success: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record || record.resetAt < now) {
    // New or expired window
    memoryStore.set(identifier, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      success: true,
      remaining: options.limit - 1,
      resetAt: now + options.windowMs,
    };
  }

  if (record.count >= options.limit) {
    return {
      success: false,
      remaining: 0,
      resetAt: record.resetAt,
    };
  }

  record.count += 1;
  return {
    success: true,
    remaining: options.limit - record.count,
    resetAt: record.resetAt,
  };
}

/**
 * Helper to extract client IP safely from headers
 */
export function getClientIp(req: Request): string {
  const headers = req.headers;
  const cfConnectingIp = headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;

  const xForwardedFor = headers.get('x-forwarded-for');
  if (xForwardedFor) {
    return xForwardedFor.split(',')[0].trim();
  }

  const xRealIp = headers.get('x-real-ip');
  if (xRealIp) return xRealIp;

  return '127.0.0.1';
}
