<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-zhxx.png" alt class="content-title"/>
      <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
      <div class="to-home" @click="toHome"><i class="el-icon-refresh-left"></i>返回上级</div>
      <img src="@/assets/imgs/dy-logo.png" alt="" class="logo">
    </div>
    <div class="content">
      <div class="btn">
        <el-button class="refresh-btn" @click="synchro"><i class="el-icon-refresh"></i>同步</el-button>
        <el-button class="refresh-btn" @click="unfollow">批量取关</el-button>
        <el-button class="refresh-btn" @click="getList(val, input4)"><i class="el-icon-refresh"></i>刷新</el-button>
        <el-input class="dyhSearch"
          placeholder="抖音号搜索"
          v-model="input4" @keyup.enter.native="queryDyh">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <base-table ref="sbTable" :columns="tableColumns" :data="tableData" selection height="525"  @selection-change="selectionRow" @renderHearder="renderHearder">
      </base-table>
      <el-pagination
        class="sp-pagenation"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, total, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 同步 -->
    <synchroZhxx ref="synchroZhxx"></synchroZhxx>
    <!-- 取关数量 -->
    <unfollowModal ref="unfollowModal"></unfollowModal>
  </div>
</template>

<script>
import synchroZhxx from '@/modal/synchroZhxx';
import unfollowModal from '@/modal/unfollowModal';
import wdsbServer from '@/api/wdsb-server.js';

export default {
  components: { synchroZhxx, unfollowModal },
  data () {
    return {
      input4: '',
      total: 0,
      val: 1,
      tableColumns: [
        {
          prop: 'dy_num',
          label: '抖音号'
        },
        {
          prop: 'name',
          label: '设备',
          filter: true,
          filterData: []
        },
        {
          prop: 'online',
          label: '在线情况',
          sortable: true,
          backColorqk: true,
          minWidth: 120
        },
        {
          prop: 'hz_num',
          label: '获赞数量',
          minWidth: 100
        },
        {
          prop: 'gz_num',
          label: '关注数量',
          minWidth: 100
        },
        {
          prop: 'fs_num',
          label: '粉丝数量',
          minWidth: 100
        },
        {
          prop: 'account_data',
          label: '日期',
          sortable: true
        }
      ],
      selectTableRow: [],
      tableData: []
    }
  },
  methods: {
    toHome () {
      this.$router.go(-1);
    },
    // 同步
    synchro () {
      this.$refs.synchroZhxx.open();
    },
    // 批量取关
    unfollow () {
      if (this.selectTableRow.length === 0) {
        this.$message({
          type: 'warning',
          message: '请先选择设备！'
        });
      } else {
        var stats = this.selectTableRow.find((item) => {
          return item.online === '离线';
        });
        if (stats) {
          this.$message.warning('请选择在线的设备！')
        } else {
          this.$refs.unfollowModal.open(this.selectTableRow, this.val);
        }
      }
    },
    // 搜索抖音号
    queryDyh () {
      this.getList(this.val, this.input4);
    },
    handleCurrentChange (val) {
      this.$refs.sbTable.handleCurrentChange();
      this.getList(val);
      this.val = val;
    },
    // 筛选列表
    renderHearder (key, label) {
      this.val = 1;
      this.getList(1, this.input4, key, label);
    },
    // 获取列表
    getList (page, dyh, key, label) {
      var parms = {};
      if (dyh) {
        parms = {
          app_type: this.$route.query.type,
          dy_s: dyh
        }
      } else {
        parms = {
          info: 1,
          page: page,
          app_type: this.$route.query.type,
          dy_s: dyh
        }
      }
      if (key) {
        parms[key] = label;
      }
      wdsbServer.myDev(parms).then(res => {
        if (res.status === 200) {
          if (res.data.results.length > 0) {
            const datas = res.data.results;
            this.total = res.data.count;
            datas.forEach((t) => {
              if (t.online === 1) {
                t.online = '在线';
              } else {
                t.online = '离线';
              }
            });
            this.tableData = datas;
            // this.getFilterData(this.tableData);
          } else {
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
    getSBList () {
      wdsbServer.myDev({ task: 1, app_type: this.$route.query.type, is_name: 1, page_size: 100 }).then(res => {
        if (res.status === 200) {
          this.tableColumns[1].filterData = [];
          if (res.data.results.length > 0) {
            res.data.results.forEach((item) => {
              this.tableColumns[1].filterData.push(
                Object.assign({}, { value: item.name, text: item.name })
              )
            });
            this.tableColumns[1].filterData.unshift({ value: '', text: '全部' });
          } else {
            this.tableColumns[1].filterData = [];
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
    // 表格复选框选中
    selectionRow (data) {
      this.selectTableRow = data;
    },
    // 获取筛选数组
    getFilterData (data) {
      // 空对象
      var obj = {}
      this.tableColumns[1].filterData = [];
      const newData = data.concat();
      // 遍历
      for (var i = 0; i < newData.length; i++) {
        if (newData[i].name) {
          if (obj[newData[i].name] === undefined) {
            // 随便贴一个不为空的值
            obj[newData[i].name] = 1;
          } else {
            newData.splice(i--, 1)
          }
        } else {
          newData.splice(i--, 1)
        }
      }
      newData.forEach((item, index) => {
        this.tableColumns[1].filterData.push(
          Object.assign({}, item, { text: item.name, value: item.name })
        )
      })
    }
  },
  mounted () {
    this.getList();
    this.getSBList();
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 100px 40px 0 40px;
  .content-title {
    width: 300px;
    position: absolute;
    left: -4px;
    top: -3px;
  }
}
.content {
  margin-top: 30px;
  .btn {
    margin-bottom: 20px;
    i {
      margin-right: 10px;
    }
  }
  .dyhSearch {
    width: 150px;
    margin-left: 20px;
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
@media screen and (max-width:770px ) {
  .box {
    padding: 35px 0 0 0;
  }
  .content {
    padding: 20px;
    .refresh-btn {
      width: 63px;
    }
    /deep/ .el-button {
      span {
        margin-left: -13px;
        font-size: 12px;
      }
    }
  }
}
</style>
