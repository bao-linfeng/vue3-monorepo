<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog, imageApi, volumeApi, baseURL } from '../util/api';
import { getQueryVariable, createMsg } from '../util/ADS';
import { ElLoading } from 'element-plus';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;
defineProps({
  msg: String,
});

const getImageList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await imageApi.getImageList({
    'vKey': volumeKey.value,
  });
  loading.close();
  if(result.status == 200){
    imageList.value = result.data;
    total.value = imageList.value.length;
    getImageDetail(imageList.value[page.value - 1]._key);
  }else{
    createMsg(result.msg);
  }
};

const getImageDetail = async (iKey) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await imageApi.getImageDetail({
    'iKey': iKey,
  });
  loading.close();
  if(result.status == 200){
    imageDetail.value = baseURL+'/nbyz'+result.data;
    isText.value == 1 ? imageOcrResult(imageList.value[page.value - 1].serialNumber) : null;
  }else{
    createMsg(result.msg);
  }
};

const getVolumeList = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await volumeApi.volumeListSingleGC({
    'gcKey': dataKey.value,
  });
  loading.close();
  if(result.status == 200){
    volumeList.value = result.data.map((ele) => {
      ele.label = ele.volumeNumber+'('+ele.internalSerialNumber+')';
      ele.value = ele._key;
      return ele;
    });
  }else{
    createMsg(result.msg);
  }
};

const getCatalogAnalysisResult = async () => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await catalog.getCatalogAnalysisResult({
    'gcKey': dataKey.value,
  });
  loading.close();
  if(result.status == 200){
    analysisList.value = result.data;
  }else{
    createMsg(result.msg);
  }
};

const OcrResultList = ref([]);

const imageOcrResult = async (serialNumber) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await imageApi.imageOcrResult({
    'gcKey': dataKey.value,
    'vKey': volumeKey.value,
    'serialNumber': serialNumber,
  });
  loading.close();
  if(result.status == 200){
    let OcrResultO = {}, ocrArr = [];
    textAllList.value = result.data.map((ele, index) => {
      let styleArr = ele.style.split(';');
      ele.rect = styleArr[0].split(',');
      ele.top = (100*(ele.rect[1])/ele.height)+'%';
      ele.left = (100*(ele.rect[0])/ele.width)+'%';
      ele.fontSize = ((styleArr[1].split(','))[1]*imageH.value/ele.height)+'px';
      // console.log(ele);
      if(OcrResultO[ele.lid]){
        OcrResultO[ele.lid].push(ele);
      }else{
        OcrResultO[ele.lid] = [ele];
      }

      return ele;
    });

    console.log(OcrResultO);
    for(let key in OcrResultO){
      ocrArr.push(OcrResultO[key]);
    }

    OcrResultList.value = ocrArr;

    // console.log(OcrResultList.value);

    analysisList.value.forEach((ele) => {
      if(serialNumber >= ele.startSerialNumber && serialNumber <= ele.endSerialNumber){
        analysis.value = ele.title;
      }
      if(ele.children && ele.children.length){
        ele.children.forEach((e) => {
          if(serialNumber >= e.startSerialNumber && serialNumber <= e.endSerialNumber){
            analysis.value = e.title;
          }
        });
      }
    });
  }else{
    createMsg(result.msg);
  }
};

const imageSearchSingleGC = async (content) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  });
  const result = await imageApi.imageSearchSingleGC({
    'gcKey': dataKey.value,
    'content': content,
  });
  loading.close();
  if(result.status == 200){
    textList.value = result.data.map((ele, index) => {
      if(index === 0){
        textAll.value = ele.index;
        textKey.value = ele.content+'-'+ele.volumeNumber+'-'+ele.pageNumber+'页';
      }
      return ele;
    });
  }else{
    createMsg(result.msg);
  }
};

const dataKey = ref('');
const genealogyName = ref('');
const imageList = ref({});
const volumeKey = ref(1);
const page = ref(1);
const currentPage = ref(1);
const total = ref(100);
const imageDetail = ref('');
const isText = ref('');
const volumeList = ref([]);
const goBack = () => {
  router.push('/GenealogyDetail?id='+dataKey.value);
}

const analysis = ref('');
const analysisList = ref([]);

const vertical = ref(true);
const keyWord = ref('');
const textKey = ref('');
const textList = ref([]);
const textAll = ref('');
const textAllList = ref([]);
const handleSearch = () => {
  if(!keyWord.value){
    textList.value = [];
  }else{
    imageSearchSingleGC(keyWord.value);
  }
}

