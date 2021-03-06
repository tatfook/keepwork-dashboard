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
      title: 'sidebar.sidebarUser',
      icon: 'users'
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
      icon: 'website'
    },
    children: [
      {
        path: 'websiteManage',
        component: () => import('@/views/website/websiteManage/index'),
        name: 'Website Manage',
        resource: 'WebsiteManage',
        meta: {
          title: 'sidebar.website.websiteManagement'
        }
      },
      {
        path: 'websiteSuspend',
        component: () => import('@/views/website/websiteSuspend/index'),
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
      icon: 'sensitiveWords'
    },
    children: [
      {
        path: 'manager',
        component: () => import('@/views/sensitiveWords/index'),
        name: 'Sensitive Words',
        resource: 'SensitiveWords',
        meta: {
          title: 'sidebar.sidebarSensitiveWords',
          icon: 'sensitiveWords'
        }
      }
    ]
  },
  {
    path: '/lesson',
    component: Layout,
    meta: {
      title: 'sidebar.sidebarLesson',
      icon: 'lesson'
    },
    children: [
      {
        path: 'packageTags',
        component: () => import('@/views/lesson/packageTags/index'),
        name: 'PackageTags',
        resource: 'PackageTags',
        meta: {
          title: 'sidebar.lesson.packageTags'
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
        path: 'hotPackages',
        component: () => import('@/views/lesson/hotPackage/index'),
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
        path: 'packageLesson',
        component: () => import('@/views/lesson/packageLesson/index'),
        name: 'packageLesson',
        resource: 'PackageLesson',
        meta: {
          title: 'sidebar.lesson.packageLesson'
        }
      }
    ]
  },
  {
    path: '/projects',
    component: Layout,
    meta: {
      title: 'sidebar.sidebarProjects',
      icon: 'projects'
    },
    children: [
      {
        path: 'projectsManage',
        component: () => import('@/views/projects/projectsManage/index'),
        name: 'Projects Manage',
        resource: 'ProjectsManage',
        meta: {
          title: 'sidebar.projects.ProjectsManage'
        }
      },
      {
        path: 'choiceProjects',
        component: () => import('@/views/projects/choiceProjects/index'),
        name: 'Choice Projects',
        resource: 'ChoiceProjects',
        meta: {
          title: 'sidebar.projects.ChoiceProjects'
        }
      },
      {
        path: 'blockedProjects',
        component: () => import('@/views/projects/blockedProjects/index'),
        name: 'Blocked Projects',
        resource: 'BlockedProjects',
        meta: {
          title: 'sidebar.projects.BlockedProjects'
        }
      },
      {
        path: 'issuesManage',
        component: () => import('@/views/projects/issuesManage/index'),
        name: 'Issues Manage',
        resource: 'IssuesManage',
        meta: {
          title: 'sidebar.projects.IssuesManage'
        }
      },
      {
        path: 'systemTags',
        component: () => import('@/views/projects/systemTags/index'),
        name: 'System Tags',
        resource: 'SystemTags',
        meta: {
          title: 'sidebar.projects.SystemTags'
        }

      },
      {
        path: 'projectsSort',
        component: () => import('@/views/projects/projectsSort/index'),
        name: 'projectsSort',
        meta: {
          title: 'sidebar.projects.ProjectsSort'
        }
      }
    ]
  },
  {
    path: '/NPL',
    component: Layout,
    meta: {
      title: 'sidebar.sidebarNPL',
      icon: 'npl'
    },
    children: [
      {
        path: 'manage',
        component: () => import('@/views/NPL/NPLManage/index'),
        name: 'NPL Manage',
        resource: 'NPLManage',
        meta: {
          title: 'sidebar.NPL.NPLManage'
        }
      },
      {
        path: 'apply',
        component: () => import('@/views/NPL/NPLApply/index'),
        name: 'NPL Apply',
        resource: 'NPLApply',
        meta: {
          title: 'sidebar.NPL.NPLApply'
        }
      },
      {
        path: 'works',
        component: () => import('@/views/NPL/NPLWorks/index'),
        name: 'NPL Works',
        resource: 'NPLWorks',
        meta: {
          title: 'sidebar.NPL.NPLWorks'
        }
      }
    ]
  },
  {
    path: '/org',
    component: Layout,
    resource: 'Organization',
    meta: {
      title: 'sidebar.sidebarOrganization',
      icon: 'org'
    },
    children: [
      {
        path: 'organization',
        component: () => import('@/views/org/organization/index'),
        name: 'Organization Manager',
        resource: 'Organization',
        meta: {
          title: 'sidebar.org.organization'
        }
      },
      {
        path: 'paracraftVisitors',
        component: () => import('@/views/org/paracraftVisitors/index'),
        name: 'paracraftVisitors',
        resource: 'ParacraftVisitors',
        meta: {
          title: 'sidebar.org.paracraftVisitors'
        }
      }
    ]
  },
  {
    path: '/messages',
    component: Layout,
    meta: {
      title: 'sidebar.sidebarMessages',
      icon: 'message'
    },
    children: [{
      path: 'historyMessages',
      component: () => import('@/views/messages/historyMessages'),
      name: 'History Messages',
      meta: {
        title: 'sidebar.messages.historyMessages',
        icon: 'message'
      }
    }]
  },
  {
    path: '/feedback',
    component: Layout,
    meta: {
      title: 'sidebar.feedback',
      icon: 'feedback'
    },
    children: [
      {
        path: 'manage',
        component: () => import('@/views/feedback/index'),
        name: 'Feedback Manage',
        meta: {
          title: 'sidebar.feedbackManage.manage',
          icon: 'feedback'
        }
      }
    ]
  },
  {
    path: '/version',
    component: Layout,
    meta: {
      title: 'sidebar.version',
      icon: 'rocket'
    },
    children: [
      {
        path: 'release',
        component: () => import('@/views/version/index'),
        name: 'Release Version',
        meta: {
          title: 'sidebar.version.release',
          icon: 'rocket'
        }
      }
    ]
  },
  {
    path: '/elementLibrary',
    component: Layout,
    meta: {
      title: '元件库',
      icon: 'element'
    },
    children: [
      {
        path: 'catalogManage',
        component: () => import('@/views/elementLibrary/catalogManage'),
        name: 'Catalog Manage',
        resource: '',
        meta: {
          title: '目录管理'
        }
      },
      {
        path: 'elementManage',
        component: () => import('@/views/elementLibrary/elementManage'),
        name: 'Element Manage',
        resource: 'PBlocks',
        meta: {
          title: '元件管理'
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
