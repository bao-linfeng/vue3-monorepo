<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog } from '../util/api';
import { ElLoading } from 'element-plus';
import { getQueryVariable, createMsg } from '../util/ADS';
import HeaderModule from '../components/HeaderModule.vue';
import ScrollModule from '../components/ScrollModule.vue';
import StatisticsModule from '../components/StatisticsModule.vue';
import showIcon from '../assets/展开.svg';
import hideIcon from '../assets/收起.svg';
import { useTable } from '../composables/useTable.js';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;

const GCResolverFrontEnd = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await catalog.GCResolverFrontEnd(SearchParameters.value);
  loading.close();
  if(result.status == 200){
    statisticsData.value = result.data;
  }else{
    createMsg(result.msg);
  }
};

const statisticsData = ref({
  'listAuthors': [],
  'listHall': [],
  'listPlace': [],
  'listSurname': [],
});

const SearchParameters = ref({
  'gcKey': '',
  'genealogyName': '',
  'surname': '',
  'hall': '',
  'publish': '',
  'authors': '',
  'place': '',
  'content': '',
  'hasImage': '',
  'hasIndex': '',
});
const h = ref(200);

const handleSearch = () => {
  pagination.reset();
  refresh(SearchParameters.value);
  GCResolverFrontEnd();
}

const handleChangeStatistics = (data) => {
  SearchParameters.value[data.p] = data.v;
  handleSearch();
}

const handleClickAction = (row, t) => {
  if(t === 'look'){
      router.push('/GenealogyDetail?id='+row._key);
  }
  if(t === 'image'){
    window.open('/ImageView?id='+row._key+'&genealogyName='+row.genealogyName+'&volumeKey='+row.firstVolumeKey+'&page='+(row.indexImagePage + 1));
  }
  if(t === 'text'){
    window.open('/ImageView?id='+row._key+'&genealogyName='+row.genealogyName+'&volumeKey='+row.firstVolumeKey+'&page='+(row.indexImagePage + 1)+'&content='+SearchParameters.value.content+'&isText=1');
  }
  if(t === 'tree'){
    window.open('/Relationmap?id='+row._key);
  }
}

const tab = ref(0);
const tabList = ref([
  {'label': '列表', 'value': 0},
  {'label': '图列', 'value': 1},
]);

const isShow = ref(true);

SearchParameters.value.surname = getQueryVariable('surname') ? decodeURIComponent(getQueryVariable('surname')) : '';

const [tableData, refresh, loading, pagination] = useTable(catalog.searchGCFrontEnd, SearchParameters.value,
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
  h.value = 1100;
  GCResolverFrontEnd();
});

</script>

<template>
  <section class="genealogy-search-wrap">
    <HeaderModule />
    <img class="image-title" src="../assets/标题.svg" />
    <main class="main">
      <!-- search -->
      <section class="search-wrap">
        <div class="search-box">
          <el-input v-model="SearchParameters.surname" class="w20p" placeholder="请输入姓氏" clearable />
          <el-input v-model="SearchParameters.genealogyName" class="w20p" placeholder="请输入谱名" clearable />
          <el-input v-model="SearchParameters.place" class="w20p" placeholder="请输入谱籍地" clearable />
          <el-input v-model="SearchParameters.hall" class="w20p" placeholder="请输入堂号" clearable />
          <el-input v-model="SearchParameters.authors" class="w20p" placeholder="请输入作者" clearable />
        </div>
        <div class="search-box marginT30">
          <el-input v-model="SearchParameters.publish" class="w20p" placeholder="请输入出版年" clearable />
          <el-input v-model="SearchParameters.content" class="w20p" placeholder="请输入全文关键字" clearable />
          <el-radio-group class="w20p" v-model="SearchParameters.hasImage">
            <el-radio :label="''">全部影像</el-radio>
            <el-radio :label="'1'">有影像</el-radio>
            <el-radio :label="'2'">无影像</el-radio>
          </el-radio-group>
          <el-radio-group class="w20p" v-model="SearchParameters.hasIndex">
            <el-radio :label="''">全部索引</el-radio>
            <el-radio :label="'1'">有索引</el-radio>
            <el-radio :label="'2'">无索引</el-radio>
          </el-radio-group>
          <el-button class="w20p" type="primary" @click="handleSearch">检索</el-button>
        </div>
      </section>
      <!-- tab -->
      <section class="tab-section">
        <div class="left">
          <h3 class="title">发现 {{pagination.total}} 部家谱</h3>
          <div class="toggle-box" @click="isShow = !isShow">
            <img src="../assets/收起.svg" />
            <i>{{isShow ? '收起' : '展开'}}筛选</i>
          </div>
        </div>
        <ul class="tab-ul">
          <li :class="{active: tab === item.value}" v-for="(item, index) in tabList" :key="index" @click="tab = item.value">
            <img v-if="index === 0" src="../assets/列表.svg" />
            <img v-if="index === 1" src="../assets/图库.svg" />
            <i class="marginL5">{{item.label}}</i>
          </li>
        </ul>
      </section>
      <!-- data -->
      <section class="data-section">
        <!-- 分面器 -->
        <aside class="aside" v-show="isShow">
          <ScrollModule />
          <StatisticsModule :statisticsData="statisticsData" v-on:save="handleChangeStatistics" />
        </aside>
        <!-- 谱目列表 -->
        <article class="article" :class="{active: !isShow}">
          <ScrollModule />
          <!-- 列表 -->
          <el-table 
            v-if="tab === 0"
            ref="jiapu"
            :data="tableData"  
            :height="h"
            style="width: 100%">
            <el-table-column prop="_key" label="谱ID" width="120" align="center" />
            <el-table-column prop="genealogyName" label="谱名" width="150" align="center" />
            <el-table-column prop="surname" label="姓氏" width="120" align="center" />
            <el-table-column prop="volume" label="总卷数" width="120" align="center" />
            <el-table-column prop="hasVolume" label="实拍卷数" width="120" align="center" />
            <el-table-column prop="hall" label="堂号" width="120" align="center" />
            <el-table-column prop="publish" label="出版年" width="120" align="center" />
            <el-table-column prop="place" label="谱籍地" min-width="120" align="center" />
            <el-table-column prop="authors" label="作者" width="120" align="center" />
            <el-table-column prop="explain" label="说明" width="120" align="center" />
            <el-table-column prop="memo" label="备注" width="120" align="center" />
            <el-table-column label="操作" fixed="right" width="180" align="center">
              <template #default="scope">
                <button class="btn" @click="handleClickAction(scope.row, 'look')">查看</button>
                <button class="btn" v-if="scope.row.hasImage == 1" @click="handleClickAction(scope.row, 'image')">影像</button>
                <button class="btn" v-if="scope.row.hasIndex == 1" @click="handleClickAction(scope.row, 'text')">全文</button>
                <button class="btn" v-if="scope.row.hasTree == 1" @click="handleClickAction(scope.row, 'tree')">节点</button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 图库 -->
          <section v-else class="catalog-wrap style1">
            <div class="catalog-box" :class="{active: !isShow}" @click="handleClickAction(item, 'look')" v-for="(item, index) in tableData" :key="index">
              <i class="book">{{item.genealogyName}}</i>
              <div class="detail">
                <h3 :title="item.genealogyName">{{item.genealogyName}}</h3>
                <p>共 {{item.hasVolume}} 卷</p>
              </div>
            </div>
          </section>
          <!-- 分页器 -->
          <div class="pagination-wrap">
            <el-pagination
              background
              layout="prev, pager, next, jumper, total"
              :current-page="pagination.current"
              :page-size="pagination.size"
              :total="pagination.total"
              @current-change="pagination.onPageChange"
            />
          </div>
        </article>
      </section>
    </main>
    <!-- footer -->
    <footer class="footer">
      <img class="logo" src="../assets/logo.png" />
    </footer>
  </section>
