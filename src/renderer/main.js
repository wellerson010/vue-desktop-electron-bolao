import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import App from './App';
import router from './router';
import { initDatabase } from './services/database';

if (!process.env.IS_WEB) Vue.use(require('vue-electron'));
Vue.config.productionTip = false;

initDatabase().then(() => {
    Vue.use(ElementUI);

    /* eslint-disable no-new */
    new Vue({
        components: { App },
        router,
        template: '<App/>'
    }).$mount('#app');
});