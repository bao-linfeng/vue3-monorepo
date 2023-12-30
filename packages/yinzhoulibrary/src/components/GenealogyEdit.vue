<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue, createMsg } from '../util/ADS.js';
import { catalog } from '../util/api';
import { ElLoading } from 'element-plus';

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
    'authors': form.value.authors,
    'authorJob': form.value.authorJob,
    'place': form.value.place,
    'LocalityModern': form.value.LocalityModern,
    'version': form.value.version,
    'volume': form.value.volume,
    'hasVolume': form.value.hasVolume,
    'memo': form.value.memo,
    'explain': form.value.explain,
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
    'patchData': {
        'genealogyName': form.value.genealogyName,
        'surname': form.value.surname,
        'hall': form.value.hall,
        'publish': form.value.publish,
        'publishAD': form.value.publishAD,
        'authors': form.value.authors,
        'authorJob': form.value.authorJob,
        'place': form.value.place,
        'LocalityModern': form.value.LocalityModern,
        'version': form.value.version,
        'volume': form.value.volume,
        'hasVolume': form.value.hasVolume,
        'memo': form.value.memo,
        'explain': form.value.explain,
    },
  });
  loading.close();
  if(result.status == 200){
    createMsg('编辑谱目成功!', true);
    close(true);
  }else{
    createMsg(result.msg);
  }
};

const dataKey = ref('');
const form = ref({
    'genealogyName': '', 
    'surname': '',
    'hall': '',
    'publish': '',
    'publishAD': '',
    'authors': '',
    'authorJob': '',
    'place': '',
    'LocalityModern': '',
    'version': '',
    'volume': '',
    'hasVolume': '',
    'memo': '',
    'explain': '',
    'isCreateVolume': ''
});

const handleSave = () => {
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

onMounted(() => {
    dataKey.value = props.dataRow._key;
    if(dataKey.value){
        form.value = {
            'genealogyName': props.dataRow.genealogyName || '', 
            'surname': props.dataRow.surname || '',
            'hall': props.dataRow.hall || '',
            'publish': props.dataRow.publish || '',
            'publishAD': props.dataRow.publishAD || '',
            'authors': props.dataRow.authors || '',
            'authorJob': props.dataRow.authorJob || '',
            'place': props.dataRow.place || '',
            'LocalityModern': props.dataRow.LocalityModern || '',
            'version': props.dataRow.version || '',
            'volume': props.dataRow.volume || '',
            'hasVolume': props.dataRow.hasVolume || '',
            'memo': props.dataRow.memo || '',
            'explain': props.dataRow.explain || '',
        }
    }
});

</script>

<template>
    <section class="genealogy-edit-section">
        <header class="header">
            <h3 class="title">{{!dataKey ? '新建' : '编辑'}}</h3>
        </header>
        <main class="main marginT20">
            <el-form :model="form" label-width="90px">
                <el-form-item label="谱名">
                    <el-input class="w200" type="text" v-model="form.genealogyName" placeholder="请输入谱名" />
                </el-form-item>
                <el-form-item label="姓氏">
                    <el-input class="w200" type="text" v-model="form.surname" placeholder="请输入姓氏" />
                </el-form-item>
                <el-form-item label="堂号">
                    <el-input class="w200" type="text" v-model="form.hall" placeholder="请输入堂号" />
                </el-form-item>
                <el-form-item label="出版年">
                    <el-input class="w200" type="text" v-model="form.publish" placeholder="请输入出版年" />
                </el-form-item>
                <el-form-item label="公元年">
                    <el-input class="w200" type="text" v-model="form.publishAD" placeholder="请输入公元年" />
                </el-form-item>
                <el-form-item label="作者">
                    <el-input class="w200" type="text" v-model="form.authors" placeholder="请输入作者" />
                </el-form-item>
                <el-form-item label="作者职务">
                    <el-input class="w200" type="text" v-model="form.authorJob" placeholder="请输入作者职务" />
                </el-form-item>
                <el-form-item label="谱籍地">
                    <el-input class="w200" type="text" v-model="form.place" placeholder="请输入谱籍地" />
                </el-form-item>
                <el-form-item label="现代谱籍地">
                    <el-input class="w200" type="text" v-model="form.LocalityModern" placeholder="请输入现代谱籍地" />
                </el-form-item>
                <el-form-item label="版本类型">
                    <el-input class="w200" type="text" v-model="form.version" placeholder="请输入版本类型" />
                </el-form-item>
                <el-form-item label="总卷数">
                    <el-input class="w200" type="text" v-model="form.volume" placeholder="请输入总卷数" />
                </el-form-item>
                <el-form-item label="实拍册数">
                    <el-input class="w200" type="text" v-model="form.hasVolume" placeholder="请输入实拍册数" />
                </el-form-item>
                <el-form-item label="备注">
                    <el-input class="w200" type="textarea" :rows="3" v-model="form.memo" placeholder="请输入备注" />
                </el-form-item>
                <el-form-item label="说明">
                    <el-input class="w200" type="textarea" :rows="3" v-model="form.explain" placeholder="请输入说明" />
                </el-form-item>
                <el-form-item v-if="!dataKey">
                    <el-checkbox v-model="form.isCreateVolume" label="按总卷册数自动生成卷册列表" />
                </el-form-item>
            </el-form>
        </main>
        <footer class="footer">
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button @click="close">取消</el-button>
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
    z-index: 10000;
    background-color: #fff;
    .header{
        text-align: center;
    }
    .footer{
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>