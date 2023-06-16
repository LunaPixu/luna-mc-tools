import { createRouter, createWebHistory } from 'vue-router';

import home from './pages/home.vue';
import error404 from './pages/error404.vue';

const routes = [
  { path: '/', name: 'Home', component: home },
  { path: '/tradereader', name: 'Trade Reader', component: () => import("./pages/tradeReader.vue") },
  { path: '/trimgenerator', name: 'Trim Generator', component: () => import("./pages/trimGenerator.vue") },
  { path: '/:pathMatch(.*)*', name: 'Error 404', component: error404 },
];

const router = createRouter({ history: createWebHistory(), routes });
export default router;
