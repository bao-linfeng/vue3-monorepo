<template>
    <div class="contract-wrap" :style="{width: 'calc(100% - '+sidebarW+'px)'}">
        <div class="contract-head">
            <div class="head-left">
                <el-select v-model="routeType" class="w130">
                    <el-option v-for="item in routeList" :key="item.value" :label="lan[item.label]" :value="item.value" />
                </el-select>
            </div>
            <div class="head-right">
                <div class="chart-box" @click="isChart = true">
                    <span>{{lan['图表展示']}}</span>
                    <img src="../assets/chart.svg" alt="">
                </div>
                <!-- <label for="">{{lan['通过时间']}}</label> -->
                <el-date-picker
                    class="w130"
                    v-model="startTime"
                    type="month"
                    :placeholder="lan['开始时间']">
                </el-date-picker>
                <el-date-picker
                    class="w130"
                    v-model="endTime"
                    type="month"
                    :placeholder="lan['结束时间']">
                </el-date-picker>
                
                <el-button type="primary" @click="getDataList">{{lan['检索']}}</el-button>
                <el-button type="primary" @click="initDownloadExcel">{{lan['下载']}}</el-button>
            </div>
        </div>
        <el-table class="el-table-box" :data="tableData" :max-height="tableH">
            <el-table-column prop="englishName" :label="lan['年度月份']" width="90" fixed :align="'center'" />
            <el-table-column :label="lan['数据汇总']" fixed :align="'center'">
                <el-table-column prop="allOrgNumberT" :label="lan['完结']" fixed :align="'center'" />
                <el-table-column prop="allOrgNumberNoT" :label="lan['未完结']" fixed :align="'center'" />
                <el-table-column prop="allOrgNumberFP" :label="lan['完成率']" fixed :align="'center'" />
            </el-table-column>
            <el-table-column :label="lan['寻源堂']" :align="'center'">
                <el-table-column prop="aaT" :label="lan['完结']" :align="'center'" />
                <el-table-column prop="aaNoT" :label="lan['未完结']" :align="'center'" />
                <el-table-column prop="aaFP" :label="lan['完成率']" :align="'center'" />
            </el-table-column>
            <el-table-column :label="lan['成蹊']" :align="'center'">
                <el-table-column prop="bbT" :label="lan['完结']" :align="'center'" />
                <el-table-column prop="bbNoT" :label="lan['未完结']" :align="'center'" />
                <el-table-column prop="bbFP" :label="lan['完成率']" :align="'center'" />
            </el-table-column>
            <el-table-column :label="lan['馨里有谱']" :align="'center'">
                <el-table-column prop="bbcT" :label="lan['完结']" :align="'center'" />
                <el-table-column prop="bbcNoT" :label="lan['未完结']" :align="'center'" />
                <el-table-column prop="bbcFP" :label="lan['完成率']" :align="'center'" />
            </el-table-column>
            <el-table-column :label="lan['仰沁']" :align="'center'">
                <el-table-column prop="ccT" :label="lan['完结']" :align="'center'" />
                <el-table-column prop="ccNoT" :label="lan['未完结']" :align="'center'" />
                <el-table-column prop="ccFP" :label="lan['完成率']" :align="'center'" />
            </el-table-column>
            <el-table-column :label="lan['良友科苑']" :align="'center'">
                <el-table-column prop="ddT" :label="lan['完结']" :align="'center'" />
                <el-table-column prop="ddNoT" :label="lan['未完结']" :align="'center'" />
                <el-table-column prop="ddFP" :label="lan['完成率']" :align="'center'" />
            </el-table-column>
            <el-table-column :label="lan['时光科技']" :align="'center'">
                <el-table-column prop="eeT" :label="lan['完结']" :align="'center'" />
                <el-table-column prop="eeNoT" :label="lan['未完结']" :align="'center'" />
                <el-table-column prop="eeFP" :label="lan['完成率']" :align="'center'" />
            </el-table-column>
            <el-table-column :label="lan['古中山']" :align="'center'">
                <el-table-column prop="ffT" :label="lan['完结']" :align="'center'" />
                <el-table-column prop="ffNoT" :label="lan['未完结']" :align="'center'" />
                <el-table-column prop="ffFP" :label="lan['完成率']" :align="'center'" />
            </el-table-column>
        </el-table>
        <!-- <ChartModule v-if="isChart" :year="Date.now()" :orgName="''" :chartData="chartData" v-on:close="isChart = false" /> -->
        <EchartsModule v-if="isChart" :title="title" :subtitle="subtitle+' '+orgName" :chartData="chartData" v-on:close="isChart = false" />
    </div>
