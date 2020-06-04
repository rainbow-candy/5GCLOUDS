<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-wdsb.png" alt class="content-title"/>
      <div class="to-home" @click="toHome">
        <i class="el-icon-refresh-left"></i>返回上级
      </div>
      <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
      <img src="@/assets/imgs/dy-logo.png" alt class="logo" v-if="this.$route.query.type === 'dy'" />
      <img src="@/assets/imgs/ks-logo.png" alt class="logo" v-if="this.$route.query.type !== 'dy'" />
    </div>
    <div class="content">
      <div class="btn">
        <el-button class="add-btn" @click="grouping">
          <i class="el-icon-plus"></i>分组
        </el-button>
        <el-button class="refresh-btn" @click="getList(val)">
          <i class="el-icon-refresh"></i>刷新
        </el-button>
      </div>
      <base-table ref="sbTable" :columns="tableColumns" :data="tableData" height="528" @selection-change="selectionRow" @renderHearder="renderHearder"></base-table>
      <el-pagination
        class="sp-pagenation"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50]"
        :page-size="10"
        layout="prev, pager, next, total, sizes"
        :total="total"
      >
      </el-pagination>
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
      total: 0,
      tableColumns: [
        {
          prop: 'name',
          label: '设备',
          minWidth: 100
        },
        {
          prop: 'type',
          label: '型号',
          minWidth: 100
        },
        {
          prop: 'group',
          label: '分组',
          filter: true,
          filterData: [],
          minWidth: 150
        },
        {
          prop: 'stats',
          label: '工作状态',
          filter: true,
          backColor: true,
          filterData: [],
          minWidth: 120
        },
        {
          prop: 'online',
          label: '在线情况',
          sortable: true,
          backColorqk: true,
          minWidth: 120
        }
      ],
      tableData: [],
      selectTableRow: [],
      val: 1,
      timers: null,
      parms: {},
      page_size: 10
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.$refs.sbTable.handleCurrentChange();
      this.getList(val);
      this.val = val;
    },
    grouping () {
      this.$refs.addGroup.open(this.selectTableRow, this.tableData)
    },
    toHome () {
      this.$router.go(-1)
    },
    // 表格复选框选中
    selectionRow (data) {
      this.selectTableRow = data;
    },
    // 筛选列表
    renderHearder (key, label) {
      // { [key]: label }
      if (key === 'zt') {
        key = 'stats';
      }
      this.val = 1;
      this.getList(1, key, label);
    },
    // 分页
    handleSizeChange (val) {
      this.page_size = val;
      this.getList(this.val);
    },
    getList (page, key, label) {
      var parms = {
        mydev: 1,
        page: page,
        page_size: this.page_size
      }
      if (key) {
        this.parms = {};
        this.parms[key] = label;
      }
      parms = Object.assign({}, parms, this.parms);
      wdsbServer.myDev(parms).then(res => {
        if (res.status === 200) {
          if (res.data.results.length > 0) {
            const datas = res.data.results;
            this.total = res.data.count;
            datas.forEach((t) => {
              switch (t.stats) {
                case 0:
                  t.stats = '未执行';
                  break;
                case 1:
                  t.stats = '正在执行';
                  break;
                case 2:
                  t.stats = '执行失败';
                  break;
                default:
                  t.stats = '执行成功';
              }
              if (t.online === 1) {
                t.online = '在线';
              } else {
                t.online = '离线';
              }
            });
            this.tableData = datas;
          } else {
            this.total = 0;
            this.tableData = [];
          }
        }
      }).catch(error => {
        if (error.request.status === 500) {
          this.$message.error('服务异常！')
        } else {
          this.$message.error(error.request.response);
        }
      });
    },
    getFZList () {
      wdsbServer.myDev({ task: 1, is_group: 1, page_size: 100 }).then(res => {
        if (res.status === 200) {
          this.tableColumns[2].filterData = [];
          if (res.data.results.length > 0 && res.data.results[0].group !== null) {
            res.data.results.forEach((item) => {
              this.tableColumns[2].filterData.push(
                Object.assign({}, { value: item.group, text: item.group })
              )
            });
            this.tableColumns[2].filterData.unshift({ value: '', text: '全部' });
          } else {
            this.tableColumns[2].filterData = [];
          }
        }
      }).catch(error => {
        if (error.request.status === 500) {
          this.$message.error('服务异常！')
        } else {
          this.$message.error(error.request.response);
        }
      });
    }
  },
  created () {
    this.getList();
    this.getFZList();
    this.tableColumns[3].filterData = [{
      value: '',
      text: '全部'
    }, {
      value: '0',
      text: '未执行'
    }, {
      value: '1',
      text: '正在执行'
    }, {
      value: '2',
      text: '执行失败'
    }, {
      value: '3',
      text: '执行成功'
    }];
  },
  // 销毁后
  destroyed () {
    clearTimeout(this.timers);
  },
  // 监听
  watch: {
    tableData () {
      if (this.timers) {
        clearTimeout(this.timers);
      }
      this.timers = setTimeout(() => {
        this.getList(this.val);
      }, 3000);
    }
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
/deep/ .is-center {
  height: 47px;
}
@media screen and (max-width:770px ) {
  .box {
    padding: 40px 10px;
  }
  .content {
    margin-top: 40px;
  }
}
</style>
