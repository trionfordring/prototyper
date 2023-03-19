import { isNil } from 'lodash';

export interface LocalStorageItem {
  expire?: number;
  insertTime: number;
  data: string;
}

export class LocalStorageTools {
  static getItem(key: string): string | null {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;
    try {
      const item: LocalStorageItem = JSON.parse(itemStr);
      // 如果未设置过期时间，则直接返回数据
      if (isNil(item.expire)) return item.data;
      // 否则检查是否过期
      const expireTime = item.insertTime + item.expire;
      if (isNaN(expireTime) || Date.now() > expireTime) {
        localStorage.removeItem(key);
        return null;
      }
      return item.data;
    } catch (e) {
      console.error(e);
      this.removeItem(key);
      return null;
    }
  }

  static setItem(key: string, data?: string, expire?: number) {
    if (!data) {
      this.removeItem(key);
      return;
    }
    const tobeStore: LocalStorageItem = {
      expire,
      data,
      insertTime: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(tobeStore));
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }
}
