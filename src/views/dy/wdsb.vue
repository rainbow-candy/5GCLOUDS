<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-wdsb.png" alt class="content-title"/>
      <div class="to-home" @click="toHome">
        <div v-if="this.$route.query.type === 'dy'">
          <i class="el-icon-s-home"></i>返回抖音首页
        </div>
        <div v-if="this.$route.query.type !== 'dy'">
          <i class="el-icon-s-home"></i>返回快手首页
        </div>
      </div>
      <img src="@/assets/imgs/newlogo.png" alt style="width: 50px;position: absolute;right: 170px;top: 20px;"/>
      <img src="@/assets/imgs/dy-logo.png" alt class="logo" v-if="this.$route.query.type === 'dy'" />
      <img src="@/assets/imgs/ks-logo.png" alt class="logo" v-if="this.$route.query.type !== 'dy'" />
    </div>
    <div class="content">
      <div class="btn">
        <el-button class="add-btn" @click="grouping" :disabled="selectTableRow.length === 0">
          <i class="el-icon-plus"></i>分组
        </el-button>
        <el-button class="refresh-btn" @click="getList">
          <i class="el-icon-refresh"></i>刷新
        </el-button>
      </div>
      <base-table :columns="tableColumns" :data="tableData" selection height="462" @selection-change="selectionRow"></base-table>
    </div>
    <addGroup ref="addGroup"></addGroup>
  </div>
</template>

<script>
import addGroup from '@/modal/addGroup';
import wdsbServer from '@/api/wdsb-server.js';

export default {
  components: { addGroup },
  data () {
    return {
      tableColumns: [
        {
          prop: 'name',
          label: '设备'
        },
        {
          prop: 'type',
          label: '型号'
        },
        {
          prop: 'group',
          label: '分组（可筛选）',
          filter: true,
          filterData: []
        },
        {
          prop: 'stats',
          label: '工作状态',
          sortable: true,
          backColor: true
        },
        {
          prop: 'online',
          label: '在线情况',
          sortable: true,
          backColorqk: true
        }
      ],
      tableData: [],
      selectTableRow: []
    }
  },
  methods: {
    grouping () {
      this.$refs.addGroup.open(this.selectTableRow)
    },
    toHome () {
      this.$router.go(-1)
    },
    // 表格复选框选中
    selectionRow (data) {
      this.selectTableRow = data;
    },
    // 获取筛选数组
    getFilterData (data) {
      // 空对象
      var obj = {}
      this.tableColumns[2].filterData = [];
      const newData = data.concat();
      // 遍历
      for (var i = 0; i < newData.length; i++) {
        if (newData[i].group) {
          if (obj[newData[i].group] === undefined) {
            // 随便贴一个不为空的值
            obj[newData[i].group] = 1;
          } else {
            newData.splice(i--, 1)
          }
        } else {
          newData.splice(i--, 1)
        }
      }
      newData.forEach((item, index) => {
        this.tableColumns[2].filterData.push(
          Object.assign({}, item, { text: item.group, value: item.group })
        )
      })
    },
    getList () {
      this.tableData = [];
      const _this = this;
      wdsbServer.myDev().then(res => {
        if (res.status === 200) {
          res.data.forEach((t) => {
            if (t.stats === 1) {
              t.stats = '正在执行';
            } else {
              t.stats = '未执行';
            }
            if (t.online === 1) {
              t.online = '在线';
            } else {
              t.online = '离线';
            }
          });
          this.tableData = res.data;
          this.getFilterData(this.tableData);
        }
      }, function () {
        _this.$message({
          type: 'error',
          message: '服务异常！'
        });
      })
    }
  },
  mounted () {
    this.getList();
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 40px;
  .content-title {
    width: 300px;
    position: absolute;
    left: 0px;
    top: -3px;
  }
  .to-home {
    font-size: 1.5rem;
    position: absolute;
    right: 50px;
    top: 90px;
    cursor: pointer;
    i {
      margin-right: 10px;
      font-size: 1.8rem;
    }
  }
  .logo {
    position: absolute;
    top: 15px;
    right: 50px;
  }
}
.content {
  margin-top: 80px;
  .btn {
    margin-bottom: 20px;
    i {
      margin-right: 10px;
    }
  }
  .add-btn {
    color: #fff;
    border-color: #53bce0;
    background-color: #53bce0;
  }
  .refresh-btn {
    color: #fff;
    border-color: #e68048;
    background-color: #e68048;
  }
}
</style>
