import axios from 'axios'
import _ from 'lodash'
import * as eResponse from './../config/eResponse'
import { encodeQueryData, isEmptyObject } from '../utils/common'

const TIMEOUT = 2000

const connectServer = (path) => {
  return axios.create({
    baseURL: path,
    headers: { 'Content-Type': 'text/html' },
    timeout: TIMEOUT
  })
}

const getConfig = (config) => {
  return config
}

export const get = async (path, data = {}, config = {}) => {
  let server = connectServer(path)
  try {
    const encode = (typeof (data) === 'object' && !isEmptyObject(data)) ? '?' + encodeQueryData(data) : ''
    path = path + encode
    const res = await server.get(path, getConfig(config))

    if (typeof res.data !== "object") {
      return eResponse._errorResquestNotFound(path);
    }

    if (res.data.code === 401) {
      return eResponse._errorUnauthorized();
    };

    return res.data
  } catch (err) {
    console.log('catch api GET:', err)
    return eResponse._errorOnTryCatch(err)
  }
}

export const post = async (path, data = {}, config = {}) => {
  let server = connectServer(path)
  try {
    const res = await server.post(path, data, getConfig(config))
    if (typeof res.data !== "object") {
      return eResponse._errorResquestNotFound(path);
    }

    if (res.data.code === 401) {
      return eResponse._errorUnauthorized();
    };

    return res.data
  } catch (err) {
    console.log('catch api POST: ', err)
    return eResponse._errorOnTryCatch(err)
  }
}

export const put = async (path, data = {}, config = {}) => {
  let server = connectServer(path)
  try {
    const res = await server.put(path, data, getConfig(config))
    if (typeof res.data !== "object") {
      return eResponse._errorResquestNotFound(url);
    }

    if (res.data.code === 401) {
      return eResponse._errorUnauthorized();
    };

    return res.data
  } catch (err) {
    if (err === 'expireToken') return window.location.href = '/';

    console.log('catch api PUT: ', err)
    return eResponse._errorOnTryCatch(err)
  }
}

export const deleted = async (path, data = {}, config = {}) => {
  let server = connectServer(path)
  try {
    const newConfig = getConfig(config)
    const newData = {...newConfig, ...{data: data}}
    const res = await server.delete(path, newData)
    if (typeof res.data !== "object") {
      return eResponse._errorResquestNotFound(url);
    }
    if (res.data.code === 401) {
      return eResponse._errorUnauthorized();
    };

    return res.data
  } catch (err) {
    console.log('catch api DELETE: ', err)
    return eResponse._errorOnTryCatch(err)
  }
}

export default { get, post, put, deleted }