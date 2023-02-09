export default {
  coaches(state) {
    return state.coaches;
  },
  hasCoaches(state) {
    return state.coaches?.length > 0;
  },
  isCoach(_state, getters, _rootState, rootGetters) {
    const coaches = getters.coaches;
    const userId = rootGetters.userId;
    return coaches.some(coach => coach.id === userId);
  },
  shouldUpdate(state) {
    if (!state.lastFetch) return true;
    const currentTimestamp = new Date().getTime();
    return (currentTimestamp - state.lastFetch) / 1000 > 60;
  }
};
