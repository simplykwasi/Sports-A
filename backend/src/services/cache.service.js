import { createClient } from 'redis';

class CacheService {
  constructor(redisUrl) {
    this.client = createClient({ url: redisUrl });
    this.ready = false;
    this.client.on('error', (err) => console.error('Redis error', err));
    this.client.connect().then(() => {
      this.ready = true;
    }).catch((err) => console.error('Redis connect failed', err));
  }

  async get(key) {
    if (!this.ready) {
      return null;
    }
    return this.client.get(key);
  }

  async set(key, value, ttlSeconds) {
    if (!this.ready) {
      return null;
    }
    if (ttlSeconds) {
      return this.client.set(key, value, { EX: ttlSeconds });
    }
    return this.client.set(key, value);
  }

  async delete(key) {
    if (!this.ready) {
      return null;
    }
    return this.client.del(key);
  }

  async close() {
    if (this.ready) {
      return this.client.disconnect();
    }
    return null;
  }
}

export default CacheService;
