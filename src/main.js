import { createApp } from 'vue';
import router from './router';
import './style.css';
import App from './App.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCommentsDollar, faHouse, faShieldHalved } from '@fortawesome/free-solid-svg-icons';

library.add(faHouse);
library.add(faCommentsDollar);
library.add(faShieldHalved);

const app = createApp(App);
app.use(router);
app.component("font-awesome-icon",FontAwesomeIcon);
app.mount('#app');
