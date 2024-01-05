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
    width: 100%;
    height: 100%;
    overflow-y: auto;
}
.tree{
    li{
        display: inline-block;
        margin-right: 30px;
        &.red{
            color: #f00;
        }
    }
}
</style>