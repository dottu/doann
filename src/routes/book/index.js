import express from 'express'

import * as db from '../../database/models'
import catchHandle from './../../middlewares/catchHandle'
import * as eResponse from './../../config/eResponse'
import bookServices from '../../webServices/bookServices'
import userServices from '../../webServices/userServices'
import { BOOK_LIMIT } from '../../config/constant'
import checklogin from '../../middlewares/checklogin'
import loaibookServices from './../../webServices/loaibookServices'
import { Op } from 'sequelize'
import alert from 'alert'; 
import multer from 'multer'
import path from 'path'
import { get } from '../../cache'
// import flash from 'express-flash'

const router = express.Router()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
        // console.log('asdasf',cb)
    },
    
})

const upload = multer({storage:storage})
// console.log('upload', upload)

// const storage = multer.diskStorage({
//     destination: function (req,file, cb){
//         cb(null,'./public/uploads/')
//     },
//     filename: function (req,file, cb){
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//     }
// })
// const upload = multer({storage:storage})

router.get('/admin', catchHandle(async (req,res)=>{
    // const resAdd = await bookServices.getjoinloaibook()
    // console.log('abc', resAdd)
    // res.send(eResponse._success(resAdd))
    // res.render('index',resAdd)
    const resAdd = await bookServices.getBook()
    console.log('abc', resAdd)
    // res.send(eResponse._success(resAdd))
    res.render('index')
}))

router.get('/sign-up', catchHandle(async (req,res)=>{
    const getuser = await db.users.findAll({

    })
    console.log('abc', getuser)
    res.render('sign-up',{users:getuser})
    return getuser;
}))

router.post('/sign-up', catchHandle(async (req,res)=>{
    console.log(req.body)

    const getuser = await db.users.findOne({
        where : {
            phonenumber : req.body.phonenumber
        }
    })
    console.log('o day', getuser)
    if(getuser){
        console.log('vao if')
        // var data = {
        //     nameinvalid: 'ten da ton tai'
        // }
        req.flash('loi', "Số điện thoại đã được sử dụng")
        return res.redirect('/sign-up')
    }else{
        const resAdd = await userServices.createUser(req.body)
        if(!resAdd || resAdd.error){
            return res.send(eResponse._errorByHand(!resAdd ? ' System Error' : res.error))
        }
        console.log('vao else')
        return res.redirect('/login').send(eResponse._success(resAdd)) 
    }
}))

// router.get('/table',catchHandle( async (req,res) =>{
//     res.render('table')
// }))



//CREATE BOOK
router.get('/create-book', catchHandle( async (req,res)=>{
    // const getbook = await db.loaibooks.findAndCountAll({
    //     include : {
    //         model : db.books,
    //         requied: true
    //     },
    //     limit : BOOK_LIMIT,
    //     of
    // })
    // const getSale = await db.sales.findAll({
    // })
    const getbook = await bookServices.getbookadmin(req.query.keySearch,req.query.page)
    const getCategory = await db.loaibooks.findAll({

    })
    // const getwarehouse = await db.books.findAll({
    //     include : {
    //         model : db.warehouses,
    //         requied: true
    //     }
    // })
    // res.send({getwarehouse, getbook})
    // console.log('loai', getbook)
    // res.send({listbook:getbook.rows})
    res.render('book',{view:getbook.rows, pages : getbook.pages, a: getbook.current, category: getCategory})
    // return getbook;
}))
router.post('/create-book',upload.single('image'),catchHandle( async (req, res)=>{

    // console.log('abc', req.file)
    console.log(req.body)
    console.log('hahah', req.body.loaibookId)
    req.body.image = req.file.filename
    const getbook = await db.books.findOne({
        where : {
            masp : req.body.masp
        }
    })
    var objbook = {
        loaibookId : req.body.loaibookId,
        masp : req.body.masp,
        image : req.body.image,
        title: req.body.title,
        description : req.body.description,
        author : req.body.author,
        cost: req.body.cost,
        luotmua : 0
    }
    console.log('vao day O',getbook)
    //check ton tai
    if(getbook == null){
        const resAdd = await bookServices.createBook(objbook)
        const listbookId = await db.books.findOne({
            order :
                [['id', 'desc']]
            
        })
        console.log('reswarehouse', listbookId.id)
        var objwarehouse = {
            bookId : String(listbookId.id),
            soluongton : req.body.soluongton
        }
        //Insert warehouse
        const resAddwarehouse = await bookServices.createWarehouse(objwarehouse)
        // console.log('abcbac', resAdd)
        if(!resAdd || resAdd.error){
            return res.send(eResponse._errorByHand(!resAdd ? ' System Error ' : resAdd.error))
        }
        console.log('abj', resAdd)
        // var booksale = {
        //     bookId : listbookId.id,
        //     saleId : req.body.saleId
        // }
        // //Insert booksale
        // const resAddbooksale = await bookServices.createbookSale(booksale)
        res.redirect('/create-book')
    }else{
        // req.flash('loi', 'Mã sản phẩm đã tồn tại')
        alert('Mã sản phẩm đã tồn tại')
        res.redirect('/create-book')
    }

}))

