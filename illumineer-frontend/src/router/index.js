import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/TestPage.vue'
import SearchResult from '../views/SearchResult.vue'
import UserInfo from '../views/UserInfo.vue'
import AccountInfo from '../views/user/AccountInfo.vue';
import FavoritePapers from '../views/user/FavoritePapers.vue';
import DownloadHistory from '@/views/user/DownloadHistory.vue';
import Chart from '@/views/user/chartPage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('../views/HelpPage.vue')
  },
  {
    path: '/advancedSearch',
    name: 'advancedSearch',
    component: () => import('../views/AdvancedSearch.vue')
  },
  {
    path: '/TestPage',
    name: 'TestPage',
    component: () => import("../views/TestPage.vue")
  },
  {
    path: '/TestComponent',
    name: 'TestComponent',
    component: () => import("../views/TestComponent.vue")
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/UserLogin.vue')
  },
  {
    path: '/chart',
    name: 'chart',
    component: () => import('../views/chart.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/UserRegister.vue')
  },
  {
    path: '/article/:id',
    name: 'article',
    component: () => import('../views/ArticleOverview.vue')
  },
  {
    path: '/searchResult',
    name: 'searchResult',
    component: SearchResult
  },
  {
    path: '/userInfo/:id',
    name: 'UserInfo',
    component: UserInfo, // 使用合并后的组件
    redirect: '/userInfo/:id/accountInfo',
    children: [
      {
        path: 'accountInfo',
        name: 'AccountInfo',
        component: AccountInfo,
      },
      {
        path: 'favoritePapers',
        name: 'FavoritePapers',
        component: FavoritePapers,
      },
      {
        path: 'downloadHistory',
        name: 'DownloadHistory',
        component: DownloadHistory,
      },
      {
        path: 'chart',
        name: 'chart',
        component: Chart,
      }
    ]
  },
  {
    path: '/scholarInfo/:id',
    name: 'scholarInfo',
    component: () => import('../views/ScholarInfo.vue'),  // 主布局
    redirect: '/scholarInfo/:id/scholarHome',
    children: [
      {
        path: 'scholarHome',
        name: 'scholarHome',
        component: () => import('../views/scholar/ScholarHome.vue')
      },
      {
        path: 'authenticationInfo',
        name: 'authenticationInfo',
        component: () => import('../views/scholar/AuthenticationInfo.vue')
      },
      {
        path: 'achievementClaim',
        name: 'achievementClaim',
        component: () => import('../views/scholar/AchievementClaim.vue')
      },
      {
        path: 'TestUpload',
        name: 'TestUpload',
        component: () => import("../views/TestPop.vue")
      },
    ]
  },
  {
    path: '/adminInfo',
    name: 'adminInfo',
    component: () => import('../views/admin/AdminHome.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
