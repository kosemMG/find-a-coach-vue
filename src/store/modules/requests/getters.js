export default {
  requests(state, _getters, _rootState, rootGetters) {
    return state.requests.filter(request => request.id === rootGetters.userId);
  },
  hasRequests(_state, getters) {
    return getters.requests?.length > 0;
  }
};
