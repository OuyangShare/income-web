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

            <el-form-item label="商品简介" prop="storagemethod">
                <el-input
                    v-model="form.storagemethod"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入商品简介"
                />
            </el-form-item>

            <el-form-item label="商品图片" prop="bannerList" class="banner-item">
                <template v-if="form.bannerList.length > 0">
                    <div v-for="(item, index) in form.bannerList" :key="item.id" class="image-item">
                        <el-image 
                            :src="item.bannerimage" 
                            class="avatar"
                            :preview-src-list="[item.bannerimage]"
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
                    v-if="form.bannerList.length < 5"
                    class="avatar-uploader"
                    action="#"
                    :show-file-list="false"
                    :http-request="uploadFile"
                    :before-upload="beforeAvatarUpload"
                >
                    <el-icon class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm(formRef)">保存</el-button>
                <el-button @click="goBack">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { API } from '@/common/api'

const router = useRouter()
const route = useRoute()
const formRef = ref(null)

const isEdit = ref(false)
const form = ref({
    pcode: '',
    name: '',
    price: 0,
    storagemethod: '',
    bannerList: []
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

const handleRemoveImage = (index) => {
    form.value.bannerList.splice(index, 1)
}

const beforeAvatarUpload = (file) => {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    if (!isJPG && !isPNG) {
        ElMessage.error('上传图片只能是 JPG/PNG 格式!')
        return false
    }
    return true
}

const uploadFile = async (file) => {
    const res = await API.uploadImage({}, {file: file.file})
    if (res.errcode === 0) {
        const url = res.data;
        form.value.bannerList.push({
            bannerimage: url,
            id: ''
        })
    }    
}

const submitForm = async (formEl) => {
    if (!formEl) return

    await formEl.validate(async (valid) => {
        if (valid) {
            const params = {
                product: {
                    pcode: form.value.pcode || '',
                    name: form.value.name,
                    price: form.value.price,
                    storagemethod: form.value.storagemethod
                },
                banner: form.value.bannerList
            }
            const res = await API.addProduct({}, params)
            if (res.errcode === 0) {
                ElMessage.success(isEdit.value ? '修改成功' : '添加成功')
                goBack()
            }
        }
    })
}

onMounted(async () => {
    const { pcode } = route.query
    if (pcode) {
        form.value.pcode = pcode
        isEdit.value = true
        const res = await API.getDetaInfo({ code: pcode })
        console.log(res)
        if (res.errcode === 0) {
            form.value = { ...form.value, ...res.data }
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

    .banner-item {
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

        &:hover .image-actions {
            display: block;
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
