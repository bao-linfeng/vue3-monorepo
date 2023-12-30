<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog, baseURL, volumeApi } from '../util/api';
import { ElLoading } from 'element-plus';
import { getQueryVariable, createMsg, initDownloadExcel } from '../util/ADS';
import VolumeEdit from '../components/VolumeEdit.vue';
import ImageUpload from '../components/ImageUpload.vue';
import IndexUpload from '../components/IndexUpload.vue';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;

const getVolumeList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  tableData.value = [];
  const result = await volumeApi.getVolumeList({
    'token': token.value,
    'gcKey': gcKey.value,
    'genealogyName': genealogyName.value,
    'volumeKey': volumeKey.value,
    'page': page.value,
    'limit': limit.value,
  });
  loading.close();
  if(result.status == 200){
    tableData.value = result.result.list;
    total.value = result.result.total;
  }else{
    createMsg(result.msg);
  }
};

const volumeStatistics = async () => {
  const result = await volumeApi.volumeStatistics({
    'token': token.value,
    'gcKey': gcKey.value,
    'genealogyName': genealogyName.value,
    'volumeKey': volumeKey.value,
  });
  if(result.status == 200){
    imageCount.value = result.result.imageCount;
  }else{
    ElMessage({
      message: result.msg,
      type: 'warning',
    });
  }
};

const deleteSingleVolume = async (vKey) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await volumeApi.deleteSingleVolume({
    'token': token.value,
    'vKey': vKey,
  });
  loading.close();
  if(result.status == 200){
    createMsg('删除卷册成功!', true);
    getVolumeList();
  }else{
    createMsg(result.msg);
  }
};

const props = defineProps({
  msg: String,
});

const gcKey = ref('');
const genealogyName = ref('');
const volumeKey = ref('');
const page = ref(1);
const limit = ref(30);
const total = ref(0);
const tableData = ref([]);
const h = ref(200);
const imageCount = ref(0);
const handleSearch = () => {
    page.value = 1;
    getVolumeList();
    volumeStatistics();
}

const handleClickAction = (row, t) => {
  console.log(row, t);
  if(t === 'linkImages'){
    
  }
  if(t === 'edit'){
    
  }
  if(t === 'delete'){
    deleteSingleVolume(row._key);
  }
  if(t === 'add'){
    
  }
  dataRow.value = row;
  isShow.value = t;
}

const handleCurrentChange = (data) => {
    page.value = data;
    getVolumeList();
}

const dataRow = ref('');
const isShow = ref('');
const handleClose = (data) => {
  console.log(data);
  if(data){
    handleSearch();
  }
  isShow.value = '';
}

const handleBatchUpdate = () => {

}

onMounted(() => {
  h.value = window.innerHeight - 50 - 50 - 72 - 20 - 20;
  gcKey.value = getQueryVariable('id');
  handleSearch();
});

</script>

<template>
  <section class="manage-volume-wrap">
    <header class="header">
      <h3 class="title">卷册列表</h3>
      <div class="right">
        <el-button type="primary" @click="handleClickAction({}, 'add')">新建卷册</el-button>
      </div>
    </header>
    <main class="main">
      <!-- search -->
      <section class="search-wrap">
        <div class="search-box">
          <el-input v-model="gcKey" class="w150" placeholder="谱ID" clearable />
          <el-input v-model="genealogyName" class="w150" placeholder="谱名" clearable />
          <el-input v-model="volumeKey" class="w150" placeholder="卷ID" clearable />
          <el-button type="primary" @click="handleSearch">检索</el-button>
        </div>
      </section>
      <!-- table -->
      <el-table 
        ref="jiapu"
        :data="tableData" 
        border 
        :height="h"
        style="width: 100%">
        <el-table-column prop="gcKey" label="谱ID" width="120" align="center" />
        <el-table-column prop="genealogyName" label="谱名" min-width="120" align="center" />
        <el-table-column prop="surname" label="姓氏" width="120" align="center" />
        <el-table-column prop="_key" label="卷ID" width="120" align="center" />
        <el-table-column prop="volumeNumber" label="卷名" width="120" align="center" />
        <el-table-column prop="internalSerialNumber" label="卷序号" width="120" align="center" />
        <el-table-column prop="images" label="页码" width="120" align="center" />
        <el-table-column label="操作" fixed="right" width="300" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" @click="handleClickAction(scope.row, 'linkImages')">关联影像</el-button>
            <el-button size="small" type="primary" @click="handleClickAction(scope.row, 'linkIndex')">关联全文</el-button>
            <el-button size="small" type="primary" @click="handleClickAction(scope.row, 'edit')">编辑</el-button>
            <el-popconfirm
              width="220"
              :confirm-button-text="'确定'"
              :cancel-button-text="'取消'"
              :title="'您确认要删除该卷册吗?'"
              @confirm="handleClickAction(scope.row, 'delete')"
            >
              <template #reference>
                  <el-button type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer class="footer">
      <div class="left">
        <p>合计: {{imageCount}}页</p>
      </div>
      <div class="right">
        <!-- 分页器 -->
        <el-pagination
          small
          background
          layout="prev, pager, next, jumper, total"
          :current-page="page"
          :page-size="limit"
          :total="total"
          @current-change="handleCurrentChange"
        />
      </div>
    </footer>
  </section>
  <VolumeEdit v-if="isShow === 'add' || isShow === 'edit'" :dataRow="dataRow" v-on:close="handleClose" />
  <ImageUpload v-if="isShow === 'linkImages'" :dataRow="dataRow" v-on:close="handleClose" />
  <IndexUpload v-if="isShow === 'linkIndex'" :dataRow="dataRow" v-on:close="handleClose" />
</template>

<style scoped lang="scss">
.manage-volume-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  color: #333;
  background-color: #f2f2f2;
  .header{
    width: calc(100% - 40px);
    padding: 0 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
  }
  .main{
    margin: 20px 20px 0 20px;
    width: calc(100% - 80px);
    height: calc(100% - 120px);
    padding: 0 20px;
    background-color: #fff;
    .search-wrap{
      padding: 20px 0;
      .search-box{
        display: flex;
        align-items: center;
      }
    }
  }
  .footer{
    width: calc(100% - 40px);
    padding: 0 20px;
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left{
        
    }
    .right{
      display: flex;
      align-items: center;
    }
  }
}
</style>
