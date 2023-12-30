<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog, baseURL, uploadApi, pedigreeApi } from '../util/api';
import { ElLoading, ElMessage } from 'element-plus';
import { getQueryVariable, createMsg, initDownloadExcel, downliadLink } from '../util/ADS';
import GenealogyEdit from '../components/GenealogyEdit.vue';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;

const getDataList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  tableData.value = [];
  const result = await catalog.searchGC({
    'token': token.value,
    'gcKey': SearchParameters.value.gcKey,
    'genealogyName': SearchParameters.value.genealogyName,
    'surname': SearchParameters.value.surname,
    'hall': SearchParameters.value.hall,
    'publish': SearchParameters.value.publish,
    'authors': SearchParameters.value.authors,
    'place': SearchParameters.value.place,
    'LocalityModern': SearchParameters.value.LocalityModern,
    'hasImage': SearchParameters.value.hasImage,
    'hasIndex': SearchParameters.value.hasIndex,
    'hasTree': SearchParameters.value.hasTree,
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

const GCStatistics = async () => {
  const result = await catalog.GCStatistics({
    'token': token.value,
    'gcKey': SearchParameters.value.gcKey,
    'genealogyName': SearchParameters.value.genealogyName,
    'surname': SearchParameters.value.surname,
    'hall': SearchParameters.value.hall,
    'publish': SearchParameters.value.publish,
    'authors': SearchParameters.value.authors,
    'place': SearchParameters.value.place,
    'LocalityModern': SearchParameters.value.LocalityModern,
    'hasImage': SearchParameters.value.hasImage,
    'hasIndex': SearchParameters.value.hasIndex,
    'hasTree': SearchParameters.value.hasTree,
  });
  if(result.status == 200){
    volumeCount.value = result.result.volumeCount;
    imageCount.value = result.result.imageCount;
  }else{
    ElMessage({
      message: result.msg,
      type: 'warning',
    });
  }
};

const deleteSingleGC = async (gcKey) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await catalog.deleteSingleGC({
    'token': token.value,
    'gcKey': gcKey,
  });
  loading.close();
  if(result.status == 200){
    createMsg('删除谱目成功!', true);
    getDataList();
  }else{
    createMsg(result.msg);
  }
};

const batchImportCatalog = async (filePath) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await catalog.batchImportCatalog({
    'token': token.value,
    'filePath': filePath,
  });
  loading.close();
  if(result.status == 200){
    createMsg('批量导入谱目成功!', true);
    getDataList();
  }else if(result.status == 301){
    createMsg('批量导入谱目失败!');
    downliadLink(result.result, baseURL+'/');
  }else{
    createMsg(result.msg);
  }
};

const SearchParameters = ref({
  'gcKey': '',
  'genealogyName': '',
  'surname': '',
  'hall': '',
  'publish': '',
  'authors': '',
  'place': '',
  'LocalityModern': '',
  'hasImage': '',
  'hasIndex': '',
  'hasTree': '',
});
const page = ref(1);
const limit = ref(30);
const total = ref(0);
const tableData = ref([]);
const h = ref(200);
const volumeCount = ref(0);
const imageCount = ref(0);
const handleSearch = () => {
    page.value = 1;
    getDataList();
    GCStatistics();
}

const handleClickAction = (row, t) => {
  if(t === 'lookImage'){
    window.open('/ImageView?id='+row._key+'&genealogyName='+row.genealogyName+'&volumeKey='+row.firstVolumeKey+'&page=1');
  }
  if(t === 'lookIndex'){
    window.open('/ImageView?id='+row._key+'&genealogyName='+row.genealogyName+'&volumeKey='+row.firstVolumeKey+'&page=1&content=&isText=1');
  }
  if(t === 'lookTree'){
    window.open('/Relationmap?id='+row._key);
  }
  if(t === 'lookVolume'){
    router.push('/VolumeManage?id='+row._key);
  }
  if(t === 'edit'){
    
  }
  if(t === 'delete'){
    deleteSingleGC(row._key);
  }
  if(t === 'add'){
    
  }
  if(t === 'template'){
    initDownloadExcel([
      ['谱名', '姓氏', '出版年', '公元年', '堂号', '作者', '作者职务', '现代地名', '始迁祖', '先祖名人', '版本类型', '总卷数', '实拍册数', '影像页', '说明', '馆藏地', '入库名'],
      ['甬東包氏支譜', '包', '（清）光緒四年', '1878', '尊樂堂', '不详', '编纂', '浙江省,宁波市,鄞州区', '榮', '業，為一世祖。拯，字希仁，諡孝肅，宋朝人，龍圖閣大學士，為五世祖。', '刻本', '3卷', '3', '289', '世系修錄至第三十五世', '鄞州圖書館', '7001'],
    ], '鄞州图书馆谱目表头');
  }
  if(t === 'batchLoad'){
    
  }
  dataRow.value = row;
  isShow.value = t;
}

