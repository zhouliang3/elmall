import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if fasle ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('error/404'), hidden: true },
  { path: '/401', component: _import('error/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: _import('dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/supplier',
    component: Layout,
    redirect: 'noredirect',
    name: 'supplier',
    meta: {
      title: '采购管理',
      icon: 'chart'
    },
    alwaysShow: true,
    children: [
      { path: 'list', component: _import('supplier/supplierList'), name: 'supplierList', meta: { title: '供应商', noCache: true }}
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    name: 'sysManage',
    meta: {
      title: '系统管理',
      icon: 'chart'
    },
    alwaysShow: true,
    children: [
      { path: 'admin', component: _import('sys/admin'), name: 'admin', meta: { title: '管理员', noCache: true }}
    ]
  },
  {
    path: '/baseconfig',
    component: Layout,
    redirect: 'noredirect',
    name: 'baseconfig',
    meta: {
      title: '基础配置管理',
      icon: 'chart'
    },
    alwaysShow: true,
    children: [
      { path: 'materialType', component: _import('baseconfig/materialType'), name: 'materialType', meta: { title: '物料类型', noCache: true }},
      { path: 'warehouse', component: _import('baseconfig/warehouse'), name: 'warehouse', meta: { title: '仓库', noCache: true }},
      { path: 'unit', component: _import('baseconfig/unit'), name: 'unit', meta: { title: '计量单位', noCache: true }}
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
