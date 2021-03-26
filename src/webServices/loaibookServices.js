import _, { identity, includes } from 'lodash'

import { BOOK_LIMIT, loaibookRequestCheck , warehouseRequestCheck } from '../config/constant'
import { Op } from 'sequelize'
import * as db from '../database/models'
import * as cache from '../cache'
import { xoaDau , removeTagHtml, removeJsScript, checkNameValid } from '../utilities/stringHelpers'

const createloaiBook = async (data)=>{
    // if(!data.bookid){
    //     return { error : loaibookRequestCheck.bookid }
    // }
    // data.bookid = data.bookid
    console.log(data)
    if(!data.namecategory){
        return {error : loaibookRequestCheck.bookid}
    }
    data.namecategory = removeTagHtml(data.namecategory)
    
    data.url = 'danhmuc/' + removeTagHtml(xoaDau(data.namecategory))
    data.slug = removeTagHtml(xoaDau(data.namecategory))

    return await db.loaibooks.create(data)
}
// get danh muc slug
const getSlug = async (slug, pageBook =1) =>{
    console.log('slug', slug)
    const offsets = (pageBook - 1)*BOOK_LIMIT
    const result = await db.loaibooks.findOne({
        where:{
            slug : slug
        },
        // include :{
        //     model : db.books,
        //     requied :true,
        //     include :{
        //         model : db.sales,
        //         requied : true
        //     }
        // }
    })
    //lay de  chia page 
    const listbook = await db.books.findAndCountAll({
        where :{
            loaibookId : result.id
        },
        include : {
            model: db.sales,
            requied : true
        },
        offset : offsets,
        limt : BOOK_LIMIT
    })
    console.log('listst', listbook)
    console.log('ktqua', result)
    listbook.page = Math.ceil(listbook.count/BOOK_LIMIT)
    listbook.current = pageBook
    return  listbook
}



const createwarehouse = async (data)=>{
    if(!data.book_id){
        return { error : warehouseRequestCheck.book_id }
    }
    data.book_id = data.book_id

    if(!data.soluongton){
        return {error : warehouseRequestCheck.bookid}
    }
    data.soluongton = removeTagHtml(data.soluongton)

    return await db.warehouses.create(data)
}

//Updatecategory 
const Upcategory = async (data) =>{
    console.log(data)
    return await db.loaibooks.update({
        namecategory : data.namecategory
    },
    {
        where : {
            id : data.id
        }
    }
    )
}



export default {
    createloaiBook,
    createwarehouse,
    Upcategory,
    getSlug
}