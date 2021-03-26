export const xoaDau = (str, char=null) => {
  let newStr = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  .replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase()
  if (char) {
    newStr = newStr.replace(' ', char)
  }
  let stringSplitted = newStr.split(' ')
  stringSplitted.forEach(e => {
    e.trim()
  })
  newStr = stringSplitted.filter(x => typeof x === 'string' && x.length > 0).join(char? char : '-')
  newStr = newStr.replace(/“/g, '').replace(/,/g).replace(/:-/g, '-').replace(/\?/g, '').replace(/”/g,'').replace('[', '').replace(']', '')
  return newStr
}

export const removeTagHtml = (str) => {
  const regex = /(<([^>]+)>)/ig
  return str.replace(regex, "")
}

export const removeJsScript = (str) => {
  const regex = /<.*?script.*?>.*?<\/.*?script.*?>/igm
  return str.replace(regex, "")
}

/**
 * 
 * They can only contain alphabetic characters, spaces (0 - any ), hyphens (0 - any), apostrophes ' (0 - any ) and number of symbols 1 - 40. 
 * First and Last name can not start with ' or whitespace
 */
export const checkNameValid = (name) => {
  if (!name) 
    return false
  return /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/.test(name)
}