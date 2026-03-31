import dbConnect from "./dbConnect";
import RateLimitModel from "@/models/RateLimit";

/**
 * Checks the rate limit for a given IP and endpoint.
 *
 * @param ip - Client IP address
 * @param endpoint - API endpoint name (e.g., 'send-message')
 * @param limit - Maximum requests allowed in the window
 * @param windowSeconds - Duration of the window in seconds
 * @returns Object with success (boolean) and remaining count
 */
export async function checkRateLimit(
  ip: string,
  endpoint: string,
  limit: number,
  windowSeconds: number
) {
  await dbConnect();

  const now = new Date();
  const expireAt = new Date(now.getTime() + windowSeconds * 1000);

  try {
    // Atomically increment or create the rate limit record
    const record = await RateLimitModel.findOneAndUpdate(
      { ip, endpoint },
      {
        $inc: { count: 1 },
        $setOnInsert: { expireAt }, // Set expiration ONLY on first request in the window
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    // If we just reached the limit, allow the current request but count it.
    // If the count is strictly greater than the limit, block it.
    if (record.count > limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        resetAt: record.expireAt,
      };
    }

    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - record.count),
      resetAt: record.expireAt,
    };
  } catch (error) {
    // Robustness: if DB check fails, we generally fail-open for rate limiting
    // to avoid blocking legitimate users due to temporary DB issues.
    console.error("Rate limit check error:", error);
    return {
      success: true,
      limit,
      remaining: 1,
      resetAt: new Date(now.getTime() + windowSeconds * 1000),
    };
  }
}
