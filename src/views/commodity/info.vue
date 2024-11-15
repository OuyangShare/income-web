<template>
    <div class="info-page">
        <div class="header">
            <el-page-header @back="goBack" title="商品详情" />
        </div>

        <div class="info-container">
            <el-descriptions :column="1">
                <el-descriptions-item label="商品编号">
                    {{ info.pcode }}
                </el-descriptions-item>
                
                <el-descriptions-item label="商品名称">
                    {{ info.name }}
                </el-descriptions-item>

                <el-descriptions-item label="供应商">
                    {{ info.supplier }}
                </el-descriptions-item>

                <el-descriptions-item label="检测报告">
                    <el-image 
                        v-if="info.testReport"
                        :src="info.testReport"
                        :preview-src-list="[info.testReport]"
                        fit="cover"
                        class="report-image"
                    />
                    <span v-else>暂无</span>
                </el-descriptions-item>

                <el-descriptions-item label="使用说明">
                    {{ info.instructions || '暂无' }}
                </el-descriptions-item>

                <el-descriptions-item label="经销商">
                    {{ info.dealer || '暂无' }}
                </el-descriptions-item>

                <el-descriptions-item label="生产商">
                    {{ info.manufacturer || '暂无' }}
                </el-descriptions-item>

                <el-descriptions-item label="物流商">
                    {{ info.logistics || '暂无' }}
                </el-descriptions-item>

                <el-descriptions-item label="公司简介">
                    {{ info.companyProfile || '暂无' }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { API } from '@/common/api'

const router = useRouter()
const route = useRoute()
const info = ref({
    pcode: '',
    name: '',
    supplier: '',
    testReport: '',
    instructions: '',
    dealer: '',
    manufacturer: '',
    logistics: '',
    companyProfile: ''
})

const goBack = () => {
    router.back()
}

onMounted(async () => {
    const { pcode } = route.query
    if (pcode) {
        // 调用获取商品详情接口
        const res = await API.getDetaInfo({ code: pcode })
        if(res.code === 0) {
            info.value = res.data
        } else {
            ElMessage.error(res.msg || '获取商品详情失败')
        }
    }
})
</script>

<style lang="scss" scoped>
.info-page {
    padding: 15px;
    background-color: #ffffff;
    
    .header {
        margin-bottom: 30px;
    }
    
    .info-container {
        max-width: 800px;
    }

    .report-image {
        width: 100px;
        height: 100px;
        cursor: pointer;
    }
}
</style>
