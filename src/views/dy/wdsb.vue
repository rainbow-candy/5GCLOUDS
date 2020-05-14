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
      <base-table :columns="tableColumns" :data="tableData" height="525" @selection-change="selectionRow"></base-table>
      <el-pagination
        class="sp-pagenation"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, total, jumper"
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
          sortable: true,
          backColor: true,
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
      val: 1
    }
  },
  methods: {
    handleCurrentChange (val) {
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
    getList (page) {
      const _this = this;
      wdsbServer.myDev({ mydev: 1, page: page }).then(res => {
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
            this.getFilterData(this.tableData);
          }
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
    // window.setInterval(() => {
    //   setTimeout(this.getList(), 0);
    // }, 1000);
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
