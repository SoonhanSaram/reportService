// redis.js
/**
 * (REmote Dictionary Server) 란? 메모리 기반의 '키-값' 구조 데이터 관리 시스템
 * no-sql, 비관계형 데이터베이스
 * 대표적인 데이터형식 [String, Lists, Sets, Sorted Sets, Hashs]
 */
import redis from 'redis'
import dotenv from 'dotenv'
dotenv.config();

export const redisClient = redis.createClient(process.env.REDIS_PORT);

