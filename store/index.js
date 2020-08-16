const cookieparser = process.server ? require('cookieparser') : undefined

// 在服务端渲染期间运行的都是同一个实例
// 为了防止数据冲突, 务必要把 state 定义成一个函数, 返回数据对象
export const state = () => {
  return {
    // 当前用户登录状态
    user: null
  }
}

export const mutations = {
  setUser (state, data) {
    state.user = data
  }
}

export const actions = {
  // nuxtSeverInit 是一个特殊的 action 方法
  // 其会且仅在服务端渲染期间自动调用
  // 作用初始化容器数据, 传递数据给客户端使用
  nuxtServerInit ({ commit }, { req }) {
    let user = null
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie)
      try {
        user = JSON.parse(parsed.user)
      } catch (error) {
        // no valid cookie found
      }
    }

    commit('setUser', user)
  }
}