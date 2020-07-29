const passport = require('passport')

// JWT là 1 cách thức của passport
const JWTStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy

const {ExtractJwt} = require('passport-jwt')

const {JWT_SECRET, auth} = require('../config/index')
const User = require('../models/User')

const FacebookTokenStrategy = require('passport-facebook-token')

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


// Passport Facebook
passport.use(
    new FacebookTokenStrategy(
      {
        clientID: auth.facebook.CLIENT_ID,
        clientSecret: auth.facebook.CLIENT_SECRET,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // check whether this current user exists in our database
          const user = await User.findOne({
            authFacebookID: profile.id,
            authType: "facebook",
          });
  
          if (user) return done(null, user)
  
          // If new accounts
          const newUser = new User({
            authType: 'facebook',
            authFacebookID: profile.id,
            email: profile.emails[0].value ,
            name: profile.name.givenName,
            //lastName: profile.name.familyName
          })

          await newUser.save()
          
          done(null, newUser)
        } catch (error) {
          done(error, false);
        }
      }
    )
  );

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