const expect = require('chai').expect 
const request = require("request")
const { host, port }  = require("../../config")

describe('获取文章列表',()=>{
    it('应该查询成功',()=>{
        request(`${host}${port}/api/article/lists`,(err,res,body)=>{
            if(!err && res.statusCode == 200){
                done()
            }
        })
    })
})