</template>

<script>
import { ref, reactive, onMounted, watch, watchEffect, computed, provide,readonly, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useState, changePropertyValue } from '../store';
import { getQueryVariable, getLocalTime, createMsg, getCurrentMonthZero, getDays, getMonthTimestamp, thousands } from '../util/ADS';
import { supplierMS, org } from '../util/api';
import ChartModule from '../components/ChartModule.vue';
import EchartsModule from '../components/EchartsModule.vue';

export default {
    components: {
        ChartModule, EchartsModule,
    },
    name: 'catalogMonthReport',
    props: ['id'],
    setup(props, context) {
        const { userKey, siteKey, userRole, orgKey, lan, sidebarW } = toRefs(useState());
        const router = useRouter();
        const id = props.id;

        const tableH = ref(300);

		const startTime = ref('');
		const endTime = ref('');
        
        const tableData = ref([]);
        const chartData = ref({'labels': [], 'data': [], 'label': []});
        // 机构汇总统计数据
        const getDataList = async () => {
            tableData.value = [];
			changePropertyValue('isLoading', true);
            const result = await supplierMS.GCOverStatisticsAllOrg({
                'startTime': startTime.value ? new Date(startTime.value).getTime() : '',
                'endTime': endTime.value ? new Date(endTime.value).getTime()+getDays(new Date(endTime.value).getTime())-1 : '',
            });
            changePropertyValue('isLoading', false);
			if(result.status == 200){
                tableData.value = result.data.map((ele) => {
                    if(ele.englishName == '数据汇总'){
                        ele.englishName = lan.value[ele.englishName];
                    }else{
                        ele.englishName = ele.year+''+(ele.month <= 9 ? '0'+ele.month : ele.month);
                    }

                    ele.allOrgNumberFP = ele.allOrgNumberFP ? (ele.allOrgNumberFP*100).toFixed(2)+'%' : '0%';
                    ele.aaFP = ele.aaFP ? (ele.aaFP*100).toFixed(2)+'%' : '0%';
                    ele.bbFP = ele.bbFP ? (ele.bbFP*100).toFixed(2)+'%' : '0%';
                    ele.bbcFP = ele.bbcFP ? (ele.bbcFP*100).toFixed(2)+'%' : '0%';
                    ele.ccFP = ele.ccFP ? (ele.ccFP*100).toFixed(2)+'%' : '0%';
                    ele.ddFP = ele.ddFP ? (ele.ddFP*100).toFixed(2)+'%' : '0%';
                    ele.eeFP = ele.eeFP ? (ele.eeFP*100).toFixed(2)+'%' : '0%';
                    ele.ffFP = ele.ffFP ? (ele.ffFP*100).toFixed(2)+'%' : '0%';

                    ele.allOrgNumberT = thousands(ele.allOrgNumber);
                    ele.aaT = thousands(ele.aa);
                    ele.bbT = thousands(ele.bb);
                    ele.bbcT = thousands(ele.bbc);
                    ele.ccT = thousands(ele.cc);
                    ele.ddT = thousands(ele.dd);
                    ele.eeT = thousands(ele.ee);
                    ele.ffT = thousands(ele.ff);

                    ele.allOrgNumberNoT = thousands(ele.allOrgNumberNo);
                    ele.aaNoT = thousands(ele.aaNo);
                    ele.bbNoT = thousands(ele.bbNo);
                    ele.bbcNoT = thousands(ele.bbcNo);
                    ele.ccNoT = thousands(ele.ccNo);
                    ele.ddNoT = thousands(ele.ddNo);
                    ele.eeNoT = thousands(ele.eeNo);
                    ele.ffNoT = thousands(ele.ffNo);
                    
                    return ele;
                });

                let chartDataO = {'labels': [], 'data': [], 'label': [lan.value['寻源堂'], lan.value['成蹊'], lan.value['馨里有谱'], lan.value['仰沁'], lan.value['良友科苑'], lan.value['时光科技'], lan.value['古中山']]};
                let aa = [], bb = [], bbc = [], cc = [], dd = [], ee = [], ff =[];

                tableData.value.forEach((ele) => {
                    if(ele.englishName == '数据汇总'){

                    }else{
                        chartDataO.labels.push(ele.englishName); 
                        aa.push(ele.aa);
                        bb.push(ele.bb);
                        bbc.push(ele.bbc);
                        cc.push(ele.cc);
                        dd.push(ele.dd);
                        ee.push(ele.ee);
                        ff.push(ele.ff);
                    }
                });
                chartDataO.data.push(aa); 
                chartDataO.data.push(bb); 
                chartDataO.data.push(bbc); 
                chartDataO.data.push(cc); 
                chartDataO.data.push(dd); 
                chartDataO.data.push(ee); 
                chartDataO.data.push(ff); 

                chartData.value = chartDataO;
            }else{
                createMsg(result.msg);
            }
        }

        // 机构
        let orgKeyO = {};
        const orgName = ref('');
        const getOrgList = async () => {
            const result = await org.getOrgList(siteKey.value, '');
            if(result.status == 200){
                result.data.map((ele) => {
                    orgKeyO[ele.organizationNo] = ele._key
                });
            }
        }

        // 切换页面
        const routeList = ref([
            {'label': '按编目汇总', 'value': '/catalogReport'}, 
            {'label': '按机构汇总', 'value': '/catalogMonthReport'}, 
            {'label': '机构编目准确率统计表', 'value': '/catalogEditReport'},
        ]);
        const routeType = ref('/catalogMonthReport');
        watch(routeType, (nv, ov) => {
            router.push(nv);
        });
        // 可视化
        const isChart = ref(false);

        onMounted(() => {
            startTime.value = getCurrentMonthZero();
            endTime.value = getCurrentMonthZero(0);
            subtitle.value = getLocalTime(startTime.value, '/', 2) + '-' + getLocalTime((endTime.value), '/', 2);

            tableH.value = window.innerHeight - 100;

            getOrgList();
            getDataList();
        });

        // 单元格点击 
        const handleCellClick = (row, column) => {
            console.log(row, column);
            let orgKey = '', startTimes = '', endTimes = '';

            if(row == 'englishName'){
                return;
            }
            if(row != 'allOrgNumber'){
                orgKey = orgKeyO[row];
            }

            if(column.englishName != '数据汇总'){
                if(startTime.value && endTime.value){
                    startTimes = getMonthTimestamp(column.year, column.month).firstDayTimestamp;
                    endTimes = getMonthTimestamp(column.year, column.month).lastDayTimestamp;
                }else{
                    startTimes = '';
                    endTimes = '';
                }
            }else{
                startTimes = startTime.value ? new Date(startTime.value).getTime() : '';
                endTimes = endTime.value ? new Date(endTime.value).getTime()+getDays(new Date(endTime.value).getTime())-1 : '';
            }

            window.open('/imageStatistics?orgKey='+orgKey+'&startTime='+startTimes+'&endTime='+endTimes+'&isAll=1');
        }

        // 下载
        const initDownloadExcel = () => {
            let aoa = [], t = [];
            ['年度月份', '汇总数据', '寻源堂', '成蹊', '馨里有谱', '仰沁', '良友科苑', '时光科技', '古中山'].forEach((ele) => {
                t.push(lan.value[ele]);
            });
            aoa.push(t);
            tableData.value.forEach((ele) => {
                aoa.push([ele.englishName, ele.allOrgNumber, ele.aa, ele.bb, ele.bbc, ele.cc, ele.dd, ele.ee, ele.ff]);
            });
            /** 
            * 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
            * @param sheet
            * @param sheetName
            */
            function sheet2blob(sheet, sheetName) {
                sheetName = sheetName || 'sheet1';
                var workbook = {
                    SheetNames: [sheetName],
                    Sheets: {}
                };
                workbook.Sheets[sheetName] = sheet;
                // 生成excel的配置项
                var wopts = {
                    bookType: 'xlsx', // 要生成的文件类型
                    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
                    type: 'binary'
                };
                var wbout = XLSX.write(workbook, wopts);
                var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
                // 字符串转ArrayBuffer
                function s2ab(s) {
                    var buf = new ArrayBuffer(s.length), view = new Uint8Array(buf);
                    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
                    return buf;
                }
                return blob;
            }

            /**
             * 通用的打开下载对话框方法，没有测试过具体兼容性
             * @param url 下载地址，也可以是一个blob对象，必选
             * @param saveName 保存文件名，可选
             */
            function openDownloadDialog(url, saveName){
                if(typeof url == 'object' && url instanceof Blob){
                    url = URL.createObjectURL(url); // 创建blob地址
                }
                var aLink = document.createElement('a'), event;
                aLink.href = url;
                aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
                if(window.MouseEvent) event = new MouseEvent('click');
                else{
                    event = document.createEvent('MouseEvents');
                    event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                }
                aLink.dispatchEvent(event);
            }

            /**
             * 导出excel
             * @param aoa 二维数组，表格头部数据
            */
            (function aoa_to_sheet(aoa){
                let XLSX = window.XLSX;
                var sheet = XLSX.utils.aoa_to_sheet(aoa);
                openDownloadDialog(sheet2blob(sheet), lan.value['编目月度汇总']+'.xlsx');
            })(aoa)
        }

        const title = ref(lan.value['编目月度汇总']);
        const subtitle = ref('');
        watch(startTime, (nv, ov) => {
            subtitle.value = getLocalTime(startTime.value, '/', 2) + '-' + getLocalTime((endTime.value), '/', 2);
        });
        watch(endTime, (nv, ov) => {
            subtitle.value = getLocalTime(startTime.value, '/', 2) + '-' + getLocalTime((endTime.value), '/', 2);
        });

        return {
            tableData, getDataList, isChart, userRole, startTime, endTime,
			chartData, lan, sidebarW, routeList, routeType, handleCellClick, 
            initDownloadExcel, tableH, title, subtitle, orgName,
        }
    }
}
</script>

