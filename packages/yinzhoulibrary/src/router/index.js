import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import Home from '../pages/Home.vue';
import GenealogySearch from '../pages/GenealogySearch.vue';
import GenealogyDetail from '../pages/GenealogyDetail.vue';
import ImageView from '../pages/ImageView.vue';
import GenealogyManage from '../pages/GenealogyManage.vue';
import VolumeManage from '../pages/VolumeManage.vue';
import Relationmap from '../pages/Relationmap.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/GenealogySearch', component: GenealogySearch },
  { path: '/GenealogyDetail', component: GenealogyDetail },
  { path: '/ImageView', component: ImageView },
  { path: '/GenealogyManage', component: GenealogyManage },
  { path: '/VolumeManage', component: VolumeManage },
  { path: '/Relationmap', component: Relationmap },
];

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
});

export default router;
