<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog, pedigreeApi } from '../util/api';
import { getQueryVariable, createMsg } from '../util/ADS';
import { ElLoading } from 'element-plus';
import boy from '../assets/boy.png';
import girl from '../assets/girl.svg';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
  msg: String,
});

const zoomChartsData = ref({
   nodes: [
      {
         id: "m-1",
         age: 20,
         name: "Joe",
         loaded: true
      },
      {
         id: "m-2",
         age: 15,
         name: "Fred",
         loaded: true
      },
      {
         id: "m-3",
         age: 16,
         name: "Tom",
         loaded: true
      },
      {
         id: "m-4",
         age: 35,
         name: "Robert",
         loaded: true
      },
      {
         id: "m-5",
         age: 38,
         name: "Mark",
         loaded: true
      },
      {
         id: "m-6",
         age: 42,
         name: "Jason",
         loaded: true
      },
      {
         id: "m-7",
         age: 37,
         name: "Bill",
         loaded: true
      },
      {
         id: "m-8",
         age: 60,
         name: "Andre",
         loaded: true
      },
      {
         id: "m-9",
         age: 63,
         name: "Daniel",
         loaded: true
      },
      {
         id: "m-10",
         age: 17,
         name: "Thomas",
         loaded: true
      },
      {
         id: "m-11",
         age: 21,
         name: "Sergejs",
         loaded: true
      },
      {
         id: "m-12",
         age: 26,
         name: "Bryon",
         loaded: true
      },
      {
         id: "m-13",
         age: 29,
         name: "Toby",
         loaded: true
      },
      {
         id: "f-1",
         age: 28,
         name: "Anna",
         loaded: true
      },
      {
         id: "f-2",
         age: 21,
         name: "Wendy",
         loaded: true
      },
      {
         id: "f-3",
         age: 17,
         name: "Dina",
         loaded: true
      },
      {
         id: "f-4",
         age: 26,
         name: "Cate",
         loaded: true
      },
      {
         id: "f-5",
         age: 31,
         name: "Elisa",
         loaded: true
      },
      {
         id: "f-6",
         age: 34,
         name: "Suzie",
         loaded: true
      },
      {
         id: "f-7",
         age: 26,
         name: "Trixie",
         loaded: true
      },
      {
         id: "f-8",
         age: 37,
         name: "Emily",
         loaded: true
      },
      {
         id: "f-9",
         age: 39,
         name: "Alice",
         loaded: true
      },
      {
         id: "f-10",
         age: 42,
         name: "Violet",
         loaded: true
      },
      {
         id: "f-11",
         age: 32,
         name: "Sara",
         loaded: true
      },
      {
         id: "f-12",
         age: 28,
         name: "Julia",
         loaded: true
      },
      {
         id: "f-13",
         age: 19,
         name: "Ramona",
         loaded: true
      },
      {
         id: "f-14",
         age: 20,
         name: "Flavia",
         loaded: true
      },
      {
         id: "f-15",
         age: 23,
         name: "Liga",
         loaded: true
      },
      {
         id: "f-16",
         age: 27,
         name: "Jessica",
         loaded: true
      },
      {
         id: "f-17",
         age: 40,
         name: "Barbara",
         loaded: true
      },
      {
         id: "f-18",
         age: 45,
         name: "Hanna",
         loaded: true
      },
      {
         id: "f-19",
         age: 53,
         name: "Giselle",
         loaded: true
      },
      {
         id: "f-20",
         age: 27,
         name: "Mia",
         loaded: true
      },
      {
         id: "f-21",
         age: 19,
         name: "Rose",
         loaded: true
      },
      {
         id: "f-23",
         age: 28,
         name: "Judy",
         loaded: true
      },
      {
         id: "f-22",
         age: 32,
         name: "Nikola",
         loaded: true
      },
      {
         id: "f-24",
         age: 34,
         name: "Sofia",
         loaded: true
      },
      {
         id: "f-25",
         age: 37,
         name: "Fatima",
         loaded: true
      },
      {
         id: "f-26",
         age: 44,
         name: "Samantha",
         loaded: true
      },
      {
         id: "f-27",
         age: 23,
         name: "Chelia",
         loaded: true
      },
      {
         id: "f-28",
         age: 18,
         name: "Alexa",
         loaded: true
      },
      {
         id: "f-29",
         age: 21,
         name: "Karla",
         loaded: true
      },
      {
         id: "f-30",
         age: 23,
         name: "Karina",
         loaded: true
      },
      {
         id: "f-31",
         age: 51,
         name: "Patricia",
         loaded: true
      },
      {
         id: "f-32",
         age: 47,
         name: "Anna",
         loaded: true
      },
      {
         id: "f-33",
         age: 38,
         name: "Laura",
         loaded: true
      }
   ],
   links: [
      {
         id: "l01",
         from: "m-1",
         to: "f-1",
         type: "friend"
      },
      {
         id: "l02",
         from: "m-1",
         to: "f-2",
         type: "friend"
      },
      {
         id: "l03",
         from: "m-1",
         to: "f-3",
         type: "friend"
      },
      {
         id: "l04",
         from: "m-1",
         to: "f-4",
         type: "friend"
      },
      {
         id: "l06",
         from: "m-1",
         to: "f-6",
         type: "friend"
      },
      {
         id: "l07",
         from: "m-2",
         to: "f-2",
         type: "collegue"
      },
      {
         id: "l12",
         from: "m-3",
         to: "f-10",
         type: "spouse"
      },
      {
         id: "l13",
         from: "m-3",
         to: "f-5",
         type: "enemy"
      },
      {
         id: "l14",
         from: "m-3",
         to: "f-8",
         type: "friend"
      },
      {
         id: "l15",
         from: "m-3",
         to: "f-4",
         type: "friend"
      },
      {
         id: "l16",
         from: "m-3",
         to: "f-9",
         type: "friend"
      },
      {
         id: "l17",
         from: "m-4",
         to: "f-15",
         type: "spouse"
      },
      {
         id: "l18",
         from: "m-4",
         to: "f-14",
         type: "collegue"
      },
      {
         id: "l22",
         from: "m-5",
         to: "f-15",
         type: "collegue"
      },
      {
         id: "l23",
         from: "m-5",
         to: "f-4",
         type: "collegue"
      },
      {
         id: "l27",
         from: "f-11",
         to: "f-15",
         type: "collegue"
      },
      {
         id: "l28",
         from: "m-5",
         to: "m-6",
         type: "friend"
      },
      {
         id: "l29",
         from: "m-6",
         to: "m-7",
         type: "friend"
      },
      {
         id: "l30",
         from: "m-7",
         to: "m-8",
         type: "friend"
      },
      {
         id: "l31",
         from: "m-8",
         to: "m-9",
         type: "friend"
      },
      {
         id: "l32",
         from: "m-9",
         to: "m-10",
         type: "friend"
      },
      {
         id: "l33",
         from: "m-10",
         to: "m-11",
         type: "friend"
      },
      {
         id: "l34",
         from: "m-11",
         to: "m-12",
         type: "friend"
      },
      {
         id: "l35",
         from: "m-12",
         to: "m-13",
         type: "friend"
      },
      {
         id: "l36",
         from: "m-13",
         to: "m-5",
         type: "friend"
      },
      {
         id: "l101",
         from: "m-7",
         to: "f-25",
         type: "collegue"
      },
      {
         id: "l102",
         from: "m-7",
         to: "f-26",
         type: "collegue"
      },
      {
         id: "l103",
         from: "m-9",
         to: "f-26",
         type: "collegue"
      },
      {
         id: "l104",
         from: "m-9",
         to: "f-25",
         type: "collegue"
      },
      {
         id: "l105",
         from: "f-25",
         to: "f-26",
         type: "collegue"
      },
      {
         id: "l106",
         from: "m-7",
         to: "m-9",
         type: "collegue"
      },
      {
         id: "l107",
         from: "f-26",
         to: "f-28",
         type: "friend"
      },
      {
         id: "l108",
         from: "f-27",
         to: "f-28",
         type: "friend"
      },
      {
         id: "l109",
         from: "f-27",
         to: "f-29",
         type: "friend"
      },
      {
         id: "l110",
         from: "f-10",
         to: "f-29",
         type: "friend"
      },
      {
         id: "l111",
         from: "f-29",
         to: "f-33",
         type: "friend"
      },
      {
         id: "l112",
         from: "f-29",
         to: "f-32",
         type: "friend"
      },
      {
         id: "l113",
         from: "f-29",
         to: "f-31",
         type: "friend"
      },
      {
         id: "l114",
         from: "f-24",
         to: "f-31",
         type: "friend"
      },
      {
         id: "l115",
         from: "f-24",
         to: "f-32",
         type: "friend"
      },
      {
         id: "l116",
         from: "f-24",
         to: "f-33",
         type: "friend"
      },
      {
         id: "l117",
         from: "f-24",
         to: "f-23",
         type: "friend"
      },
      {
         id: "l118",
         from: "f-23",
         to: "f-22",
         type: "friend"
      },
      {
         id: "l119",
         from: "f-22",
         to: "f-21",
         type: "friend"
      },
      {
         id: "l120",
         from: "f-21",
         to: "f-20",
         type: "friend"
      },
      {
         id: "l121",
         from: "f-20",
         to: "f-19",
         type: "friend"
      },
      {
         id: "l122",
         from: "f-19",
         to: "f-18",
         type: "friend"
      },
      {
         id: "l123",
         from: "f-18",
         to: "f-17",
         type: "friend"
      },
      {
         id: "l124",
         from: "f-17",
         to: "f-16",
         type: "friend"
      },
      {
         id: "l125",
         from: "f-16",
         to: "f-30",
         type: "friend"
      },
      {
         id: "l126",
         from: "f-19",
         to: "f-30",
         type: "friend"
      },
      {
         id: "l130",
         from: "f-15",
         to: "m-10",
         type: "friend"
      },
      {
         id: "l131",
         from: "f-23",
         to: "m-4",
         type: "friend"
      },
      {
         id: "l132",
         from: "f-15",
         to: "m-7",
         type: "friend"
      },
      {
         id: "l133",
         from: "f-12",
         to: "m-13",
         type: "friend"
      },
      {
         id: "l134",
         from: "f-21",
         to: "m-12",
         type: "friend"
      },
      {
         id: "l135",
         from: "f-29",
         to: "m-11",
         type: "friend"
      },
      {
         id: "l136",
         from: "f-13",
         to: "m-11",
         type: "friend"
      },
      {
         id: "l137",
         from: "f-13",
         to: "m-7",
         type: "friend"
      },
      {
         id: "l138",
         from: "f-13",
         to: "m-12",
         type: "friend"
      },
      {
         id: "l139",
         from: "f-13",
         to: "m-6",
         type: "friend"
      },
      {
         id: "l140",
         from: "f-17",
         to: "f-9",
         type: "friend"
      },
      {
         id: "l141",
         from: "f-2",
         to: "m-4",
         type: "collegue"
      },
      {
         id: "l142",
         from: "f-5",
         to: "m-13",
         type: "friend"
      },
      {
         id: "l143",
         from: "f-7",
         to: "f-20",
         type: "friend"
      }
   ]
});

