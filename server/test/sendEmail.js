const email = require('../utils/sendEmail')
const expect = require('chai').expect

const test = ()=>{
    email.sendEmail({
        to:"test@qq.com",
        subject: '测试',
        html: "<p>测试</p>"
    })
}
describe('给用户发送邮件测试',()=>{
    it('邮件应该发送成功',()=>{
        expect(test())
    })
})
