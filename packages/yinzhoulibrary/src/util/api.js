import axios from 'axios';
let baseURL = 'https://nbyzdata.qingtime.cn';
let uploadFileURL = '';

axios.interceptors.response.use(
  (response) => {
    switch (response.data.statusCode || response.data.status) {
      case '701':
        localStorage.clear();
        // createMsg('登录失效');
        break;
      case '201':
        // createMsg(response.data.msg)
        break;
      default:
    }

    return response;
  },
  (err) => {
    console.log(err);
  }
);

const request = {
  get: (url, params, base = '') => {
    return new Promise((resolve, reject) => {
      axios
        .get((base ? base : baseURL) + url, { params })
        .then((response) => {
          resolve(response.data);
          if (response.data.status == 301) {
            // 验证码失效 => 跳转 验证码校验UI 2022.07.02 -> baolf
            // createMsg(response.data.msg);
            // router.push('/authentication');
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  post: (url, params, base) => {
    return new Promise((resolve, reject) => {
      axios
        .post((base ? base : baseURL) + url, params)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  patch: (url, params) => {
    return new Promise(function (resolve, reject) {
      axios
        .patch(baseURL + url, params)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
  delete: (url, params) => {
    return new Promise(function (resolve, reject) {
      axios
        .delete(baseURL + url, {
          data: params,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  },
};

const catalog = {
  searchGCFrontEnd(param) {// 谱检索（前台无token）
    return request.get('/catalog/searchGCFrontEnd', param);
  },
  GCResolverFrontEnd(param) {// 谱检索分辨器（前台无token）
    return request.get('/catalog/GCResolverFrontEnd', param);
  },
  GCDetailFrontEnd(param) {// 谱目详情（前台无token）
    return request.get('/catalog/GCDetailFrontEnd', param);
  },
  createSingleGC(param) {// 单谱创建
    return request.post('/catalog/createSingleGC', param);
  },
  editSingleGC(param) {// 单谱创建
    return request.patch('/catalog/editSingleGC', param);
  },
  deleteSingleGC(param) {// 单谱删除
    return request.delete('/catalog/deleteSingleGC', param);
  },
  searchGC(param) {// 谱检索
    return request.get('/catalog/searchGC', param);
  },
  batchImportCatalog(param) {// 批量导入谱目
    return request.post('/catalog/batchImportCatalog', param);
  },
  searchGenealogyName(param) {// 谱名模糊查询
    return request.get('/catalog/searchGenealogyName', param);
  },
  hasImage(param) {// 绑定是否有影像
    return request.post('/catalog/hasImage', param);
  },
  catalogAnalysis(param) {// 谱目目录解析
    return request.post('/catalog/catalogAnalysis', param);
  },
  getCatalogAnalysisResult(param) {// 谱目目录解析结果
    return request.get('/catalog/catalogAnalysisResult', param);
  },
  getGCPedigreeListFrontEnd(param) {// 获取谱的谱系分支列表（前台无token）
    return request.get('/catalog/GCPedigreeListFrontEnd', param);
  },
  GCStatistics(param) {// 谱检索统计（卷数和影像页数）
    return request.get('/catalog/GCStatistics', param);
  },
};

const volumeApi = {
  createSingleVolume(param) {// 单卷册创建
    return request.post('/volume/createSingleVolume', param);
  },
  getVolumeList(param) {// 卷册列表
    return request.get('/volume/volumeList', param);
  },
  editSingleVolume(param) {// 单卷册编辑
    return request.patch('/volume/editSingleVolume', param);
  },
  deleteSingleVolume(param) {// 单卷册删除
    return request.delete('/volume/deleteSingleVolume', param);
  },
  volumeListSingleGC(param) {// 卷册列表（单谱前台无token）
    return request.get('/volume/volumeListSingleGC', param);
  },
  volumeStatistics(param) {// 卷册统计（影像页数）
    return request.get('/volume/volumeStatistics', param);
  },
};

const login = {
  loginByPassword(param) {// 登录
    return request.get('/loginByPassword', param);
  },
  setPassword(param) {// 设置新密码
    return request.patch('/setPassword', param);
  },
};

const uploadApi = {
  uploadJPGOrXML(param){// 上传文件
		return request.post('/uploadJPGOrXML', param);
	},
};

const imageApi = {
  createImage(param){// 创建影像页记录
		return request.post('/image/createImage', param);
	},
  getImageList(param) {// 卷册影像页key列表
    return request.get('/image/volumeImageList', param);
  },
  getImageDetail(param) {// 影像页SimplePath
    return request.get('/image/imageSimplePath', param);
  },
  imageAnalysis(param){// 影像页xml解析
		return request.post('/image/imageAnalysis', param);
	},
  imageSearchSingleGC(param) {// 影像页ocr检索（单谱）
    return request.get('/image/imageSearchSingleGC', param);
  },
  imageOcrResult(param) {// 影像页oc结果
    return request.get('/image/imageOcrResult', param);
  },
};

const pedigreeApi = {
  importTree(param){// 导入谱系分支树
		return request.post('/pedigree/importTree', param);
	},
  getTotalTree(param) {// 获取谱系分支树数据
    return request.get('/pedigree/totalTree', param);
  },
};

export { 
  catalog,
  volumeApi,
  login,
  uploadApi,
  imageApi,
  baseURL, 
  pedigreeApi,
};
