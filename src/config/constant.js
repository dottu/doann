import e from 'express'
import _ from 'lodash'

export const ENABLE_CACHE = true
export const ENABLE_TEMPLATE_FULL = true
export const BOOK_LIMIT = 6
export const LOAIBOOK_LIMIT = 5
export const COMMENT_LIMIT = 8
export const COMMENT_SUB_LIMIT = 5
export const timezone = '+07:00'

// export const articleRequestCheck = {
//   titleRequire: 'title is required',
//   contentRequire: 'content is required',
//   authorRequire: 'author is required',
//   authorInvalid: "author can only contain alphabetic characters, spaces (0 - any ), hyphens (0 - any), apostrophes ' (0 - any ) and number of symbols 1 - 40. First and Last name can not start with ' or whitespace"
// }

// export const commentRequestCheck = {
//   articleIdRequire: 'articleId is required',
//   contentMessageRequire: 'contentMessage is required',
//   guestNameRequire: 'guestName is required',
//   parentGuestNameRequire: 'parentGuestName is required',
//   guestNameInvalid: "guestName can only contain alphabetic characters, spaces (0 - any ), hyphens (0 - any), apostrophes ' (0 - any ) and number of symbols 1 - 40. First and Last name can not start with ' or whitespace",
//   parentGuestNameInvalid: "parentGuestName can only contain alphabetic characters, spaces (0 - any ), hyphens (0 - any), apostrophes ' (0 - any ) and number of symbols 1 - 40. First and Last name can not start with ' or whitespace",
// }

export const bookRequestCheck = {
    imageRequire : 'Image is requied',
    titleRequire : 'Title is requied',
    author : 'Author is requied',
    costRequire: 'ProviderId is requied',
    loai_bookId : 'loaibookid is requied'
}

export const loaibookRequestCheck = {
    nameCategory : 'nameCategory is requied',
    // bookId : 'bookid is requied',
}


export const cartRequestCheck = {
    // bookid : 'bookid is requied',
    // shipid : ' shipid is requied',
    nameRequest : 'Name is requied'
}

export const providerRequestCheck = {
    nameproviders : 'nameproviders is requied',
}

// export const shipRequestCheck = {
//     userId : 'userId is requied',
//     shipId : 'shipId is requied',
//     bookId : 'bookId is requied',
//     nameships : 'nameships is requied',
//     costship : 'costship is requied',
// }

export const userRequestCheck = {
    phonenumber : 'phonenumber is requied',
    password : 'password is requied',
    confirmpassword : 'Confirmpassword is requied'
}

export const billsRequestCheck = {
    userId : 'userId is requied',
    bookId : 'bookId is requied',
    address : 'address is requied',
    // giohang_id : 'giohang_id is requied',
    soluongdat : 'soluongdat is requied'
}

export const warehouseRequestCheck = {
    book_id: 'bookid is requied',
    soluongton : 'Soluongton is requied'
}

export const bookcartRequestCheck = {
    book_id: 'bookId is requied',
    cart_id: 'cartId is requied',
    soluongdatRequired: 'Soluongdat is required'
}