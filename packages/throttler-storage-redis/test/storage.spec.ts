import Redis from 'ioredis';
import { ThrottlerStorageRedisService } from '../src';

describe('ThrottlerStorageRedisService', () => {
  const redis = new Redis();
  const storage = new ThrottlerStorageRedisService(redis);

  afterAll(async () => {
    await redis.quit();
  });

  // PTTL returns 0 for a key in its final millisecond. Back-to-back hits land
  // in that millisecond, which must not extend the window with the old count.
  it('resets the hit counter when hits arrive back to back across windows', async () => {
    const ttl = 20;
    const deadline = Date.now() + 10 * ttl;
    let windows = 0;

    while (Date.now() < deadline) {
      const { totalHits } = await storage.increment(
        `pttl-zero-${process.pid}`,
        ttl,
        Number.MAX_SAFE_INTEGER,
        ttl,
        'default'
      );
      if (totalHits === 1) {
        windows++;
      }
    }

    expect(windows).toBeGreaterThan(1);
  });
});
