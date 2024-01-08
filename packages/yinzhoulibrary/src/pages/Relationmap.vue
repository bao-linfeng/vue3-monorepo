<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog, pedigreeApi } from '../util/api';
import { getQueryVariable, createMsg } from '../util/ADS';
import { ElLoading } from 'element-plus';
import cover from '../assets/cover.svg';
import TreeModule from '../components/TreeModule.vue';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token, activeKey, activeLevel } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
  msg: String,
});

const zoomChartsData = ref({
   nodes: [],
   links: []
});

let members = {};
const rootMembers = ref({'Fullname': '', 'Given': ''});
const GenerationList = ref([]);

const getTotalTree = async () => {
   GenerationList.value = [];
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
      rootKey.value = result.result.root;
      saveProperyValue({'label': 'activeKey', 'value': rootKey.value});
      members = result.result.members;

      for(let key in members){
         // if(Number(members[key].Generation) >= generation.value){
         //    generation.value = Number(members[key].Generation);
         // }

         if(members[key].isMember != 1){
            members[key].children = [];
            members[key].spouseOrder = [];
         }

         if(members[key].children.length && members[key].isMember == 1){
            for(let i = 0; i < members[key].children.length; i++){
               members[key].children[i] = members[members[key].children[i]];
            }
         }

         if(members[key].spouseOrder.length && members[key].isMember == 1){
            for(let j = 0; j < members[key].spouseOrder.length; j++){
               members[key].spouseOrder[j] = members[members[key].spouseOrder[j]];
            }
         }
      }

      rootMembers.value = members[rootKey.value]; 
      // console.log(rootMembers.value);

      let personArr = [];
      function getChildren(data){
         let Generation = 0;
         if(data.length){
            for(let i = 0; i < data.length; i++){
               Generation = data[i].Generation || 0;
               
               if(!personArr[Generation]){
                  personArr[Generation] = [];
                  // 获取每一世代 第一个节点
                  if(i === 0){
                     GenerationList.value.push({
                        'name': data[i].Fullname || data[i].Given,
                        '_key': data[i]._key,
                        'Generation': data[i].Generation,
                     });
                  }
               }

               personArr[Generation].push(data[i]);

               if(data[i].spouseOrder.length && data[i].isMember == 1){
                  personArr[Generation] = personArr[Generation].concat(data[i].spouseOrder);
               }

               if(data[i].children.length && data[i].isMember == 1){
                  getChildren(data[i].children);
               }
            }
         }
      }

      getChildren([members[rootKey.value]]);
      console.log(GenerationList.value);

      if(keyWord.value){
         getPositionNode();
      }
   }else{
      createMsg(result.msg);
   }
};

watch(activeKey, () => {
   saveProperyValue({'label': 'activeLevel', 'value': Number(members[activeKey.value].Generation)});
   detail.value = members[activeKey.value];
   if(type.value == 2){
      handleScrollIntoView(activeLevel.value);
      handleScrollIntoView(activeKey.value+'-'+activeLevel.value);
   }
});

const handleScrollIntoView = (id) => {
   let timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      document.getElementById(id+'').scrollIntoView();
   }, 200);
}

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
const genealogyName = ref();
const pedigreeKey = ref('');
const pedigreeList = ref([]);
const rootKey = ref('');
const detail = ref({});
const nodes = ref([]);
const keyWord = ref('');

