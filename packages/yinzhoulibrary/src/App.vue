<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from './store/global.js';
import AnchorModule from './components/AnchorModule.vue';

const route = useRoute();

const global = useGlobalStore();
const { pathActive, userInfo } = storeToRefs(global);
const { saveProperyValue } = global;

watch(() => route, (to, from) => {
  console.log(to.path);
  saveProperyValue({'label': 'pathActive', 'value': to.path});
},{deep: true});

const NoAnchor = ['/', '/GenealogySearch', '/GenealogyDetail', '/ImageView', '/Relationmap'];

</script>

<template>
  <AnchorModule v-show="NoAnchor.indexOf(pathActive) === -1" />
  <div class="app-wrap" :class="{active: NoAnchor.indexOf(pathActive) === -1}">
    <router-view></router-view>
  </div>
</template>

<style scoped lang="scss">
.app-wrap{
  position: relative;
  width: 100%;
  height: 100%;
  &.active{
    width: calc(100% - 22rem);
  }
}
</style>