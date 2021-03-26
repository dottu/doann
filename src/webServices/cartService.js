import _ from 'lodash'

import { shipRequestCheck,billsRequestCheck, cartRequestCheck , bookcartRequestCheck } from '../config/constant'
import { Op } from 'sequelize'
import * as db from '../database/models'
import * as cache from  '../cache'
import { xoaDau , removeTagHtml, removeJsScript } from '../utilities/stringHelpers'
import catchHandle from '../middlewares/catchHandle'
const cacheTime = 3600


const createCart = async (name) =>{
    console.log('data', name)
    let data = {
        name : name
    }
    console.log('basdasf', data)
    const abc = await db.carts.create(data)
}
const createBookCart = async (data) =>{
    console.log(data)
    const creat = await db.bookcarts.create(data)
}

const upsoluongdat = async (data) =>{
    console.log(typeof data.soluongdat)
    // let data ={
    //     id: id,
    //     soluongdat = soluong
    // }
    if(!data.soluongdat){
        return { error : bookcartRequestCheck.soluongdatRequired }
    }
    data.soluongdat = removeTagHtml(data.soluongdat)
    
    return await db.bookcarts.update({soluongdat : Number(data.soluongdat)},
        {
            where :{
                id : data.id
            }
        }
    )
}


 
export default {
    createCart,
    createBookCart,
    upsoluongdat
}