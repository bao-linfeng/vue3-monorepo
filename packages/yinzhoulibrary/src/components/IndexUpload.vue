<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue, createMsg } from '../util/ADS.js';
import { catalog, baseURL, volumeApi, uploadApi, imageApi } from '../util/api';
import { ElMessage, ElLoading } from 'element-plus';

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
    'gcKey': '',
});

const handleSave = () => {
    if(dataKey.value){

    }else{
        
    }
    close();
}

const emit = defineEmits(['close', 'save']);
const close = () => {
    emit('close');
}

const uploadIndex = ref(0);
const uploadLength = ref(0);
let i = 0, l = 0, files = [];
const handleInputChange = (e) => {
    files = Array.from(e.target.files).filter((ele) => {
        return ele.name.indexOf('.xml') > -1;
    });
    uploadLength.value = files.length;
    e.target.value = '';
}

function handleUploadImage(){
    if(uploadIndex.value < uploadLength.value){
        let fd = new FormData(), name = form.value.gcKey+'_'+form.value.internalSerialNumber+'_'+files[uploadIndex.value].name;
        fd.append('file', new File([files[uploadIndex.value]], name));
        uploadJPGOrXML(fd);
        fd = null;
        name = null;
    }else{
        files = [];
        hasImage();
    }
}

const uploadJPGOrXML = async (fd) =>{
  const result = await uploadApi.uploadJPGOrXML(fd);
  if(result.status == 200){
    imageAnalysis(result.simplePath);
  }else{
    ElMessage({
        message: result.msg,
        type: 'warning',
    });
    uploadIndex.value = uploadIndex.value + 1;
    handleUploadImage();
  }
}

const imageAnalysis = async (simplePath) => {
  const result = await imageApi.imageAnalysis({
    'token': token.value,
    'gcKey': form.value.gcKey,
    'vKey': dataKey.value,
    'simplePath': simplePath,
  });
  if(result.status == 200){
    uploadIndex.value = uploadIndex.value + 1;
    handleUploadImage();
  }else{
    ElMessage({
        message: result.msg,
        type: 'warning',
    });
    uploadIndex.value = uploadIndex.value + 1;
    handleUploadImage();
  }
};

const hasImage = async () => {
  const result = await catalog.hasImage({
    'token': token.value,
    'gcKey': form.value.gcKey,
    'type': 'hasIndex',
  });
  if(result.status == 200){
    ElMessage({
        message: '批量关联全文成功!',
        type: 'success',
    });
  }else{
    ElMessage({
        message: result.msg,
        type: 'warning',
    });
  }
};

onMounted(() => {
    dataKey.value = props.dataRow._key;
    if(dataKey.value){
        form.value = {
            'volumeNumber': props.dataRow.volumeNumber || '卷1', 
            'internalSerialNumber': props.dataRow.internalSerialNumber || '001',
            'gcKey': props.dataRow.gcKey || '',
        }
    }
});

</script>

<template>
    <section class="image-upload-section">
        <header class="header">
            <h3 class="title">全文上传</h3>
        </header>
        <main class="main marginT20">
            <el-form :model="form" label-width="60px">
                <el-form-item label="卷名">
                    <el-input class="w200" type="text" v-model="form.volumeNumber" :disabled="true" />
                </el-form-item>
                <el-form-item label="卷序号">
                    <el-input class="w200" type="text" v-model="form.internalSerialNumber" :disabled="true" />
                </el-form-item>
                <el-form-item label="文件夹">
                    <div class="upload-wrap">
                        <div class="upload-box">
                            <input type="file" id="folderInput" @change="handleInputChange" accept=".jpg" directory webkitdirectory mozdirectory />
                            <label for="folderInput" class="label">选择文件</label>
                        </div>
                        <p class="btn marginL10" @click="handleUploadImage">上传</p>
                    </div>
                </el-form-item>
            </el-form>
        </main>
        <div class="process-wrap" v-if="uploadLength">
            <div class="process-box">
                <i class="p" :style="{width: (100*uploadIndex/uploadLength)+'%'}"></i>
                <i class="d">{{uploadIndex}}/{{uploadLength}}</i>
            </div>
        </div>
        <footer class="footer marginT20">
            <el-button type="primary" @click="handleSave">保存</el-button>
            <el-button @click="close">取消</el-button>
        </footer>
    </section>
</template>

<style scoped lang="scss">
.image-upload-section{
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
    .main{
        .upload-wrap{
            position: relative;
            display: flex;
            align-items: center;
            .upload-box{
                position: relative;
                width: 120px;
                height: 30px;
                display: flex;
                align-items: center;
                #folderInput{
                    opacity: 0;
                    width: 100%;
                    height: 100%;
                }
                .label{
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    text-align: center;
                    background-color: #C9A470;
                    color: #fff;
                    border-radius: 5px;
                    cursor: pointer;
                }
            }
            .btn{
                border: none;
                outline: none;
                width: 60px;
                height: 30px;
                line-height: 30px;
                border-radius: 4px;
                background-color: #C9A470;
                color: #fff;
                cursor: pointer;
                text-align: center;
            }
        }
    }
    .process-wrap{
        position: relative;
        height: 30px;
        display: flex;
        align-items: center;
        .process-box{
            position: relative;
            width: 100%;
            height: 20px;
            border-radius: 10px;
            overflow: hidden;
            background-color: #f2f2f2;
            .p{
                position: absolute;
                top: 0;
                left: 0;
                width: 10%;
                height: 100%;
                background-color: #409eff;
            }
            .d{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #f00;
            }
        }
    }
    .footer{
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>