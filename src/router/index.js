import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/lesson',
    component: Layout,
    meta: {
      title: 'Lesson',
      icon: 'nested'
    },
    children: [
      {
        path: 'teacher_cdkeys',
        component: () => import('@/views/lesson/teacher_cdkey/index'),
        name: 'Teacher CDKeys',
        resource: 'TeacherCDKey',
        meta: { title: 'Teacher CDKeys' }
      },
      {
        path: 'subjects',
        component: () => import('@/views/lesson/subject/index'),
        name: 'Subjects',
        resource: 'Subject',
        meta: { title: 'Subjects' }
      },
      {
        path: 'skills',
        component: () => import('@/views/lesson/skill/index'),
        name: 'Skills',
        resource: 'Skill',
        meta: { title: 'Skills' }
      },
      {
        path: 'packages',
        component: () => import('@/views/lesson/package/index'),
        name: 'Packages',
        resource: 'Package',
        meta: { title: 'Packages' }
      },
      {
        path: 'lessons',
        component: () => import('@/views/lesson/lesson/index'),
        name: 'Lessons',
        resource: 'Lesson',
        meta: { title: 'Lessons' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
