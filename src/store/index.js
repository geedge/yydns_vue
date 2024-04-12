import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import globalAttrs from './modules/globalAttrs'
import range from './modules/range'
import node from './modules/node'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    closeLoading: false
  },
  getters: {
    getCloseLoading: state => state.closeLoading
  },
  mutations: {
    setCloseLoading(state, closeLoading) {
      state.closeLoading = closeLoading
  }
  },
  actions: {
    setCloseLoadingAction(context, closeLoading) {
      context.commit('setCloseLoading', closeLoading)
  }
  },
  modules: {
    globalAttrs,
    range,
    node
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage  // 同localStorage相同，只是将vuex的所有值存储到sessionStorage中
})]
})