const netChart = ref('');
const initZoomCharts = (data, root) => {
   // netChart.value ? netChart.value.clearFocus() : null;
   netChart.value ? netChart.value.remove() : null;
   netChart.value = null;
   netChart.value = new NetChart({
      navigation: {
         focusNodeExpansionRadius: 2,
         initialNodes: [root],
         mode: "focusnodes"
      },
      style: {
         node: {
            display: "image",
            lineWidth: 2,
            lineColor: "#7C4F11",
            imageCropping: true
         },
         "nodeStyleFunction": function(node) {
            nodeStyle(node);
         },
         linkStyleFunction: function(link) {        
            // console.log(link);                 
            link.fillColor = "#7C4F11";  
            link.label = link.data.type;                  
            link.labelStyle.textStyle.fillColor = '#7C4F11';
            link.labelStyle.padding = 15;
            // link.labelStyle.textStyle.font ='12px Arial';                 
            link.labelStyle.backgroundStyle.fillColor = 'transparent';             
            link.labelStyle.backgroundStyle.lineColor = 'transparent';
            link.toDecoration = 'arrow';
            link.labelStyle.rotateWithLink = true; //关系label方向顺着线条方向摆放                
            if (link.hovered) {                       
               // link.radius = 2;  
               link.fillColor = "#7C4F11";                       
            } else{
               // link.radius = 1;
            } 
         }
      },
      container: "relationmap",
      data: {
         preloaded: data,
         preloadNodeLinks: true,              
      },
      toolbar: {
         fullscreen: true,
         enabled: true
      },
      interaction: {
         resizing: {
               enabled: false
         }
      },
      layout: {
         nodeSpacing: 60,
         mode: 'dynamic',      
      },
      nodeMenu: {
         enabled: false,
         // showData: false,               
      },
      interaction: {
         // resizing: { enabled: false },
         zooming: {
            zoomExtent: [0.1, 2],
            autoZoomExtent: [0.1, 1],
            doubleClickZoom: null,//双击空白将触发按此值放大
            autoZoomPositionElasticity: 5
         },                
      },
      events: {
         onClick: (event, args) => {
            // console.log(event, args);
            console.log(event.clickNode);
            //当前点击的节点 
            if(event.clickNode){     
               // netChart.value.clearFocus();
               // netChart.value.addFocusNode(event.clickNode);  
               detail.value =   event.clickNode.data;                              
               event.preventDefault();
            }
            //当前点击的关系
            if(event.clickLink){       
               event.preventDefault();
            }
         },   
         onDoubleClick: (event, args) => {
            console.log(event.clickNode);
            // if(event.clickNode){     
            //    detail.value =   event.clickNode.data;                              
            //    event.preventDefault();
            // }
         }     
      },
   })
}

