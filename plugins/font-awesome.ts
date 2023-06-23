import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCommentsDollar, faHouse, faShieldHalved, faBars } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';

config.autoAddCss = false;

library.add(faHouse);
library.add(faCommentsDollar);
library.add(faShieldHalved);
library.add(faTwitter);
library.add(faGithub);
library.add(faBars);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('font-awesome-icon', FontAwesomeIcon);
});
