<template>
    <div class="commodity-page">
        <div class="header">
            <div class="search-area">
                <el-input v-model="searchForm.name" placeholder="请输入商品名称" style="width: 200px; margin-right: 10px;" />
                <el-input v-model="searchForm.pcode" placeholder="请输入商品编号" style="width: 200px; margin-right: 10px;" />
                <el-button type="primary" @click="handleSearch">查询</el-button>
                <el-button @click="resetSearch">重置</el-button>
            </div>
            <div class="operation-area">
                <el-button type="success" @click="handleAdd">新增商品</el-button>
            </div>
        </div>
        <el-table border :data="tableData" style="width: 100%">
            <el-table-column prop="pcode" label="商品ID" width="180" />
            <el-table-column prop="name" label="商品名称" width="180" />
            <el-table-column prop="price" label="价格" />
            <el-table-column label="操作" align="center">
                <template #default="scope">
                    <el-button size="small" type="primary" link @click="handleView(scope.row)">查看</el-button>
                    <el-button size="small" type="primary" link @click="handleEditDetail(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div class="pagination-container">
            <el-pagination
                v-model:current-page="searchForm.page"
                v-model:page-size="searchForm.pageSize"
                :page-sizes="[10, 20, 50]"
                :total="tableData.length"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </div>
    </div>
</template>

<script lang="js" setup>
import { ref, onMounted } from 'vue'
import { API } from '@/common/api'
import { useRouter } from 'vue-router'

const router = useRouter()

const searchForm = ref({
    name: '',
    pcode: '',
    page: 1,
    pageSize: 100,
})
const tableData = ref([
    {
        pcode: 1,
        name: '商品1',
        price: 99,
        stock: 100
    },
    {
        pcode: 2, 
        name: '商品2',
        price: 199,
        stock: 50
    }
])

const handleSizeChange = (val) => {
    searchForm.value.pageSize = val
    getProductList();
}

const handleCurrentChange = (val) => {
    searchForm.value.page = val
    getProductList();
}

const resetSearch = () => {
    searchForm.value = {
        name: '',
        pcode: '',
        page: 1,
        pageSize: 10
    }
    getProductList() // 重置后重新获取数据
}

const handleSearch = () => {
    searchForm.value.page = 1
    getProductList()
}

const getProductList = async () => {
    const res = await API.getProductList(searchForm.value)
    console.log(res)
}

onMounted(() => {
    getProductList()
})

const handleAdd = (row) => {
    router.push({
        path: '/commodity/edit',
        query: {
            pcode: row.pcode,
            type: 'add'
        }
    })
}

const handleView = (row) => {
    router.push({
        path: '/commodity/edit',
        query: {
            pcode: row.pcode,
            type: 'view'
        }
    })
}

const handleEditDetail = (row) => {
    router.push({
        path: '/commodity/edit',
        query: {
            pcode: row.pcode
        }
    })
}
</script>

<style lang="scss" scoped>
.commodity-page {
    padding: 20px;
    
    .header {
        margin-bottom: 20px;
    }
}

.operation-area {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}

.pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
}

.dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>