import { createStore } from 'vuex';
import coaches from '@/store/modules/coaches';

const store = createStore({
  modules: {
    coaches
  },
  state() {
    return {
      userId: 'c3'
    };
  },
  getters: {
    userId(state) {
      return state.userId;
    }
  }
});

export default store;