import express from 'express'

import * as db from '../../database/models'


import catchHandle from './../../middlewares/catchHandle'
import checkgiohang from './../../middlewares/checklogin'
import * as eResponse from './../../config/eResponse'
import billServices from './../../webServices/billService'
import cartServices from './../../webServices/cartService'
import bookServices from './../../webServices/bookServices'
import { Op, Sequelize, where } from 'sequelize'
import { forEach } from 'lodash'
import { flushByUser, get } from '../../cache'
import moment from 'moment'
const nodemailer = require("nodemailer")

const router = express.Router()

//Create Bill
router.post('/bill', catchHandle(async(req,res)=>{
    console.log(req.body)
    const resAdd = await billServices.createBill(req.body)
    console.log('abcbac', resAdd)
    if(!resAdd || resAdd.error){
        return res.send(eResponse._errorByHand(!resAdd ? ' System Error ' : resAdd.error))
    }
    res.send(eResponse._success(resAdd))
}))

//Create Cart
router.post('/cart', catchHandle(async(req,res)=>{
    console.log(req.body)
    const resAdd = await billServices.createCart(req.body)
    console.log('abcbac', resAdd)
    if(!resAdd || resAdd.error){
        return res.send(eResponse._errorByHand(!resAdd ? ' System Error ' : resAdd.error))
    }
    res.send(eResponse._success(resAdd))
}))

//Create Ship
// router.post('/ship', catchHandle(async(req,res)=>{
//     console.log(req.body)
//     const resAdd = await billServices.createShip(req.body)
//     console.log('abcbac', resAdd)
//     if(!resAdd || resAdd.error){
//         return res.send(eResponse._errorByHand(!resAdd ? ' System Error ' : resAdd.error))
//     }
//     res.send(eResponse._success(resAdd))
// }))

