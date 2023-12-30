<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useGlobalStore } from '../store/global.js';
import { setValue } from '../util/ADS.js';

const router = useRouter();

const global = useGlobalStore();
const { userInfo, pathActive, orgMemberInfo } = storeToRefs(global);
const { saveProperyValue } = global;
const asideList = ref([
    {'title': '谱目列表', 'route': '/GenealogyManage', 'icon': '', 'level': '0', 'show': true},
    {'title': '卷册列表', 'route': '/VolumeManage', 'icon': '', 'level': '0', 'show': true},
]);

const logout = () => {
    saveProperyValue({'label': 'token', 'value': ''});
    saveProperyValue({'label': 'userInfo', 'value': ''});
    localStorage.clear();
    router.push('/');
}

const goHome = () => {
    router.push('/GenealogySearch');
}

const goRouter = (data) => {
    if(data.child){
        asideList.value.forEach((ele) => {
            if(data.child.indexOf(ele.route) > -1){
                ele.show = !ele.show;
            }
        });
    }else{
        router.push(data.route);
    }
}

onMounted(() => {

});

</script>

<template>
    <aside class="aside">
        <header class="header">
            <img class="logo" @click="goHome" src="/favicon.ico" alt="">
            <span class="name">{{userInfo.account}}</span>
            <p class="role">{{userInfo.right == 1 ? '管理员' : userInfo.right == 2 ? '编辑' : '成员'}}</p>
        </header>
        <nav class="nav">
            <a :class="'router level'+(item.level)+(pathActive.indexOf(item.route) > -1 ? ' active' : '')" v-show="item.show" v-for="(item, index) in asideList" :key="index" @click="goRouter(item)">
                <img class="icon" v-if="item.icon" :src="item.icon" />
                <i class="title">{{item.title}}</i>
            </a>
        </nav>
        <footer class="footer" @click="logout">
            <img src="../assets/logout.svg" alt="">
        </footer>
    </aside>
</template>

<style scoped lang="scss">
.aside{
    position: relative;
    width: 22rem;
    height: 100%;
    background: #353D51;
    .header{
        height: 6rem;
        text-align: center;
        color: #fff;
        font-size: 1.2rem;
        .logo{
            height: 4rem;
            margin-bottom: 1rem;
            display: block;
            margin: 5px auto;
            cursor: pointer;
        }
        .role{
            position: absolute;
            top: 10px;
            left: calc(50% + 30px);
        }
    }
    .nav{
        height: calc(100% - 10rem);
        .router{
            height: 4rem;
            display: flex;
            align-items: center;
            color: #9B9B9B;
            cursor: pointer;
            &.level1{
                padding-left: 3rem;
            }
            .icon{
                margin-left: 1rem;
            }
            .title{
                position: relative;
                margin-left: 0.5rem;
            }
            &.active{
                color: #fff;
                border-left: 0.5rem solid #4C95FF;
                background: #414455;
                &.level1{
                    padding-left: 2.5rem;
                }
                .icon{
                    margin-left: 0.5rem;
                }
            }
            &:hover{
                color: #4C95FF;
            }
        }
    }
    .footer{
        height: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .logout{
            
        }
    }
}
.indexStatisticsData{
    position: absolute;
    top: -5px;
    left: calc(100% + 3px);
    background: #f00;
    border-radius: 2px;
    text-indent: 0;
    font-size: 10px;
    padding: 0 2px;
    color: #fff;
}
</style>