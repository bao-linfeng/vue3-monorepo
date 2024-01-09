<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { catalog, pedigreeApi } from '../util/api';
import { getQueryVariable, createMsg } from '../util/ADS';
import { ElLoading } from 'element-plus';
import cover from '../assets/cover.svg';

const router = useRouter();
const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo, token, activeKey, activeLevel } = storeToRefs(global);
const { saveProperyValue } = global;

const props = defineProps({
    rootKey: String,
    zoomChartsData: Object,
});

const emit = defineEmits(['get-detail', 'get-key']);
const getDetail = (data) => {
   emit('get-detail', data);
}
const getKey = (data) => {
   emit('get-key', data);
}

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
               getDetail(event.clickNode.data);                     
               event.preventDefault();
            }
         },   
         onDoubleClick: (event, args) => {
            if(event.clickNode){    
               event.clickNode.data.isMember == 1 ? getKey(event.clickNode.data._key) : null;                        
               event.preventDefault();
            }
         },
         onPositionChange: function(args){
            circleRect.value = {
               w: args.nodes[0].shape.hHeight*4,
               h: args.nodes[0].shape.hWidth*4,
               x: args.nodes[0].shape.x-2*args.nodes[0].shape.hWidth,
               y: args.nodes[0].shape.y-2*args.nodes[0].shape.hWidth, //+ 76
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

onMounted(() => {
   // console.log(props.zoomChartsData, props.rootKey);
   initZoomCharts(props.zoomChartsData, props.rootKey);
});

</script>

<template>
    <section class="radial-charts">
        <i class="focus-circle" :style="{width: circleRect.w+'px', height: circleRect.h+'px', left: circleRect.x+'px', top: circleRect.y+'px'}"></i>
        <div class="relationmap" id="relationmap"></div>
        <i class="patch"></i>
    </section>
</template>

<style scoped lang="scss">
.radial-charts{
    position: relative;
    width: 100%;
    height: 100%;
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
.relationmap{
    position: relative;
    width: 100%;
    height: 100%;
}
@keyframes rotate {
    0% { transform: rotate(0deg); } /* 初始状态为不旋转 */
    100% { transform: rotate(360deg); } /* 结束状态为完全旋转一周（360度）*/
}
.patch{
    position: absolute;
    bottom: 0;
    right: 380px;
    width: 200px;
    height: 50px;
    background-color: #534f4a;
}
</style>