<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue } from '../util/ADS.js';
import open from '../assets/open.svg';
import close from '../assets/close-circle.svg';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token, activeKey } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
    node: Object,
});

onMounted(() => {

});

const handleClickNode = (data) => {
    saveProperyValue({'label': 'activeKey', 'value': data._key});
}

const expanded = ref(true);
const toggle = () => {
    expanded.value = !expanded.value;
}

</script>

<template>
    <div class="node" :class="{nodeHasLittleBrother: node.HasLittleBrother == 1}">
        <div class="name-box">
            <i class="name" @click="handleClickNode(node)" :class="{hasChild: node.children && node.children.length, noline: !expanded, select: activeKey == node._key}" :style="{width: (node.Fullname || node.Given).length*14+'px'}" :id="node._key+'-'+node.generation">{{node.Fullname || node.Given}}<img v-if="node.children && node.children.length" class="toggle" @click.stop="toggle" :src="expanded ? open : close"></i>
            <i class="name red" @click="handleClickNode(item)" :class="{select: activeKey == item._key}" v-for="(item, index) in node.spouseOrder" :key="index" :style="{width: item.Fullname.length*18+'px'}">{{item.Fullname}}</i>
        </div>
        <div class="node-list" v-if="node.children && node.children.length > 0 && expanded">
            <TreeNode v-for="child in node.children" :key="child._key" :node="child" />
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>