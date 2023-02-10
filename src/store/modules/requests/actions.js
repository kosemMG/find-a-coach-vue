export default {
  async contactCoach(context, payload) {
    const { coachId, email, message } = payload;
    const request = { coachId, email, message };
    const response = await fetch(`https://vue-find-a-coach-d29ea-default-rtdb.europe-west1.firebasedatabase.app/requests/${coachId}.json`, {
      method: 'POST',
      body: JSON.stringify(request)
    });
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to send request');
    }

    request.id = responseData.name;
    request.coachId = coachId;

    context.commit('addRequest', request);
  },
  async fetchRequests(context) {
    const { userId, token } = context.rootGetters;
    const response = await fetch(`https://vue-find-a-coach-d29ea-default-rtdb.europe-west1.firebasedatabase.app/requests/${userId}.json?auth=${token}`);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to fetch requests');
    }

    const requests = [];

    for (const key in responseData) {
      const request = {
        id: key,
        coachId: userId,
        email: responseData[key].email,
        message: responseData[key].message
      };
      requests.push(request);
    }
    context.commit('setRequests', requests);
  }
};