<style lang="scss" scoped>
.contract-wrap{
    position: relative;
    width: calc(100% - 200px);
    height: 100%;
    color: #333;
}
.contract-head{
    position: relative;
    width: calc(100% - 40px);
    padding: 0 20px;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .head-right{
        display: flex;
        align-items: center;
        .chart-box{
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-right: 10px;
            img{
                height: 30px;
                margin-left: 5px;
            }
        }
    }
}
.contract-content{
    position: relative;
    width: calc(100% - 40px);
    padding: 0 20px;
    height: calc(100% - 100px);
    overflow-y: auto;
}
.table{
    position: relative;
    width: 100%;
    max-height: 100%;
    text-align: center;
    border: none;
    border-collapse: collapse;
    color: #000;
    border: 1px solid #ddd;
    .thead{
        position: relative;
        width: 100%;
        height: 40px;
        background: #D1D1D1;
        position: sticky;
        top: 0;
        z-index: 2;
        tr{
            th{
                padding: 5px 0;
                min-width: 80px;
                border: 1px solid #ddd;
            }
        }
    }
    .tbody{
        position: relative;
        width: 100%;
        height: calc(100% - 42px);
        font-size: 14px;
        tr{
            &:nth-of-type(even){
                background: #F2F2F2;
            }
            &:hover{
                background: #DBE6CC;
            }
            &.active{
                position: sticky;
                bottom: 0;
                background: #DBE6CC;
                font-weight: bold;
            }
            td{
                padding: 15px 0;
                min-width: 80px;
                border: 1px solid #ddd;
                cursor: pointer;
            }
        }
    }
    .btn{
        padding: 0 10px;
        width: auto;
        height: 20px;
        line-height: 20px;
        font-size: 12px;
        &.disabled{
            background: #ddd;
            cursor: default;
        }
    }
    .marginR10{
        margin: 0 5px;
    }
}
.marginR10{
    margin-right: 10px;
}
.w130{
    width: 130px !important;
}
.el-table-box{
    width: calc(100% - 40px);
    margin: 0 auto;
}
</style>