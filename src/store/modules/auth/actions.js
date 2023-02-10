let timer;

export default {
  async login(context, payload) {
    return context.dispatch('auth', { ...payload, mode: 'login' });
  },
  async signup(context, payload) {
    return context.dispatch('auth', { ...payload, mode: 'signup' });
  },
  async auth(context, payload) {
    const { email, password, mode } = payload;
    const url = mode === 'login'
      ? 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCd-ZM2OgW0kEfrUXd5-Ze6cRu-ognlfyc'
      : 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCd-ZM2OgW0kEfrUXd5-Ze6cRu-ognlfyc';

    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email, password, returnSecureToken: true })
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Failed to authenticate.');
    }

    const { idToken: token, localId: userId, expiresIn: tokenExpiration } = responseData;

    const expiresIn = +tokenExpiration * 1000;
    const expirationDate = new Date().getTime() + expiresIn;

    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('tokenExpiration', expirationDate.toString());

    timer = setTimeout(() => context.dispatch('autoLogout'), expiresIn);

    context.commit('setUser', { token, userId });
  },
  autoLogin(context) {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const tokenExpiration = localStorage.getItem('tokenExpiration');

    if (token && userId && tokenExpiration) {
      const expiresIn = +tokenExpiration - new Date().getTime();
      if (expiresIn < 0) return;
      timer = setTimeout(() => context.dispatch('autoLogout'), expiresIn);
      context.commit('setUser', { token, userId });
    }
  },
  logout(context) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('tokenExpiration');

    clearTimeout(timer);

    context.commit('setUser', { token: null, userId: null });
  },
  autoLogout(context) {
    context.dispatch('logout');
    context.commit('setAutoLogout');
  }
};
