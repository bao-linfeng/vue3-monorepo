<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog } from '../util/api';
import { getQueryVariable, createMsg } from '../util/ADS';
import { ElLoading } from 'element-plus';
// import HeaderModule from '../components/HeaderModule.vue';
import { useDetail } from '../composables/useDetail.js';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, token } = storeToRefs(global);
const { saveProperyValue } = global;

const dataKey = ref(getQueryVariable('id'));

const field_main = ref([
  {'fieldMeans': '谱ID', 'fieldName': '_key'},
  {'fieldMeans': '谱名', 'fieldName': 'genealogyName'},
  {'fieldMeans': '姓氏', 'fieldName': 'surname'},
  {'fieldMeans': '堂号', 'fieldName': 'hall'},
  {'fieldMeans': '出版年', 'fieldName': 'publish'},
  {'fieldMeans': '公元年', 'fieldName': 'publishAD'},
  {'fieldMeans': '谱籍地', 'fieldName': 'place'},
  {'fieldMeans': '作者', 'fieldName': 'authors'},
  {'fieldMeans': '作者职务', 'fieldName': 'authorJob'},
  {'fieldMeans': '始迁祖', 'fieldName': 'migrationAncestor'},
  {'fieldMeans': '先祖名人', 'fieldName': 'celebrity'},
  {'fieldMeans': '版本类型', 'fieldName': 'version'},
  {'fieldMeans': '总卷数', 'fieldName': 'volume'},
  {'fieldMeans': '缺卷说明', 'fieldName': 'lostVolume'},
  {'fieldMeans': '单双页', 'fieldName': 'singleOrTwo'},
  {'fieldMeans': '实拍册数', 'fieldName': 'hasVolume'},
  {'fieldMeans': '影像页', 'fieldName': 'images'},
  {'fieldMeans': '说明', 'fieldName': 'explain'},
  {'fieldMeans': '馆藏地', 'fieldName': 'owner'},
  {'fieldMeans': '载体形态', 'fieldName': 'carrierType'},
  {'fieldMeans': '入库编号', 'fieldName': 'inStoreSerialName'},
]);

const handleView = (i) => {
  window.open('/ImageView?id='+dataKey.value+'&genealogyName='+detail.value.genealogyName+'&volumeKey='+detail.value.firstVolumeKey+'&page=1&isText='+i);
}

const [detail, refresh, loading] = useDetail(catalog.GCDetailFrontEnd, {'gcKey': dataKey.value},
  {
    immediate: true
  });

onMounted(() => {
  
});

</script>

<template>
  <section class="genealogy-detail-wrap">
    <!-- <HeaderModule /> -->
    <main class="main">
        <h3 class="title">家谱简介</h3>
        <section class="main-section marginT20">
            <aside class="aside">
              <img class="cover" src="../assets/book-detail.png" />
              <p class="name">{{detail.genealogyName ? detail.genealogyName.replace(/[\（\）\(\)]/g, '') : ''}}</p>
              <el-button v-if="detail.hasIndex == 1" class="btn" type="primary" @click="handleView('1')"><img class="icon" src="../assets/全文.svg"><i>全文</i></el-button>
              <el-button v-if="detail.hasImage == 1" class="btn" type="primary" @click="handleView('')"><img class="icon" src="../assets/影像.svg"><i>影像</i></el-button>
            </aside>
            <article class="article">
              <div class="title-box">
                <h3 class="title">{{detail.genealogyName}}</h3>
                <img class="place" src="../assets/place.svg" />
                <p>{{detail.place}}</p>
              </div>
              <ul class="detail-box">
                <li class="li" v-for="(item, index) in field_main" :key="index">
                  <p>{{item.fieldMeans}}</p>
                  <span>{{detail[item.fieldName] || '-'}}</span>
                </li>
              </ul>
            </article>
        </section>
    </main>
  </section>
</template>

<style scoped lang="scss">
.genealogy-detail-wrap {
  position: relative;
  width: 100%;
  height: calc(100% - 80px);
  padding-top: 80px;
  background: #fffcf9 url('../assets/detail_bg.png') 0 0 no-repeat;
  background-size: cover;
  .main{
    margin: 0 auto auto auto;
    padding: 30px;
    width: 1400px;
    height: 694px;
    background: rgba(255, 255, 255, 0.7) url('../assets/eave.png') 0 0 repeat-x;
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
          bottom: 130px;
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
          width: 100%;
          height: 462px;
          display: flex;
          flex-wrap: wrap;
          flex-direction: column;
          .li{
            width: 50%;
            display: flex;
            align-items: center;
            font-size: 22px;
            margin-top: 10px;
            p{
              font-weight: bold;
              margin-right: 5px;
              width: 120px;
            }
          }
        }
      }
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