const nodeStyle = (node) =>{ 
   node.radius = 30;
   node.lineColor = '#ff7963';
   node.lineWidth = 2;  

   if(node.focused){           
      node.radius = 40;
      node.lineWidth = 4;  
   }

   if(node.hovered){
      node.radius = 35; 
      node.fillColor = "#f7764d";  
   } 

   node.items = [];
   node.display = "image";           
   node.imageCropping = true;
   node.label = node.data.name;
   node.labelStyle.padding = 15;       
   node.labelStyle.textStyle.fillColor = "#7C4F11";                 
   node.labelStyle.backgroundStyle.fillColor = "transparent";    
   
   if(node.data.imageUrl){
      node.image = node.data.imageUrl;
   }else{
      node.image = (node.data.Sex == 'female' ? girl : boy);
   }
     
   if(node.focused && node.selected) {
      node.label = node.data.name;
   }

   return node;
}

const getTotalTree = async () => {
   const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
   });
   const result = await pedigreeApi.getTotalTree({
      'pedigreeKey': pedigreeKey.value,
   });
   loading.close();
   if(result.status == 200){
      result.result.nodes.forEach((ele) => {
         ele.name = ele.Fullname ? ele.Fullname : ele.Given;
         ele.id = ele._key;
      });
      result.result.links.forEach((ele) => {
         ele.type = ele.type == 1 ? '儿子' : ele.type == 2 ? '女儿' : ele.type == 3 ? '配偶' : '';
      });
      root.value = result.result.root;
      zoomChartsData.value = {
         'nodes': result.result.nodes,
         'links': result.result.links,
      };
      initZoomCharts(zoomChartsData.value, root.value);
   }else{
      createMsg(result.msg);
   }
};

