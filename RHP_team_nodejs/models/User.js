const mongoose = require('mongoose')

// Collection: table
//Field: column

const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserSchema = new Schema({
    name: {
        type: String,
    },
    age: {
        type: String,
        require: false
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        require: false
    },
    authFacebookID: {
        type: String,
        default: null,
        
    },
    authType: {
        type: String,
        enum: ['local', 'google', 'facebook'],
        default: 'local'
    },
    decks : [{ // realtionship
        type: Schema.Types.ObjectId,
        ref: 'Deck', // ref phai trung ten vs ten Model de nó đi đến model đó để lấy thong tin,
    }]
})

// encrypt password
UserSchema.pre('save', async function(next){ // trước khi save , phải viết normal function vì bên duới có this, viết arrow function thì this lại là chính function đó
    try{
        if(this.authType !== 'local') next()
        // tất cả hảm cảu bcrypt đều là await hết
        // Generate a salt 
        const salt = await bcrypt.genSalt(10)
        //generate passwork hash(salt + hash)
        const passwordHash = await bcrypt.hash(this.password, salt)
        //Re-assign password
        this.password = passwordHash
        next()

    }catch(err){
        next(err)
    }
})

UserSchema.methods.isValidPassword = async function(userPassword){
    try{
        return await bcrypt.compare(userPassword, this.password)
    }catch(err){
        throw new Error(err)
    }
}

const User = mongoose.model('User', UserSchema)
module.exports = User