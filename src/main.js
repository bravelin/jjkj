import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import 'swiper/dist/css/swiper.css'
import './style/common/common.scss'

Vue.config.productionTip = false

new Vue({
    render: h => h(App)
}).$mount('#app')
