<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue } from '../util/ADS.js';
import LoginModule from './LoginModule.vue';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;

const logout = () => {
    saveProperyValue({'label': 'token', 'value': ''});
    saveProperyValue({'label': 'userInfo', 'value': ''});
    localStorage.clear();
    router.push('/');
}

const goRouter = (data) => {
    router.push(data);
}

const isLogin = ref(false);
const handleLogin = () => {
    if(!token.value){
        isLogin.value = true;
    }
}

onMounted(() => {

});

</script>

<template>
    <header class="header">
      <!-- <img class="logo" src="../assets/logo.png" @click="goRouter('/')" /> -->
      <nav class="nav">
        <router-link to="/GenealogySearch">检索中心</router-link>
        <router-link v-if="token" class="marginL20" to="/GenealogyManage">管理中心</router-link>
        <a class="btn marginL20" @click="handleLogin">{{token ? userInfo.account : '登录'}}</a>
      </nav>
    </header>
    <LoginModule v-if="isLogin" v-on:close="isLogin = false" />
</template>

<style scoped lang="scss">
.header{
    height: 80px;
    margin: 0 auto;
    width: 1460px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    color: #C9A470;
    .logo{
        cursor: pointer;
    }
    .nav{
        a{
            color: #C9A470;
        }
    }
}
</style>