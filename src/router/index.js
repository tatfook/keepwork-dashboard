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
    name: 'Dashboard',
    hidden: true,
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index')
      }
    ]
  },

  {
    path: '/',
    component: Layout,
    redirect: '/admin',
    name: 'Admin',
    hidden: true,
    children: [
      {
        path: 'admin',
        component: () => import('@/views/admin/index')
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/user',
    component: Layout,
    meta: {
      title: 'sidebar.siderbarUser',
      icon: 'nested'
    },
    children: [
      {
        path: 'manager',
        component: () => import('@/views/user/manager/index'),
        name: 'User Manager',
        resource: 'User',
        meta: {
          title: 'sidebar.user.userManager'
        }
      },
      {
        path: 'info',
        component: () => import('@/views/user/info/index'),
        name: 'User Info',
        resource: 'UserInfo',
        meta: {
          title: 'sidebar.user.userInfo'
        }
      },
      {
        path: 'blocked_user',
        component: () => import('@/views/user/blocked-user/index'),
        name: 'Blocked User',
        resource: 'BlockedUser',
        meta: {
          title: 'sidebar.user.blockedUser'
        }
      }
    ]
  },
  {
    path: '/website',
    component: Layout,
    meta: {
      title: 'sidebar.sidebarWebsite',
      icon: 'nested'
    },
    children: [
      {
        path: 'website_manage',
        component: () => import('@/views/website/website_manage/index'),
        name: 'Website Suspend',
        resource: 'WebsiteManage',
        meta: {
          title: 'sidebar.website.websiteManagement'
        }
      },
      {
        path: 'website_suspend',
        component: () => import('@/views/website/website_suspend/index'),
        name: 'Website Suspend',
        resource: 'WebsiteSuspend',
        meta: {
          title: 'sidebar.website.suspendManagement'
        }
      }
    ]
  },
  {
    path: '/sensitiveWords',
    component: Layout,
    meta: {
      title: 'sidebar.sidebarSensitiveWords',
      icon: 'nested'
    },
    children: [
      {
        path: 'manager',
        component: () => import('@/views/sensitive-words/index'),
        name: 'Sensitive Words',
        resource: 'SensitiveWords',
        meta: {
          title: 'sidebar.sidebarSensitiveWords',
          icon: 'nested'
        }
      }
    ]
  },
  {
    path: '/lesson',
    component: Layout,
    meta: {
      title: 'sidebar.sidebarLesson',
      icon: 'nested'
    },
    children: [
      {
        path: 'teacher_cdkeys',
        component: () => import('@/views/lesson/teacher_cdkey/index'),
        name: 'Teacher CDKeys',
        resource: 'TeacherCDKey',
        meta: {
          title: 'sidebar.lesson.teacherCDKeys'
        }
      },
      {
        path: 'subjects',
        component: () => import('@/views/lesson/subject/index'),
        name: 'Subjects',
        resource: 'Subject',
        meta: {
          title: 'sidebar.lesson.subjects'
        }
      },
      {
        path: 'skills',
        component: () => import('@/views/lesson/skill/index'),
        name: 'Skills',
        resource: 'Skill',
        meta: {
          title: 'sidebar.lesson.skills'
        }
      },
      {
        path: 'hot_packages',
        component: () => import('@/views/lesson/hot_package/index'),
        name: 'Hot Packages',
        resource: 'HotPackage',
        meta: {
          title: 'sidebar.lesson.hotPackages'
        }
      },
      {
        path: 'packages',
        component: () => import('@/views/lesson/package/index'),
        name: 'Packages',
        resource: 'Package',
        meta: {
          title: 'sidebar.lesson.packages'
        }
      },
      {
        path: 'lessons',
        component: () => import('@/views/lesson/lesson/index'),
        name: 'Lessons',
        resource: 'Lesson',
        meta: {
          title: 'sidebar.lesson.lessons'
        }
      },
      {
        path: 'package_lesson',
        component: () => import('@/views/lesson/package_lesson/index'),
        name: 'packageLesson',
        resource: 'PackageLesson',
        meta: {
          title: 'sidebar.lesson.packageLesson'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