//GET Cart
router.get('/gio-hang',checkgiohang, catchHandle(async(req,res)=>{
    // console.log()
    console.log(req.body)
    console.log(req.session)
    if(!req.session.cartId){
        var objbookcart = {
            userId : req.session.userId,
            // cartId : req.session.cartId
        }
        const infoCart = await billServices.getCart(objbookcart)
        const infoAdd = await billServices.getinfocustom()
        // const infoCart = await billServices.getCart(objbookcart)
        let checkma = {}
        if(req.session.magiamgia){
            const checkmaa = await db.magiamgia.findOne({
                where : {
                        magiamgia: req.session.magiamgia,
                }
            })
            checkma = checkmaa
            console.log("checkma",checkmaa)
        }
        else{
            var checkmaa = {
                magiamgia: 0,
            }
            checkma = checkmaa
            console.log('checlmamasas',checkma)
        }
    
        //check ton tai 
        // if(!req.session.cartId)
        const getsumcart = await db.bookcarts.findAll({
            where :{
                [Op.and]:{
                    userId: req.session.userId,
                    // cartId : req.session.cartId
                }
            }
        })
        const address = await db.users.findAll({
            include :{
                model : db.addresses,
                requied: true,
                // include : {
                //     model : db.users
                // }
            },
            where :{
                id : req.session.userId
            }
        })
        console.log('==========', address)
        const getdanhmuc = await db.loaibooks.findAll({})
        console.log('asd',address)
        // res.send(address)
        var tenngdung = req.session.name
        res.render('cart',{address:infoAdd, cart:infoCart, checkma: checkma,soluonggio:getsumcart,address: address, danhmuc : getdanhmuc, ten: tenngdung})
    }
    else{
        var objbookcart = {
            userId : req.session.userId,
            cartId : req.session.cartId
        }

        const infoAdd = await billServices.getinfocustom()
        // const infoCart = await billServices.getCart(objbookcart)
        let checkma = {}
        if(req.session.magiamgia){
            const checkmaa = await db.magiamgia.findOne({
                where : {
                        magiamgia: req.session.magiamgia,
                }
            })
            checkma = checkmaa
            console.log("checkma",checkmaa)
        }
        else{
            var checkmaa = {
                magiamgia: 0,
            }
            checkma = checkmaa
            console.log('checlmamasas',checkma)
        }
    
        //check ton tai 
        // if(!req.session.cartId)
        const cart = await db.bookcarts.findAll({
            where : {
                cartId : req.session.cartId
            }
        })
        var sumcart;

        const getsumcart = await db.bookcarts.findAll({
            where :{
                [Op.and]:{
                    userId: req.session.userId,
                    // cartId : req.session.cartId
                }
            }
        })
        //lấy giỏ hàng của user sau đó check giỏ đã tồn tại hay ko nếu tồn tại thì lấy cái đã tồn tại còn chưa có thì tạo mới 
        for(var i = 0; i < getsumcart.length; i++){
            for(var k = 0; k < cart.length; k++){
                if(getsumcart[i].cartId != req.session.cartId && getsumcart[i].bookId == cart[k].bookId){
                    sumcart = cart[k].soluongdat + getsumcart[i].soluongdat
                    console.log('============sumcart', sumcart)
                    const Upcart = await db.bookcarts.update(
                        {  
                            soluongdat : sumcart
                            
                        },{
                            where : {
                                [Op.and]:{
                                    bookId : getsumcart[i].bookId,
                                    cartId : getsumcart[i].cartId
                                }
                            }
                        }
                    )
                    const deletecart = await db.bookcarts.destroy({
                        where : {
                            [Op.and]:{
                                cartId : cart[k].cartId,
                                bookId : cart[k].bookId
                            }
                        }
                    })
                    console.log('cmmmmmmmmmmmmmmmmm')
                }
            }
        }
        const getsumcartnew = await db.bookcarts.findAll({
            where :{
                [Op.and]:{
                    userId: req.session.userId,
                    // cartId : req.session.cartId
                }
            }
        })
        const infoCart = await billServices.getCart(objbookcart)
        const address = await db.users.findAll({
            include :{
                model : db.addresses,
                requied: true,
                // include : {
                //     model : db.addresses
                // }
            },
            where :{
                id : req.session.userId
            }
        })
        const getdanhmuc = await db.loaibooks.findAll({})
        console.log('asd',address)
        // return res.send(address)
        var tenngdung = req.session.name
        res.render('cart',{address:infoAdd, cart:infoCart, checkma: checkma,soluonggio:getsumcartnew,address: address, danhmuc : getdanhmuc, ten:tenngdung})
    }


    // const infoShip = await billServices.getShip()
    // const indobookcart = await billServices.getDistinct()
    // res.send({address:infoAdd, cart:infoCart,checkma:checkma})

}))



//Tang - giam soluong
router.post('/tangsoluong', catchHandle( async ( req,res) =>{
    console.log(req.body)
    console.log('acv', req.session)
    req.session.bookcartid = req.body.id
    console.log(req.session.bookcartid)
    console.log('acv', req.session)
    const getsoluongton = await db.warehouses.findOne({
        attribute : ['soluongton'],
        where : {
            bookId : req.body.bookId
        }
    })
    let soluongconlai = Number(getsoluongton.soluongton - 1 )
    console.log('soluongconlai', soluongconlai)
    let obj = {
        bookId : req.body.bookId,
        soluongton : soluongconlai
    }
    const resUp = await cartServices.upsoluongdat(req.body)
    const resUpwarehouse = await bookServices.upsoluongton(obj)
    if(!resUp || resUp.error){
        return res.send(eResponse._errorByHan(!resUp ? 'System Error' : resUp.error))
    }
    res.send((eResponse._success(resUp)))
}))

router.get('/checkout', catchHandle( async( req,res)=>{
    const infoAdd = await billServices.getinfocustom()
    const infoCart = await billServices.getCart()
    const infoShip = await billServices.getShip()
    // const bookCartsShip = await billServices.getShipbookcart()
    res.render('bill',{address:infoAdd, cart:infoCart, ship:infoShip})
}))

