function add (x,y){
    return x + y
}

const expect = require('chai').expect     //断言库

describe('加法函数的测试',()=>{
    it('1加1应该等于2',()=>{
        expect(add(1,1)).to.be.equal(2)        //to.be.equal 指定预期的结果
    })
})