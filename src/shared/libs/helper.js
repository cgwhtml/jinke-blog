/*
 * @Author: jinke.li 
 * @Date: 2017-07-17 19:42:21 
 * @Last Modified by:   jinke.li 
 * @Last Modified time: 2017-07-17 19:42:21 
 */
import obj2Query from "libs/params"
import Message from "shared/components/Message"
import NProgress from "nprogress"
import { host, port } from "../../../config"
const mode = process.env.NODE_ENV || "DEV"
import "nprogress/nprogress.css"

const helper = {
  resCode: {
    "SUCCESS": 200,
    "ERROR": 500,
    "TIMEOUT": 503
  },
  jsonToString(params) {
    return obj2Query.toQueryString(params)
  },
  //获取当前时间
  getCurrentTime() {
    const date = new Date(),
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      h = date.getHours(),
      m = date.getMinutes(),
      s = date.getSeconds(),
      hh = h < 10 ? `0${h}` : h,
      mm = m < 10 ? `0${m}` : m,
      ss = s < 10 ? `0${s}` : s

    return `${year}/${month}/${day} ${hh}:${mm}:${ss}`
  },

  /**
   * get 请求
   * params {url} String 请求地址 支持跨域
   * parmas {params} obj 请求参数 
   */

  async getJson(url, params) {
    NProgress.start()
    const data = await (
      fetch(`${host}${port}/api${url}${params ? '?' + (this.jsonToString(params)) : ''}`, {
        method: "GET",
        mode: "cors",
      })
    )
    return this.sendResponse(data)
  },

  /**
   * post 请求
   * params {url} String 请求地址 支持跨域
   * parmas {params} obj 请求参数 
   * parmas {isForm} boolean 是否是表单提交 表单提交 如:formData 
   */

  async postJson(url, params, isForm = false) {
    const fetchConfig = {
      method: "POST",
      mode: "cors",
      body: isForm ? params : JSON.stringify(params)
    }
    const data = (await
      fetch(`${host}${port}/api${url}`, fetchConfig)
    )
    return this.sendResponse(data)
  },
  removeProgress() {
    NProgress.done()
    NProgress.remove()
  },
  //全局处理错误
  sendResponse(data) {
    const { status } = data
    switch (status) {
      case this.resCode['SUCCESS']:
        this.removeProgress()
        return data.json()
      case this.resCode['ERROR']:
        this.removeProgress()
        return Message.error('接口请求失败! :(')
      case this.resCode['TIMEOUT']:
        this.removeProgress()
        return Message.error('哦豁,请求超时!')
      default:
        this.removeProgress()
        return data.json()
    }
  }
}
export default helper