const netChart = ref('');
const circleRect = ref({
   w: 0,
   h: 0,
   x: 0,
   y: 0,
});
const initZoomCharts = (data, rootKey) => {
   netChart.value ? netChart.value.remove() : null;
   netChart.value = null;
   netChart.value = new NetChart({
      navigation: {
         focusNodeExpansionRadius: 2,
         initialNodes: [rootKey],
         mode: "focusnodes"
      },
      style: {
         node: {
            display: "image",
            lineWidth: 4,
            lineColor: "#0EA0B8",
            imageCropping: true
         },
         "nodeStyleFunction": function(node) {
            nodeStyle(node);
         },
         "linkStyleFunction": function(link) {                 
            link.fillColor = "#F8EEDF";  
            link.label = link.data.type;                  
            link.labelStyle.textStyle.fillColor = '#fff';
            link.labelStyle.padding = 2;
            link.labelStyle.textStyle.font ='10px SourceHanSerifCN-Regular';  
            link.labelStyle.backgroundStyle.fillColor = 'transparent';             
            link.labelStyle.backgroundStyle.lineColor = 'transparent';   
            link.toDecoration = 'arrow';
            link.labelStyle.rotateWithLink = true; //关系label方向顺着线条方向摆放                
         }
      },
      area: { height: null },
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
         nodeSpacing: 120,
         mode: 'dynamic', //radial dynamic      
      },
      nodeMenu: {
         enabled: false,           
      },
      interaction: {
         zooming: {
            zoomExtent: [0.1, 2],
            autoZoomExtent: [0.1, 1],
            doubleClickZoom: null,//双击空白将触发按此值放大
            autoZoomPositionElasticity: 5
         },                
      },
      events: {
         onClick: (event, args) => {
            if(event.clickNode){       
               detail.value = event.clickNode.data;                        
               event.preventDefault();
            }
         },   
         onDoubleClick: (event, args) => {
            if(event.clickNode){    
               event.clickNode.data.isMember == 1 ? getFiveGeneration(event.clickNode.data._key) : null;                             
               event.preventDefault();
            }
         },
         onPositionChange: function(args){
            circleRect.value = {
               w: args.nodes[0].shape.hHeight*4,
               h: args.nodes[0].shape.hWidth*4,
               x: args.nodes[0].shape.x-2*args.nodes[0].shape.hWidth,
               y: args.nodes[0].shape.y-2*args.nodes[0].shape.hWidth + 76,
            }               
         },    
      },
   })
}

const nodeStyle = (node) =>{ 
   node.radius = 30;
   node.lineColor = '#0EA0B8';
   node.lineWidth = 4;  

   node.items = [];
   node.display = "image";           
   node.imageCropping = true;
   node.label = node.data.name;
   node.image = cover;
   node.labelStyle.padding = 10;   
   node.labelStyle.margin = -30;     
   node.labelStyle.textStyle.fillColor = "#000";                 
   node.labelStyle.backgroundStyle.fillColor = "transparent";   
   
   if(node.data.Sex != 'male'){
      node.lineColor = '#ff7963';
   }

   if(node.hovered){
      node.radius = 35; 
      node.lineWidth = 5;  
      node.labelStyle.margin = -35; 
   } 

   if(node.focused){           
      node.radius = 40;
      node.lineWidth = 6;  
      node.labelStyle.margin = -40;  
   }

   return node;
}

const personList = ref([]);
// 定位节点
const getPositionNode = async () => {
   const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
   });
   const result = await pedigreeApi.getPositionNode({
      'gcKey': dataKey.value,
      'name': keyWord.value,
   });
   loading.close();
   if(result.status == 200){
      nodes.value = result.result.map((ele, index) => {
         if(index === 0){
            rootKey.value = ele._key;
         }
         return ele;
      });
      saveProperyValue({'label': 'activeKey', 'value': rootKey.value});
      if(type.value == 1){
         getFiveGeneration(rootKey.value)
      }else{
         if(keyWord.value){
            // rootMembers.value = members[rootKey.value]; 
            // detail.value = members[rootKey.value];
         }else{

         }
      }
   }else{
      createMsg(result.msg);
   }
};

// 获取5代数据
const getFiveGeneration = async (id) => {
   const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
   });
   const result = await pedigreeApi.getFiveGeneration({
      'personKey': id,
   });
   loading.close();
   if(result.status == 200){
      result.result.nodes.forEach((ele) => {
         ele.name = ele.Fullname ? ele.Fullname : ele.Given;
         ele.id = ele._key;
         if(ele._key === id){
            detail.value = ele;
         }
      });

      zoomChartsData.value = {
         'nodes': result.result.nodes,
         'links': result.result.links,
      };

      personList.value = result.result.personList;
      rootKey.value = id;

      initZoomCharts(zoomChartsData.value, rootKey.value);
   }else{
      createMsg(result.msg);
   }
};

// 获取谱的一世祖节点key
const getFirstAncestor = async () => {
   const loading = ElLoading.service({
      lock: true,
      text: 'Loading',
      background: 'rgba(0, 0, 0, 0.7)',
   });
   const result = await pedigreeApi.getFirstAncestor({
      'gcKey': dataKey.value,
   });
   loading.close();
   if(result.status == 200){
      rootKey.value = result.result.firstAncestorKey;
      getFiveGeneration(rootKey.value);
   }else{
      createMsg(result.msg);
   }
};

const handleClickNode = (data) => {
   rootKey.value = data._key;
   saveProperyValue({'label': 'activeKey', 'value': rootKey.value});
   keyWord.value = '';
   nodes.value = [];
   if(type.value == 1){
      getFiveGeneration(rootKey.value)
   }else{
      // rootMembers.value = members[rootKey.value]; 
      // detail.value = members[rootKey.value];
   }
}

