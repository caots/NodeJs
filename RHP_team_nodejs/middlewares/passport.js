const passport = require('passport')

// JWT là 1 cách thức của passport
const JWTStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy

const {ExtractJwt} = require('passport-jwt')

const {JWT_SECRET} = require('../config/index')
const User = require('../models/User')

// giai ma token
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'), // lay token tu header Authorization
    secretOrKey: JWT_SECRET
}, async (payload, done)=>{
    try{
        const user = await User.findById(payload.sub)
        if(!user) return done(null, false) // chằng may k lueu được user mà vẫn trả về token

        done(null, user)

    }catch(err){
        done(err, false)
    }
}))

// Passport local // ma hoa matkhau
passport.use(new LocalStrategy({
    usernameField: 'email' // ten truong pahi giong trong db
}, async (email, password, done) => {
    try{

        const user = await User.findOne({email})

        if(!user) return done(null, false)

        // so sanh password (chua ma hoa) user nhap vs password trong db
        const isCorrectPass = await user.isValidPassword(password)

        if(!isCorrectPass) return done(null, false)
        
        done(null, user) // send data to req.user

    }catch(err){
        done(err, false)
    }

}))