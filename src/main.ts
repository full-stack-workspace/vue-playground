import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Playground from './components/Playground.vue'
import './style.css'

const app = createApp(Playground)
const pinia = createPinia()

app.use(pinia)
app.mount('#app')
