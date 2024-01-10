<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue } from '../util/ADS.js';
import TreeNode from './TreeNode.vue';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token, activeLevel } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
    treeData: Object,
    generation: Array,
});

onMounted(() => {
    
});

const handleClickLevel = (data) => {
    saveProperyValue({'label': 'activeKey', 'value': data._key});
}

</script>

<template>
    <section class="tree-wrap">
        <div class="generation-box style1">
            <div class="generation" v-for="(item, index) in generation" :key="index" :id="item.Generation" :class="{active: activeLevel == item.Generation}" @click="handleClickLevel(item)">{{item.Generation}}世</div>
            <div class="generation-h"></div>
        </div>
        <div class="tree-box style1">
            <TreeNode :node="treeData" />
        </div>
    </section>
</template>

<style scoped lang="scss">
.tree-wrap{
    position: relative;
    width: calc(100% - 30px);
    height: 100%;
    padding-left: 30px;
    font-size: 12px;
}
.generation-box{
    position: fixed;
    top: 76px;
    left: 30px;
    width: 60px;
    height: 100%;
    overflow-y: auto;
    .generation{
        height: 20px;
        line-height: 20px;
        padding: 0 5px;
        cursor: pointer;
        margin-bottom: 40px;
        &.active{
            color: #f00;
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
}
</style>