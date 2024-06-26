const { RateLimiterMemory } = require("rate-limiter-flexible");

const rateLimiter = new RateLimiterMemory({
  points: 5,
  duration: 60,
});

export const limiter = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.connection.remoteAddress);
    next();
  } catch (err) {
    res.set({
      "Retry-After": err.msBeforeNext / 1000,
      "X-RateLimit-Reset": new Date(Date.now() + err.msBeforeNext),
    });
    return res
      .status(429)
      .send({ error: "Too many requests, Try again later" });
  }
};
