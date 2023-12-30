<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog } from '../util/api';
import { getQueryVariable, createMsg } from '../util/ADS';
import { ElLoading } from 'element-plus';
import HeaderModule from '../components/HeaderModule.vue';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;
defineProps({
  msg: String,
});

const getDataDetail = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await catalog.GCDetailFrontEnd({
    'gcKey': dataKey.value,
  });
  loading.close();
  if(result.status == 200){
    detail.value = result.data;
  }else{
    createMsg(result.msg);
  }
};

const dataKey = ref('');
const detail = ref({});
const field_main = ref([
  // {'fieldMeans': '谱ID', 'fieldName': '_key'},
  // {'fieldMeans': '谱名', 'fieldName': 'genealogyName'},
  {'fieldMeans': '姓氏', 'fieldName': 'surname'},
  {'fieldMeans': '出版年', 'fieldName': 'publish'},
  {'fieldMeans': '堂号', 'fieldName': 'hall'},
  {'fieldMeans': '作者', 'fieldName': 'authors'},
  // {'fieldMeans': '一世祖', 'fieldName': 'firstAncestor'},
  // {'fieldMeans': '始迁祖', 'fieldName': 'migrationAncestor'},
  // {'fieldMeans': '谱籍地(现代)', 'fieldName': 'place'},
  // {'fieldMeans': '谱籍地(原谱)', 'fieldName': 'LocalityModern'},
  {'fieldMeans': '总卷数', 'fieldName': 'volume'},
  {'fieldMeans': '页数', 'fieldName': 'images'},
  // {'fieldMeans': '缺卷说明', 'fieldName': 'lostVolume'},
  // {'fieldMeans': '可拍册数', 'fieldName': 'hasVolume'},
  // {'fieldMeans': '作者', 'fieldName': 'authors'},
  // {'fieldMeans': '作者职务', 'fieldName': 'authorJob'},
  // {'fieldMeans': '版本类型', 'fieldName': 'version'},
]);

const handleView = (i) => {
  window.open('/ImageView?id='+dataKey.value+'&genealogyName='+detail.value.genealogyName+'&volumeKey='+detail.value.firstVolumeKey+'&page=1&isText='+i);
  // router.push('/ImageView?id='+dataKey.value+'&genealogyName='+detail.value.genealogyName+'&volumeKey='+detail.value.firstVolumeKey+'&page=1&isText='+i);
}

onMounted(() => {
    dataKey.value = getQueryVariable('id');
    getDataDetail();
});

</script>

<template>
  <section class="genealogy-detail-wrap">
    <HeaderModule />
    <main class="main">
        <h3 class="title">家谱简介</h3>
        <section class="main-section marginT20">
            <aside class="aside">
              <img class="cover" src="../assets/book-detail.png" />
              <p class="name">{{detail.genealogyName}}</p>
              <el-button v-if="detail.hasIndex == 1" class="btn" type="primary" @click="handleView('1')"><img class="icon" src="../assets/影像.svg"><i>全文</i></el-button>
              <el-button v-if="detail.hasImage == 1" class="btn" type="primary" @click="handleView('')"><img class="icon" src="../assets/影像.svg"><i>影像</i></el-button>
            </aside>
            <article class="article">
              <div class="title-box">
                <h3 class="title">{{detail.genealogyName}}</h3>
                <img class="place" src="../assets/place.svg" />
                <p>{{detail.place}}</p>
              </div>
              <div class="detail-box">
                <ul class="detail-ul">
                  <li class="li" v-for="(item, index) in field_main" :key="index">
                    <p>{{item.fieldMeans}}</p>
                    <span>{{detail[item.fieldName]}}</span>
                  </li>
                </ul>
                <ul class="detail-ul">
                  <li class="li">
                    <p>摘要</p>
                    <span>{{detail.explain}}</span>
                  </li>
                </ul>
              </div>
            </article>
        </section>
    </main>
    <footer class="footer">
        <div class="left">
            
        </div>
        <div class="right">
            
        </div>
    </footer>
  </section>
</template>

<style scoped lang="scss">
.genealogy-detail-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fffcf9 url('../assets/detail_bg.png') 0 0 no-repeat;
  background-size: cover;
  .main{
    margin: 0 auto auto auto;
    padding: 30px;
    width: 1400px;
    height: 694px;
    background: rgba(255, 255, 255, 0.7) url('../assets/eave.png') 0 0 repeat-x;
    // backdrop-filter: blur(10px);
    // box-shadow: 0 0 10px 0 #fffcf9;
    >.title{
      width: 250px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 40px;
      font-weight: normal;
      background: url('../assets/tleft.svg') 0 50% no-repeat, url('../assets/tright.svg') 100% 50% no-repeat; 
      margin: 40px 0 30px 0;
    }
    .main-section{
      display: flex;
      .aside{
        position: relative;
        width: 290px;
        .name{
          position: absolute;
          top: 55px;
          left: 65px;
          bottom: 100px;
          text-align: center;
          color: #fff;
          width: 20px;
          font-size: 18px;
          font-style: normal;
          overflow: hidden;
        }
      }
      .article{
        width: calc(100% - 350px);
        margin-left: 60px;
        .title-box{
          display: flex;
          align-items: center;
          font-size: 20px;
          color: #9D7747;
          .title{
            font-size: 40px;
            margin-right: 40px;
          }
          .place{
            cursor: pointer;
            margin-right: 10px;
          }
        }
        .detail-box{
          display: flex;
          .detail-ul{
            width: 50%;
            .li{
              display: flex;
              align-items: center;
              font-size: 22px;
              margin-top: 30px;
              p{
                font-weight: bold;
                margin-right: 5px;
                width: 80px;
              }
            }
          }
        }
      }
    }
  }
  .footer{
    width: calc(100% - 100px);
    padding: 0 50px;
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
.btn{
  width: 135px;
  height: 50px;
  font-size: 20px;
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  .icon{
    margin-right: 10px;
  }
}
</style>