router.post('/giamsoluong', catchHandle(async(req, res)=> {
    console.log('-----cart ', req.body)
    const getsoluongton = await db.warehouses.findOne({
        attributes : ['soluongton'],
        where : {
            bookId : req.body.bookId
        }
    })
    let soluongsaukhigiam = Number(getsoluongton.soluongton +1)
    console.log(' ++++++', soluongsaukhigiam)
    var obj = {
        bookId : req.body.bookId,
        soluongton : soluongsaukhigiam
    }
    console.log('o day na ', obj)
    const resUp = await cartServices.upsoluongdat(req.body)
    const resUpwarehouse = await bookServices.upsoluongton(obj)
    res.send(eResponse._success(resUp))
}))

//DELETE Products
router.get('/deleteproducts',catchHandle( async (req, res)=>{

    console.log(req.query.id)
    res.send('ok')
    return await db.bookcarts.destroy({
        where :{
            id : Number(req.query.id)
        }
    })
}))


//ADD BIll
// router.post('/thanhtoan',catchHandle(async(req,res)=>{
//     console.log(req.body)
//     console.log(req.session)
//     const getuserid = await db.users.findOne({
//         where : {
//             phonenumber : req.session.phone}
//     })
//     var userid = getuserid.id
//     const getdescbookcart = await db.bookcarts.findAll({
//         order:[
//             ['id']
//         ],
//     })
//     console.log('vao dayyyy', getdescbookcart)
//     const reaAddress = await billServices.createAdd(req.body)
//     const getdescadd = await db.addresses.findOne({
//         order: [
//             ['id', 'desc']
//         ],
//         limit: 1
//     })
//     var addid = getdescadd.id
//     for(var i =0;i<getdescbookcart.length;i++){
//         var listid = getdescbookcart[i].id
//         // var addid = String(listid)
//         var objbill = {
//             userId: userid,
//             // bookcartId: listid,
//             bookId : getdescbookcart[i].bookId,
//             soluongdat: getdescbookcart[i].soluongdat,
//             addressId : addid
//         }
//         var objdeletebookcart = {
//             bookcartId: listid
//         }
//         console.log('obj',objdeletebookcart)
//         const deletebookcart = await db.bookcarts.destroy({
//             where: {
//                 id: objdeletebookcart.bookcartId
//             }
//         })
//         const resAddBill = await billServices.addbill(objbill)
//         // res.send(eResponse._success(resAddBill))
//     }


//     //Send Mail 
//     // var today = new Date();
//     // const sendmail = 
//     //     `<div>  
//     //         <a href="localhost:2021"> Booking Online</a>
//     //         <p> Chao ban </p>
//     //         <h3> Thong tin nhan hang </h3>
//     //         <ul>
//     //             <li> Name: ${req.body.name} </li>
//     //             <li> Email: ${req.body.email} </li>
//     //             <li> Address: ${req.body.address} </li>
//     //             <li> Phone: ${req.body.phonenumber} </li>
//     //             <li> Ngay: ${today} </li>
//     //         <p> Cam? on ban va chuc' ban. mot. ngay tot' lanh </p>
//     //     </div>`
//     //     ;
//     // let transporter = nodemailer.createTransport({
//     //     host: "smtp.gmail.com", // giao thuc smtp gmail
//     //     port: 587, //cong port cua google
//     //     secure: false, // true for 465, false for other ports
//     //     auth: {
//     //         user: 'dottu99@gmail.com', //ten gmail da tao
//     //         pass: 'wsjbyfwrltbeisqj', // mat khau da dao
//     //     },tls: { // giao thuc bao ve du lieu khi di chuyen
//     //             // do not fail on invalid certs
//     //         rejectUnauthorized: false // khong that bai tren chung chi khong hop le
//     //     }
    
//     // });
//     // let info = transporter.sendMail({
//     //     from: '"Don Hang cua ban" ', // sender address
//     //     to: "tudt72@wru.vn", // list gmail
//     //     subject: "Hello ✔", // Subject line
//     //     text: "Hello world?", // plain text body
//     //     html: sendmail, // html body
//     //   });
//     res.redirect('/gio-hang')
//     // res.send(getinfobook)
// }))

