<template>
    <div class="improve-page">
        <div class="header">
            <el-page-header @back="goBack" title="完善商品信息" />
        </div>
        
        <el-form 
            ref="formRef" 
            :model="form" 
            :rules="rules" 
            label-width="120px" 
            class="form-container"
        >
            <el-form-item label="商品编号">
                {{ form.pcode }}
            </el-form-item>

            <el-form-item label="商品名称">
                {{ form.name }}
            </el-form-item>

            <el-form-item label="使用步骤" class="step-container">
                <el-form-item label="步骤名" label-width="70px">
                    <el-input 
                        v-model="form.inspectionorgname"
                        placeholder="请输入步骤名称"
                    />
                </el-form-item>
            </el-form-item>
    
            <div class="steps-list">
                <div 
                    v-for="(step, stepIndex) in form.useSteps" 
                    :key="stepIndex" 
                    class="step-item"
                >
                    <div class="step-content">
                        ({{ stepIndex + 1 }})
                            <el-input
                                style="width: 80%;"
                                :row="1"
                                type="textarea"
                                v-model="step.inspectiondate"
                                placeholder="请输入步骤描述"
                            />
                            <el-button
                                style="display: block;"
                                type="danger"
                                link
                                class="delete-btn"
                                @click="removeStepDesc(stepIndex)"
                            >
                                <el-icon><Delete /></el-icon>
                            </el-button>
                    </div>
                </div>
                <el-button 
                    type="primary" 
                    class="add-step-btn" 
                    @click="addStepDesc"
                >
                    <el-icon><Plus /></el-icon>添加步骤描述
                </el-button>
            </div>

            <el-form-item label="供应商">
                <el-input v-model="form.supplier" />
            </el-form-item>

            <el-form-item 
                label="检测报告" 
                prop="testReport" 
                class="test-report-container"
            >
                <template v-if="form.testReport.length > 0">
                    <div 
                        v-for="(item, index) in form.testReport.filter(item => item.origincertify)" 
                        :key="index" 
                        class="report-item"
                    >
                        <div class="image-item">
                            <el-image 
                                :src="item.origincertify" 
                                class="avatar"
                                :preview-src-list="[item.origincertify]"
                                fit="contain"
                            />
                            <div class="image-actions">
                                <el-button 
                                    type="danger" 
                                    link 
                                    @click="handleRemoveImage(index)"
                                >
                                    <el-icon><Delete /></el-icon>
                                </el-button>
                            </div>
                        </div>
                        <div class="report-info">
                            <el-form-item 
                                :style="{ marginBottom: '10px' }" 
                                label="报告名称" 
                                label-width="70px" 
                                :prop="'testReport.' + index + '.caname'"
                            >
                                <el-input 
                                    v-model="item.caname" 
                                    placeholder="请输入报告名称"
                                />
                            </el-form-item>
                            <el-form-item 
                                label="报告编号" 
                                label-width="70px"  
                                :prop="'testReport.' + index + '.caimage'"
                            >
                                <el-input 
                                    v-model="item.caimage" 
                                    placeholder="请输入报告编号"
                                />
                            </el-form-item>
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
    dealer: '',
    manufacturer: '',
    logistics: '',
    companyProfile: '',
    inspectionorgname: '',
    useSteps: []
})

const rules = {
    'testReport.*.caname': [
        { required: true, message: '请输入报告名称', trigger: 'blur' }
    ],
    'testReport.*.caimage': [
        { required: true, message: '请输入报告编号', trigger: 'blur' }
    ]
}

const addStepDesc = () => {
    form.value.useSteps.push({
        id: 0,
        pcode: form.value.pcode,
        inspectiondate: '',
        inspectionorgname: form.value.inspectionorgname,
        inspectioncode: '',
        sort: form.value.useSteps.length + 1,
    })
}

const removeStepDesc = (index) => {
    form.value.useSteps.splice(index, 1)
    // 重新排序
    form.value.useSteps.forEach((step, idx) => {
        step.sort = idx + 1
    })
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
        const url = res.data
        form.value.testReport.push({
            pcode: form.value.pcode,
            producername: form.value.supplier,
            originnodename: '',
            origincertify: url,
            caname: '',
            caimage: ''
        })
    }    
}

const submitForm = async (formEl) => {
    if (!formEl) return
    
    await formEl.validate(async (valid) => {
        if (valid) {
            const params = {
                pcode: form.value.pcode,
                internetProduction: form.value.testReport.map((item, index) => ({
                    id: originObj.value?.internetProduction?.[index]?.id || 0,
                    pcode: form.value.pcode,
                    producername: form.value.supplier,
                    originnodename: '',
                    origincertify: item.origincertify || '',
                    caname: item.caname,
                    caimage: item.caimage
                })),
                customs: [{
                    id: originObj.value?.customs?.[0]?.id || 0,
                    pcode: form.value.pcode,
                    cuscode: form.value.companyProfile
                }],
                logisticsinfos: [{
                    id: originObj.value?.logisticsinfos?.[0]?.id || 0,
                    pcode: form.value.pcode,
                    dealername: form.value.dealer,
                    cusname: form.value.manufacturer,
                    logisticsname: form.value.logistics
                }],
                overseastests: form.value.useSteps.map(step => ({
                    id: step.id || 0,
                    pcode: form.value.pcode,
                    inspectiondate: step.inspectiondate,
                    inspectionorgname: form.value.inspectionorgname,
                    inspectioncode: step.inspectioncode,
                    sort: step.sort
                }))
            }
            const res = await API.addOrUpdateProperty({}, params)
            if(res.errcode === 0) {
                ElMessage.success('保存成功')
                goBack()
            } else {
                ElMessage.error(res.msg || '保存失败')
            }
        }
    })
}

const originObj = ref({})

onMounted(async () => {
    const { pcode } = route.query
    if (pcode) {
        form.value.pcode = pcode
        const res = await API.getDetaInfo({ code: pcode })
        if(res.errcode === 0) {
            const data = res.data || {}
            originObj.value = data
            form.value = {...form.value, ...data}
            form.value.supplier = data.internetProduction?.[0]?.producername || ''
            form.value.testReport = data.internetProduction || []
            form.value.dealer = data?.logisticsinfos?.[0]?.dealername || ''
            form.value.manufacturer = data?.logisticsinfos?.[0]?.cusname || ''
            form.value.logistics = data?.logisticsinfos?.[0]?.logisticsname || ''
            form.value.companyProfile = data?.customs?.[0]?.cuscode || ''
            form.value.inspectionorgname = data?.overseastests?.[0]?.inspectionorgname || ''
            form.value.useSteps = data?.overseastests?.map(step => ({
                ...step,
                descriptions: []
            })) || []
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
    
    .steps-list {
        margin: 18px 0;
        padding-left: 120px;
    }

    .step-item {
        .step-content {
            display: flex;
            gap: 15px;
            align-items: center;
            padding: 0 15px;
            margin-bottom: 15px;
            border-radius: 4px;
            .step-desc {
                display: flex;
                margin: 0;

                :deep(.el-form-item__content) {
                    display: flex;
                    gap: 10px;
                }
            }

            .delete-btn {
                color: var(--el-color-danger);
            }
        }
    }

    .add-step-btn {
        margin-left: 10px;
    }

    .test-report-container {
        :deep(.el-form-item__content) {
            line-height: normal;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
        }
    }

    .report-item {
        display: flex;
        gap: 20px;
        align-items: flex-start;
        
        .report-info {
            flex: 1;
            min-width: 200px;
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