//Delete Book
router.get('/deletebook', catchHandle(async(req,res)=>{
    const remove = await db.books.destroy({
        where :{
            id : req.query.bookid
        }
    })
    res.send(eResponse._success(remove))
}))

//Edit Book
router.post('/editbook',upload.single('image'),catchHandle(async(req,res)=>{
    console.log('upreq', req.body)
    req.body.image = req.file.filename
    const Upbook = await bookServices.Updatebook(req.body,req.body.image)
    res.redirect('/create-book')
}))


//Create Category
router.get('/create-category', catchHandle( async (req,res)=>{
    const getcategory = await db.loaibooks.findAll({
        
    })
    // res.send({infobook:getcategory})
    res.render('categorycreate',{infobook:getcategory})
}))
router.post('/create-category', catchHandle( async (req,res)=>{
    console.log(req.body)
    //check ton tai
    const getcategory = await db.loaibooks.findOne({
        where :{
            namecategory : req.body.namecategory
        }
    })
    if(getcategory == null){
        console.log('vaoday if')
        const resAddCategory = await loaibookServices.createloaiBook(req.body)
        res.redirect('/create-category')
    }else{
        console.log('vao else')
        req.flash('loi', 'Tên thể loại đã tồn tại')
        res.redirect('/create-category')
    }
}))

//DELETE Category
router.get('/deletecategory',catchHandle(async (req,res)=>{
    const remove = await db.loaibooks.destroy({
        where :{
            id : req.query.id
        }
    })
    const removetl = await db.books.destroy({
        where : {
            loaibookId : req.query.id
        }
    })
    res.send(eResponse._success(remove,removetl))
}))

//UpdateCategory
router.post('/editcategory', async(req,res)=>{
    console.log('upcate', req.body)
    const Upcategory = await loaibookServices.Upcategory(req.body)
    res.redirect('/create-category')
})

//DELETE Category
router.get('/deletecategory', async(req, res) =>{
    console.log(req.body)
    console.log(req.query)
    const removecategory = await loaibookServices.destroy({
        where : {
            id : req.query.id
        }
    })
    res.redirect('/create-category')
})

