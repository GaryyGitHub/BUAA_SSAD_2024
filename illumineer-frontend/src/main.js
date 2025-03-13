import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import * as ElIcons from '@element-plus/icons-vue';
import router from './router'
import api from './api/axios'
import store from './store'

// 引入全局样式css
import "./assets/css/index.css"

import "./assets/css/global.css"

const app = createApp(App)

app.use(ElementPlus)
app.use(router)
app.use(store)
app.config.globalProperties.$api = api;
// 注册所有图标
for (const name in ElIcons) {
    app.component(name, ElIcons[name]);
}

app.mount('#app')
