<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import {  } from '../util/api';

const router = useRouter();
const global = useGlobalStore();
const {  } = storeToRefs(global);
const { saveProperyValue } = global;

const surname = ref('');

const goRouter = () => {
  router.push('/GenealogySearch?surname='+surname.value);
}
</script>

<template>
  <section class="home-wrap">
    <img class="title" src="../assets/标题.png" />
    <i class="line"></i>
    <main class="main">
      <img class="search-title" src="../assets/检索标题.svg" />
      <div class="search-box">
        <input class="search" type="text" v-model="surname" @keyup.enter="goRouter" placeholder="请输入姓氏" />
      </div>
    </main>
  </section>
</template>

<style scoped lang="scss">
.home-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: url('../assets/背景.png');
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .title{
    width: 312px;
  }
  .line{
    width: 1px;
    height: 415px;
    border: 1px solid #0a365c;
    background-color: #0a365c;
    margin: 0 185px;
  }
  .main{
    text-align: center;
    .search-box{
      width: 350px;
      height: 46px;
      background: url('../assets/home-search.svg');
      background-size: cover;
      margin-top: 43px;
      display: flex;
      justify-content: center;
      align-items: center;
      .search{
        width: calc(100% - 40px);
        height: 100%;
        font-size: 20px;
        outline: none;
        border: none;
        font-family: "楷体";
        text-align: center;
      }
    }
  }
}
::-webkit-input-placeholder {
  color: #192B53; 
}
</style>
