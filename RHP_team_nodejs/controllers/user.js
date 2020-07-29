/*
+ interact with mongo in 3 ways
    .Callback (er, payload ) =>{}
    .Promises
    .Async/Await (Promises nhung xu ly tot hon)
*/

const User = require('../models/User')

const Deck = require('./../models/Deck')

const JWT = require('jsonwebtoken')

const {JWT_SECRET} = require('../config/index')

//encode token
const encodedToken = (userId) =>{
    return JWT.sign({
        iss: 'Cao Tran',
        sub: userId,
        iat: new Date().getTime(),
        exp : new Date().setDate(new Date().getDate() + 3) // life time
    }, JWT_SECRET) // secret public key
}


// Callback function
/**
const getAllUser = (req, res, next) =>{
    // callback way
    User.find({
        // điều kiện
    }, (err, payload) =>{
        if(err){
            next(err) // chuyen den function hứng lỗi
        }
        return res.status(200).json({payload})
    })
}

const newUser = (req, res, next) =>{
    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    }

    const newUser = new User(req.body)

    newUser.save((err, payload) =>{
        if(err){
            next(err) // chuyen den function hứng lỗi
        }
        return res.status(201).json({payload}) // create in 201
    })

} 
*/

// Promises way
/*
 const getAllUser = (req, res, next) =>{
    User.find({}).then((payload) =>{
        res.status(200).json({payload})
    }).catch((err =>{
        next(err)
    }))
}

const newUser = (req, res, next) =>{

    if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
    }
    const newUser = new User(req.body)

    newUser.save().then(payload =>{
        res.status(201).json({payload})
    }).catch(err =>{s
        next(err)
    })

}
*/

//auth facebook
const authFacebook = async (req, res, next) => {
    // Assign a token
     const token = encodedToken(req.user._id)
    //console.log('request: ',req);
     res.setHeader('Authorization', token)
     return res.status(200).json({ success: true })
  }

// async - await : bản chất vẫn là promise nhưng nó xử lý tốt hơn, multi thread, viết dễ hơn, code clean hơn
const getAllUser = async (req, res, next) => {
    const users = await User.find({})
    //throw new Error () // next(err) => express-promise-router
    return res.status(200).json({
        users
    })
}

const getUserById = async (req, res, next) => {

    let {userId} = req.value.params

    const user = await User.findById({_id: userId})
    return res.status(200).json({
        user
    })
}

// Decks
const getUserDecks = async (req, res, next) => {
    let {
        userId
    } = req.params
    let user = await User.findById(userId).populate('decks') // decks: trường mà mình muốn join
    return res.status(200).json({
        decks: user.decks
    })
}


const updateUser = async (req, res, next) => {
    // update 1-n field
    const {
        userId
    } = req.params
    const newUser = req.body
    const result = await User.findByIdAndUpdate(userId, newUser)
    return res.status(200).json({
        success: true
    })
}

const replaceUser = async (req, res, next) => {
    // replace all
    const {
        userId
    } = req.params
    const newUser = req.body
    const result = await User.findByIdAndUpdate(userId, newUser)
    return res.status(200).json({
        success: true
    })
}


const newUser = async (req, res, next) => {
    //try{
    const newUser = new User(req.value.body)
    await newUser.save()
    return res.status(201).json({
        user: newUser
    })
    // }catch(err){
    //   next(err)
    //}
}
//Decks
const newUserDecks = async (req, res, next) => {
    const {
        userId
    } = req.params

    const newDeck = new Deck(req.body)

    const user = await User.findById(userId)

    //assign user as a deck's owner
    newDeck.owner = user

    //save Deck
    await newDeck.save()

    // add deck to user deck array 'decks'
    //push id thôi k là bị call stack vì deck quá lơns
    user.decks.push(newDeck._id)

    // save user
    await user.save()

    return res.status(201).json({
        deck: newDeck
    })
}

//authentication signup
const signup = async (req, res, next) => {
    const {name, age, email, password} = req.value.body

    const foundUser = await User.findOne({email})
    if(foundUser){
        return res.status(403).json({
            error: {
                message: 'email is already in use'
            }
        })
    } else{
        //create a new user
        let newUser = new User({name, age, email, password})
        newUser.save()

        //token 
        const token = encodedToken(newUser._id)
        res.setHeader('Authorization', token)
        return res.status(201).json({
            success: true,
        })
    }
}

const signin = async (req, res, next) => {
   // req.user : info user

    const token = encodedToken(req.user._id)
    res.setHeader('Authorization', token)
    return res.status(200).json({
        success: true
    })
}

const secret = async (req, res, next) => {
    return res.status(200).json({
        resources: true
    })
}

module.exports = {
    getAllUser,
    newUser,
    getUserById,
    updateUser,
    replaceUser,
    getUserDecks,
    newUserDecks,
    signup,
    signin,
    secret,
    authFacebook
}