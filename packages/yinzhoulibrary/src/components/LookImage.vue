<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue } from '../util/ADS.js';
import { catalog, imageApi, volumeApi, baseURL } from '../util/api';
import { useDetail } from '../composables/useDetail.js';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token, activeLevel, imageSerialNumber } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
    treeData: Object,
    generation: Array,
});

// 影像列表模块
const [imageList, refreshImageList, , total] = useDetail(imageApi.getImageList, {'vKey': '9291243756'},
  {
    immediate: true
  });

watch(imageList, (nv, ov) => {
    console.log(nv);
});

watch(imageSerialNumber, (nv, ov) => {
    console.log(nv);
    if(nv && nv.length){
        serialNumber.value = nv[0];
        document.getElementById(serialNumber.value).scrollIntoView();
    }
});

const serialNumber = ref('');

// watch(serialNumber, (nv, ov) => {
//     document.getElementById(serialNumber.value).scrollIntoView();
// });

const handleChange = () => {
    document.getElementById(serialNumber.value).scrollIntoView();
}

const handleToggleBar = () => {
    saveProperyValue({'label': 'isShowImage', 'value': false});
}

onMounted(() => {
    
});

</script>

<template>
    <section class="look-image-wrap">
        <header class="header">
            <h3 class="">家谱影像</h3>
            <el-select v-model="serialNumber" @change="handleChange" class="w150" placeholder="影像序号">
                <el-option
                v-for="item in imageSerialNumber"
                :key="item"
                :label="item"
                :value="item"
                />
            </el-select>
        </header>
        <section class="image-wrap style1">
            <div class="image-box" v-for="(item, index) in imageList" :key="index" :id="item.serialNumber">
                <img class="image" :src="baseURL+'/nbyz/imageFile/9291240794/001/'+item.serialNumber+'.jpg'" alt="">
                <i class="box" v-if="imageSerialNumber.indexOf(item.serialNumber) > -1"></i>
            </div>
        </section>
        <i class="toggle-image-bar" @click="handleToggleBar"></i>
    </section>
</template>

<style scoped lang="scss">
.look-image-wrap{
    position: fixed;
    width: 240px;
    height: calc(100% - 20px);
    padding: 10px;
    top: 67px;
    left: 0;
    background-color: #999;
    .header{
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }
    .image-wrap{
        position: relative;
        height: calc(100% - 42px);
        overflow-y: auto;
        .image-box{
            position: relative;
            margin-bottom: 10px;
            .image{
                width: 100%;
            }
            .box{
                position: absolute;
                right: 10px;
                bottom: 10px;
                width: 15px;
                height: 15px;
                border: 1px solid #1A365C;
                background-color: #1A365C;
            }
        }
    }
    .toggle-image-bar{
        position: absolute;
        top: 50%;
        right: 2px;
        transform: translateY(-50%);
        width: 8px;
        height: 100px;
        background-color: #C9A470;
        cursor: pointer;
        border-radius: 5px;
    }
}
</style>