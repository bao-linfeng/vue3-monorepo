import { ref } from 'vue';
import { getQueryVariable, createMsg } from '../util/ADS';

export function useDetail(api, params, options = {
    immediate: false,
}) {
    const data = ref([]);
    const loading = ref(false);

    const refresh = () => {
        loading.value = true;
        return api(params).then((res) => {
            loading.value = false;
            if(res.status == 200){
                data.value = res.data;
            }else{
                console.log(res.msg);
            }
        })
    };

    options.immediate && refresh();
    return [data, refresh, loading];
}