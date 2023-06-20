import { createApp } from 'vue';
import router from './router';
import './style.css';
import App from './App.vue';
import { createHead } from "@unhead/vue";

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCommentsDollar, faHouse, faShieldHalved, faBars } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

library.add(faHouse);
library.add(faCommentsDollar);
library.add(faShieldHalved);
library.add(faTwitter);
library.add(faGithub);
library.add(faBars);

const app = createApp(App);
const head = createHead();

app.use(router);
app.use(head);
app.component("font-awesome-icon", FontAwesomeIcon);
app.mount('#app');
