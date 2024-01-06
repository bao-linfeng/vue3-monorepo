import { ref } from 'vue';
import { usePagination } from './usePagination.js';
import { formattedDate } from '../util/ADS';

export function useTable(api, params, options = {
    path: {data: "data", total: "total", page: "page", size: "size" },
    immediate: false,
}) {
    const [pagination, , , setTotal] = usePagination(() => refresh());;
    const data = ref([]);
    const loading = ref(false);

    const refresh = (extraData = params) => {
        loading.value = true;
        return api(Object.assign(extraData, {[options.path.page]: pagination.current, [options.path.size]: pagination.size})).then((res) => {
            // console.log(res);
            loading.value = false;
            if(res.status == 200){
                data.value = res.result.list.map((ele) => {
                    ele.time = formattedDate(ele.time); 
                    return ele;
                });
                setTotal(res.result.total);
            }else{
                console.log(res.msg);
            }
        })
    };

    options.immediate && refresh();
    return [data, refresh, loading, pagination];
}