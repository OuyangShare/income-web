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

            <el-form-item label="检测报告" prop="testReport">
                <el-upload
                    class="upload-demo"
                    action="#"
                    :http-request="uploadTestReport"
                    :limit="2"
                    :show-file-list="true"
                    accept="image/*"
                    list-type="picture-card"
                >
                    <el-icon><Plus /></el-icon>
                    <template #tip>
                        <div class="el-upload__tip">
                            只能上传jpg/png格式图片,最多上传2张
                        </div>
                    </template>
                </el-upload>
            </el-form-item>

            <el-form-item label="使用说明" prop="instructions">
                <el-input
                    v-model="form.instructions"
                    type="textarea"
                    rows="4"
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
                    rows="4"
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
import { Plus } from '@element-plus/icons-vue'
const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const form = ref({
    pcode: '',
    name: '',
    testReport: '',
    instructions: '',
    dealer: '',
    manufacturer: '',
    logistics: '',
    circulationInfo: '',
    companyProfile: ''
})

const rules = {
}

const goBack = () => {
    router.back()
}

const uploadTestReport = async (params) => {
    // 这里处理文件上传逻辑
    const formData = new FormData()
    formData.append('file', params.file)
    // const res = await API.uploadFile(formData)
    // if(res.code === 0) {
    //     form.value.testReport = res.data.url
    //     ElMessage.success('上传成功')
    // }
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

onMounted(async () => {
    const { pcode } = route.query
    if (pcode) {
        form.value.pcode = pcode
        // 这里可以调用获取商品详情的接口
        const res = await API.getDetaInfo({ code: pcode })
        console.log(res)
        if(res.code === 0) {
            form.value = {...form.value, ...res.data}
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
}
</style>
