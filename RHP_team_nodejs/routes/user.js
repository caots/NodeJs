const express = require('express')
//const router = express.Router()

const router = require('express-promise-router')() // có lỗi thì tự động ném sang hàm xử lý lỗi
const {
    validateParams, validateBody, schemas, signup, signin, secret
} = require('../helpers/routerHelper')


const userController = require('./../controllers/user')
const user = require('./../controllers/user')


router.route('/')
    .get(userController.getAllUser)
    .post(validateBody(schemas.userSchema) ,userController.newUser)

router.route('/signup').post(validateBody(schemas.authSignupSchema), userController.signup)

router.route('/signin').post(validateBody(schemas.authSigninSchema),userController.signin)

router.route('/secret').get(userController.secret)

router.route('/:userId')
    .get(validateParams(schemas.idSchema, 'userId') ,userController.getUserById)
    .put(userController.updateUser)
    .patch(userController.replaceUser)

router.route('./:userId/decks')
    .get(userController.getUserDecks)
    .post(userController.newUserDecks)

module.exports = router