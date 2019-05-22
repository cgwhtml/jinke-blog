module.exports = {
    /**
     * 
     * @param {req} Object  
     */
    getFetchData(req) {
        let res = ""
        res.on('data', (data) => {
            res += data
        })
        res.on('end', async () => {
            res = await res.toString()
        })

        return res
    },
    /**
     * 
     * @param {req} Object       获取客户端ip 
     */
     getClientIp(req) {
        return req.headers['x-forwarded-for'] ||          //是否有反向代理
        req.connection.remoteAddress ||                   //客户端ip
        req.socket.remoteAddress ||                       //socket ip
        req.connection.socket.remoteAddress;
    }
}