import axios from 'axios'

export const request = axios.create({
  baseURL: 'https://conduit.productionready.io/'
})

// 通过插件机制获取上下文请求对象 (query, params, req, res, app, store)
// 插件导出必须作为 default 成员
export default ({ store }) => {
  request.interceptors.request.use(config => {
    const { user } = store.state
    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }
    return config
  }, error => {
    // 请求失败(此时还未发出去)
    return Promise.reject(error)
  })
}