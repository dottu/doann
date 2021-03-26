
import _ from 'lodash'

import { BOOK_LIMIT,bookRequestCheck, loaibookRequestCheck } from '../config/constant'
import { Op } from 'sequelize'
import * as db from '../database/models'
import * as cache from '../cache'
import { xoaDau , removeTagHtml, removeJsScript, checkNameValid } from '../utilities/stringHelpers'
// import multer from 'multer'
const cacheTime = 3600



const createBook = async (data)=>{
    console.log('..............', data)
    if(!data.loaibookId){
        return { error : bookRequestCheck.loai_bookId}
    }
    data.loaibookId = removeTagHtml(data.loaibookId)
    if(!data.image){
        return { error : bookRequestCheck.imageRequire }
    }
    data.image = data.image
    if(!data.title){
        return { error : bookRequestCheck.titleRequire }
    }
    data.title = removeTagHtml(data.title)
    if(!data.author){
        return { error : bookRequestCheck.authorId }
    }
    data.author = removeTagHtml(data.author)
    if(!data.cost){
        return { error : bookRequestCheck.costRequire }
    }
    data.cost = removeTagHtml(data.cost)

    return await db.books.create(data)
}

const getBook = async (keySearch=false, pageBook =1,data) =>{
    // const finbook = db.books.findOne({
    //     limit : BOOK_LIMIT
    // })
    // return finbook
    console.log('pageBook',pageBook)
    let where = {
        title: data,
        status : '1',
    }
    if(keySearch) {
        keySearch = removeTagHtml((xoaDau(keySearch), ' '))
        where.title = {
            [Op.substring]: removeTagHtml(keySearch)
        }
    }
    console.log('search',data)
    if(!pageBook){
        pageBook =1
    }
    const offsets = (pageBook - 1)*BOOK_LIMIT

    const keyCache = '__book_search_keysearch_'+keySearch+'_page_'+pageBook+'_offset_'+offsets
    console.log('keycache', keyCache)
    const cacheData = await cache.get(keyCache, true)
    console.log('cacheData', cacheData)
    if(cacheData){
        return cacheData
    }
    const books = await db.books.findAndCountAll({
        // attributes: ['id','loaibookId','image', 'title', 'status', 'author','cost' ,'createdAt', 'updatedAt'],

        where: {
            // [Op.or]:{
                status:where.status,
                // title: {
                //     [Op.startsWith]: '%'+where.title
                // }
            // }
        },
        include : {
            model: db.sales,
            requied : true,
            // include : {
            //     model : db.sales
            // }
        },
        limit: BOOK_LIMIT,
        offset: offsets,
        order: [
          ['id', 'desc']
        ],
        // include: [
        //   {
        //     model: db.comment,
        //     where: {
        //       status: 'publish'
        //     },
        //     limit: COMMENT_SUB_LIMIT
        //   }
        // ]
    })
    books.pages = Math.ceil(books.count/BOOK_LIMIT)
    books.current = pageBook
    cache.set(keyCache, books, cacheTime, true)
    console.log('page', pageBook)
    
    // const searchbook = await db.books.findAndCountAll({
    //     attributes: ['id','loaibookId','image', 'title', 'status', 'author','cost' ,'createdAt', 'updatedAt'],
    //     where : {
    //         title: {
    //             [Op.startsWith]: '%'+where.title
    //         }
    //     },
    //     limit : BOOK_LIMIT,
    //     offset: offsets,
    // })
  
  return books;
}

//Search  
const searchbook = async (data,pageBook =1) =>{
    console.log('data', data)
    // const offsets = (pageBook - 1)*BOOK_LIMIT

    const search =  await db.books.findAndCountAll({
        attributes: ['id','loaibookId','image', 'title', 'status', 'author','cost' ,'createdAt', 'updatedAt'],
        // include : {
        //     model: db.sales,
        //     requied : true
        // },
        where :{
            [Op.or] :{
                [Op.and]:{
                    status : '1',
                    title :{
                        [Op.startsWith]: '%'+data.q,
                    },        
                },
                cost : {
                    [Op.gte]: data.q
                }
            }

        },
        // limit: BOOK_LIMIT,
        // offset: offsets
    })

    //tim thoe gia tien
    // const abc = await db.books.findAndCountAll({
    //     include : {
    //         model : db.sales,
    //         requied : true
    //     },
    //     where : {
    //         [Op.and]:{
    //             status : 'publish',
    //             cost : {
    //                 [Op.lte] : data.q
    //             }
    //         },
    //     }
    // })

    // const searchCost = await db.books.findAndCountAll({
    //     include: {
    //         model : db.sales,
    //         requied : true
    //     },
    //     where :{
    //         //sap xep nho hon 
    //         [Op.and]:{
    //             [Op.gte]: data.q,
    //             status : 'publish'
    //         }
    //     }
    // })
    // search.pages = Math.ceil(search.count/BOOK_LIMIT)
    // search.current = pageBook
    return search;
}

// //Search theo gia tien