//ADD thong tin
router.post('/diachi', catchHandle(async(req,res)=>{
    console.log('reqbody',req.body)
    console.log(req.session)
    const resAdd = await billServices.createAdd(req.body)
    //lay cai vua tao
    const laycaivuatao = await db.addresses.findOne({
        order: [
            ['id', 'desc']
        ],
        limit: 1
    })
    var objuseradd = {
        userId : req.session.userId,
        addressId : laycaivuatao.id
    }
    console.log("objuseradd", objuseradd)
    const resUseradd = await billServices.createUseradd(objuseradd)
    res.redirect('/gio-hang').send(eResponse._success_2(resAdd,resUseradd))
}))

//Thanh toan 
router.post('/thanhtoan', catchHandle(async(req,res)=>{
    var thongtin = {}
    //lay bookId 
    const getbookid = await db.bookcarts.findAll({
        where : {
            userId : req.session.userId
        }
    })
    console.log('aaaaaaaaaaaaaaaaaaaaaa', getbookid)
    if(getbookid){
        for(var i = 0; i< getbookid.length ; i++){
            thongtin = {
                bookId : getbookid[i].bookId,
                soluongdat : getbookid[i].soluongdat,
                addressId : req.body.addressId,
                userId : req.session.userId
            }
            //them san pham vao bill
            const resBill = await billServices.createBill(thongtin)

            // them sann pham vao bang BookUsers
            const crBU = await billServices.crBookUsers(thongtin)
            //them dia chi vao bang usersaddresses
            const crUA = await billServices.crUsersadd(thongtin)
            //luotmuahientai
            const layluotmuahientai = await db.books.findOne({
                where : {
                    id : thongtin.bookId
                }
            })
            console.log('llllllllllllllllllllllllllllllllllllll++++++++++++++', typeof layluotmuahientai.luotmua)
            console.log('ooooooooooooooooooooo', typeof thongtin.soluongdat)
            const Updateluotmua = await db.books.update(
                {
                    luotmua : thongtin.soluongdat + layluotmuahientai.luotmua
                },
                {
                    where : {
                        id : thongtin.bookId
                    }
                }
            )
            console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa : o day', Updateluotmua)
            const deletecart = await db.bookcarts.destroy({
                where : {
                    [Op.and]:{
                        userId : req.session.userId,
                        bookId : thongtin.bookId
                    }
                }
            })
        }
    }
    res.redirect('/gio-hang')
    //create Bill
}))

//Mã giảm giá
router.post('/magiamgia', catchHandle(async(req,res)=>{
    console.log('as',req.body)
    // const checkmagg = await db.magiamgia.findAll({
    //     where :{
    //         status: 'conhan'
    //     }
    // })
    // console.log('vo day', checkmagg)
    var magiamgia = req.body.magiamgia
    // var now = moment().format('MMMM Do YYYY, h:mm:ss a')
    // console.log('now', now)
    const checkmagg = await db.magiamgia.findOne({
        where : {
            magiamgia : magiamgia
            // [Op.and]: {
            //     magiamgia : magiamgia,
            //     [Op.lte]:{
            //         ngayketthuc : now
            //     }
            // }
        }
    })
    var giamgia = checkmagg.sotiengiam
    var sale = checkmagg.sale
    // var timesale = checkmagg.timesale
    // console.log('ngayketthuc', checkmagg.ngayketthuc)
    console.log('magiamgia', checkmagg)
    if(magiamgia == checkmagg.magiamgia){
        req.session.magiamgia = magiamgia
        res.send({giamgia,magiamgia,sale})
    }
    // setTimeout(() => {
    //     c
    // },1000);
}))

//Thong tin donn hang vua dat
router.get('/thongtin-donhang', catchHandle( async (req,res) =>{
    
    // Lay thong tin book
    const getinfobook = await db.books.findAll({
        include: {
            model : db.bills,
            requied: true,
            where : {
                userId : req.session.userId
            }
        },

    })
    //Lay thong tin Address 
    const getaddress = await db.addresses.findAll({
        include : {
            model : db.bills,
            requied : true,
            where : {
                userId : req.session.userId
            }
        }
    })
    // res.send({infobook : getinfobook})
    // res.send({infobook : getinfobook, infoaddress: getaddress})
    res.render('infobill',{infobook : getinfobook, infoaddress: getaddress})
}))

