import VueRouter, { RouteConfig } from 'vue-router'
import Store from '../vuex/store'
import Home from '../views/Home.vue'
import tenantManage from '../modules/tenant/tenantManage.vue'
// 首页 租户列表
import tenantHome from '../modules/tenant/tenantHome.vue'
// 知识查询
import homeQuery from '../modules/homeQuery/index.vue'

// 知识应用
import homeGraphAnalysis from '../modules/knowledgeApply/homeGraphAnalysis/index.vue' // 图谱分析

// 知识地图
import homeMap from '../modules/homeMap/index.vue'
// 个人中心
import homeUser from '../modules/homeUser/index.vue'

import projectMember from '../modules/projectMember/index.vue'
import roleManagement from '../modules/roleManagement/index.vue'
// 用户组管理
import userGroupManagement from '../modules/userGroupList/index.vue'
// 文档处理
import homeAnnotation from '../modules/fileManage/homeAnnotation.vue' // 知识标注
import fileManage from '../modules/fileManage/filesManage.vue' // 文档管理

import { authorition } from '../utils/authorition'
import { getMenuResource } from '../common/index'

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        redirect: '/home/tenantHome', // 默认跳转租户列表页面
        beforeEnter: async (to, from, next) => {
            // 检查是否登录
            if (!authorition()){
               return
            }

            if (Store.getters.resourceGroup && Store.getters.resourceGroup.length){
                return next()
            }
            
            try {
                await getMenuResource()
            } catch (error) {
                console.log(error);
            }
            
            next();
        },
        children: [
            {
                path: '/home/tenantHome', // 租户列表
                component: tenantHome
            },
            {
                path: '/home/tenantManage', // 租户管理
                component: tenantManage
            }, 

    // 文档管理

            {
                path: '/home/fileManage', // 文档处理 -》 文档管理
                component: fileManage
            },
            {
                path: '/home/callout',
                component: homeAnnotation // 文档处理 -》 知识标注
            },
    // 知识查询
            {
                path: '/home/query', // 知识查询
                component: homeQuery
            },
    // 知识应用
            // {
            //     path: '/home/graphAnalysis', // 知识应用 -》 图谱分析
            //     component: homeGraphAnalysis
            // },

            {
                path: '/home/map', // 知识地图
                component: homeMap
            },
            {
                path: '/home/user', // 个人中心
                component: homeUser
            },
            {
                path: '/home/projectMember', // 成员管理
                component: projectMember
            },
            {
                path: '/home/roleManagement', // 权限管理 -》 角色管理
                component: roleManagement
            },
            {
                path: '/home/userGroupManagement', // 用户组管理
                component: userGroupManagement
            },
        ]
    },
    {
        path: "/login",
        name: "login",
        component: () => import("@/views/Login.vue")
    },

]

const router = new VueRouter({
  // mode: 'history',
    routes
})

export default router
