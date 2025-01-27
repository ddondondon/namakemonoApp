import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createPinia } from 'pinia' // Piniaをインポート

loadFonts()

  const app = createApp(App);
  const pinia = createPinia(); // Piniaを作成
  
  app
    .use(router)
    .use(store)
    .use(pinia) // Piniaを登録
    .use(vuetify)
    .mount('#app');