const getGCPedigreeListFrontEnd = async () => {
   const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
   });
   const result = await catalog.getGCPedigreeListFrontEnd({
      'gcKey': dataKey.value,
   });
   loading.close();
   if(result.status == 200){
      pedigreeList.value = result.result.forEach((ele, index) => {
         if(index === 0){
            pedigreeKey.value = ele._key;
         }
      });
      getTotalTree();
   }else{
      createMsg(result.msg);
   }
};


const dataKey = ref('');
const pedigreeKey = ref('');
const pedigreeList = ref([]);
const root = ref('');
const detail = ref({});
const nodes = ref([]);
const keyWord = ref('');

const handleClickNode = (data) => {
   root.value = data._key;
   detail.value = data;
   // netChart.value ? netChart.value.reloadData() : null;
   initZoomCharts(zoomChartsData.value, root.value);
}

const handleSearch = () => {
   // console.log(keyWord.value);
   if(!keyWord.value){
      nodes.value = [];
   }else{
      nodes.value = zoomChartsData.value.nodes.filter((ele, index) => {
         return (ele.Fullname && ele.Fullname.indexOf(keyWord.value) > -1);
      });
      // console.log(nodes.value);
   }
}

onMounted(() => {
   dataKey.value = getQueryVariable('id');
   getGCPedigreeListFrontEnd();
});

