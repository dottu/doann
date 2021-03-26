import _ from  'lodash'

import { userRequestCheck } from '../config/constant'
import { Op } from 'sequelize'
import * as db from '../database/models'
import * as cache from '../cache'
import { xoaDau , removeTagHtml, removeJsScript} from '../utilities/stringHelpers'
import { Router } from 'express'
import bcrypt, { hash } from 'bcrypt'
const cacheTime = 3600

//Sign-Up
const createUser = async(data)=>{
    console.log(" data user", data)
    const getUser = await db.users.findOne({
        where :{
            phonenumber: data.phonenumber
        }
    })
    console.log("getuser", getUser)
    //check phonenumber ton tai khong
    if(getUser == null){
        bcrypt.hash(data.password, 10, async(err, hash)=>{
            console.log('security', hash)
            if(err) return err
            console.log('qua if')
            await db.users.create({
                name : data.name,
                phonenumber : data.phonenumber,
                password : hash
            })
        })
        return true
    }
    else{
        return false
    }
    // if(!data.phonenumber){
    //     return { error : userRequestCheck.phonenumber}
    // }
    // data.phonenumber = removeTagHtml(data.phonenumber)
    // if(!data.password){
    //     return { error : userRequestCheck.password}
    // }
    // data.password = removeTagHtml(data.password)

    // if(!data.confirmpassword && data.password!=data.confirmpassword ){
    //     return { error : userRequestCheck.confrimpassword}
    // }
    // data.confirmpassword = removeTagHtml(data.confirmpassword)

    // // console.log('aav',data)
    // return await db.users.create(data)
}

//Edit Users
const Upuser = async(data) =>{
    console.log('userdata', data)
    return await db.users.update({
        phonenumber: data.phonenumber,
        password : data.password,
        confirmpassword: data.confirmpassword,
        role : data.role
    },{
        where:{
            id: data.id
        }
    })
}


export default {
    createUser,
    // loginUser,
    Upuser
}