///Thong tin don hang duoc dat
router.get('/donhang', catchHandle(async(req,res)=>{
    //lay ten khach hang dat
    const listkcustom = await db.users.findAll({
        include : {
            model : db.bills,
            requied : true
        }
    })

    //lay san pham duoc dat 
    const listbook = await db.books.findAll({
        include : {
            model : db.bills,
            requied : true
        }
    })

    // lay dia chi nhan hang
    const listaddress = await db.addresses.findAll({
        include : {
            model : db.bills,
            requied : true
        }
    })
}))

//TEst 
router.get('/thongtinsp', catchHandle(async(req,res)=>{
 
    // const abcc = await db.ActorMovies.findAll({
    //     include: {
    //         model : db.Movie,
    //         requied : true,
    //         // include : db.Actor
            
    //     },
    // })
    // var mangmoi =[]
    // for(var i =0 ; i< us.length; i++){

    //     console.log('asaa', us[i])
    //     for(var j = 0 ; j<us[i].bill;j++){
    //         console.log('asaaaa', us[i].bills[j])

    //         if(mangmoi.indexOf(us[i].id) == -1){
    //             mangmoi.push(us[i].bills[j])
    //         }
    //     }
    // }

    const thongtinsp = await db.book_users.findAll({
        attributes : ['id','bookId','userId','soluongdat','status'],
        include: [
            {
                model: db.books,
                requied: true,
                include : {
                    model : db.sales
                }
            },
            {
                model : db.users,
                include : [
                    {
                        // model : db.useraddresses,
                        // as : 'add',
                            model : db.addresses

                    }
                ]
            }
        ]
    })
    // const thongtinsp = await db.books.findAll({
    //     include : [
    //         {
    //             model : db.users,
    //             include : [
    //                 // {
    //                 //     model : db.book_users,
    //                 // },
    //                 {
    //                     model : db.addresses
    //                 }
    //             ]
    //         },
    //         {
    //             model : db.sales
    //         }
    //     ]
    // })
// 

    // var listbill = []
    // var objbill
    // //duyệt mảng 
    // for(var i =0 ; i < )
    // return res.send({infobook:thongtinsp})  
    res.render('infobill',{infobook: thongtinsp})
}))

//thay doi trang thai
router.post('/thaydoitt', catchHandle(async(req,res)=>{
    console.log('=======', req.query)
    console.log('=======', req.body)
    // console.log('=======', req.query)
    // update database
    const thaydoitt = await db.book_users.update(
        {
            status :req.body.status
        },{
            where :{
                id: req.body.id
            }
        }
        )
    res.send('oce')
}))

router.get('/searchthongtinsp', catchHandle(async(req,res)=>{
    console.log('``````````````````````', req.query)
    const search = await billServices.searchttsp(req.query)
    console.log('///////////////', search)
    res.render('searchttsp', {infobook : searchttsp})
}))

//thong tin sản phẩm của bạn 
router.get('/thongtindonhang', catchHandle(async(req, res)=>{
    const getProduct = await db.users.findAll({
        include : [
            {
                model : db.book_users,
                where :{
                    userId : req.session.userId
                },
                required : true,
                include :[
                    {
                        model : db.books,
                        requied: true,

                    }
                ]
            }
        ]
    })
    // return res.send(getProduct)
    res.render('infocart', {infocart: getProduct})
}))
router.get('/hoso', catchHandle(async function(req, res){
    const getProfile = await db.users.findAll({
        where : {
            id : req.session.userId
        },
        include : [
            {
                model : db.addresses,
                requied: true
            }
        ]
    })
    // return res.json(getProfile)
    res.render('infouser', {infouser : getProfile})
}))

///abcccc


export default router
