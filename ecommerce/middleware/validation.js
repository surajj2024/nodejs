const Joi = require("joi");
const AppError = require("../AppError");

module.exports = (req, res, next) => {
    const userSchema = Joi.object({
        fullName: Joi.string().required(),
        email: Joi.string().required().email({
            minDomainSegments: 2,
            tlds:
            {
                allow: ['com', 'net']
            }
        }),
        gender: Joi.string().required().max(1).valid('M', 'F', 'm', 'f'),
        phone: Joi.number().required().min(1000000000).max(9999999999),
        password: Joi.string().min(3).max(15).required().label('Password'),
        confirmPassword: Joi.any().equal(Joi.ref('password'))
            .required()
            .label('Confirm password')
            .options({ messages: { 'any.only': '{{#label}} does not match' } })
    })

    const { error } = userSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next();
    }
}
