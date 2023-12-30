<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue, createMsg } from '../util/ADS.js';
import { catalog, login } from '../util/api';
import { ElLoading } from 'element-plus';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo } = storeToRefs(global);
const { saveProperyValue } = global;

const goRouter = (data) => {
    router.push(data);
}

const loginByPassword = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await login.loginByPassword({
    'account': form.value.account,
    'password': form.value.password,
  });
  loading.close();
  if(result.status == 200){
    saveProperyValue({'label': 'token', 'value': result.data.token}, true);
    saveProperyValue({'label': 'userInfo', 'value': result.data}, 'dep');
    close();
  }else{
    createMsg(result.msg);
  }
};

const setPassword = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await login.setPassword({
    'account': form.value.account,
    'oldPassword': form.value.password,
    'newPassword': form.value.password,
  });
  loading.close();
  if(result.status == 200){
    
  }else{
    createMsg(result.msg);
  }
};

const form = ref({'account': '', 'password': ''});

const handleLogin = () => {
    if(!form.value.account){
        return createMsg('账号必填！');
    }
    if(!form.value.password){
        return createMsg('密码必填！');
    }

    loginByPassword();
}

const emit = defineEmits(['close', 'save']);
const close = () => {
    emit('close');
}

onMounted(() => {

});

</script>

<template>
    <section class="login-section">
        <header class="header">
            <h3 class="title">登录</h3>
        </header>
        <main class="main marginT20">
            <el-form :model="form">
                <el-form-item label="账号">
                    <el-input class="w200" type="text" v-model="form.account" placeholder="请输入账号" />
                </el-form-item>
                <el-form-item label="密码">
                    <el-input class="w200" type="password" v-model="form.password" placeholder="请输入密码" />
                </el-form-item>
            </el-form>
        </main>
        <footer class="footer">
            <el-button type="primary" @click="handleLogin">登录</el-button>
            <el-button @click="close">取消</el-button>
        </footer>
    </section>
</template>

<style scoped lang="scss">
.login-section{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 50px;
    box-shadow: 0 0 1px 2px #ddd;
    border-radius: 10px;
    z-index: 10000;
    background-color: #fff;
    .header{
        text-align: center;
    }
    .footer{
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>