const Joi = require('@hapi/joi')

// xay dung nhu 1 Middlewares
const validateParams = (schema, name) => { // điều kiện, tên validator(userId,...)
    return (req, res, next) => {
        const validatorResult = schema.validate({
            param: req.params[name]
        })
        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error)
        } else {
            // tạo nơi chứa cho giá trị được validate
            if (!req.value) req.value = {}
            if (!req.value['params']) req.value.params = {}
            // gans giá trị params vào req.value.params
            req.value.params[name] = req.params[name]
            next()
        }
    }
}

const validateBody = (schema) => {
    return (req, res, next) => {
        const validatorResult = schema.validate(req.body)

        if (validatorResult.error) {
            return res.status(400).json(validatorResult.error)
        } else {
            // tạo nơi chứa cho giá trị được validate
            if (!req.value) req.value = {}
            if (!req.value['body']) req.value.body = {}
            req.value.body = validatorResult.value
            next()
        }
    }
}

const schemas = {
    authSignupSchema: Joi.object().keys({
        name: Joi.string().min(2).required(),
        age: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),

    authSigninSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),


    userSchema: Joi.object().keys({
        name: Joi.string().min(2).required(),
        age: Joi.number()
            .integer()
            .min(1)
            .max(100)
            .required()
    }),
    userOptionalSchema: Joi.object().keys({ // update user
        name: Joi.string().min(2),
        age: Joi.number()
            .integer()
            .min(1)
            .max(100)
    }),

    idSchema: Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
    }),
}

module.exports = {
    validateParams,
    validateBody,
    schemas
}