import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },

  {
    path: '/service',
    component: Layout,
    redirect: '/service/urls',
    name: 'service',
    meta: { title: '信息服务', icon: 'information' },
    children: [
      {
        path: 'urls',
        name: 'Urls',
        component: () => import('@/views/InfoService/ServiceAddress.vue'),
        meta: { title: '服务地址', icon: 'links-fill' }
      },
      {
        path: 'links',
        name: 'Links',
        component: () => import('@/views/InfoService/CommonAddress.vue'),
        meta: { title: '常用链接', icon: 'links-fill' }
      },
      {
        path: 'ipports',
        name: 'Ipports',
        component: () => import('@/views/InfoService/IpPorts.vue'),
        meta: { title: '业务IP及端口', icon: 'host' }
      },
      {
        path: 'boxs',
        name: 'Boxs',
        component: () => import('@/views/tree/index'),
        meta: { title: 'BOX列表', icon: 'box' }
      },
      {
        path: 'others',
        name: 'Others',
        component: () => import('@/views/tree/index'),
        meta: { title: '其他', icon: 'Other' }
      }
    ]
  },

  {
    path: '/release',
    component: Layout,
    redirect: '/release/boxgrouplists',
    name: 'release',
    meta: { title: '版本发布', icon: 'example' },
    children: [
      {
        path: 'boxgrouplists',
        name: 'Boxgrouplists',
        component: () => import('@/views/table/index'),
        meta: { title: 'BOX分组', icon: 'table' }
      },
      {
        path: 'versionlists',
        name: 'Versionlists',
        component: () => import('@/views/table/index'),
        meta: { title: '版本计划', icon: 'table' }
      },
      {
        path: 'htmlorders',
        name: 'Htmlorders',
        component: () => import('@/views/table/index'),
        meta: { title: 'HTML版本', icon: 'table' }
      },
      {
        path: 'boxorders',
        name: 'Boxorders',
        component: () => import('@/views/table/index'),
        meta: { title: 'BOX', icon: 'table' }
      }
    ]

  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },

  {
    path: '/nested',
    component: Layout,
    redirect: '/nested/menu1',
    name: 'Nested',
    meta: {
      title: 'Nested',
      icon: 'nested'
    },
    children: [
      {
        path: 'menu1',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'Menu1',
        meta: { title: 'Menu1' },
        children: [
          {
            path: 'menu1-1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'Menu1-1',
            meta: { title: 'Menu1-1' }
          },
          {
            path: 'menu1-2',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'Menu1-2',
            meta: { title: 'Menu1-2' },
            children: [
              {
                path: 'menu1-2-1',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
                name: 'Menu1-2-1',
                meta: { title: 'Menu1-2-1' }
              },
              {
                path: 'menu1-2-2',
                component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
                name: 'Menu1-2-2',
                meta: { title: 'Menu1-2-2' }
              }
            ]
          },
          {
            path: 'menu1-3',
            component: () => import('@/views/nested/menu1/menu1-3'),
            name: 'Menu1-3',
            meta: { title: 'Menu1-3' }
          }
        ]
      },
      {
        path: 'menu2',
        component: () => import('@/views/nested/menu2/index'),
        meta: { title: 'menu2' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    children: [
      {
        path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
        meta: { title: 'External Link', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
