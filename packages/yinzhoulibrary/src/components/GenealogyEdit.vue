<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue, createMsg } from '../util/ADS.js';
import { catalog } from '../util/api';
import { ElLoading, ElMessage } from 'element-plus';

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
  const result = await catalog.createSingleGC({
    'token': token.value,
    'genealogyName': form.value.genealogyName,
    'surname': form.value.surname,
    'hall': form.value.hall,
    'publish': form.value.publish,
    'publishAD': form.value.publishAD,
    'place': form.value.place,
    'authors': form.value.authors,
    'authorJob': form.value.authorJob,
    'migrationAncestor': form.value.migrationAncestor,
    'celebrity': form.value.celebrity,
    'version': form.value.version,
    'volume': form.value.volume,
    'lostVolume': form.value.lostVolume,
    'singleOrTwo': form.value.singleOrTwo,
    'hasVolume': form.value.hasVolume,
    'explain': form.value.explain,
    'owner': form.value.owner,
    'inStoreSerialName': form.value.inStoreSerialName,

    'isCreateVolume': form.value.isCreateVolume ? 1 : 0,
  });
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
    {'label': '版本类型', 'value': ''},
    {'label': '刻本', 'value': '刊本'},
    {'label': '刊本', 'value': '刊本'},
    {'label': '写本', 'value': '写本'},
]);

const singleOrTwoList = ref([
    {'label': '单双页', 'value': ''},
    {'label': '单页', 'value': '单页'},
    {'label': '双页', 'value': '双页'},
]);

const dataKey = ref('');
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
    'inStoreSerialName': '',
    'isCreateVolume': '',
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
    <section class="genealogy-edit-section">
        <header class="header">
            <h3 class="title">{{!dataKey ? '新建' : '编辑'}}</h3>
        </header>
        <main class="main style1">
            <el-form :model="form" label-width="90px">
                <el-form-item v-for="(item, index) in field_branch" :key="index" :label="item.fieldMeans+(item.required ? '*' : '')">
                    <!-- v-if="['version', 'singleOrTwo'].indexOf(item.fieldName) === -1"  -->
                    <el-input class="w200" :type="item.type" :rows="3" v-model="form[item.fieldName]" :placeholder="'请输入'+item.fieldMeans" />
                    <!-- <el-select class="w200" v-if="'version' === item.fieldName" v-model="form[item.fieldName]" :placeholder="'请输入'+item.fieldMeans">
                        <el-option
                            v-for="item2 in versionList"
                            :key="item2.value"
                            :label="item2.label"
                            :value="item2.value"
                        />
                    </el-select>
                    <el-select class="w200" v-if="'singleOrTwo' === item.fieldName" v-model="form[item.fieldName]" :placeholder="'请输入'+item.fieldMeans">
                        <el-option
                            v-for="item2 in singleOrTwoList"
                            :key="item2.value"
                            :label="item2.label"
                            :value="item2.value"
                        />
                    </el-select> -->
                </el-form-item>

                <el-form-item v-if="!dataKey">
                    <el-checkbox v-model="form.isCreateVolume" label="按总卷册数自动生成卷册列表" />
                </el-form-item>
            </el-form>
        </main>
        <footer class="footer">
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button @click="close(false)">取消</el-button>
        </footer>
    </section>
</template>

<style scoped lang="scss">
.genealogy-edit-section{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 50px;
    box-shadow: 0 0 1px 2px #ddd;
    border-radius: 10px;
    z-index: 10;
    background-color: #fff;
    height: calc(100% - 80px);
    .header{
        text-align: center;
        height: 50px;
    }
    .main{
        height: calc(100% - 100px);
        overflow-y: auto;
    }
    .footer{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 50px;
    }
}
</style>