const searchCost = async(data, pageBook =1) =>{
    const offests = (pageBook - 1)*BOOK_LIMIT

    if(data.a == 'giathap'){
        const searchcost = await db.books.findAndCountAll({
            include :{
                model : db.sales,
                requied: true
            },
            where :{
                status : '1',
            },
            limit : BOOK_LIMIT,
            offset :offests,
            order: [
                ['cost', 'asc']
            ]
        })
        searchcost.page = Math.ceil(searchcost.count/BOOK_LIMIT)
        searchcost.current = pageBook
        return searchcost
    }else{
        const searchcost = await db.books.findAndCountAll({
            include :{
                model : db.sales,
                requied: true
            },
            where :{
                status : '1',
            },
            limit : BOOK_LIMIT,
            offset :offests,
            order: [
                ['cost', 'desc']
            ]
        })
        searchcost.page = Math.ceil(searchcost.count/BOOK_LIMIT)
        searchcost.current = pageBook
        return searchcost
    }

}

//Get gia tri de view ra man Home
const getbooks = async () =>{
    const joinbook = db.books.findAll({
    })
    return joinbook;
}
const getinfobook = async (bookid) =>{
    const infobook = await db.books.findOne({
        where: {
            id: bookid
        }
    })
    return infobook
}

//Update Book
const Updatebook = async (data)=>{
    console.log('Updatebook', data)
    return await db.books.update({
        masp : data.masp,
        image: data.image,
        title: data.title,
        author: data.author,
        cost: data.cost
    },
    {
        where :{
            id : Number(data.id)
        }
    }
    )
}

//Create Warehouse
const createWarehouse = async (objwarehouse) =>{
    console.log('warehouse', objwarehouse)
    return await db.warehouses.create(objwarehouse)
}

//Update Warehouse
const upsoluongton = async (obj) =>{
    console.log('upsoluongton',obj)
    return await db.warehouses.update(
        {
            soluongton : obj.soluongton
        },
        {
            where :{
                bookId : obj.bookId
            }
        }
    )
}

//Update BookCarts so luong 
const upsoluongdat = async (obj) =>{
    console.log('obj', typeof obj.soluongdat)
    let a = obj.soluongdat +1
    console.log('aaaaaa', a)
    const upbookcart = await db.bookcarts.update(
        {
            soluongdat : a
        },
        {
            where : {
                [Op.and]:[{
                    bookId : obj.bookId,
                    // userId : obj.userId
                    cartId : obj.cartId
                }                    
                ]
            }
        }
    )
}

//Create sale
const createSale = async(sale) =>{
    console.log('createo day', sale)
    return await db.sales.create(sale)
}
// Update sale 
const Upsale = async (data)=>{
    console.log(data)
    return await db.sales.update(
        {
            namesale: data.namesale,
            sale: data.sale
        },
        {
            where :{
                bookId : data.bookid
            }
        }
    )
}

//Views sale 
const listsale = async(pagesale =1) =>{
    // console.log('keys', keySearch)
    const offests = (pagesale - 1)*BOOK_LIMIT
    const getsale = await db.loaibooks.findAndCountAll({
        include :{
            model: db.books,
            requied : true,
            include :{
                model : db.sales,

            },
            // where :{
            //     title : {
            //         [Op.startsWith] : '%'+keySearch
            //     }
            // }
        },
        limit : 6,
        // order : [['createdAt', 'desc']],
        offset : offests
    })
    getsale.page = Math.ceil(getsale.count/BOOK_LIMIT)
    getsale.current = pagesale

    return getsale
}

//Create Magiamgia 
const createGiamgia = async(giamgia)=>{
    console.log('ádasfaf', giamgia)
    console.log('create giamgia ', giamgia)
    return await db.magiamgia.create(giamgia)
}

//Create bookSale 
// const createbookSale = async(booksale) =>{
//     return await db.booksales.create(booksale)
// }

//Edit magiamgia
const Upmagiamgia = async(data)=>{
    console.log('odsad'. data)
    return await db.magiamgia.update(
        {
            magiamgia : data.magiamgia,
            sotiengiam: data.sotiengiam
        },
        {
            where :{
                id : data.id
            }
        }
    )
}

//
const getbookadmin = async(keySearch=false, pageBook=1,data) =>{
    const offsets = (pageBook - 1)*BOOK_LIMIT
    console.log("offsets", offsets)
    const keyCache = '__book_search_keysearch_'+keySearch+'_page_'+pageBook+'_offset_'+offsets
    console.log('keycache', keyCache)
    const cacheData = await cache.get(keyCache, true)
    console.log('cacheData', cacheData)

    const book = await db.loaibooks.findAndCountAll({
        include : {
            model : db.books,
            requied: true,
            // include : {
            //     model: db.sales
            // }
        },
        limit: BOOK_LIMIT,
        offset : offsets,
        order :[
            ['id', 'desc']
        ]
    })
    book.pages = Math.ceil(book.count/BOOK_LIMIT)
    book.current = pageBook
    return book
}

//Bình luận sản phẩm
const comment = async(data) =>{
    console.log('*********', data)
    return await db.comment_books.create(data)
}

export default{
    createBook,
    getBook,
    getbooks,
    getinfobook,
    searchbook,
    createWarehouse,
    upsoluongton,
    upsoluongdat,
    createSale,
    createGiamgia,
    // createbookSale,
    Upsale,
    getbookadmin,
    Updatebook,
    Upmagiamgia,
    // listdanhmuc,
    listsale,
    searchCost,
    comment
}
