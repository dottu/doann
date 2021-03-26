import { logger } from './logFile'

export const _errorNetwork = () => ({
    code: 504,
    msg: "Kết nối mạng có vấn đề vui lòng xem lại",
    data: false
  }
);

export const _errorResquestNotFound = (url) => ({
    code: 404,
    msg: `${url} không tồn tại`,
    data: false
})

export const _errorOnTryCatch = (err, message) => {
  logger.log('error', err.message);
  return {
    code: 9999,
    msg: message || `Có lỗi xảy ra, hãy kiểm lại thông tin`,
    data: false,
    catch: err.message
  }
}

export const _errorDataNotFound = (message) => ({
  code: 404,
  msg: message || `Dữ liệu không tồn tại`,
  data: null
})

export const _success = (res, message) => ({
  code: 0,
  message: message || 'Thành công',
  data: res
})

export const _success_2 = (res, message) => ({...{
  code: 0,
  msg: message || 'Thành công'},
  ...res
})

export const _errorByHand = (message) => ({
  code: 9998,
  msg: message || `Có lỗi xảy ra, vui lòng quay lại sau`,
  data: false
})