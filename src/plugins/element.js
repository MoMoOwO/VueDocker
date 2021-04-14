import Vue from 'vue'
// 按需引入 element-ui 组件
/* import {
  Button, Message, Container, Header, Main, Alert, Card, Select, Option,
  Popover, Divider, RadioGroup, Radio, Input, ColorPicker
} from 'element-ui' */
import { Button, Form, FormItem, Input, Message } from 'element-ui'
// 国际化配置
import enLang from 'element-ui/lib/locale/lang/en'
import locale from 'element-ui/lib/locale'
locale.use(enLang)
// 将组建添加到 Vue 实例中
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 将 Message 挂载到 Vue 实例上
Vue.prototype.$message = Message