const handleCurrentChange = (data) => {
    page.value = data;
    getDataList();
}

const dataRow = ref('');
const isShow = ref('');
const handleClose = (data) => {
  if(data){
    handleSearch();
  }
  isShow.value = '';
}

const handleBatchUpdate = (response, uploadFile, uploadFiles) => {
  if(response.statusCode == 200){
    console.log(response);
    batchImportCatalog(response.filePath);
  }else{
    createMsg(response.msg);
  }
}

const uploadType = ref('');
const handleClickInput = (row, t) => {
  dataRow.value = row;
  uploadType.value = t;
}

const handleInputChange = (e) => {
  let file = e.target.files[0], fd = new FormData(), name = dataRow.value._key+'_'+file.name;

  fd.append('file', new File([file], name));
  fd.append('project', 1);
  uploadJPGOrXML(fd);

  file = null;
  fd = null;
  name = null;
  e.target.value = '';
}

const uploadJPGOrXML = async (fd) =>{
  const result = await uploadApi.uploadJPGOrXML(fd);
  if(result.status == 200){
    uploadType.value == 'project' ? catalogAnalysis(result.simplePath) : null;
    uploadType.value == 'tree' ? importTree(result.simplePath) : null;
  }else{
    ElMessage({
      message: result.msg,
      type: 'warning',
    });
  }
}

const catalogAnalysis = async (simplePath) => {
  const result = await catalog.catalogAnalysis({
    'token': token.value,
    'gcKey': dataRow.value._key,
    'simplePath': simplePath,
  });
  if(result.status == 200){
    ElMessage({
      message: '目录解析成功!',
      type: 'success',
    });
    handleSearch();
  }else{
    ElMessage({
      message: result.msg,
      type: 'warning',
    });
  }
};

const importTree = async (simplePath) => {
  const result = await pedigreeApi.importTree({
    'token': token.value,
    'gcKey': dataRow.value._key,
    'simplePath': simplePath,
  });
  if(result.status == 200){
    ElMessage({
      message: '节点解析成功!',
      type: 'success',
    });
    handleSearch();
  }else{
    ElMessage({
      message: result.msg,
      type: 'warning',
    });
  }
};

const hasImageList = ref([
  {'label': '全部影像', 'value': ''},
  {'label': '有影像', 'value': '1'},
  {'label': '无影像', 'value': '2'},
]);

const hasIndexList = ref([
  {'label': '全部索引', 'value': ''},
  {'label': '有索引', 'value': '1'},
  {'label': '无索引', 'value': '2'},
]);

const hasTreeList = ref([
  {'label': '全部节点', 'value': ''},
  {'label': '有节点', 'value': '1'},
  {'label': '无节点', 'value': '2'},
]);

onMounted(() => {
  h.value = window.innerHeight - 50 - 50 - 72 - 20 - 20;
  handleSearch();
});

</script>