const handleSearch = () => {
   if(!keyWord.value){
      nodes.value = [];
   }else{
      getPositionNode();
   }
}

const handleClickName = (data) => {
   data.isMember == 1 ? getFiveGeneration(data._key) : null;  
}

const type = ref('2');
const typeList = ref([
   {'label': '人物图谱', 'value': '1'},
   {'label': '世系图谱', 'value': '2'},
]);

const handleClickTab = (data) => {
   if(type.value == data.value){
      return;
   }
   type.value = data.value;
   keyWord.value = getQueryVariable('content') ? decodeURIComponent(getQueryVariable('content')) : '';
   if(type.value == 1){
      keyWord.value ? getPositionNode() : getFirstAncestor();
   }else{
      getGCPedigreeListFrontEnd();
   }
}

const goBack = () => {
   // history.go(-1);
}

onMounted(() => {
   dataKey.value = getQueryVariable('id');
   genealogyName.value = getQueryVariable('genealogyName') ? decodeURIComponent(getQueryVariable('genealogyName')) : '';
   keyWord.value = getQueryVariable('content') ? decodeURIComponent(getQueryVariable('content')) : '';
   if(type.value == 1){
      keyWord.value ? getPositionNode() : getFirstAncestor();
   }else{
      getGCPedigreeListFrontEnd();
   }
});

</script>

<template>
   <section class="relationmap-wrap">
      <header class="header">
         <div class="left">
            <img src="../assets/返回白色.svg" @click="goBack" />
            <h3 class="title">{{genealogyName}}</h3>
         </div>
         <ul class="tab-wrap">
            <li :class="{active: type === item.value}" v-for="(item, index) in typeList" :key="index" @click="handleClickTab(item)">{{item.label}}</li>
         </ul>
      </header>
      <i class="focus-circle" v-if="type == 1" :style="{width: circleRect.w+'px', height: circleRect.h+'px', left: circleRect.x+'px', top: circleRect.y+'px'}"></i>
      <main class="main">
         <div v-if="type == 1" class="relationmap" id="relationmap"></div>
         <TreeModule v-else :treeData="rootMembers" :generation="GenerationList" />
      </main>
      <aside class="aside">
         <div class="search-box">
            <input class="search" type="text" v-model="keyWord" placeholder="请输入关键字或世代数" @keyup.enter="handleSearch" >
            <img class="search-icon" src="../assets/搜索.svg" alt="">
            <ul class="nodeList style1" v-if="nodes.length">
               <li v-for="(item, index) in nodes" :class="{active: rootKey == item._key}" :key="index" @click="handleClickNode(item)">{{item.Fullname}}</li>
            </ul>
         </div>
         <article class="article style1" v-if="detail._key">
            <div class="node-detail fontSize36">
               <h3>{{detail.Fullname || detail.Given || '-'}}</h3>
            </div>
            <div class="node-detail">
               <label for="">姓氏</label>
               <i>{{detail.Surname || '-'}}</i>
            </div>
            <div class="node-detail">
               <label for="">名</label>
               <i>{{detail.Given || '-'}}</i>
            </div>
            <div class="node-detail">
               <label for="">性别</label>
               <i>{{detail.Sex == 'male' ? '男' : '女'}}</i>
            </div>
            <div class="node-detail">
               <label for="">世代</label>
               <i v-if="detail.Generation">{{detail.Generation+'世'}}</i>
            </div>
            <div class="node-detail">
               <label for="">字</label>
               <i>{{detail.Zi || '-'}}</i>
            </div>
            <div class="node-detail">
               <label for="">号</label>
               <i>{{detail.Hao || '-'}}</i>
            </div>
            <div class="node-detail">
               <label for="">行</label>
               <i>{{detail.Hang || '-'}}</i>
            </div>
            <div class="node-detail">
               <label for="">生于</label>
               <i>{{detail.BirthDate || '-'}}</i>
            </div>
            <div class="node-detail">
               <label for="">卒于</label>
               <i>{{detail.DeathDate || '-'}}</i>
            </div>
            <div class="node-detail">
               <label for="">传记</label>
               <i>{{detail.Biography || '-'}}</i>
            </div>
            <div class="node-detail" v-if="detail._key === rootKey && type == 1">
               <label for="">关系</label>
               <ul class="links-box">
                  <li v-for="(item, index) in personList" :key="index">
                     {{item.relation}}
                     <p @click="handleClickName(item)">{{item.Fullname}}</p>
                  </li>
               </ul>
            </div>
         </article>
      </aside>
      <footer class="footer" v-if="type == 1">
         
      </footer>
   </section>
