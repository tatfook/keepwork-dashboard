import { login } from '@/api/login'
import { getToken, getAdminInfo, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.id = id
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    async Login({ commit, dispatch }, userInfo) {
      const username = userInfo.username.trim()
      const data = await login(username, userInfo.password)
      setToken(data.token)
      commit('SET_TOKEN', data.token)
      commit('SET_ID', data.id)
      commit('SET_NAME', data.username)
      commit('SET_AVATAR', data.portrait)
    },

    // 获取用户信息
    async GetInfo({ commit }) {
      const adminInfo = await getAdminInfo()

      if (typeof adminInfo !== 'object') {
        return false
      }

      const roles = []

      if (adminInfo.roleId === 0) {
        roles.push('admin')
        commit('SET_ROLES', roles)
      }

      if (adminInfo.roleId === 1) {
        roles.push('market')
        commit('SET_ROLES', roles)
      }

      commit('SET_ID', adminInfo.id)
      commit('SET_NAME', adminInfo.username)
      // commit('SET_AVATAR', adminInfo.portrait)
      return roles
    },

    // 登出
    LogOut({ commit }) {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
    },

    // 前端 登出
    FedLogOut({ commit }) {
      commit('SET_TOKEN', '')
      removeToken()
    }
  }
}

export default user
