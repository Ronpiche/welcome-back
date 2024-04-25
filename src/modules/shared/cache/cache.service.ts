import { Injectable } from '@nestjs/common';
import NodeCache from 'node-cache';

@Injectable()
export class CacheService {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache();
  }

  get(key: string): unknown {
    return this.cache.get(key);
  }

  set(key: string, value: unknown, ttl: number = 300): boolean {
    return this.cache.set(key, value, ttl);
  }
}
