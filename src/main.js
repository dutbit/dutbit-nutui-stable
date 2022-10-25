import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { 
  Button, Cell, CellGroup, Icon, Range,
  Form, FormItem, Input
} from '@nutui/nutui'
import App from './App.vue'
import router from './router.js'

const app = createApp(App)
app.use(router)
app.use(VueAxios, axios)
app.use(Button).use(Cell).use(CellGroup)
.use(Icon).use(Range)
.use(Form).use(FormItem).use(Input)
if (import.meta.env.DEV) {
  app.provide('axiosBaseURL', 'https://www.dutbit.com/apivue')
} else {
  app.provide('axiosBaseURL', 'https://www.dutbit.com/apivue')
}
app.mount('#app')
