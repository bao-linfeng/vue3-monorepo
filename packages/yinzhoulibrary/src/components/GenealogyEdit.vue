<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue, createMsg } from '../util/ADS.js';
import { catalog } from '../util/api';
import { ElLoading, ElMessage } from 'element-plus';
import DragModule from './DragModule.vue';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
  dataRow: Object,
});

const goRouter = (data) => {
    router.push(data);
}

const createSingleGC = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await catalog.createSingleGC(Object.assign({'token': token.value, 'isCreateVolume': isCreateVolume.value ? 1 : 0}, form.value));
  loading.close();
  if(result.status == 200){
    createMsg('新建谱目成功!', true);
    close(true);
  }else{
    createMsg(result.msg);
  }
};

const editSingleGC = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await catalog.editSingleGC({
    'token': token.value,
    'gcKey': dataKey.value,
    'patchData': form.value,
  });
  loading.close();
  if(result.status == 200){
    createMsg('编辑谱目成功!', true);
    close(true);
  }else{
    createMsg(result.msg);
  }
};

const handleSave = () => {
    for(let i = 0; i < field_branch.value.length; i++){
        if(!form.value[field_branch.value[i].fieldName] && field_branch.value[i].required){
            return ElMessage({
                message: field_branch.value[i].fieldMeans+'必填',
                type: 'warning',
            });
        }
    }
    if(dataKey.value){
        editSingleGC();
    }else{
        createSingleGC();
    }
}

const emit = defineEmits(['close', 'save']);
const close = (f = false) => {
    emit('close', f);
}

const versionList = ref([
    // {'label': '版本类型', 'value': ''},
    {'label': '刻本', 'value': '刻本'},
    {'label': '刊本', 'value': '刊本'},
    {'label': '写本', 'value': '写本'},
]);

const singleOrTwoList = ref([
    // {'label': '单双页', 'value': ''},
    {'label': '单页', 'value': '单页'},
    {'label': '双页', 'value': '双页'},
]);

const carrierTypeList = ref([
    {'label': '纸质', 'value': '纸质'},
    {'label': '电子谱', 'value': '电子谱'},
]);

const dataKey = ref('');
const isCreateVolume = ref(false);
const form = ref({
    'genealogyName': '', 
    'surname': '',
    'hall': '',
    'publish': '',
    'publishAD': '',
    'place': '',
    'authors': '',
    'authorJob': '',
    'migrationAncestor': '',
    'celebrity': '',
    'version': '',
    'volume': '',
    'lostVolume': '',
    'singleOrTwo': '',
    'hasVolume': '',
    'explain': '',
    'owner': '',
    'carrierType': '纸质',
    'inStoreSerialName': '',
});

const field_branch = ref([
    {'fieldMeans': '谱名', 'fieldName': 'genealogyName', 'required': true, 'type': 'text'},
    {'fieldMeans': '姓氏', 'fieldName': 'surname', 'required': true, 'type': 'text'},
    {'fieldMeans': '堂号', 'fieldName': 'hall', 'required': true, 'type': 'text'},
    {'fieldMeans': '出版年', 'fieldName': 'publish', 'type': 'text'},
    {'fieldMeans': '公元年', 'fieldName': 'publishAD', 'type': 'text'},
    {'fieldMeans': '谱籍地', 'fieldName': 'place', 'required': true, 'type': 'text'},
    {'fieldMeans': '作者', 'fieldName': 'authors', 'required': true, 'type': 'text'},
    {'fieldMeans': '作者职务', 'fieldName': 'authorJob', 'required': true, 'type': 'text'},
    {'fieldMeans': '始迁祖', 'fieldName': 'migrationAncestor', 'type': 'text'},
    {'fieldMeans': '先祖名人', 'fieldName': 'celebrity', 'type': 'text'},
    {'fieldMeans': '版本类型', 'fieldName': 'version', 'required': true, 'type': 'text'},
    {'fieldMeans': '总卷数', 'fieldName': 'volume', 'required': true, 'type': 'text'},
    {'fieldMeans': '缺卷说明', 'fieldName': 'lostVolume', 'type': 'text'},
    {'fieldMeans': '单双页', 'fieldName': 'singleOrTwo', 'required': true, 'type': 'text'},
    {'fieldMeans': '实拍册数', 'fieldName': 'hasVolume', 'required': true, 'type': 'text'},
    {'fieldMeans': '说明', 'fieldName': 'explain', 'type': 'textarea'},
    {'fieldMeans': '馆藏地', 'fieldName': 'owner', 'type': 'text'},
    {'fieldMeans': '载体形态', 'fieldName': 'carrierType', 'type': 'text'},
    {'fieldMeans': '入库编号', 'fieldName': 'inStoreSerialName', 'type': 'text'},
]);

onMounted(() => {
    dataKey.value = props.dataRow._key;
    if(dataKey.value){
        field_branch.value.forEach((ele) => {
            form.value[ele.fieldName] = props.dataRow[ele.fieldName] || '';
        });
    }
});

</script>

<template>
    <DragModule>
        <template #header>
            <h3 class="title">{{!dataKey ? '新建' : '编辑'}}</h3>
        </template>
        <template #main>
            <el-form :model="form" label-width="90px">
                <el-form-item 
                    v-for="(item, index) in field_branch" 
                    :key="index" 
                    :label="item.fieldMeans+(item.required ? '*' : '')"
                >
                    <el-input 
                        class="w200" 
                        v-if="['version', 'singleOrTwo', 'carrierType'].indexOf(item.fieldName) === -1" 
                        :type="item.type" 
                        :rows="3" 
                        v-model="form[item.fieldName]" 
                        :placeholder="'请输入'+item.fieldMeans" 
                    />
                    <el-select 
                        class="w200" 
                        v-if="'version' === item.fieldName" 
                        v-model="form[item.fieldName]" 
                        :placeholder="'请输入'+item.fieldMeans"
                    >
                        <el-option
                            v-for="item2 in versionList"
                            :key="item2.value"
                            :label="item2.label"
                            :value="item2.value"
                        />
                    </el-select>
                    <el-select 
                        class="w200" 
                        v-if="'singleOrTwo' === item.fieldName" 
                        v-model="form[item.fieldName]" 
                        :placeholder="'请输入'+item.fieldMeans"
                    >
                        <el-option
                            v-for="item2 in singleOrTwoList"
                            :key="item2.value"
                            :label="item2.label"
                            :value="item2.value"
                        />
                    </el-select>
                    <el-select 
                        class="w200" 
                        v-if="'carrierType' === item.fieldName" 
                        v-model="form[item.fieldName]" 
                        :placeholder="'请输入'+item.fieldMeans"
                    >
                        <el-option
                            v-for="item2 in carrierTypeList"
                            :key="item2.value"
                            :label="item2.label"
                            :value="item2.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item v-if="!dataKey">
                    <el-checkbox v-model="isCreateVolume" label="按总卷册数自动生成卷册列表" />
                </el-form-item>
            </el-form>
        </template>
        <template #footer>
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button @click="close(false)">取消</el-button>
        </template>
    </DragModule>
</template>

<style scoped lang="scss">

</style>