import express from 'express'

import * as db from '../../database/models'
import catchHandle from './../../middlewares/catchHandle'
import * as eResponse from './../../config/eResponse'
import loaibookServices from './../../webServices/loaibookServices'
import bookServices from '../../webServices/bookServices'
import { Op } from 'sequelize'

// import loaibookServices from './../../webServices/loaibookServices'
import alert from 'alert';
import moment from 'moment'
const router = express.Router()




router.post('/ware', async(req,res)=>{
    console.log(req.body)
    const resAdd = await loaibookServices.createwarehouse(req.body)
    if(!resAdd || resAdd.error){
        return res.send(eResponse._errorByHand(!resAdd ? ' System Error ' : resAdd.error))
    }
    res.send(eResponse._success(resAdd))
})


//Create Sale GET
router.get('/create-sale', catchHandle(async(req,res)=>{
    const getbookid = await db.books.findAll({
        where : {
            status : '1'
        }
    })
    // const getsale = await db.loaibooks.findAndCountAll({
    //     include : {
    //         model: db.books,
    //         requied: true,
    //         include :{
    //             model: db.sales
    //         }
    //     },
    //     // where : {
    //     //     status : 'publish'
    //     // }
    // // })  
    // const getmagiamgia = await db.magiamgia.findAll({
    //     where : {
    //         status : "conhan",
    //     }
    // })
    
    const getsale = await bookServices.listsale()

    // res.send({view: getsale})
    // res.send({getsale: getsale})
    res.render('create-sale',{book:getbookid,view: getsale.rows,current : getsale.current, page : getsale.page})
}))



//Create Sale POST
router.post('/create-sale', catchHandle(async(req,res)=>{
    console.log(req.body)
    //check ton tai 
    const getsale = await db.sales.findOne({
        where : {
            bookId : req.body.bookId
        }
    })
    if(getsale == null){
        const resAddSale = await bookServices.createSale(req.body)
        res.redirect('/create-sale')
    }
    else{
        alert('Mã sản phẩm đã được giảm giá')
        res.redirect('/create-sale')
    }
}))


//Edit Sale
router.post('/editsale', catchHandle(async(req,res)=>{
    console.log(req.query)
    console.log(req.params)
    console.log(req.body)
    const Upsale = await bookServices.Upsale(req.body)
    res.redirect('/create-sale')
}))

//Delete Sale
router.get('/deletesale', catchHandle(async(req,res)=>{
    console.log(req.query)
    console.log(req.body),
    console.log(req.params)
    const removesale = await db.sales.destroy({
        where : {
            id : req.query.saleId
        }
    })
    const removebook = await db.books.destroy({
        where :{
            id: req.query.bookId
        }
    })
    const removewarehouse = await db.warehouse.destroy({
        where : {
            bookId : req.query.bookId
        }
    })
    return res.send(eResponse._success(removesale,removebook,removewarehouse))
}))

