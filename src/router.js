import { createRouter, createWebHistory } from 'vue-router';
import CoachesList from '@/pages/coaches/CoachesList.vue';
import store from '@/store';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/coaches' },
    { path: '/coaches', component: CoachesList },
    {
      path: '/coaches/:id',
      component: () => import('./pages/coaches/CoachDetails.vue'),
      props: true,
      children: [
        {
          path: 'contact',
          component: import('./pages/requests/ContactCoach.vue')
        }
      ]
    },
    {
      path: '/register',
      component: () => import('./pages/coaches/CoachRegistration.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/requests',
      component: import('./pages/requests/RequestsReceived.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/auth',
      component: import('./pages/auth/UserAuth.vue'),
      meta: { requiresUnauth: true }
    },
    {
      path: '/:notFound(.*)',
      component: import('./pages/NotFound.vue')
    }
  ]
});

router.beforeEach((to, _from, next) => {
  if (to.meta['requiresAuth'] && !store.getters.isAuthenticated) {
    next('/auth?redirect=' + to.path);
  } else if (to.meta['requiresUnauth'] && store.getters.isAuthenticated) {
    next('/coaches');
  } else {
    next();
  }
});

export default router;