const changePage = (t) => {
  if(t === 'prev'){
    if(page.value >= 2){
      currentPage.value = page.value = page.value - 1;
    }
  }else if(t === 'next'){
    if(page.value < total.value){
      currentPage.value = page.value = page.value + 1;
    }
  }
}

const handleClickAnalysis = (data) => {
  analysis.value = data.title;
  imageList.value.forEach((ele, index) => {
    if(ele.serialNumber === data.startSerialNumber){
      page.value = currentPage.value = index + 1;
    }
  });
}

const handleInputChange = (e) => {
  page.value = Number(currentPage.value);
}

const handleClickText = (data) => {
  if(data.vKey === volumeKey.value){
    if(data.pageNumber === page.value){
      textAll.value = data.index;
    }else{
      textAll.value = data.index;
      page.value = currentPage.value = data.pageNumber;
      textKey.value = data.content+'-'+data.volumeNumber+'-'+data.pageNumber+'页';
    }
  }else{

  }
}

watch(page, (nv, ov) => {
  console.log(nv);
  getImageDetail(imageList.value[page.value - 1]._key);
});

watch(volumeKey, (nv, ov) => {
  console.log(nv);
  getImageList();
});

const imageH = ref(1080);

onMounted(() => {
  imageH.value = window.innerHeight - 60 - 60 - 60;
  dataKey.value = getQueryVariable('id');
  genealogyName.value = getQueryVariable('genealogyName') ? decodeURIComponent(getQueryVariable('genealogyName')) : '';
  volumeKey.value = getQueryVariable('volumeKey');
  page.value = Number(getQueryVariable('page'));
  currentPage.value = page.value;
  isText.value = getQueryVariable('isText');
  keyWord.value = getQueryVariable('content') ? decodeURIComponent(getQueryVariable('content')) : '';
  getVolumeList();
  isText.value == 1 ? getCatalogAnalysisResult() : null;
  keyWord.value ? handleSearch() : null;
});

</script>

<template>
  <section class="image-view-wrap">
    <!-- 目录 -->
    <aside class="aside" v-if="isText == 1">
      <h3 class="title PingFang_Regular">目录</h3>
      <ul class="analysis-wrap style1">
        <li class="analysis-box" :class="{active: analysis === item.title}" v-for="(item, index) in analysisList" :key="index">
          <p :class="{active: analysis === item.title}" @click="handleClickAnalysis(item)">{{item.title}}</p>
          <p class="textIndent20" :class="{active: analysis === item2.title}" v-for="(item2, index2) in item.children" :key="index" @click="handleClickAnalysis(item2)">{{item2.title}}</p>
        </li>
      </ul>
    </aside>
    <section class="content" :class="{active: isText != 1}">
      <!-- header -->
      <header class="header">
        <div class="box">
          <img class="back" src="../assets/返回.svg" @click="goBack" />
          <h3 class="title">{{genealogyName}}</h3>
          <el-select v-model="volumeKey" placeholder="卷册列表" class="w150">
            <el-option
              v-for="(item,index) in volumeList"
              :key="index"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div class="box"></div>
      </header>
      <!-- main -->
      <main class="main" :class="{active: isText != 1}">
        <!-- 图片 -->
        <div class="large-image" :class="{active: isText != 1}">
          <div class="large-box">
            <img class="image" :src="imageDetail" />
            <!-- ocr标记 -->
            <p class="text" :class="{active: textAll === item.index}" :title="item.content" :style="{top: item.top, left: item.left, fontSize: item.fontSize}" v-for="(item, index) in textAllList" :key="index" @click="textAll = item.index">{{item.content}}</p>
          </div>
        </div>
        <!-- 全文 -->
        <article class="article" v-if="isText == 1">
          <!-- 关键字检索 -->
          <div class="search-box">
            <el-input class="search" v-model="keyWord" placeholder="请输入关键字" @change="handleSearch" clearable />
            <ul class="textList style1" v-if="textList.length">
              <li v-for="(item, index) in textList" :class="{active: textKey == (item.content+'-'+item.volumeNumber+'-'+item.pageNumber+'页')}" :key="index" :title="item.content+'-'+item.volumeNumber+'-'+item.pageNumber+'页'" @click="handleClickText(item)">{{item.content}}-{{item.volumeNumber}}-{{item.pageNumber}}页</li>
            </ul>
          </div>
          <!-- 全文展示 -->
          <div class="text-wrap style1" :class="{active: vertical}">
            <div class="text-box" :class="{vertical: vertical}" v-for="(item, index) in OcrResultList" :key="index">
              <i :class="{active: textAll === item2.index, vertical: vertical}" v-for="(item2, index2) in item" :key="index2+'text'" @click="textAll = item2.index">{{item2.content}}</i>
            </div>
          </div>
        </article>
        <!-- 翻页 -->
        <img v-if="page >= 2" class="prev" src="../assets/左翻.svg" @click="changePage('prev')" />
        <img v-if="page < total" class="prev next" src="../assets/右翻.svg" @click="changePage('next')" />
      </main>
      <!-- 分页 -->
      <footer class="footer">
        <p class="marginR20">{{page}}/{{total}} 跳转至</p>
        <el-input class="w150 input-center" v-model="currentPage" @change="handleInputChange"  />
      </footer>
    </section>
  </section>
