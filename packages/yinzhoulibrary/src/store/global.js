import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getValue, createMsg, setValue } from '../util/ADS.js';

export const useGlobalStore = defineStore('global', () => {
  const pathActive = ref('/');
  const token = ref(getValue('token') || '');
  const userInfo = ref(getValue('userInfo') ? JSON.parse(getValue('userInfo')) : {});
  const isResize = ref(0);

  const saveProperyValue = (data, f = false) => {
    switch(data.label){
      case 'token':
        token.value = data.value;
        break;
      case 'userInfo':
        userInfo.value = data.value;
        break;
      case 'pathActive':
        pathActive.value = data.value;
        break;
      case 'isResize':
        isResize.value = data.value;
        break;
      default:
        console.log('未定义属性');
    }
    if(f){
      setValue(data.label, f == 'dep' ? JSON.stringify(data.value) : data.value);
    }
  }

  return { 
    pathActive,
    token,
    userInfo,
    isResize,
    saveProperyValue,
  };
});
