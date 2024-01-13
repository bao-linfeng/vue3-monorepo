<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue, scrollIntoView, getQueryVariable } from '../util/ADS.js';
import { catalog, imageApi, volumeApi, baseURL } from '../util/api';
import { useDetail } from '../composables/useDetail.js';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token, activeLevel, imageSerialNumber, isShowImage } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
    treeData: Object,
    generation: Array,
});

const gcKey = ref(getQueryVariable('id'));
const page = ref(1);
const limit = ref(10);
const currentList = ref([]);

const onPageChange = (val) => {
    page.value = val;
    currentList.value = imageList.value.slice((page.value - 1)*limit.value, page.value*limit.value);
}

// 影像列表模块
const [imageList, refreshImageList, , total] = useDetail(imageApi.gcImageList, {'gcKey': gcKey.value},
  {
    immediate: true
  });

watch(imageList, (nv, ov) => {
    currentList.value = imageList.value.slice((page.value - 1)*limit.value, page.value*limit.value);
});

watch(imageSerialNumber, (nv, ov) => {
    console.log(nv);
    if(nv && nv.length){
        serialNumber.value = nv[0];

        handleChange();
    }else{
        serialNumber.value = '';
    }
});

const serialNumber = ref('');

const handleChange = () => {
    if(isShowImage.value){
        page.value = Math.ceil(serialNumber.value.substr(5)/limit.value);
        currentList.value = imageList.value.slice((page.value - 1)*limit.value, page.value*limit.value);

        let timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
            scrollIntoView(serialNumber.value);
        }, 200);
    }
}

const handleToggleBar = () => {
    saveProperyValue({'label': 'isShowImage', 'value': false});
}

const h = ref(window.innerHeight - 170);

onMounted(() => {
    
});

</script>

<template>
    <section class="look-image-wrap">
        <header class="header">
            <h3 class="">家谱影像</h3>
            <el-select v-model="serialNumber" @change="handleChange" class="w150" placeholder="影像序号">
                <el-option
                v-for="(item, index) in imageSerialNumber"
                :key="index"
                :label="item"
                :value="item"
                />
            </el-select>
        </header>
        <div class="image-wrap style1" :style="{height: h+'px'}">
            <div class="image-box" v-for="(item, index) in currentList" :key="index" :id="item.serialNumber">
                <img class="image" :src="baseURL+'/nbyz/imageFile/'+gcKey+'/'+item.internalSerialNumber+'/'+item.serialNumber+'.jpg'" alt="">
                <p>{{item.serialNumber}}</p>
                <i class="box" v-if="imageSerialNumber && imageSerialNumber.indexOf(item.serialNumber) > -1"></i>
            </div>
        </div>
        <footer class="footer">
            <el-pagination
                small
                background
                layout="prev, pager, next"
                :pager-count="3"
                :current-page="page"
                :page-size="limit"
                :total="total"
                @current-change="onPageChange"
            />
        </footer>
        <i class="toggle-image-bar" @click="handleToggleBar"></i>
    </section>
</template>

<style scoped lang="scss">
.look-image-wrap{
    position: fixed;
    width: 240px;
    height: calc(100% - 20px);
    padding: 10px;
    top: 76px;
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
        height: calc(100% - 102px);
        height: 800px;
        overflow-y: auto;
        .image-box{
            position: relative;
            margin-bottom: 10px;
            text-align: center;
            .image{
                width: 100%;
                display: inline-block;
            }
            .box{
                position: absolute;
                right: 10px;
                bottom: 30px;
                width: 15px;
                height: 15px;
                border: 1px solid #1A365C;
                background-color: #1A365C;
            }
        }
    }
    .footer{
        background-color: #999;
        height: 40px;
        width: calc(100% - 20px);
        padding:  0 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
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