//VIEW
router.get('/',catchHandle(async(req,res)=>{

    console.log('checklogin', req.session.phone)
    console.log(req.body)
    console.log(req.params)
    console.log(req.query)
    console.log(req.session)
    const home = await bookServices.getBook(req.query.keySearch,req.query.page)
    // const abc = await bookServices.searchbook(req.query.search)
    // console.log('ahasd', {abc:home})
        //Search products 
    // return res.send(home)
    console.log(home.count)
    var c = home.count -1
    var a = Number(home.current)
    console.log('a',a)
    // res.send(home)
    // var arr = []
    // for(var i =0; i <home.rows.length; i++){
    //     arr.push(home.rows[i].id)
    // }
    // console.log("aarr", arr)
    // res.send({book:home.rows,page: home.pages,a})
    //lay gio hang 
    if(!req.session.userId && !req.session.cartId){
        console.log('asdddddddddddddddddddddddddddddddddddd')
        var getsumcart = 0;
        // //update Users vao bookcarts
        // const themUsers = await 
        // return res.redirect('/gio-hang')
        const getdanhmuc = await db.loaibooks.findAll({
            // 
        })
        var tenngdung = 'Tài khoản'
        res.render('view',{book:home.rows,page: home.pages,a,c,soluonggio:getsumcart, danhmuc : getdanhmuc, ten : tenngdung})
    }else{
        // if(!req.session.cartId){
        //     var getsumcart = 0
        //     console.log('//////////////////////////o day')
        //     const getdanhmuc = await db.loaibooks.findAll({
        //         // 
        //     })
        //     var tenngdung = req.session.name
        //     res.render('view',{book:home.rows,page: home.pages,a,soluonggio:getsumcart, danhmuc : getdanhmuc, ten: tenngdung})
        // }
        // else{
            //co cart
            if(!req.session.userId){
                console.log('<><<<<<<<<<<<<<<<<<<<<<<<<<<<<dcm')
                const getsumcart = await db.bookcarts.findAll({
                    where :{
                        cartId: req.session.cartId
                    }
                })
                const getdanhmuc = await db.loaibooks.findAll({
                    // 
                })
                var tenngdung = 'Tài khoản'
                res.render('view',{book:home.rows,page: home.pages,a,c,soluonggio:getsumcart, danhmuc : getdanhmuc, ten: tenngdung})
            }else{
                if(req.session.userId && !req.session.cartId){
                    const getsumcart = await db.bookcarts.findAll({
                        where : {
                            [Op.and] :{
                                userId : req.session.userId,
                                // cartId : req.session.cartId
                            }
                        }
                    })
                    console.log('-----------------------------getsumcart---------------dmcm', getsumcart)
                    const getdanhmuc = await db.loaibooks.findAll({})
                    var tenngdung = req.session.name
                    res.render('view',{book:home.rows,page: home.pages,a,c,soluonggio:getsumcart, danhmuc : getdanhmuc, ten: tenngdung})
                }
                else{
                    const getsumcart = await db.bookcarts.findAll({
                        where : {
                            [Op.and] :{
                                userId : req.session.userId,
                                cartId : req.session.cartId
                            }
                        }
                    })
                    console.log('-----------------------------getsumcart-------sadmSD', getsumcart)
                    const getdanhmuc = await db.loaibooks.findAll({
                        // 
                    })
                    var tenngdung = req.session.name
                    res.render('view',{book:home.rows,page: home.pages,a,c,soluonggio:getsumcart, danhmuc : getdanhmuc,ten: tenngdung})
                }
            }
        // } 
    }

    // var tong = 0;

    // // Loi khi dung for
    // // for(var i = 0; i <= getsumcart.length; i++){
    // //     console.log('Tongsoluong',getsumcart[i].soluongdat)
    // //     tong = tong + getsumcart[i].soluongdat
    // //     console.log('tong', tong) 
    // // }

    // //check mang
    // if(getsumcart == null){
    //     return false
    // }else {
    //     getsumcart.forEach(element => {
    //         console.log('Tongsoluong', element.soluongdat)
    //         tong = tong + element.soluongdat
    //     });
    // }
    // setTimeout(() => {
        // console.log('tongngoaifor', tong)
        // res.send({getsumcart, tong})
    
    // console.log('-----------------------------getsumcart======', getsumcart)
    //Lay danh muc

    // res.send({book:home.rows,page: home.pages,a,soluonggio:getsumcart})
    // }, 1000);
    // res.render('view',{book:home.rows,page: home.pages,a,tongsoluong : getsumcart})
}))