</script>

<template>
  <section class="relationmap-wrap">
    <main class="main" id="relationmap">
        
    </main>
    <aside class="aside">
      <div class="search-box">
         <el-input class="search" v-model="keyWord" placeholder="请输入关键字" @change="handleSearch" clearable />
         <ul class="nodeList style1" v-if="nodes.length">
            <li v-for="(item, index) in nodes" :class="{active: root == item._key}" :key="index" @click="handleClickNode(item)">{{item.Fullname}}</li>
         </ul>
      </div>
      <article class="article style1" v-if="detail._key">
         <div class="node-detail" v-if="detail.Fullname">
            <label for="">全名</label>
            <i>{{detail.Fullname}}</i>
         </div>
         <div class="node-detail" v-if="detail.Surname">
            <label for="">姓氏</label>
            <i>{{detail.Surname}}</i>
         </div>
         <div class="node-detail" v-if="detail.Given">
            <label for="">名</label>
            <i>{{detail.Given}}</i>
         </div>
         <div class="node-detail" v-if="detail.Sex">
            <label for="">性别</label>
            <i>{{detail.Sex == 'male' ? '男' : '女'}}</i>
         </div>
         <div class="node-detail" v-if="detail.Spouse">
            <label for="">配偶</label>
            <i>{{detail.Spouse}}</i>
         </div>
         <div class="node-detail" v-if="detail.Zi">
            <label for="">字</label>
            <i>{{detail.Zi}}</i>
         </div>
         <div class="node-detail" v-if="detail.Hao">
            <label for="">号</label>
            <i>{{detail.Hao}}</i>
         </div>
         <div class="node-detail" v-if="detail.Inherit">
            <label for="">继承</label>
            <i>{{detail.Inherit}}</i>
         </div>
         <div class="node-detail" v-if="detail.Hang">
            <label for="">行</label>
            <i>{{detail.Hang}}</i>
         </div>
         <div class="node-detail" v-if="detail.BirthDate">
            <label for="">出生日期</label>
            <i>{{detail.BirthDate}}</i>
         </div>
         <div class="node-detail" v-if="detail.DeathDate">
            <label for="">死亡日期</label>
            <i>{{detail.DeathDate}}</i>
         </div>
         <div class="node-detail" v-if="detail.Biography">
            <label for="">传记</label>
            <i>{{detail.Biography}}</i>
         </div>
         <div class="node-detail" v-if="detail.Alias">
            <label for="">别名</label>
            <i>{{detail.Alias}}</i>
         </div>
      </article>
    </aside>
    <footer class="footer">
        
    </footer>
  </section>
</template>

<style scoped lang="scss">
.relationmap-wrap {
   position: relative;
   width: 100%;
   height: 100%;
   // background-color: #333;
   overflow: hidden;
   .header{

   }
   .main{
      position: relative;
      width: 100%;
      height: 100%;
   }
   .footer{
      position: absolute;
      bottom: 0;
      right: 0;
      width: 200px;
      height: 50px;
      background-color: #fff;
   }
}
.aside{
   position: absolute;
   top: 50px;
   right: 0;
   bottom: 50px;
   width: 240px;
   background-color: #333;
   padding: 20px;
}
.article{
   height: calc(100% - 182px);
   margin-top: 150px;
   color: #7C4F11;
   .node-detail{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      cursor: pointer;
      label{
         width: 70px;
         display: block;
      }
      i{
         width: calc(100% - 70px);
      }
   }
}
.search-box{
   position: relative;
   width: 100%;
   .search{
      text-indent: 40px;
   }
   .nodeList{
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
</style>