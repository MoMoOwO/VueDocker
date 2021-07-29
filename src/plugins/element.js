import Vue from 'vue'
// 按需引入 element-ui 组件
/* import {
  Button, Message, Container, Header, Main, Alert, Card, Select, Option,
  Popover, Divider, RadioGroup, Radio, Input, ColorPicker
} from 'element-ui' */
import {
  Button, Form, FormItem, Input, Message,
  Container, Header, Aside, Main,
  Menu, Submenu, MenuItem,
  Breadcrumb, BreadcrumbItem,
  Card, Table, TableColumn, Loading,
  Row, Col,
  Pagination,
  Tag,
  Skeleton, SkeletonItem
} from 'element-ui'
// 将组建添加到 Vue 实例中
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Loading.directive)
Vue.use(Row)
Vue.use(Col)
Vue.use(Pagination)
Vue.use(Tag)
Vue.use(Skeleton)
Vue.use(SkeletonItem)
// 将 Message 挂载到 Vue 实例上
Vue.prototype.$message = Message
//