router.get('/thong-tin-book/:bookid', catchHandle( async (req,res)=>{
    req.session.bookid = req.params.bookid
    console.log(req.session) 
    const getsale = await db.sales.findOne({
        where :{
            bookId : req.params.bookid
        }
    })

    const getinfo = await bookServices.getinfobook(req.params.bookid)
    const getsluong = await db.bookcarts.findAll({
    })
    const listcomment = await db.books.findAll({
        include: [
            {
                model : db.users,
                include : [
                    {
                        model : db.comment_books,
                        as : 'commentuser',
                        where : {
                            status : 1,
                            bookId : req.params.bookid
                        },
                        // include : [
                        //     {
                        //         model: db.likes,
                        //         requied : true,
                        //         group : ['commentId'],
                        //     }
                        // ],
                    }
                ]
            },
            {
                model : db.warehouses
            }
        ],
        where :{
            id : req.params.bookid
        }
    })
    //lấy số lượng tồn 
    // var soluong
    // for(var i=0; i < listcomment.length; i++ ){
    //     for( var j =0; j < listcomment[i].warehouses.length; j++){
    //         if(listcomment[i].warehouses[j].soluongton == 0){
    //             soluong = listcomment[i].warehouses[j].soluongton
    //         }
    //     }
    // }

    // console.log()
    // return res.send(listcomment)
    if(!req.session.userId && !req.session.cartId){
            var getsumcart = 0
        var tenngdung = 'Tài khoản'
        // else{
            const getdanhmuc = await db.loaibooks.findAll({})
            res.render('infobook',{infobook:getinfo,sale : getsale,soluonggio: getsumcart,danhmuc : getdanhmuc, ten: tenngdung, comment : listcomment})
        // }

    }
    else{
        if(!req.session.userId){
            console.log('------vaoday----if 1')
            const getsumcart = await db.bookcarts.findAll({
                where :{
                    cartId: req.session.cartId
                }
            })
            var tenngdung = req.session.name
            const getdanhmuc = await db.loaibooks.findAll({})
            res.render('infobook',{infobook:getinfo,sale : getsale,soluonggio: getsumcart,danhmuc : getdanhmuc, ten : tenngdung, comment : listcomment})
        }
        else{
            if(req.session.userId && !req.session.cartId){
                console.log('///////////////////////asdddddddddddd')
                const getsumcart = await db.bookcarts.findAll({
                    where :{
                        userId : req.session.userId,
                        // cartId: req.session.cartId
                    }
                })
                var tenngdung = req.session.name
                const getdanhmuc = await db.loaibooks.findAll({})
                res.render('infobook',{infobook:getinfo,sale : getsale,soluonggio: getsumcart,danhmuc : getdanhmuc, ten:tenngdung, comment : listcomment})
            }else{
                console.log('......................vaoday else 1...')
                const getsumcart = await db.bookcarts.findAll({
                    where :{
                        userId : req.session.userId,
                        cartId: req.session.cartId
                    }
                })
                const getdanhmuc = await db.loaibooks.findAll({})
                var tenngdung = req.session.name
                res.render('infobook',{infobook:getinfo,sale : getsale,soluonggio: getsumcart,danhmuc : getdanhmuc, ten: tenngdung, comment : listcomment})
            }
            // console.log('......................vaoday else 1...')
            // const getsumcart = await db.bookcarts.findAll({
            //     where :{
            //         userId : req.session.userId,
            //         cartId: req.session.cartId
            //     }
            // })
            // const getdanhmuc = await db.loaibooks.findAll({})
            // res.render('infobook',{infobook:getinfo,sale : getsale,soluonggio: getsumcart,danhmuc : getdanhmuc})
        }
    }

}))


///BÌNH Luân SẢN PHẨM 


router.post('/binhluan', catchHandle(async(req,res)=>{
    console.log('======', req.body)
    console.log('++++++', req.params)
    console.log('-----', req.query)
    console.log('-----******', req.session)

    var objcomment = {
        noidung : req.body.noidung,
        luotthich : 0,
        bookId : Number(req.session.bookid),
        userId : req.session.userId
    }

    const incm = await bookServices.comment(objcomment)
    // const list = await db.comment_books.findAll({
    //     where :{
    //         [Op.and]:{
    //             bookId : req.session.bookid,
    //             userId : req.session.userId
    //         }
    //     }
    // })
    // const abcc = await db.books.findAll({
    //     include : [
    //         {
    //             model :db.users,
    //             attributes : ['id','name'],
    //             include :[
    //                 {
    //                     model: db.comment_books,
    //                     as : 'commentuser',
    //                     where : {
    //                         status : 1
    //                     }
    //                 }
    //             ] 
    //         },
    //     ],
    //     where : {
    //         id : req.session.bookid
    //     }
    // })
    

    //Lấy id vừa tạo trong comment_books

    // const getdesccm_book = await db.comment_books.findOne({
    //     order :[
    //         ['id', 'desc']
    //     ], limit :1
    // })
    // //
    // var objlike  = {
    //     commentId : getdesccm_book.id,
    //     userId : req.session.userId,
    //     luotthich : 0
    // }
    // const crlike = await db.likes.create(objlike)
    res.send('Oce')
}))




//Search 
router.get('/search', catchHandle (async (req,res)=>{
    const getdanhmuc = await db.loaibooks.findAll({})
    console.log(req.query)
    const home = await bookServices.searchbook(req.query)
    var a = Number(home.current)
    var b = req.query.q
    // console.log('a',a)
    // res.send({home})

    res.render('viewsearch',{book:home.rows,page : home.pages,a,b, danhmuc : getdanhmuc})
}))
//Search giathap
router.get('/gia', catchHandle(async(req,res)=>{
    console.log(req.query)
    if(req.query.a == 'giathap'){
        const getdanhmuc = await db.loaibooks.findAll({})
        const home = await bookServices.searchCost(req.query,req.query.page)
        console.log('home', home.page)
        res.render('viewgiathap', {book:home.rows,page : home.page, danhmuc : getdanhmuc})
    }else{
        const getdanhmuc = await db.loaibooks.findAll({})
        const home = await bookServices.searchCost(req.query,req.query.page)
        res.render('viewgiacao', {book:home.rows,page : home.page, danhmuc : getdanhmuc})
    }
    // console.log('hokme', home)
    // res.send({home : home.rows})
}))

