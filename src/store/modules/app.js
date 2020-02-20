const app = {
  state: {
    showLoading: true,
  },
  mutations: {
    SET_SHOWLOADING: (state, value) => {
      state.showLoading = value
    },
  },
  actions: {
    setShowLoading({ commit }, value) {
      commit('SET_SHOWLOADING', value)
    },
  },
}

export default app
