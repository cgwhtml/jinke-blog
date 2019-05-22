const {origin} = require('../../config')
const {ERROR_logger} = require('../utils/logHelper')

module.exports = function(err,req,res,next){
    const resultData = {
        api:req.originalUrl,
        method:req.method,
        origin,
        result:{
            code:500,
            message:err.message ? err.message : err
        }
    }
    ERROR_logger.info(
        Object.assign(
            JSON.stringify(
                {query:req.query,body:req.body},resultData
            )
        )
    )
    res.status(err.status || 500).send(resultData)
}