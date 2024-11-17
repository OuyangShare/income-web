<template>
    <div class="info-page">
        <div class="header">
            <el-page-header @back="goBack" title="商品详情" />
        </div>
        <div class="info-container">
            <el-descriptions :column="1">
                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">商品编号</strong>
                    </template>
                    {{ info?.pcode || '暂无' }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">商品名称</strong>
                    </template>
                    {{ info?.name || '暂无' }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">商品简介</strong>
                    </template>
                    {{ info?.storagemethod || '暂无' }}
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">商品图片</strong>
                    </template>
                    <el-image
                        v-for="item in info?.bannerList"
                        :key="item.id"
                        :src="item.bannerimage"
                        :preview-src-list="[item.bannerimage]"
                        fit="cover"
                        class="product-image"
                        style="width: 120px; height: 120px;margin-right: 10px;"
                    />
                </el-descriptions-item>
                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">供应商</strong>
                    </template>
                    {{ info?.internetProduction?.[0]?.producername || '暂无' }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">检测报告</strong>
                    </template>
                    <el-image
                        v-for="item in info?.internetProduction"
                        :key="item.id"
                        :src="item.origincertify"
                        :preview-src-list="[item.origincertify]"
                        v-show="item.origincertify"
                        fit="cover"
                        class="report-image"
                        style="width: 120px; height: 120px;margin-right: 10px;"
                    />
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">使用说明</strong>
                    </template>
                    <span>{{ info?.instructions?.userName }}：</span>
                    <span v-for="(item, index) in info?.instructions?.userStep" :key="index">
                        <span v-for="(e, idx) in item" :key="idx">{{ e }}</span>
                    </span>
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">经销商</strong>
                    </template>
                    {{ info?.logisticsinfos?.[0]?.dealername || '暂无' }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">生产商</strong>
                    </template>
                    {{ info?.logisticsinfos?.[0]?.cusname || '暂无' }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">物流商</strong>
                    </template>
                    {{ info?.logisticsinfos?.[0]?.logisticsname || '暂无' }}
                </el-descriptions-item>

                <el-descriptions-item>
                    <template #label>
                        <strong style="color: #000">公司简介</strong>
                    </template>
                    {{ info?.customs?.[0]?.cuscode || '暂无' }}
                </el-descriptions-item>
            </el-descriptions>
        </div>
    </div>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { API } from '@/common/api'

const router = useRouter()
const route = useRoute()
const info = ref({
    pcode: '',
    name: '',
})

const goBack = () => {
    router.back()
}

onMounted(async () => {
    const { pcode } = route.query
    if (pcode) {
        const res = await API.getDetaInfo({ code: pcode })
        if (res.errcode === 0) {
            info.value = res.data
        } else {
            ElMessage.error(res.errmsg || '获取商品详情失败')
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
        width: 100%;
    }

    .report-image {
        width: 100px;
        height: 100px;
        cursor: pointer;
    }
}
</style>
