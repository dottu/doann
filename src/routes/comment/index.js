import express, { Router } from 'express'

import * as db from '../../database/models'
import catchHandle from './../../middlewares/catchHandle'
import * as eResponse from './../../config/eResponse'
// import { BOOK_LIMIT } from '../../config/constant'
import checklogin from '../../middlewares/checklogin'
import { Op } from 'sequelize'
import alert from 'alert'; 
import multer from 'multer'
import path from 'path'
const router = express.Router();


router.get('/danhsachbinhluan', catchHandle(async(req,res)=>{
    //lay danh sach binh luan san pham
    const danhsachbinhluan = await db.users.findAll({
        // include :[
        //     {
                model : db.users,
                where : {
                    role : 'custom'
                },
                include : [
                    {
                        model : db.comment_books,
                        as : 'commentuser',
                        where : {
                            status : '0',
                            // group : ['commentId'],
                            // id = bookId
                        }
                    }
                ]
        //     }
        // ]
    })

    const dsbook = await db.books.findAll({
        where : {
            status : '1'
        }
    })

    // tạo 1 mảng chứa dsbinh luan 
    var listbl = []
    var objbl
    for(var i = 0; i < danhsachbinhluan.length; i++){
        for( var j = 0 ; j < danhsachbinhluan[i].commentuser.length; j++){
            for(var k =0 ; k < dsbook.length ; k++){
                if(danhsachbinhluan[i].commentuser[j].bookId == dsbook[k].id){
                    if(danhsachbinhluan[i].id == danhsachbinhluan[i].commentuser[j].userId){
                        objbl = {
                            nameuser : danhsachbinhluan[i].name,
                            id : danhsachbinhluan[i].commentuser[j].id,
                            noidung : danhsachbinhluan[i].commentuser[j].noidung,
                            image : dsbook[k].image,
                            status : danhsachbinhluan[i].commentuser[j].status,
                            masp : dsbook[k].masp,
                            ngaycomment : danhsachbinhluan[i].commentuser[j].createdAt
                        }
                        listbl.push(objbl)
                        console.log('o dy')
                    }
                }
            }
        }
    }
    console.log('=======',objbl)
    console.log('----', listbl)
    // const dsbinhluan = await db.books.findAll({
    //     include : [
    //         {
    //             model : db.users,
    //             as : 'comment_books',
    //             include :[
    //                 {
    //                     model : db.comment_books,
    //                     as : 'commentuser', 
    //                     where :{

    //                     }
    //                 }
    //             ]
    //         }
    //     ]
    // })
    // for()
    // return res.send(danhsachbinhluan)
    res.render('viewcomment', {comment : listbl})
}))

//Thay đổi trạng thái xét duyệt
router.post('/thaydoittbl', catchHandle(async(req, res)=>{
    console.log('=', req.body)
    const suatt = await db.comment_books.update(
        {
            status : req.body.status,
        },{
            where : {
                id : req.body.id
            }
        }
    )
    res.send('oce')
}))

//Sửa lượt thích    
router.post('/like', catchHandle(async(req, res) =>{
    console.log('******' ,req.body)
    // var objlikes = {
    //     commentId : req.body.id,
    //     userId : req.body.userId,
    //     luotthich : req.body.luotthich
    // }

    // const getlike = await db.likes.findOne({
    //     where : {
    //         [Op.and]: {
    //             luotthich : 0,
    //             commentId : req.body.id
    //         }
    //     }
    // })
    // console.log('------', getlike)
    // //Update like
    // if(getlike){
    //     const uplike = await db.likes.update(
    //         {
    //             luotthich : req.body.luotthich
    //         },{
    //             where : {
    //                 [Op.and]:{
    //                     commentId : req.body.id,
    //                     userId : req.body.userId
    //                 }
    //             }
    //         }
            
    //     )
    // }else{
        
    //     const crlike = await db.likes.create(objlikes)
    // }
    

    const upcm_book = await db.comment_books.update(
        {
            luotthich : req.body.luotthich
        },{
            where : {
                id : req.body.id
            }
        }
        )
    res.send('oce')
}))
export default router