//test OK

// router.get('/test', catchHandle(async(req,res)=>{
//     // function primeArray(arr){
//     //     var arr = [1,3,5,7]
//     //     for(var i =0; i <arr.length; i++){
//     //         if(arr[i] == 1){
//     //             return primeArray = false
//     //         }
//     //         else{
//     //             return primeArray = true
//     //         }
//     //     }
//     // }
//     // console.log(primeArray())
// }))

router.get('/danhmuc/:slug', catchHandle(async(req,res) =>{
    //lay slug 
    console.log(req.query)
    console.log(req.params)
    const listtheloai = await loaibookServices.getSlug(req.params.slug,req.query.page)
    const listdanhmuc = await db.loaibooks.findOne({
        where : {
            slug : req.params.slug
        }
    })
    const getdanhmuc = await db.loaibooks.findAll({})
    // res.send(listtheloai)
    // console.log('is', listtheloai.books)
    res.render('danhmuc', {list : listtheloai.rows, danhmuc : getdanhmuc, page: listtheloai.page, current : listtheloai.current, listdanhmuc})
}))

//Update Trang thai'
router.post('/trangthai',catchHandle(async(req,res)=>{
    //
    console.log('raas', req.body)
    console.log('raas', req.params)
    console.log('raas', req.query)
    const resUpstatus = await db.books.update(
        {
            status: req.body.status
        },
        {
            where :{
                id : req.body.id
            }
        }
    )
    res.send('Oce')
}))

//Comment 
router.get('/test', catchHandle(async(req,res)=>{
    //c
    // const test = await db.users.findAll({
    //     include : [
    //         {
    //         model : db.books,
    //         // as: 'kaka',
    //         requied: true,
    //         // model : db.useraddresses
    //         },
    //     ]
    // })
    // var a = [{a: 'int'}, {b: 'cac'}]
    // var ush = []
    // for (var i = 0 ; i < a.length; i++){
    //     ush.push(a[i])
    // }
    // console.log('aaaaaa',ush)
    // res.send('of')
    // const abc = await db.books.findAll({
    //     include : [
    //         {
    //             model : db.users,
    //             // attributes : ['id', 'bookId', 'userId','status' ,'soluongdat'],
    //             include : [
    //                 {
    //                     model : db.comment_books,
    //                     required : true,
                        
    //                 },
    //                 // {
    //                 //     model : db.addresses,
    //                 //     require: true
    //                 // }
    //             ]
    //         },
    //         {
    //             model : db.sales
    //         }
    //     ]
    // })
    // let a = []
    // const abc = await db.users.findAll({
    //     include : {
    //         model : db.comment_books
    //     },
    //     where : {
    //         role : 'custom'
    //     }
    // })
    // const ab = await db.books.findAll({
    //     include : {
    //         model : db.users,
    //         where : {
    //             role : 'custom'
    //         }
    //     }
    // })
    // let listuserbook = []
    // for (let index = 0; index <=ab.length; index++) {
    //         console.log('------a-',ab[index])
    //     for (let q = 0;q < ab[index].users.length; q++) {
    //         listuserbook.push([q])
    //     }
    // }
    // ab =JSON.parse(JSON.stringify(ab))
    // console.log('--------------0', ab)
    // ab.forEach(element => {
    //   console.log('===â', element.books)  
    // });
    // console.log('=====', listuserbook)

    // for(i = 0 ; i <= abc.length;i++){
    //     for(j=0; j <= ab.length; j++){
    //         if()
    //     }
    // }
    const abcc = await db.books.findAll({
        include : [
            {
                model :db.users,
                attributes : ['id','name'],
                include :[
                    {
                        model: db.comment_books,
                        as : 'commentuser',
                        where : {
                            status : '1'
                        }
                    }
                ] 
            },
            // {
            //     model : db.comment_books,
            //     as : 'commentbook'
            // }
        ],
    })
    return res.send({comment :abcc})
}))



export default router