<template>
    <div class="login-page">
        <div class="content-box">
            <div class="right-box">
                <div class="title">
                    <h1>管理系统</h1>
                </div>
                <div class="form-box">
                    <div class="ipt-box">
                        <el-input 
                            v-model="formData.name"
                            placeholder="请输入用户账号"
                            :prefix-icon="User"
                            size="large"
                        />
                    </div>
                    <div class="ipt-box">
                        <el-input
                            v-model="formData.passWord"
                            :type="passwordShow ? 'text' : 'password'"
                            placeholder="请输入登录密码"
                            size="large"
                            :prefix-icon="Lock"
                        >
                            <template #suffix>
                                <el-icon :size="15" @click="passwordShow = !passwordShow">
                                    <component :is="passwordShow ? View : Hide" />
                                </el-icon>
                            </template>
                        </el-input>
                    </div>
                    <el-button type="primary" class="login-btn" @click="submitLogin">
                        登录
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script lang="js" setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { Lock, User, Hide, View } from '@element-plus/icons-vue';
const router = useRouter()
const formData = ref({
    name: 'admin',
    passWord: '123456',
})
const passwordShow = ref(false);
const submitLogin = () => {
    if(!formData.value.name || !formData.value.passWord) {
        ElMessage.error('请输入用户账号和密码');
        return
    } else {
        ElMessage.success('登录成功');
        setTimeout(() => {
            router.push('/web/commodity');
        }, 1500);
    }
}
</script>
  
<style lang="scss" scoped>
.login-page {
    max-height: 100vh;
    height: 100vh;
    background: #F9F9F9;
    display: flex;
    align-items: center;
    justify-content: center;

    .content-box {
        display: flex;
        align-items: center;
        justify-content: center;

        .right-box {
            width: 374px;
            height: 308px;
            margin-left: 28px;
            background: #FFFFFF;
            box-shadow: 0px 2px 33px 0px rgba(0, 0, 0, 0.07);
            border-radius: 21px;
            display: flex;
            flex-direction: column;
            align-items: center;

            .title {
                margin-bottom: 20px;
                h1 {
                    margin-top: 30px;
                    font-size: 18px;
                    font-weight: bold;
                    color: #222222;
                }
            }

            .ipt-box {
                margin-bottom: 18px;
                display: flex;
                justify-content: center;
                align-items: center;

                .ipt-title {
                    font-size: 14px;
                    color: #848181;
                    width: 90px;
                    line-height: 30px;
                }
            }

            .login-btn {
                width: 311px;
                height: 48px;
                margin-top: 15px;
                border-radius: 8px;
                font-size: 16px;
            }
        }
    }
}
</style>