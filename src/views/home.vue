<template>
    <div class="home-page">
        <div class="welcome-section">
            <h1>欢迎使用后台管理系统</h1>
            <p>当前时间: {{ currentTime }}</p>
        </div>
        <img src="@/assets/bg.jpg" class="bg-img" alt="">
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const currentTime = ref(new Date().toLocaleString())
const timer = setInterval(() => {
    currentTime.value = new Date().toLocaleString()
}, 1000)

onUnmounted(() => {
    clearInterval(timer)
})
</script>

<style lang="scss" scoped>
.home-page {
    padding: 20px;

    .welcome-section {
        margin-bottom: 30px;
        // text-align: center;

        h1 {
            font-size: 24px;
            color: #303133;
            margin-bottom: 10px;
        }
        p {
            color: #909399;
        }
    }

    .bg-img {
        width: 900px;
        height: auto;
        margin-bottom: 20px;
    }
}
</style>