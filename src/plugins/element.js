import Vue from 'vue'
import {
  Button,
  Dialog,
  Form,
  Table,
  Select,
  Option,
  FormItem,
  Input,
  Message,
  MessageBox,
  Row,
  Col,
  Popover,
  DatePicker,
  Container,
  Header,
  Aside,
  Main,
  TableColumn
} from 'element-ui'
// import ElementUI from 'element-ui';

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(Table)
Vue.use(Select)
Vue.use(Option)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(Popover)
Vue.use(DatePicker)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(TableColumn)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm;
