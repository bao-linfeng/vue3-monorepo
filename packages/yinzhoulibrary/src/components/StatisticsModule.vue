<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue, createMsg } from '../util/ADS.js';
import { catalog, baseURL, volumeApi } from '../util/api';
import { ElLoading } from 'element-plus';
import showIcon from '../assets/展开.svg';
import hideIcon from '../assets/收起.svg';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
  statisticsData: Object,
});


const emit = defineEmits(['save']);

const statisticsTitle = ref([
  {'title': '姓氏', 'isShow': false, 'name': 'listSurname', 'attribute': 'surname'},
  {'title': '堂号', 'isShow': false, 'name': 'listHall', 'attribute': 'hall'},
  {'title': '作者', 'isShow': false, 'name': 'listAuthors', 'attribute': 'authors'},
  {'title': '谱籍地', 'isShow': false, 'name': 'listPlace', 'attribute': 'place'},
]);

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

const handleToggle = (i) => {
  statisticsTitle.value = statisticsTitle.value.map((ele, index) => {
    if(i === index){
      ele.isShow = !ele.isShow;
    }

    return ele;
  });
}

const changeProperty = (p, v) =>{
  if(SearchParameters.value[p] === v){
    SearchParameters.value[p] = '';
  }else{
    SearchParameters.value[p] = v;
  }
  
  emit('save', {'p': p, 'v': SearchParameters.value[p]});
}

</script>

<template>
  <div class="statistics">
    <div class="box" v-for="(item, index) in statisticsTitle" :key="'box'+index">
      <div class="title-box">
      <h3 class="title">{{item.title}}</h3>
      <img :src="!item.isShow ? showIcon : hideIcon" @click="handleToggle(index)" />
      </div>
      <ul class="list-wrap style1" :class="{active: item.isShow}">
        <li class="li" :class="{active: SearchParameters[item.attribute] == item2[item.attribute]}" v-for="(item2, index2) in statisticsData[item.name]" :key="item.attribute+''+index2" @click="changeProperty(item.attribute, item2[item.attribute])">{{item2[item.attribute]}}({{item2.length}})</li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 分面器
.statistics{
  position: relative;
  height: calc(100% - 45px);
  padding: 20px;
  font-size: 16px;
  .box{
    height: 260px;
    margin-top: 20px;
    .title-box{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      img{
        cursor: pointer;
        height: 14px;
      }
    }
  }
  .title{
    border-left: 3px solid #333;
    padding-left: 10px;
    height: 14px;
    line-height: 14px;
    font-size: 16px;
    font-weight: normal;
  }
  .list-wrap{
    height: calc(100% - 34px);
    overflow-y: hidden;
    &.active{
      overflow-y: auto;
    }
    .li{
      text-indent: 14px;
      margin-bottom: 5px;
      cursor: pointer;
      color: #999;
      &.active{
        color: #358acd;
      }
    }
  }
}
</style>