export default {
  async registerCoach(context, payload) {
    const coachData = {
      firstName: payload.first,
      lastName: payload.last,
      description: payload.desc,
      hourlyRate: payload.rate,
      areas: payload.areas
    };
    const { userId, token } = context.rootGetters;
    const response = await fetch(`https://vue-find-a-coach-d29ea-default-rtdb.europe-west1.firebasedatabase.app/coaches/${userId}.json?auth=${token}`, {
      method: 'PUT',
      body: JSON.stringify(coachData)
    });

    // const responseData = await response.json();

    if (!response.ok) {
      // TODO: Handle error
    }

    context.commit('registerCoach', { ...coachData, id: userId });
  },
  async loadCoaches(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) return;

    const response = await fetch(`https://vue-find-a-coach-d29ea-default-rtdb.europe-west1.firebasedatabase.app/coaches.json`);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch!');
    }

    const coaches = [];

    for (const key in responseData) {
      const coach = {
        id: key,
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        description: responseData[key].description,
        hourlyRate: responseData[key].hourlyRate,
        areas: responseData[key].areas
      };
      coaches.push(coach);
    }
    context.commit('setCoaches', coaches);
    context.commit('setFetchTimestamp');
  }
};
