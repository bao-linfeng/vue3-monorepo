<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue } from '../util/ADS.js';
import Tree from './Tree.vue';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
    treeData: Array,
});

onMounted(() => {

});

</script>

<template>
    <section class="tree-wrap style1">
        <ul class="tree-box">
            <li v-for="(item, index) in treeData" :key="index" :id="index">
                <!-- <p>{{item.Fullname || item.Given}}</p> -->
                <!-- <Tree v-if="item.children.length" :treeData="item.children"></Tree> -->
                <ul class="tree" v-if="item.length">
                    <li :class="{red: item2.isMember != 1}" v-for="(item2, index2) in item" :key="item2._key">{{item2.Fullname || item2.Given}}</li>
                </ul>
            </li>
        </ul>
    </section>
</template>

<style scoped lang="scss">
.tree-wrap{
    position: relative;
    width: calc(100% - 76px);
    height: calc(100% - 30px);
    padding: 76px 0 0 30px;
    overflow-y: auto;
}
.tree{
    margin-bottom: 20px;
    li{
        display: inline-block;
        margin-right: 30px;
        background-color: #999;
        border-radius: 5px;
        height: 20px;
        line-height: 20px;
        padding: 0 5px;
        cursor: pointer;
        font-size: 14px;
        &.red{
            color: #f00;
        }
    }
}
</style>