</template>

<style scoped lang="scss">
.image-view-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fffcf9 url('../assets/detail_bg.png') 0 0 no-repeat;
  background-size: cover;
  color: #333;
  display: flex;
  .aside{
    width: 300px;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    box-shadow: 0 0 10px 0 #fffcf9;
    text-indent: 20px;
    .title{
      height: 60px;
      line-height: 60px;
      border-bottom: 2px solid #c9a470;
      font-size: 32px;
      color: #7C4F11;
    }
    .analysis-wrap{
      height: calc(100% - 80px);
      overflow-y: auto;
      .analysis-box{
        .textIndent20{
          text-indent: 40px;
        }
        p{
          height: 38px;
          line-height: 38px;
          cursor: pointer;
          &:hover{
            color: #7C4F11;
            background: #f8eedf;
          }
          &.active{
            color: #7C4F11;
            background: #f8eedf;
          }
        }
      }
    }
  }
  .content{
    position: relative;
    width: calc(100% - 300px);
    height: 100%;
    &.active{
      width: 100%;
    }
  }
  .header{
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .box{
      display: flex;
      align-items: center;
      justify-content: space-between;
      .back{
        cursor: pointer;
        margin-left: 10px;
      }
      .title{
        margin: 0 10px;
        height: 16px;
        line-height: 16px;
      }
    }
  }
  .main{
    position: relative;
    width: 100%;
    height: calc(100% - 120px);
    display: flex;
    justify-content: center;
    align-items: center;
    &.active{
      width: 100%;
      justify-content: center;
    }
    .large-image{
      position: relative;
      height: calc(100% - 60px);
      padding: 30px;
      background-color: #fff;
      .large-box{
        position: relative;
        height: 100%;
        font-family: '宋体';
      }
      &.active{
        height: 100%;
        background-color: transparent;
        margin: 0 auto;
      }
      .image{
        height: 100%;
        min-height: 300px;
      }
      .text{
        position: absolute;
        color: transparent;
        cursor: pointer;
        writing-mode: vertical-lr;
        vertical-align: top;
        // opacity: 0;
        border: 1px solid #7C4F11;
        &.active{
          // color: #f00;
          border: 1px solid #f00;
        }
      }
    }
    .article{
      width: 340px;
      height: calc(100% - 60px);
      padding: 30px;
      background-color: #fff;
      .search-box{
        position: relative;
        width: 100%;
        .search{
          text-indent: 40px;
        }
        .textList{
          position: absolute;
          top: 100%;
          left: 0;
          padding: 10px 20px;
          width: calc(100% - 40px);
          background-color: #fff;
          box-shadow: 0 0 1px 0 #7C4F11;
          z-index: 1000;
          max-height: 150px;
          overflow-y: auto;
          border-radius: 5px;
          li{
            height: 30px;
            line-height: 30px;
            cursor: pointer;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            &:hover{
              color: #7C4F11;
            }
            &.active{
              color: #7C4F11;
            }
          }
        }
      }
      .text-wrap{
        margin-top: 170px;
        position: relative;
        height: calc(100% - 200px);
        overflow-y: auto;
        &.active{
          overflow-y: hidden;
          overflow-x: auto;
          display: flex;
          flex-direction: row-reverse;
        }
        .text-box{
          margin-top: 10px;
          &.vertical{
            width: 20px;
            margin-left: 8px;
            letter-spacing: 3px;
          }
          i{
            cursor: pointer;
            display: inline-block;
            margin-right: 10px;
            &:hover{
              color: #7C4F11;
            }
            &.active{
              color: #7C4F11;
            }
            &.vertical{
              margin-bottom: 10px;
              display: inline;
              writing-mode: vertical-lr;
              max-height: 100%;
              vertical-align: top;
              
            }
          }
        }
      }
    }
    .prev{
      position: absolute;
      top: 50%;
      left: 10%;
      transform: translateY(-50%);
      cursor: pointer;
    }
    .next{
      left: auto;
      right: 10%;
    }
  }
  .footer{
    width: calc(100% - 40px);
    padding: 0 20px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    .center{
      text-align: center;
    }
  }
}
</style>
