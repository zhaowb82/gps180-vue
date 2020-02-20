const Main = () => import('@/views/Layouts/Main')

const routes = [{
    path: '/',
    redirect: '/map',
    component: Main,
    children: [{
      path: 'map',
      name: 'Map',
      component: () => import('@/views/Map')
    }, {
      path: '/system',
      redirect: '/system/menu',
      component: () => import('@/views/System'),
      children: [{
          path: 'deviceType',
          name: 'deviceType',
          component: () => import('@/views/System/DeviceType')
        },
        {
          path: 'deviceCommand',
          name: 'deviceCommand',
          component: () => import('@/views/System/DeviceCommand')
        },
        {
          path: 'carType',
          name: 'carType',
          component: () => import('@/views/System/CarType')
        },
        {
          path: 'role',
          name: 'role',
          component: () => import('@/views/System/Role')
        },
        {
          path: 'menu',
          name: 'menu',
          component: () => import('@/views/System/Menu')
        },
        {
          path: 'schedule',
          name: 'schedule',
          component: () => import('@/views/System/Schedule')
        },
        {
          path: 'log',
          name: 'log',
          component: () => import('@/views/System/Log')
        },
        {
          path: 'jt809',
          name: 'jt809',
          component: () => import('@/views/System/Jt809')
        },
        {
          path: 'sql',
          name: 'sql',
          component: () => import('@/views/System/Sql')
        },
        {
          path: 'api',
          name: 'api',
          component: () => import('@/views/System/Api')
        },
        {
          path: 'codegen',
          name: 'codeGenerator',
          component: () => import('@/views/System/CodeGen')
        },
        {
          path: 'riskPos',
          name: 'riskPos',
          component: () => import('@/views/System/RiskPos')
        }
      ]
    }, {
      path: '/manage',
      redirect: '/manage/dept',
      component: () => import('@/views/Manage'),
      children: [{
          path: 'dept',
          name: 'dept',
          component: () => import('@/views/Manage/Dept')
        },
        {
          path: 'user',
          name: 'systemUser',
          component: () => import('@/views/Manage/User')
        },
        {
          path: 'devices',
          name: 'devices',
          component: () => import('@/views/Manage/Devices')
        },
        {
          path: 'groups',
          name: 'groups',
          component: () => import('@/views/Manage/Groups')
        },
        {
          path: 'sim',
          name: 'sim',
          component: () => import('@/views/Manage/Sim')
        },
        {
          path: 'audrecs',
          name: 'audrecs',
          component: () => import('@/views/Manage/AudRecs')
        }
      ]
    }, {
      path: '/report',
      redirect: '/report/travel',
      component: () => import('@/views/Report'),
      children: [{
          path: 'travel',
          name: 'travel',
          component: () => import('@/views/Report/Travel')
        },
        {
          path: 'alarms',
          name: 'alarms',
          component: () => import('@/views/Report/Alarms')
        }
      ]
    }]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login'),
  }
]

export default routes
