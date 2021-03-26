import _ from 'lodash'
import redis from 'redis'
import asyncRedis from 'async-redis'
import dotenv from 'dotenv'
dotenv.config({path: `${__dirname}/../../.env`})

const host = process.env.DEV_CACHE_HOST || 'localhost'
const port = process.env.DEV_CACHE_PORT || '6379'

const client = redis.createClient(port, host)
const clientRedis = asyncRedis.createClient(port, host)
const ENABLE_CACHE = process.env.NODE_ENV === 'production' ? true : false

export const get = async (key, parse = false) => {
  try {
    if (!ENABLE_CACHE) {
      return false
    }
    return parse ? JSON.parse(await clientRedis.get(key)) : await clientRedis.get(key)
  } catch (error) {
    return false
  }
}

export const set = (key, data, duration=3600, encode = false) => {
  client.setex(key, duration, encode ? JSON.stringify(data) : data)
  // clientRedis.set(key, encode ? JSON.stringify(data) : data)
}

export const remove = (key) => {
  if (!ENABLE_CACHE) {
    return null
  }
  clientRedis.del(key)
}

export const genKey = (key, data = {}) => {
  let str = `${process.env.PREFIX_API_CACHE}unique_user_${key}`
  if (!_.isEmpty(data, true)) {
    str += '_'
    Object.keys(data)
      .sort()
      .forEach(function (v, i) {
        str += `&${v}=${data[v]}`
      });
  }
  return str
}

export const genKeyPublic = (key, data = {}) => {
  let str = `${process.env.PREFIX_API_CACHE}public_unique_user_${key}`
  if (!_.isEmpty(data, true)) {
    str += '_'
    Object.keys(data)
      .sort()
      .forEach(function (v, i) {
        str += `&${v}=${data[v]}`
      });
  }
  return str
}

export const flushByUser = async () => {
  let uniqueUser = `unique_user_`
  client.keys(`*${uniqueUser}*`, function (err, keys) {
    keys.forEach(function (key) {
      client.del(key)
    });
  });
  return true
}

export const flushCache = () => {
  clientRedis.flushdb()
}

export default { get, set, remove, genKey, genKeyPublic, flushByUser, flushCache }