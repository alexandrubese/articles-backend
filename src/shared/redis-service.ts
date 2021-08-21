import IORedis, * as Redis from 'ioredis';

export class RedisService {
    private static instance: IORedis.Redis;
    private timeSeconds = 'ex'
    /* @ts-ignore */
    private timeMiliseconds = 'px'
    private interval = 10

    constructor() {
      if (!RedisService.instance) {
        RedisService.instance = new Redis();
      }
    }

    getInstance() {
      return RedisService.instance;
    }

    public async setCacheValue(
      key: string, 
      value: object, 
      intervalType: string = this.timeSeconds, 
      intervalTime: number = this.interval
    ) {
      const redisInstance = this.getInstance();
      return await redisInstance.set(key, JSON.stringify(value), intervalType, intervalTime);
    }

    public async getCachedValue(key: string) {
      const redisInstance = this.getInstance();
      const keyValue = await redisInstance.get(key);

      return keyValue ? JSON.parse(keyValue) : '';       
    }

    public async deleteCachedValue(key: string) {
      const redisInstance = this.getInstance();
      return await redisInstance.del(key);   
    }
}
