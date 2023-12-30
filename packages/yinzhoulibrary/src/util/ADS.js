/**
 * @author baolf <baolf@qingtime.com>
 */

import { baseURL } from './api.js';

function getQueryVariable(variable){
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for(let i=0; i < vars.length; i++){
        let pair = vars[i].split("=");
        if(pair[0] == variable){return pair[1];}
    }
    return '';
}

const setValue = (label,value) => {
	window.localStorage.setItem(label,value);
}

const getValue = (label) => {
	return window.localStorage.getItem(label);
}

function downliadLink(fileName, origin = ''){
    var a = document.createElement('a');
    a.download = fileName;
    a.href = origin + fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

/** 
 * 数字千分位逗号分割 
 * @param {Number} [num=0] - 数字
 * @returns {String} 千分位逗号分割的字符串，如 12,345
 */
function thousands(num){
    return (num || 0).toLocaleString();
}

// download
const initDownloadExcel = (aoa, name) => {
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
        openDownloadDialog(sheet2blob(sheet), name+'-'+Date.now()+'.xlsx');
    })(aoa)
}

/**  
 * 同步下载打包【推荐】 
 * @param zipName 压缩包文件名  
 * @param files 文件列表，格式：[{"name":"文件名", "url":"文件下载地址"},……]  
 */
function zipFiles(zipName, files, cb) {  
    let startTime = Date.now();
    console.log("同步下载打包开始时间：" + startTime);  
    // 创建压缩文件输出流  
    const zipFileOutputStream = streamSaver.createWriteStream(zipName);  
    // 创建下载文件流  
    const fileIterator = files.values();  

    const readableZipStream = new ZIP({  
            async pull(ctrl) {  
                const fileInfo = fileIterator.next();  
                if (fileInfo.done) {//迭代终止  
                    ctrl.close();  
                } else {  
                    const {name, url} = fileInfo.value;  
                    return fetch(url).then(res => {  
                        ctrl.enqueue({  
                            name,  
                            stream: () => res.body  
                        });  
                    })  
                    .catch((e) => {
                        console.log('请求下载');
                        cb('error');
                    });
                }        
            }    
        });  
    
    if (window.WritableStream && readableZipStream.pipeTo) {  
        // 开始下载  
        readableZipStream  
            .pipeTo(zipFileOutputStream)  
            .then(() => {
                console.log("同步下载打包结束时间：" + (Date.now() - startTime)/1000);
                cb('success');
            })
            .catch((e) => {
                console.log('压缩错误');
                cb('error');
            });  
    }  
}

const createMsg = (msg='ok', flag = false) => {
    let time = Date.now(),className = flag ? 'msg_wrap_ok' : 'msg_wrap_warn';

    let str = '<span id='+time+' class="msg_wrap '+className+'">'+msg+'</span>';
    let range = document.createRange();
    range.selectNodeContents(document.documentElement); 
    let fragment = range.createContextualFragment(str);
    document.body.appendChild(fragment);

    let timer = setTimeout(function(){
        document.body.removeChild(document.getElementById(time));
        clearTimeout(timer);
    },3000);
}

export {
    getQueryVariable,
    setValue,
    getValue,
    downliadLink,
    thousands,
    initDownloadExcel,
    zipFiles,
    createMsg,
}