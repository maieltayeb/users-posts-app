const {validationResult} = require('express-validator');
require('express-async-errors');
const CustomError = require('../helpers/customError')
module.exports = (...validationChecks) => async (req, re, next) => {

    await Promise.all(
        validationChecks.map(
            check => check.run(req)
        )
    );
    const {errors} = validationResult(req);
    if (!errors.length) {
        return next();
    }
    //console.log(errors);
    throw CustomError( 422,`validation error`, errors)

}