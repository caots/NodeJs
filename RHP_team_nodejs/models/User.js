const mongoose = require('mongoose')

// Collection: table
//Field: column

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name: {
        type: String
    },
    age: {
        type: String
    },
    email: {
        type: String,
        require: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        require: true
    },
    decks : [{ // realtionship
        type: Schema.Types.ObjectId,
        ref: 'Deck' // ref phai trung ten vs ten Model de nó đi đến model đó để lấy thong tin
    }]
})

const User = mongoose.model('User', UserSchema)
module.exports = User