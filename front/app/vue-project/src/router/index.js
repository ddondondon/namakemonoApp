import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/list',
    name: 'list',
    // route level code-splitting
    // this generates a separate chunk (list.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "list" */ '../views/ListView.vue')
  },
  {
    path: '/taskDetail/:itemNumber',
    name: 'taskDetail',
    // route level code-splitting
    // this generates a separate chunk (taskDetail.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "taskDetail" */ '../components/TaskDetail.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
