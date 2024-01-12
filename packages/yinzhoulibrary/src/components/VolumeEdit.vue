<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue, createMsg } from '../util/ADS.js';
import { catalog, baseURL, volumeApi } from '../util/api';
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

const dataKey = ref('');
const form = ref({
    'volumeNumber': '', 
    'internalSerialNumber': '',
    'genealogyName': '',
});

const gcList = ref([]);
const gcKey = ref('');
const isShow = ref(false);
const remoteMethod = (e) => {
    if(form.value.genealogyName){
        searchGenealogyName(form.value.genealogyName);
    }else{
        handleClear();
    }
}

const handleClear = () => {
    gcList.value = [];
    isShow.value = false;
}

const handleClickSelect = (data) => {
    gcKey.value = data.value;
    form.value.genealogyName = data.label;
    isShow.value = false;
}

const searchGenealogyName = async (genealogyName) => {
  const result = await catalog.searchGenealogyName({
    'token': token.value,
    'genealogyName': genealogyName,
  });
  if(result.status == 200){
    gcList.value = result.result.list.map((ele) => {
        ele.label = ele.genealogyName+'('+ele._key+')';
        ele.value = ele._key;

        return ele;
    });
    console.log(gcList.value);
    gcList.value.length ? isShow.value = true : null;
  }else{
    createMsg(result.msg);
  }
};

const loading = ref(false);

const createSingleVolume = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await volumeApi.createSingleVolume({
    'token': token.value,
    'gcKey': gcKey.value,
    'volumeNumber': form.value.volumeNumber,
    'internalSerialNumber': form.value.internalSerialNumber,
  });
  loading.close();
  if(result.status == 200){
    createMsg('新建卷册成功!', true);
    close(true);
  }else{
    createMsg(result.msg);
  }
};

const editSingleVolume = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await volumeApi.editSingleVolume({
    'token': token.value,
    'vKey': dataKey.value,
    'patchData': {
        'volumeNumber': form.value.volumeNumber,
        'internalSerialNumber': form.value.internalSerialNumber,
    },
  });
  loading.close();
  if(result.status == 200){
    createMsg('编辑卷册成功!', true);
    close(true);
  }else{
    createMsg(result.msg);
  }
};

const handleSave = () => {
    if(dataKey.value){
        if(!form.value.volumeNumber){
            return createMsg('请输入卷名');
        }
        if(!form.value.internalSerialNumber){
            return createMsg('请输入卷序号');
        }
        editSingleVolume();
    }else{
        if(!gcKey.value){
            return createMsg('请输入谱名');
        }
        if(!form.value.volumeNumber){
            return createMsg('请输入卷名');
        }
        if(!form.value.internalSerialNumber){
            return createMsg('请输入卷序号');
        }
        createSingleVolume();
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
            'volumeNumber': props.dataRow.volumeNumber || '', 
            'internalSerialNumber': props.dataRow.internalSerialNumber || '',
        }
    }
});

</script>

<template>
    <section class="volume-edit-section">
        <header class="header">
            <h3 class="title">{{!dataKey ? '新建' : '编辑'}}</h3>
        </header>
        <main class="main marginT20">
            <el-form :model="form" label-width="60px">
                <el-form-item label="谱名" v-if="!dataKey">
                    <div class="search-wrap">
                        <el-input class="input w200" type="text" v-model="form.genealogyName" @keyup.enter="remoteMethod" @clear="handleClear" placeholder="请输入谱名" clearable />
                        <ul class="select style1" v-show="isShow">
                            <li v-for="item in gcList" :key="item.value" :title="item.label" :label="item.label" :value="item.value" @click="handleClickSelect(item)">{{item.label}}</li>
                        </ul>
                    </div>
                </el-form-item>
                <el-form-item label="卷名">
                    <el-input class="w200" type="text" v-model="form.volumeNumber" placeholder="请输入卷名，如 卷1" />
                </el-form-item>
                <el-form-item label="卷序号">
                    <el-input class="w200" type="text" v-model="form.internalSerialNumber" placeholder="请输入卷序号，如 001" />
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
.volume-edit-section{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 50px;
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
.search-wrap{
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 10000;
    .input{
        position: absolute;
        top: 0;
        left: 0;
    }
    .select{
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        min-height: 30px;
        max-height: 150px;
        background-color: #fff;
        box-shadow: 0 0 10px 0 #ddd;
        border-radius: 5px;
        overflow-y: auto;
        li{
            height: 30px;
            line-height: 30px;
            text-indent: 10px;
            white-space: nowrap; /* 不换行 */
            overflow: hidden; /* 超出部分隐藏 */
            text-overflow: ellipsis; /* 显示省略号 */
            cursor: pointer;
            :hover{
                color: #409eff;
            }
        }
    }
}
</style>