</template>

<style scoped lang="scss">
.genealogy-search-wrap {
  position: relative;
  width: 100%;
  min-height: 100%;
  background: #fffcf9 url('../assets/bg.png') 50% 0 no-repeat;
  background-size: 100% auto;
  color: #333;
  .image-title{
    display: block;
    margin: 0 auto 34px auto;
  }
  .main{
    width: 100%;
    padding-bottom: 30px;
    .search-wrap{
      width: 1400px;
      margin: 0 auto;
      padding: 30px;
      background: rgba(248, 248, 248, 0.75) url('../assets/Rectangle.png') 50% 50% no-repeat;
      background-size: cover;
      .search-box{
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .tab-section{
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 1460px;
      margin: 30px auto 10px auto;
      color: #7C4F11;
      font-size: 26px;
      .left{
        display: flex;
        align-items: center;
        .title{
          font-weight: normal;
        }
      }
      .tab-ul{
        font-size: 26px;
        display: flex;
        align-items: center;
        li{
          cursor: pointer;
          margin-left: 40px;
          opacity: 0.5;
          &.active{
            opacity: 1;
          }
        }
      }
    }
    .data-section{
      width: 1460px;
      margin: 0 auto;
      display: flex;
      .aside{
        position: relative;
        padding-top: 25px;
        width: 240px;
        background-color: #fff;
      }
      .article{
        position: relative;
        padding: 30px 20px 20px 20px;
        width: calc(100% - 300px);
        background-color: #fff;
        margin-left: 20px;
        &.active{
          width: calc(100% - 40px);
          margin-left: 0;
        }
        .btn{
          border: none;
          outline: none;
          color: #C9A470;
          background-color: transparent;
          margin: 0 10px;
          cursor: pointer;
        }
        .pagination-wrap{
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
      }
    }
  }
  .footer{
    width: calc(100% - 100px);
    padding: 0 50px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    .logo{
      height: 36px;
    }
  }
}
// box
.catalog-wrap{
  position: relative;
  width: 100%;
  height: 1100px;
  font-size: 20px;
  .catalog-box{
    position: relative;
    height: 342px;
    width: 217px;
    color: #333;
    display: inline-flex;
    margin: 20px 36px 0 36px;
    background: url('../assets/book.png') 50% 50% no-repeat;
    background-size: cover;
    cursor: pointer;
    &.active{
      margin: 20px 33px 0 33px;
    }
    .book{
      position: absolute;
      top: 55px;
      left: 55px;
      max-height: 140px;
      font-style: normal;
      writing-mode: tb-rl;
      line-height: 14px;
      font-size: 12px;
      color: #fff;
      letter-spacing: 3px;
    }
    .detail{
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      color: #1A365C;
      width: 200px;
      font-size: 14px;
      text-align: center;
      h3{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 5px;
        letter-spacing: 2px;
      }
    }
  }
}
// 
.toggle-box{
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #999;
  margin: 5px 0 0 20px;
  img{
    margin-right: 5px;
  }
}
</style>
