<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue } from '../util/ADS.js';
import TreeNode from './TreeNode.vue';
import LookImage from './LookImage.vue';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token, activeLevel, isShowImage } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
    treeData: Object,
    generation: Array,
});

onMounted(() => {
    
});

const handleClickLevel = (data) => {
    saveProperyValue({'label': 'activeKey', 'value': data._key});
    saveProperyValue({'label': 'imageSerialNumber', 'value': data.coordinateArray});
}

const handleToggleBar = () => {
    saveProperyValue({'label': 'isShowImage', 'value': true});
}

</script>

<template>
    <section class="tree-wrap">
        <div class="generation-box style1" :class="{active: isShowImage}">
            <div class="generation" v-for="(item, index) in generation" :key="index" :id="item.Generation" :class="{active: activeLevel == item.Generation}" @click="handleClickLevel(item)">{{item.Generation}}世</div>
            <div class="generation-h"></div>
        </div>
        <div class="tree-box style1" :class="{active: isShowImage}">
            <TreeNode :node="treeData" />
        </div>
        <i class="toggle-image-bar" @click="handleToggleBar"></i>
        <LookImage v-show="isShowImage" />
    </section>
</template>

<style scoped lang="scss">
.tree-wrap{
    position: relative;
    width: calc(100% - 30px);
    height: 100%;
    padding-left: 30px;
    font-size: 12px;
    .toggle-image-bar{
        position: fixed;
        top: 50%;
        left: 5px;
        transform: translateY(-50%);
        width: 8px;
        height: 100px;
        background-color: #C9A470;
        cursor: pointer;
        border-radius: 5px;
    }
}
.generation-box{
    position: fixed;
    top: 76px;
    left: 30px;
    width: 60px;
    height: 100%;
    overflow-y: auto;
    &.active{
        left: 290px;
    }
    .generation{
        height: 20px;
        line-height: 20px;
        padding: 0 5px;
        cursor: pointer;
        margin-bottom: 40px;
        &.active{
            color: #C9A470;
        }
    }
    .generation-h{
        height: 90px;
    }
}
.tree-box{
    position: fixed;
    top: 76px;
    left: 110px;
    width: calc(100% - 490px);
    height: calc(100% - 76px);
    overflow: auto;
    &.active{
        left: 370px;
        width: calc(100% - 750px);
    }
}
</style>