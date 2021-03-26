import express from 'express'

import * as db from '../../database/models'
import { Op } from 'sequelize'
import catchHandle from './../../middlewares/catchHandle'
import * as eResponse from './../../config/eResponse'
// import bookServices from './../../webServices/bookServices'
// import userServices from '../../webServices/userServices'
import cartServices from '../../webServices/cartService'
import bookServices from '../../webServices/bookServices'
import { BOOK_LIMIT, cartRequestCheck } from '../../config/constant'
import checklogin from '../../middlewares/checklogin'
import multer from 'multer'
import path from 'path'
import { update } from 'lodash'

const router = express.Router()

//Add Cart
router.post('/addcart', catchHandle(async (req,res)=>{

    console.log('session', req.session)
    console.log('bac',req.body)
    req.session.giasale = req.body.giasale
    var giasale = Number(req.body.giasale.replace(/\./g, ''))
  
    // //lay BookcartId 
    // const getbookcartid = await db.bookcarts.findOne({
    //     // attribute : ['id','cartId','bookId', 'soluongdat'],
    //     where :{
    //         [Op.and]: {
    //             bookId : req.session.bookid,
    //             userId : req.session.userId
    //         },
    //     },
    //     // order : [
    //     //     ['id', 'DESC']
    //     // ]
    // })

    // // // viet ham kiem tra

    // // // kiem tra gio hang cua thang user hien tai tai co khong
    // // // if (co) {
    // // //     // tao du lieu va goi ham cap nhat
    // // // } else {
    // // //     // tao du lieu va tao gio hang cho user
    // // // }

    // // kiem tra gio hang cua thang user hien tai tai co khong
    // if(getbookcartid &&req.session.bookid == getbookcartid.bookId ){
    //     //     // tao du lieu va goi ham cap nhat
    //     const getsoluongton = await db.warehouses.findOne({
    //         attribute : ['soluongton'],
    //         where :{
    //             bookId : req.body.id
    //         }
    //     })

    //     //capnhat soluong
    //     var soluongconlai = Number(getsoluongton.soluongton) - Number(getbookcartid.soluongdat)
    //     console.log('soluongconlai', soluongconlai)
    //     //
    //     var obj = {
    //         bookId : req.body.id,
    //         soluongton : String(soluongconlai)
    //     }
    //     console.log('oas', obj)
    //     console.log('obj', objbookcart)

    //     // 
    //     var objupsoluong = {
    //         bookId: getbookcartid.bookId,
    //         userId : req.session.userId,
    //         soluongdat: getbookcartid.soluongdat,
    //         // giasale : res.session.giasale
    //     }
    //     console.log('objupsluong', objupsoluong)
    //     req.session.soluong = objupsoluong.soluongdat
    //     //update soluongdat in bookcarts
    //     const upbookcart = await bookServices.upsoluongdat(objupsoluong)
    //     console.log('vao if')
    //     //update soluongton in warehouses
    //     const resUpwarehouse = await bookServices.upsoluongton(obj)
    // }
    // else {

    //     //// tao du lieu va tao gio hang cho user
    //     const listbookcart = await db.bookcarts.findAll({
    //         where : {
    //             userId : req.session.userId
    //         }
    //     })

    //     //Check gio hang 
    //     if(listbookcart == null){
    //         const resAdd = await cartServices.createCart(req.body.name)
    //     }
    //     else{
    //     //lay idgiohang cuoi cung
    //     const getDesc = await db.carts.findOne({
    //         order:[
    //             ['id', 'DESC']
    //         ] ,
    //         limit : 1
    //     })
    //     //lay userId dang duoc luu o session
    //     const getUserid = await db.users.findOne({
    //         attribute: ['id'],
    //         where :{
    //             phonenumber : req.session.phone
    //         }
    //     })
    //     console.log('vao` else', getUserid.id)
    //     req.session.userId = getUserid.id
    //     var a = String(getDesc.id)
    //     console.log('abcc',typeof getDesc.id)
    //     var objbookcart = {
    //         bookId: req.body.id,
    //         cartId: a,
    //         userId: getUserid.id,
    //         soluongdat : Number(req.body.soluongdat),
    //         giasale : giasale
    //     }
    //     req.session.soluong = objbookcart.soluongdat
    //     //tao gio hang
    //     const resAddbookcart = await cartServices.createBookCart(objbookcart)
    //     console.log('resAddbookcart', resAddbookcart)
    //     //Update soluongton
    //     const getsoluongton = await db.warehouses.findOne({
    //         attribute : ['soluongton'],
    //         where :{
    //             bookId : req.body.id
    //         }
    //     })
    //     var soluongconlai = Number(getsoluongton.soluongton - objbookcart.soluongdat )
    //     console.log('soluongconlai', soluongconlai)
    //     var obj = {
    //         bookId : req.body.id,
    //         soluongton : String(soluongconlai)
    //     }

    //     //update lai soluongton in warehouses
    //     const resUpwarehouse = await bookServices.upsoluongton(obj)
    //     }

    // }
    // res.send('abc') 




    ///LAM' LAI. DCC
    
    //neu co cart thi (check xem co' cart trong bookcart day chua )
        //lay gio hang day 
            //check bookId trong gio co == sp se dc them vao tiep theo k
                // neu book 
                        //update soluong
                // !book
                    // them san pham do vao` gio
    //else
        //tao cart va' them cart vao bookcarts


    if(req.session.cartId){
        const listcart = await db.bookcarts.findOne({
            where : {
                [Op.and] : {
                    bookId : req.session.bookid,
                    cartId : req.session.cartId
                }
            }
        })
        console.log('lista', listcart)
        if(listcart && req.body.id == listcart.bookId){
            //tang so luong
            var objtangsl = {
                bookId : req.session.bookid,
                cartId : req.session.cartId,
                soluongdat : listcart.soluongdat
            }
            const updatesl = await bookServices.upsoluongdat(objtangsl)
            console.log('ababsad', updatesl)
            console.log('vao if 1')
            //  lay soluong ton
            const getsoluongton = await db.warehouses.findOne({
                attribute : ['soluongton'],
                where :{
                    bookId : req.body.id
                }
            })
            console.log('-------------soluongton----',getsoluongton)
            //capnhat soluong
            var soluongconlai = Number(getsoluongton.soluongton) - Number(listcart.soluongdat)
            console.log('soluongconlai', soluongconlai)
            //
            var obj = {
                bookId : req.body.id,
                soluongton : String(soluongconlai)
            }
            const resUpwarehouse = await bookServices.upsoluongton(obj)
        }
        else{
            if(!req.session.userId){
                //them san pham moi vao gio
                console.log('./////////,,,,,,,,,,,,,,,,,,,,,,,,,,dumaaa')
                var objspmoi = {
                    bookId : req.session.bookid,
                    cartId : req.session.cartId,
                    soluongdat : req.body.soluongdat,
                    giasale : giasale
                }
                const themsanpham = await cartServices.createBookCart(objspmoi)
                console.log('vao else 2')

                const getsoluongton = await db.warehouses.findOne({
                    where :{
                        bookId : req.body.id
                    }
                })
                var objkhohang = {
                    bookId : objspmoi.bookId,
                    soluongton : Number(getsoluongton.soluongton) - Number(objspmoi.soluongdat)
                }
                const resUpwarehouse = await bookServices.upsoluongton(objkhohang)
            }
            else{
                console.log('1232222222222222222222222')
                var objspmoi = {
                    bookId : req.session.bookid,
                    cartId : req.session.cartId,
                    userId : req.session.userId,
                    soluongdat : req.body.soluongdat,
                    giasale : giasale
                }
                const themsanpham = await cartServices.createBookCart(objspmoi)
                console.log('vao else 2')

                const getsoluongton = await db.warehouses.findOne({
                    where :{
                        bookId : req.body.id
                    }
                })
                var objkhohang = {
                    bookId : objspmoi.bookId,
                    soluongton : Number(getsoluongton.soluongton) - Number(objspmoi.soluongdat)
                }
                const resUpwarehouse = await bookServices.upsoluongton(objkhohang)
            }
        }   
    }
    else{
        if(!req.session.userId){
            // tao gio
            const taogio = await cartServices.createCart(req.body.name)

            //them gio vao bookcart

            const getDesc = await db.carts.findOne({
                order : [
                    ['id','desc']
                ],
                limit : 1
            })
            console.log('getDESC', getDesc.id)
            req.session.cartId = getDesc.id
            //tao obj cart
            var obj = {
                bookId: req.body.id,
                cartId : getDesc.id,
                soluongdat: Number(req.body.soluongdat),
                giasale : giasale
            }
            // req.session.cartId = obj.cartId
            //tao bookcarts
            const themvao = await cartServices.createBookCart(obj)
        }
        else{
            // tao gio
            const taogio = await cartServices.createCart(req.body.name)

            //them gio vao bookcart

            const getDesc = await db.carts.findOne({
                order : [
                    ['id','desc']
                ],
                limit : 1
            })
            console.log('getDESC', getDesc.id)
            req.session.cartId = getDesc.id
            //tao obj cart
            var obj = {
                bookId: req.body.id,
                userId : req.session.userId,
                cartId : getDesc.id,
                soluongdat: Number(req.body.soluongdat),
                giasale : giasale
            }
            // req.session.cartId = obj.cartId
            //tao bookcarts
            const themvao = await cartServices.createBookCart(obj)
        }
    }
    res.send('abc')

}))

export default router