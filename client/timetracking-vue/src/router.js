import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/sign-in',
      name: 'sign-in',
      // route level code-splitting
      // this generates a separate chunk (sign-in.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "sign-in" */ './views/sign-in.vue'),
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      // route level code-splitting
      // this generates a separate chunk (sign-up.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "sign-up" */ './views/sign-up.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // route level code-splitting
      // this generates a separate chunk (dashboard.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "dashboard" */ './views/dashboard.vue'),
    },
    {
      path: '/reports',
      name: 'reports',
      // route level code-splitting
      // this generates a separate chunk (reports.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "reports" */ './views/reports.vue'),
    },
  ],
});
