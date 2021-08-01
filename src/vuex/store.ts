import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import systemManage from './modules/systemManage'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    systemManage
  },
  state,
  getters
})

export default store
