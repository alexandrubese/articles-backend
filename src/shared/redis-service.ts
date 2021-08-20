import IORedis, * as Redis from 'ioredis';

export class RedisService {
    private static instance: IORedis.Redis;
    private static timeSeconds = 'ex'
    /* @ts-ignore */
    private static timeMiliseconds = 'px'
    private static interval = 10

    constructor() {
      if (!RedisService.instance) {
        RedisService.instance = new Redis();
      }
    }

    getInstance() {
      return RedisService.instance;
    }

    public static async setCacheValue(
      key: string, 
      value: object, 
      intervalType: string = this.timeSeconds, 
      intervalTime: number = this.interval
    ) {
      const redisInstance = new RedisService().getInstance();
      return await redisInstance.set(key, JSON.stringify(value), intervalType, intervalTime);
    }

    public static async getCachedValue(key: string) {
      const redisInstance = new RedisService().getInstance();
      const keyValue = await redisInstance.get(key);

      return keyValue ? JSON.parse(keyValue) : '';       
    }

    public static async deleteCachedValue(key: string) {
      const redisInstance = new RedisService().getInstance();
      return await redisInstance.del(key);   
    }
}
