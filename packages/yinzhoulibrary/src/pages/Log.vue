<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { baseURL, logApi } from '../util/api';
import { ElLoading } from 'element-plus';
import { getQueryVariable, createMsg, formattedDate } from '../util/ADS';
import { useTable } from '../composables/useTable.js';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, token, isResize } = storeToRefs(global);
const { saveProperyValue } = global;

const getOperationLogType = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  tableData.value = [];
  const result = await logApi.getOperationLogType({
    'token': token.value,
  });
  loading.close();
  if(result.status == 200){
    let arr = [{'label': '日志类型', 'value': ''}];
    result.result.forEach((ele) => {
      arr.push({'label': ele, 'value': ele});
    });
    logTypeList.value = arr;
  }else{
    createMsg(result.msg);
  }
};

const logTypeList = ref([]);
const searchParameters = ref({
  'logType': '',
  'log': '',
});
const h = ref(200);
const handleSearch = () => {
  pagination.reset();
  refresh(searchParameters.value);
}

watch(isResize, () => {
  h.value = window.innerHeight - 50 - 50 - 72 - 20 - 20;
});

const [tableData, refresh, loading, pagination] = useTable(logApi.getOperationLogList, searchParameters.value,
  {
    path: {
      data: 'data',
      total: 'total',
      page: 'page',
      size: 'limit',
    },
    immediate: true
  });

onMounted(() => {
  h.value = window.innerHeight - 50 - 50 - 72 - 20 - 20;
  getOperationLogType();
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
          <el-select v-model="searchParameters.logType" class="w150" placeholder="日志类型">
            <el-option
              v-for="item in logTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="searchParameters.log" class="w150" placeholder="日志内容" clearable />
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
        <el-table-column prop="logType" label="日志类型" width="150" align="center" />
        <el-table-column prop="log" label="日志内容" min-width="120" align="center" />
        <el-table-column prop="time" label="创建时间" width="100" align="center" />
        <el-table-column prop="userName" label="创建者" width="120" align="center" />
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
          :current-page="pagination.current"
          :page-size="pagination.size"
          :total="pagination.total"
          @current-change="pagination.onPageChange"
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