router.get('/create-magiamgia', catchHandle(async(req,res, next)=>{
    const magg = await db.magiamgia.findAll({
        // where : {
        //     status : 'conhan'
        // }
    })
    console.log('mooomentttttttttttttttttt', moment())

    // today.replace(/\B(?=(\d{3})+(?!\d))/g, "Moment")
    // console.log('qqqqqqqqqqqqqqqqqqqqqqqqqqq', today)
    // const layngay = await db.magiamgia.findAll({
    //     where :{
    //         ngayketthuc : moment()
    //     }
    // })
    // for(var i = 0; i< layngay.length; i++){
    //     console.log('ajsjasfn')
    //     if(moment() < layngay[i].ngayketthuc){
    //         console.log('-----------------------oday-')
    //     }
    // }
    // return res.send(layngay)
    // res.render('createmagg', {magiamgia : magg})
    res.render('createmagg', {magiamgia : magg})
    setInterval(function(){
        for(var i = 0; i<magg.length; i++){
            var date = moment(magg[i].ngayketthuc)
            console.log('abccc', date)
            var today =  moment()
            if( today > date){
                console.log('aaaaaaabcccccccc')
                //doi status thanh het han 
                const suadoitrangthai  = db.magiamgia.update(
                    {
                        status: 'hethan'
                    },{
                        where :{
                            id : magg[i].id
                        }
                    }
                )
            }
        }
        // return next()
    }, 60000);
}))
//Create MaGiamgia POST 
router.post('/create-magiamgia', catchHandle(async(req,res)=>{
    // var today = new Date(req.body.ngaybatdau)
    // console.log("today",today)
    console.log('oday', req.body)
    // console.log('00000000000000000',typeof req.body.sale)
    if(req.body.sotiengiam == ''){
        var objmagg = {
            magiamgia : req.body.magiamgia,
            sale : Number(req.body.sale),
            // sotiengiam : '',
            ngaybatdau : req.body.ngaybatdau,
            ngayketthuc: req.body.ngayketthuc
        }
        console.log('vào đây ')
    }else{
        var objmagg = {
            magiamgia : req.body.magiamgia,
            // sale : '',
            sotiengiam : Number(req.body.sotiengiam),
            ngaybatdau : req.body.ngaybatdau,
            ngayketthuc: req.body.ngayketthuc
        }
        console.log('vào đây elsse ')

    }
    //check ton tai 
    const getmagiamgia = await db.magiamgia.findOne({
        where : {
            magiamgia : req.body.magiamgia
        }
    })
    console.log('abbc o day', getmagiamgia)
    if(getmagiamgia == null){
        // var objmgg = {
        //     magiamgia : req.body.magiamgia,
        //     sotiengiam : req.body.sotiengiam,
        //     timesale : Number(req.body.timesale) * 24 * 60 * 60
        // }
        const resAddgiamgia = await bookServices.createGiamgia(objmagg)
        res.redirect('/create-magiamgia')
    }else{
        alert('Mã giảm giá đã tồn tại')
        res.redirect('/create-magiamgia')
    }
}))

//DELETE magiamgia
router.get('/deletemagiamgia', catchHandle(async(req,res)=>{
    const remove = await db.magiamgia.destroy({
        where :{
            id : req.query.id
        }
    })
    res.send(eResponse._success(remove))
}))

//Edit giamgia
router.post('/editmagiamgia', catchHandle(async(req,res)=>{
    console.log(req.body)
    const updatemagiamgia = await bookServices.Upmagiamgia(req.body)
    res.redirect('/create-sale')
}))

// router.get('/abc', async(req,res)=>{
//     res.send('<div><p>abcc</p></div>')
// })



//Search the loai
router.get('/searchtheloai', catchHandle(async(req,res)=>{
    // console.log('req.bodyaaaaa', req.boy)
    console.log('acv', req.query)
    const timkiem = await db.loaibooks.findAll({
        where : {
            namecategory : {
                [Op.startsWith] : '%'+req.query.search
            }
        }
    })
    console.log('timkiem', timkiem)
    res.render('layout/searchcategory',{infobook :timkiem})
}))

//Search magiamgia 
router.get('/searchmagg', catchHandle(async(req,res)=>{
    const timkiem = await db.magiamgia.findAll({
        where :{
            magiamgia : {
                [Op.startsWith] : '%'+ req.query.search
            }
        }
    })
    res.render('layout/searchmagiamgia',{magiamgia : timkiem})
}))

//Search Sale
router.get('/searchsale', catchHandle(async(req,res)=>{
    console.log('abcaad', req.query)
    const timkiem = await db.loaibooks.findAndCountAll({
        include : {
            model : db.books,
            requied : true ,
            include : {
                model : db.sales
            },
            where : {
                [Op.or]:{
                    title : {
                        [Op.startsWith] : '%'+req.query.search
                    },
                    masp : {
                        [Op.startsWith] : '%'+req.query.search
                    }
                }
            }
        }
    })
    // res.send(timkiem)
    res.render('layout/searchsale',{view:timkiem.rows})
}))

//Search Book 
router.get('/searchbook', catchHandle(async(req,res)=>{
    console.log('abcaad', req.query)
    const timkiem = await db.loaibooks.findAndCountAll({
        include : {
            model : db.books,
            requied : true ,
            include : {
                model : db.sales
            },
            where : {
                [Op.or]:{
                    title : {
                        [Op.startsWith] : '%'+req.query.search
                    },
                    masp : {
                        [Op.startsWith] : '%'+req.query.search
                    }
                }
            }
        }
    })
    // res.send(timkiem)
    res.render('layout/searchbook',{view:timkiem.rows})
}))

export default router