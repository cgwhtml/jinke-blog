module.exports = function(req, res, next) {
    if(req.originalUrl.indexOf('/api/music') !== -1) return next()
    
    let postData = ""
    req.on('data', (data) => {
        postData += data
    })
    req.on('end', () => {
        postData = postData && JSON.parse(postData)
        req.body =  Object.assign(req.body,postData)
        next()
    })
}