</template>

<style scoped lang="scss">
.relationmap-wrap {
   position: relative;
   width: 100%;
   height: 100%;
   background: #000 url('../assets/家谱平台关系图BG.png') 0 0 no-repeat;
   background-size: cover;
   overflow: hidden;
   color: #fff;
   .header{
      position: absolute;
      top: 0;
      left: 0;
      width: calc(100% - 46px);
      padding: 13px 23px;
      display: flex;
      align-items: center;
      font-size: 30px;
      z-index: 10;
      .left{
         display: flex;
         align-items: center;
         img{
            margin-right: 12px;
            cursor: pointer;
         }
      }
      .tab-wrap{
         position: absolute;
         top: 50%;
         left: 50%;
         transform: translate(-50%, -50%);
         display: flex;
         align-items: center;
         font-size: 20px;
         li{
            margin: 0 20px;
            cursor: pointer;
            opacity: 0.8;
            &.active{
               opacity: 1;
            }
         }
      }
   }
   .main{
      position: absolute;
      top: 76px;
      left: 0;
      width: calc(100% - 380px);
      height: 100%;
      .relationmap{
         position: relative;
         width: 100%;
         height: 100%;
      }
   }
   .focus-circle{
      position: absolute;
      opacity: 0.3;
      background: url('../assets/circle.png') 50% 50% no-repeat;
      background-size: cover;
      animation-name: rotate; /* 指定要应用的动画名称 */
      animation-duration: 2s; /* 设置动画持续时间 */
      animation-iteration-count: infinite; /* 无限次重复播放动画 */
      animation-timing-function: linear; /* 线性过渡效果 */
   }
   .footer{
      position: absolute;
      bottom: 0;
      right: 380px;
      width: 200px;
      height: 50px;
      background-color: #534f4a;
   }
}
@keyframes rotate {
  0% { transform: rotate(0deg); } /* 初始状态为不旋转 */
  100% { transform: rotate(360deg); } /* 结束状态为完全旋转一周（360度）*/
}
.aside{
   position: absolute;
   top: 0;
   right: 0;
   bottom: 0;
   width: 340px;
   padding: 20px;
   z-index: 11;
}
.article{
   position: relative;
   height: calc(100% - 87px);
   margin-top: 45px;
   color: #fff;
   overflow-y: auto;
   font-size: 20px;
   .node-detail{
      display: flex;
      align-items: flex-start;
      margin-bottom: 10px;
      label{
         width: 70px;
         display: block;
      }
      i{
         width: calc(100% - 70px);
      }
      .links-box{
         width: calc(100% - 70px);
         li{
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            p{
               margin-left: 20px;
               width: 122px;
               height: 40px;
               line-height: 40px;
               background: url('../assets/btn-icon.svg') 50% 50% no-repeat;
               background-size: cover;
               color: #000;
               text-align: center;
               cursor: pointer;
            }
         }
      }
   }
}
.search-box{
   position: relative;
   width: 100%;
   font-size: 16px;
   z-index: 10000;
   .search{
      text-indent: 40px;
      width: calc(100% - 2px);
      height: 42px;
      background-color: transparent;
      border: 1px solid rgba(255,255,255,0.15);
      color: rgba(255,255,255,0.88);
      font-size: 16px;
      border: 1px solid #ddd;
      outline: none;
      border-radius: 5px;
   }
   .search-icon{
      position: absolute;
      top: 11px;
      left: 10px;
      cursor: pointer;
   }
   .nodeList{
      position: absolute;
      top: 100%;
      left: 0;
      padding: 0 10px;
      width: calc(100% - 20px);
      background-color: transparent;
      box-shadow: 0 0 1px 0 #fff;
      z-index: 1000;
      max-height: 150px;
      overflow-y: auto;
      border-radius: 5px;
      color: #fff;
      background-color: #534f4a;
      li{
         height: 42px;
         line-height: 42px;
         cursor: pointer;
         overflow: hidden;
         white-space: nowrap;
         text-overflow: ellipsis;
         &:hover{
            color: #F8EEDF;
         }
         &.active{
            color: #F8EEDF;
         }
      }
   }
}
.marginB30{
   margin-bottom: 30px !important;
}
</style>