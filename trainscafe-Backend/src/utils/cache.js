import redisClient from "../config/redis.js";

export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    return null;
  }
};

export const setCache = async (key, data, ttl = 3600) => {
  try {
    await redisClient.set(key, JSON.stringify(data), {
      EX: ttl,
    });
  } catch (err) {}
};

export const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {}
};

export const deleteByPattern = async (pattern) => {
  try {
    const keys = [];

    for await (const key of redisClient.scanIterator({
      MATCH: pattern,
    })) {
      keys.push(key);
    }

    if (keys.length) {
      await redisClient.del(keys);
    }
  } catch (err) {}
};
