<template>
    <div class="user-page">
        <div class="header">
            <div class="search-area">
                <el-input v-model="searchForm.name" placeholder="请输入用户名" style="width: 200px; margin-right: 10px;" />
                <el-input v-model="searchForm.username" placeholder="请输入登录名" style="width: 200px; margin-right: 10px;" />
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
            </div>
            <div class="operation-area">
                <el-button type="success" @click="handleAdd">新增用户</el-button>
                <el-button type="primary" @click="handleExport">导出</el-button>
                <el-upload
                    class="upload-demo"
                    action=""
                    :show-file-list="false"
                    :before-upload="handleImport"
                >
                    <el-button type="primary">导入</el-button>
                </el-upload>
            </div>
        </div>

        <el-table border :data="tableData" style="width: 100%">
            <el-table-column prop="id" label="用户ID" />
            <el-table-column prop="name" label="用户名" />
            <el-table-column prop="username" label="登录名" />
            <el-table-column prop="createtime" label="创建时间" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button size="small" type="primary" link @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" link @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination
                v-model:current-page="searchForm.page"
                v-model:page-size="searchForm.pageSize" 
                :page-sizes="[10, 20, 50]"
                :total="total"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>

        <el-dialog
            :title="dialogType === 'add' ? '新增用户' : '编辑用户'"
            v-model="dialogVisible"
            width="500px"
        >
            <el-form
                ref="formRef"
                :model="userForm"
                :rules="rules"
                label-width="80px"
            >
                <el-form-item label="用户名" prop="name">
                    <el-input v-model="userForm.name" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="登录名" prop="username">
                    <el-input v-model="userForm.username" placeholder="请输入登录名" />
                </el-form-item>
                <el-form-item label="密码" prop="pwd" v-if="dialogType === 'add'">
                    <el-input v-model="userForm.pwd" type="password" placeholder="请输入密码" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitForm">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue'
import { API } from '@/common/api'
import { ElMessage, ElMessageBox } from 'element-plus'

const formRef = ref(null)
const searchForm = ref({
    name: '',
    username: '', 
    page: 1,
    pageSize: 10
})

const total = ref(0)
const tableData = ref([])
const dialogVisible = ref(false)
const dialogType = ref('add')
const userForm = ref({
    username: '',
    name: '',
    pwd: ''
})

const rules = {
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    loginname: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
    pwd: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

const handleSizeChange = (val) => {
    searchForm.value.pageSize = val
    getUserList()
}

const handleCurrentChange = (val) => {
    searchForm.value.page = val 
    getUserList()
}

const resetSearch = () => {
    searchForm.value = {
        username: '',
        name: '',
        page: 1,
        pageSize: 10
    }
    getUserList()
}

const handleSearch = () => {
    searchForm.value.page = 1
    getUserList()
}

const getUserList = async () => {
    const res = await API.getUserList({}, searchForm.value)
    const data = res.data || {}
    tableData.value = data.list || []
    total.value = data.total || 0
}

const handleAdd = () => {
    dialogType.value = 'add'
    userForm.value = {
        username: '',
        name: '',
        pwd: ''
    }
    dialogVisible.value = true
}

const handleEdit = (row) => {
    dialogType.value = 'edit'
    userForm.value = {
        id: row.id,
        username: row.username,
        name: row.name
    }
    dialogVisible.value = true
}

const submitForm = async () => {
    if (!formRef.value) return
    
    await formRef.value.validate(async (valid) => {
        if (valid) {
            const api = dialogType.value === 'add' ? API.addUser : API.editUser
            if (dialogType.value === 'add') {
                userForm.value.isadmin = 0;
            }
            const res = await api({}, userForm.value)
            
            if (res.errcode === 0) {
                ElMessage.success(dialogType.value === 'add' ? '新增成功' : '编辑成功')
                dialogVisible.value = false
                getUserList()
            } else {
                ElMessage.error(res.errmsg || (dialogType.value === 'add' ? '新增失败' : '编辑失败'))
            }
        }
    })
}

const handleDelete = (row) => {
    ElMessageBox.confirm('确认删除该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(async () => {
        const res = await API.editUser({}, { id: row.id, status: 1, name: row.name, username: row.username })
        if (res.errcode === 0) {
            ElMessage.success('删除成功')
            getUserList()
        } else {
            ElMessage.error(res.errmsg || '删除失败')
        }
    })
}

// 导出Excel
const handleExport = async () => {
    try {
        const res = await API.exportUserList({}, searchForm.value)
        if(res.errcode === 0) {
            // 假设接口返回的是文件流
            const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = '用户列表.xlsx'
            link.click()
            window.URL.revokeObjectURL(url)
            ElMessage.success('导出成功')
        } else {
            ElMessage.error(res.errmsg || '导出失败')
        }
    } catch (error) {
        ElMessage.error('导出失败')
    }
}

// 导入Excel
const handleImport = (file) => {
    // const reader = new FileReader()
    // reader.onload = async (e) => {
    //     const data = e.target.result
    //     const workbook = XLSX.read(data, { type: 'array' })
    //     const firstSheetName = workbook.SheetNames[0]
    //     const worksheet = workbook.Sheets[firstSheetName]
    //     const results = XLSX.utils.sheet_to_json(worksheet)
        
    //     // 处理导入数据
    //     try {
    //         for (let item of results) {
    //             const params = {
    //                 username: item['用户名'],
    //                 loginname: item['登录名'],
    //                 pwd: '123456' // 默认密码
    //             }
    //             await API.addUser({}, params)
    //         }
    //         ElMessage.success('导入成功')
    //         getUserList()
    //     } catch (error) {
    //         ElMessage.error('导入失败')
    //     }
    // }
    // reader.readAsArrayBuffer(file)
    // return false
}

onMounted(() => {
    getUserList()
})
</script>

<style lang="scss" scoped>
.user-page {
    padding: 20px;
    background-color: #fff;

    .header {
        margin-bottom: 20px;
    }

    .operation-area {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
        gap: 10px;
        
        .upload-demo {
            display: inline-block;
        }
    }

    .pagination-container {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>
