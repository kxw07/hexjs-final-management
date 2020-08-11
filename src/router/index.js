import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue')
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import(/* webpackChunkName: "about" */ '../views/admin/Dashboard.vue'),
    children: [
      {
        path: 'products',
        name: 'Products',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/Products.vue')
      },
      {
        path: 'coupons',
        name: 'Coupons',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/Coupons.vue')
      },
      {
        path: 'orders',
        name: 'Orders',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/Orders.vue')
      },
      {
        path: 'pictures',
        name: 'Pictures',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/Pictures.vue')
      },
      {
        path: 'logout',
        name: 'Logout',
        component: () => import(/* webpackChunkName: "about" */ '../views/admin/Logout.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
