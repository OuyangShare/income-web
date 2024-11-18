<template>
    <el-container class="layout-container">
        <el-aside :width="isCollapse ? '64px' : '200px'" class="aside">
            <div class="logo">
                <h2 v-show="!isCollapse">后台管理系统</h2>
                <h2 v-show="isCollapse">管理</h2>
            </div>
            <el-menu
                :default-active="$route.path"
                class="el-menu-vertical"
                background-color="#304156"
                text-color="#fff"
                active-text-color="#409EFF"
                router
                :collapse="isCollapse"
            >
                <el-menu-item index="/">
                    <el-icon><House /></el-icon>
                    <span>首页</span>
                </el-menu-item>
                
                <el-menu-item index="/web/commodity">
                    <el-icon><Goods /></el-icon>
                    <span>商品管理</span>
                </el-menu-item>

                <el-menu-item v-if="userInfo.isadmin" index="/user">
                    <el-icon><User /></el-icon>
                    <span>用户管理</span>
                </el-menu-item>
            </el-menu>
        </el-aside>
        
        <el-container>
            <el-header class="header">
                <div class="header-left">
                    <el-icon class="collapse-btn" @click="isCollapse = !isCollapse">
                        <Fold v-if="!isCollapse"/>
                        <Expand v-else/>
                    </el-icon>
                    <el-breadcrumb separator="/" class="breadcrumb">
                        <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index" :to="item.path">
                            {{ item.title }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="header-right">
                    <el-dropdown>
                        <span class="user-info">
                            {{ userInfo.username || '未知人员' }} <el-icon><ArrowDown /></el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </div>
            </el-header>
            
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { House, Goods, Fold, Expand, ArrowDown, User } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const isCollapse = ref(false)

const userInfo = computed(() => {
    return JSON.parse(localStorage.getItem('userInfo') || '{}')
})

const breadcrumbList = computed(() => {
    const matched = route.matched
    const result = []
    
    matched.forEach(item => {
        if (item.meta && item.meta.title) {
            result.push({
                title: item.meta.title,
                path: item.path
            })
        }
    })
    
    return result
})

const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
    router.push('/login')
}
</script>

<style lang="scss" scoped>
.layout-container {
    height: 100vh;
    
    .aside {
        background-color: #304156;
        transition: width 0.3s;
        
        .logo {
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            
            h2 {
                color: #fff;
                margin: 0;
                font-size: 18px;
                white-space: nowrap;
            }
        }
        
        .el-menu {
            border-right: none;
        }
    }
    
    .header {
        background-color: #fff;
        border-bottom: 1px solid #dcdfe6;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        
        .header-left {
            display: flex;
            align-items: center;
        }
        
        .collapse-btn {
            font-size: 20px;
            cursor: pointer;
            margin-right: 20px;
        }
        
        .breadcrumb {
            margin-left: 10px;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            cursor: pointer;
            
            .el-icon {
                margin-left: 5px;
            }
        }
    }
    
    .el-main {
        background-color: #f0f2f5;
        padding: 20px;
    }
}
</style>
