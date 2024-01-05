<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue } from '../util/ADS.js';

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
    <ul class="tree" v-if="treeData.length">
        <li v-for="(item, index) in treeData" :key="item._key">
            <p>{{item.Fullname || item.Given}}</p>
        </li>
    </ul>
</template>

<style scoped lang="scss">
.tree{
    position: relative;
    // width: 100%;
    // height: 100%;
}
</style>