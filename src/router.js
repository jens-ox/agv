import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/reingold-tilford',
      name: 'ReingoldTilford',
      component: () => import(/* webpackChunkName: "ReingoldTilford" */ './views/ReingoldTilford.vue')
    },
    {
      path: '/hv-layout',
      name: 'HVLayout',
      component: () => import(/* webpackChunkName: "HVLayout" */ './views/HVLayout.vue')
    }
  ]
})
