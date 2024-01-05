<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog, baseURL, volumeApi } from '../util/api';
import { ElLoading } from 'element-plus';
import { getQueryVariable, createMsg, initDownloadExcel } from '../util/ADS';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token, isResize } = storeToRefs(global);
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
    'gcKey': '',
    'genealogyName': '',
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

const props = defineProps({
  msg: String,
});

const volumeKey = ref('');
const page = ref(1);
const limit = ref(30);
const total = ref(0);
const tableData = ref([]);
const h = ref(200);
const handleSearch = () => {
    page.value = 1;
    getVolumeList();
}

const handleCurrentChange = (data) => {
    page.value = data;
    getVolumeList();
}

watch(isResize, () => {
  h.value = window.innerHeight - 50 - 50 - 72 - 20 - 20;
});

onMounted(() => {
  h.value = window.innerHeight - 50 - 50 - 72 - 20 - 20;
  handleSearch();
});

</script>

<template>
  <section class="log-wrap">
    <header class="header">
      <h3 class="title">系统日志</h3>
      <div class="right">
        
      </div>
    </header>
    <main class="main">
      <!-- search -->
      <section class="search-wrap">
        <div class="search-box">
          <!-- <el-input v-model="gcKey" class="w150" placeholder="谱ID" clearable /> -->
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
      </el-table>
    </main>
    <footer class="footer">
      <div class="left">
        
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
</template>

<style scoped lang="scss">
.log-wrap {
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
