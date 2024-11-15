
<template>
    <div class="edit-page">
        <div class="header">
            <el-page-header @back="goBack" :title="isEdit ? '编辑商品' : '新增商品'" />
        </div>
        
        <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" class="form-container">
            <el-form-item label="商品名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入商品名称" />
            </el-form-item>
            
            <el-form-item label="商品建议零售价" prop="price">
                <el-input-number 
                    v-model="form.price"
                    :precision="2"
                    :step="0.1"
                    :min="0"
                    placeholder="请输入商品价格"
                />
            </el-form-item>
            
            <el-form-item label="商品简介" prop="description">
                <el-input
                    v-model="form.description"
                    type="textarea"
                    rows="4"
                    placeholder="请输入商品简介"
                />
            </el-form-item>
            
            <el-form-item label="商品图片">
                <el-upload
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :before-upload="beforeAvatarUpload"
                >
                    <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
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
import { Plus } from '@element-plus/icons-vue'
import { API } from '@/common/api'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const isEdit = ref(false)
const form = ref({
    name: '',
    price: 0,
    description: '',
    imageUrl: ''
})

const rules = {
    name: [
        { required: true, message: '请输入商品名称', trigger: 'blur' },
        { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
    ],
    price: [
        { required: true, message: '请输入商品价格', trigger: 'blur' }
    ]
}

const goBack = () => {
    router.back()
}

const beforeAvatarUpload = (file) => {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG && !isPNG) {
        ElMessage.error('上传头像图片只能是 JPG/PNG 格式!')
        return false
    }
    if (!isLt2M) {
        ElMessage.error('上传头像图片大小不能超过 2MB!')
        return false
    }
    return true
}

const submitForm = async (formEl) => {
    if (!formEl) return
    
    await formEl.validate((valid) => {
        if (valid) {
            ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
            goBack()
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
.edit-page {
    padding: 15px;
    background-color: #ffffff;
    .header {
        margin-bottom: 30px;
    }
    
    .form-container {
        max-width: 800px;
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
