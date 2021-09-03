import express from 'express'

import * as db from '../../database/models'
import catchHandle from './../../middlewares/catchHandle'
import * as eResponse from './../../config/eResponse'
import userServices from '../../webServices/userServices'
import { phone } from 'faker'
import alert from 'alert'; 
import bcrypt from 'bcrypt'
import { Op } from 'sequelize'

const router = express.Router()

router.get('/logout',(req,res)=>{
    // console.log('aaaaa', req.session)
    console.log('ress',req.session)
    req.session.destroy(function(err){
        return res.status(200).redirect('/login');
    })
})

//LOGIN
router.get('/login',catchHandle( async(req,res)=>{
    console.log(req.body)
    console.log(req.query)
    console.log(req.params)
    console.log(req.session)
    var phone = req.session.phone
    if(req.session.phone){
        const userLogin = await db.users.findOne({
            where :{
                phonenumber : phone
            }
        })
        console.log('suse',userLogin)
        res.render('login',{userLogin})
    }else{
        res.render('login')
    }
    // res.render('login')
}))

router.post('/login',catchHandle( async (req,res)=>{
    console.log(req.body)
    var phone = req.body.phonenumber
    // var password = bcrypt.compare(req.body.password)
    // console.log('password', password)
    // console.log('phone',userLogin[0].phonenumber)

    if(phone){
        
        //Account custom
        const userLogin = await db.users.findOne({
            where : {
                phonenumber : phone,
                role : {
                    [Op.or]:['admin','custom']
                }
            },
        })

        // //Account Admin
        // const userLogin1 = await db.users.findOne({
        //     where : {
        //         phonenumber : phone,
        //         role : 'admin'
        //     },
        // })
        // console.log('userLogin1', userLogin1)
        console.log('userlogin', userLogin)
        var password = await bcrypt.compare(req.body.password, userLogin.password)
        // var passadmin = await bcrypt.compare(req.body.password,userLogin1.password)
        console.log('ok',password)
        if(password === true && userLogin.role === 'custom'){
            req.session.phone = phone
            req.session.password = true
            req.session.userId = userLogin.id
            req.session.name = userLogin.name
            console.log('o dat',req.session)
            
            //them user vao bookcarts
            if(req.session.cartId){
                const themuser = await db.bookcarts.update(
                    {
                        userId : userLogin.id
                    },{
                        where :{
                            cartId : req.session.cartId
                        }
                    }
                ) 
                res.redirect('/gio-hang')
            }
            else{
                res.redirect('/')
            }
            // res.send('oke')
        }
        else{
            if(password === true && userLogin.role === 'admin'){
                req.session.phone == phone
                req.session.password = true
                // req.session.userId == userLogin1.id
                res.redirect('/admin')
            }
            else {
                req.session.phone = phone
                console.log('o day ')
                // alert('tài khoản hoặc mật khẩu không chính xác')
                req.flash('loi','Có lỗi xảy ra')
                res.redirect('/login')
                // res.send('<h2> co loi xay ra </h2>')
            }
        }
    }
    else{
        res.redirect('/login')
    }
}))


//DELETE user
router.get('/deleteuser', catchHandle( async(req, res)=>{
    console.log(req.body)
    console.log(req.query)
    var iduser = req.query.id
    const remove = await db.users.destroy({
        where : {
            id : iduser
        }
    })
    res.send('ok')
}))

//Edit User
router.post('/edituser', catchHandle( async(req, res)=>{
    const Upusers = await userServices.Upuser(req.body)
    res.redirect('/sign-up')
}))


//Search User 
router.get('/searchuser', catchHandle(async(req,res)=>{
    const timkiem = await db.users.findAll({
        where :{
            [Op.or] : {
                name : {
                    [Op.startsWith] : '%'+req.query.search
                },
                phonenumber : {
                    [Op.startsWith] : '%'+req.query.search
                }
            }
        }
    })
    // res.send(timkiem)
    res.render('layout/searchuser', {users: timkiem})
}))


router.get('/socketio', catchHandle(async(req,res) =>{
    res.render('socketio/indexsocket')
}))


///

export default router