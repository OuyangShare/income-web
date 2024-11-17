<template>
    <div class="improve-page">
        <div class="header">
            <el-page-header @back="goBack" title="完善商品信息" />
        </div>
        
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="form-container">
            <el-form-item label="商品编号">
                {{ form.pcode }}
            </el-form-item>

            <el-form-item label="商品名称">
                {{ form.name }}
            </el-form-item>

            <el-form-item label="供应商">
                <el-input v-model="form.supplier" />
            </el-form-item>
            <el-form-item label="检测报告" prop="testReport" class="test-report-container">
                <template v-if="form.testReport.length > 0">
                    <div v-for="(item, index) in form.testReport" :key="index" class="image-item">
                        <el-image 
                            :src="item" 
                            class="avatar"
                            :preview-src-list="[item]"
                            fit="cover"
                        />
                        <div class="image-actions">
                            <el-button type="danger" link @click="handleRemoveImage(index)">
                                <el-icon><Delete /></el-icon>
                            </el-button>
                        </div>
                    </div>
                </template>
                <el-upload
                    v-if="form.testReport.length < 2"
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :http-request="uploadFile"
                >
                    <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>

            <el-form-item label="使用说明" prop="instructions">
                <el-input
                    v-model="form.instructions"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入使用说明"
                />
            </el-form-item>

            <el-form-item label="经销商" prop="dealer">
                <el-input
                    v-model="form.dealer"
                    placeholder="请输入经销商信息"
                />
            </el-form-item>

            <el-form-item label="生产商" prop="manufacturer">
                <el-input
                    v-model="form.manufacturer"
                    placeholder="请输入生产商信息"
                />
            </el-form-item>

            <el-form-item label="物流商" prop="logistics">
                <el-input
                    v-model="form.logistics"
                    placeholder="请输入物流商信息"
                />
            </el-form-item>

            <el-form-item label="公司简介" prop="companyProfile">
                <el-input
                    v-model="form.companyProfile"
                    type="textarea"
                    :rows="6"
                    placeholder="请输入公司简介"
                />
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
                <el-button @click="goBack">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { API } from '@/common/api'
import { Plus, Delete } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const form = ref({
    pcode: '',
    name: '',
    supplier: '',
    testReport: [],
    instructions: '',
    dealer: '',
    manufacturer: '',
    logistics: '',
    companyProfile: '',
})

const rules = {
}

const goBack = () => {
    router.back()
}

const handleRemoveImage = (index) => {
    form.value.testReport.splice(index, 1)
}

const uploadFile = async (file) => {
    const res = await API.uploadImage({}, {file: file.file})
    if (res.errcode === 0) {
        const url = res.data;
        form.value.testReport.push(url)
    }    
}

const submitForm = async (formEl) => {
    if (!formEl) return
    
    await formEl.validate(async (valid) => {
        if (valid) {
            const res = await API.addOrUpdateProperty({}, form.value)
            if(res.code === 0) {
                ElMessage.success('保存成功')
                goBack()
            } else {
                ElMessage.error(res.msg || '保存失败')
            }
        }
    })
}

const originObj = ref({});

onMounted(async () => {
    const { pcode } = route.query
    if (pcode) {
        form.value.pcode = pcode
        const res = await API.getDetaInfo({ code: pcode })
        if(res.errcode === 0) {
            const data = res.data || {};
            originObj.value = data;
            form.value = {...form.value, ...data}
            form.value.supplier = data.internetProduction?.[0]?.producername || ''
            form.value.testReport = Array.from(data.internetProduction, x=>x.origincertify);
            form.value.dealer = data?.logisticsinfos?.[0]?.dealername || '';
            form.value.manufacturer = data?.logisticsinfos?.[0]?.cusname || '';
            form.value.logistics = data?.logisticsinfos?.[0]?.logisticsname || '';
            form.value.companyProfile = data?.customs?.[0]?.cuscode || '';
        }
    }
})
</script>

<style lang="scss" scoped>
.improve-page {
    padding: 15px;
    background-color: #ffffff;
    
    .header {
        margin-bottom: 30px;
    }
    
    .form-container {
        max-width: 800px;
    }

    .test-report-container {
        :deep(.el-form-item__content) {
            line-height: normal;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
    }

    .image-item {
        position: relative;
        width: 120px;
        height: 120px;

        &:hover .image-actions {
            display: block;
        }

        .image-actions {
            position: absolute;
            top: 0;
            right: 0;
            display: none;
            background: rgba(0,0,0,0.6);
            border-radius: 0 6px 0 6px;
            
            .el-button {
                padding: 4px 8px;
                color: #fff;
            }
        }
    }

    .avatar-uploader {
        :deep(.el-upload) {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);

            &:hover {
                border-color: var(--el-color-primary);
            }
        }
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        text-align: center;
        line-height: 120px;
    }

    .avatar {
        width: 120px;
        height: 120px;
        display: block;
    }

}
</style>
