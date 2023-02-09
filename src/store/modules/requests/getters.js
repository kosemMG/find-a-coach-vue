export default {
  requests(state, _getters, _rootState, rootGetters) {
    return state.requests.filter(request => request.coachId === rootGetters.userId);
  },
  hasRequests(_state, getters) {
    return getters.requests?.length > 0;
  }
};