<template>
  <section class="manage-genealogy-wrap">
    <header class="header">
      <h3 class="title">谱目列表</h3>
      <div class="right">
        <el-button type="primary" @click="handleClickAction({}, 'template')">模板</el-button>
        <el-button type="primary" @click="handleClickAction({}, 'add')">新建谱目</el-button>
        <el-upload
            class="inline-block marginL10"
            :action="baseURL+'/upload'"
            :show-file-list="false"
            accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :on-success="handleBatchUpdate"
        >
            <template #trigger>
                <el-button type="primary" @click="handleClickAction({}, 'batchLoad')">批量导入</el-button>
            </template>
        </el-upload>
      </div>
    </header>
    <main class="main">
      <!-- search -->
      <section class="search-wrap">
        <div class="search-box">
          <el-input v-model="SearchParameters.gcKey" class="w150" placeholder="谱ID" clearable />
          <el-input v-model="SearchParameters.genealogyName" class="w150" placeholder="谱名" clearable />
          <el-input v-model="SearchParameters.surname" class="w150" placeholder="姓氏" clearable />
          <el-input v-model="SearchParameters.hall" class="w150" placeholder="堂号" clearable />
          <el-select v-model="SearchParameters.hasImage" class="w150" placeholder="全部影像">
            <el-option
              v-for="item in hasImageList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="SearchParameters.hasIndex" class="w150" placeholder="全部索引">
            <el-option
              v-for="item in hasIndexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-select v-model="SearchParameters.hasTree" class="w150" placeholder="全部节点">
            <el-option
              v-for="item in hasTreeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
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
        <el-table-column prop="_key" label="谱ID" width="120" align="center" />
        <el-table-column prop="genealogyName" label="谱名" min-width="120" align="center" />
        <el-table-column prop="surname" label="姓氏" width="120" align="center" />
        <el-table-column prop="hall" label="堂号" width="120" align="center" />
        <el-table-column prop="publish" label="出版年" width="140" align="center" />
        <el-table-column prop="place" label="谱籍地" min-width="120" align="center" />
        <el-table-column prop="authors" label="作者" width="120" align="center" />
        <el-table-column prop="volume" label="总卷数" width="120" align="center" />
        <el-table-column prop="hasVolume" label="实拍册数" width="120" align="center" />
        <el-table-column prop="images" label="影像页" width="120" align="center" />
        <el-table-column prop="explain" label="说明" width="120" align="center" />
        <el-table-column prop="memo" label="备注" width="120" align="center" />
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <template #default="scope">
            <el-button v-if="scope.row.hasImage === 1" size="small" type="primary" @click="handleClickAction(scope.row, 'lookImage')">影像</el-button>
            <el-button v-if="scope.row.hasIndex === 1" size="small" type="primary" @click="handleClickAction(scope.row, 'lookIndex')">全文</el-button>
            <el-button v-if="scope.row.hasTree === 1" size="small" type="primary" @click="handleClickAction(scope.row, 'lookTree')">节点</el-button>
            <el-button size="small" type="primary" @click="handleClickAction(scope.row, 'lookVolume')">查看卷册</el-button>
            <el-button size="small" type="primary" @click="handleClickAction(scope.row, 'edit')">编辑</el-button>
            <el-popconfirm
              width="220"
              :confirm-button-text="'确定'"
              :cancel-button-text="'取消'"
              :title="'您确认要删除该谱目吗?'"
              @confirm="handleClickAction(scope.row, 'delete')"
            >
              <template #reference>
                  <el-button type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
            <div class="upload-box">
              <input type="file" id="fileInput" @click="handleClickInput(scope.row, 'project')" @change="handleInputChange" accept=".xml" />
              <label for="fileInput" class="label">目录解析</label>
            </div>
            <div class="upload-box">
              <input type="file" id="tree" @click="handleClickInput(scope.row, 'tree')" @change="handleInputChange" accept=".xml" />
              <label for="tree" class="label">节点解析</label>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </main>
    <footer class="footer">
      <div class="left">
        <p>合计: {{volumeCount}}册, {{imageCount}}页</p>
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
  <GenealogyEdit v-if="isShow === 'add' || isShow === 'edit'" :dataRow="dataRow" v-on:close="handleClose" />
</template>

<style scoped lang="scss">
.manage-genealogy-wrap {
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
.upload-box{
  position: relative;
  width: 72px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  margin: 2px 0 0 10px;
  #fileInput{
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
    border-radius: 2px;
    cursor: pointer;
    font-size: 12px;
  }
}
</style>
