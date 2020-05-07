<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-rwlb.png" alt class="content-title"/>
      <div class="to-home" @click="toHome">
        <div v-if="this.$route.query.type === 'dy'"><i class="el-icon-refresh-left"></i>返回上级</div>
        <div v-if="this.$route.query.type !== 'dy'"><i class="el-icon-s-home"></i>返回快手首页</div>
      </div>
      <img src="@/assets/imgs/newlogo.png" alt style="width: 50px;position: absolute;right: 170px;top: 20px;"/>
      <img src="@/assets/imgs/dy-logo.png" alt class="logo" v-if="this.$route.query.type === 'dy'"/>
      <img src="@/assets/imgs/ks-logo.png" alt class="logo" v-if="this.$route.query.type !== 'dy'"/>
    </div>
    <div class="content">
      <div class="btn">
        <!-- <el-button class="add-btn" @click="cancel">
          <i class="el-icon-warning-outline"></i>取消任务
        </el-button> -->
        <el-button class="add-btn" @click="suspends" :disabled="selectTableRow.length === 0">
          <i class="el-icon-video-pause"></i>批量停止
        </el-button>
        <el-button class="refresh-btn" type="danger"  @click="deletes" :disabled="selectTableRow.length === 0">
          <i class="el-icon-delete"></i>批量删除
        </el-button>
      </div>
      <base-table :columns="tableColumns" :data="tableData" selection height="525" @selection-change="selectionRow">
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-video-play" @click="suspendRow(scope.row)" v-if="scope.row.zt === '正在执行'">停止</el-button>
            <el-button type="text" icon="el-icon-video-pause" @click="startRow(scope.row)" v-if="scope.row.zt === '未执行'">继续</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </base-table>
      <el-pagination
        class="sp-pagenation"
        @current-change="handleCurrentChange"
        layout="prev, pager, next, total, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';

export default {
  data () {
    return {
      total: 0,
      val: 1,
      tableColumns: [
        {
          prop: 'name',
          label: '设备'
        },
        {
          prop: 'group',
          label: '分组（可筛选）',
          filter: true,
          filterData: [],
          width: 150
        },
        {
          prop: 'task_nick',
          label: '任务昵称'
        },
        {
          prop: 'task_date',
          label: '创建时间',
          sortable: true
        },
        {
          prop: 'zt',
          label: '工作状态',
          sortable: true,
          backColor: true
        }
      ],
      selectTableRow: [],
      tableData: []
    }
  },
  methods: {
    toHome () {
      this.$router.go(-1)
    },
    cancel () {
    },
    // 继续
    startRow (row) {
      this.$confirm('是否确认继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.suspendVideo(row.key, { stop_task: 1 });
      })
    },
    // 停止
    suspendRow (row) {
      this.$confirm('是否确认停止?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.suspendVideo(row.key, { stop_task: 0 });
      })
    },
    // 批量停止
    suspends () {
      let ids = ''
      this.selectTableRow.forEach(t => {
        ids += t.key + ','
      });
      ids = ids.substr(0, ids.length - 1);
      this.$confirm('是否确认停止?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.suspendVideo(ids, { stop_task: 0 });
      })
    },
    // 删除当前行
    deleteRow (row) {
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.pauseVideo(row.id);
      })
    },
    // 批量删除
    deletes () {
      let ids = ''
      this.selectTableRow.forEach(t => {
        ids += t.id + ','
      });
      ids = ids.substr(0, ids.length - 1);
      this.$confirm('是否确认删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.pauseVideo(ids);
      })
    },
    // 表格复选框选中
    selectionRow (data) {
      this.selectTableRow = data;
    },
    // 视频停止
    suspendVideo (ids, params) {
      params.id_list = ids;
      params.bulk = 1;
      wdsbServer.suspendDev(params).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '工作状态修改成功！',
            type: 'success'
          });
          this.selectTableRow = [];
          this.getList(this.val);
        }
      })
    },
    // 视频删除
    pauseVideo (ids) {
      wdsbServer.deleteDev({ del_task: '1', id_list: ids, bulk: 1 }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.selectTableRow = [];
          this.getList(this.val);
        }
      })
    },
    handleCurrentChange (val) {
      this.getList(val);
      this.val = val;
    },
    // 获取列表
    getList (page) {
      this.tableData = [];
      wdsbServer.myDev({ task: '1', app_type: this.$route.query.type, page: page }).then(res => {
        if (res.status === 200) {
          if (res.data.results.length > 0) {
            const datas = res.data.results;
            this.total = res.data.count;
            datas.forEach((t) => {
              switch (t.stats) {
                case 0:
                  t.zt = '未执行';
                  break;
                case 1:
                  t.zt = '正在执行';
                  break;
                case 2:
                  t.zt = '执行失败';
                  break;
                default:
                  t.zt = '执行成功';
              }
              t.key = t.id;
              this.tableData.push(t);
            });
            this.getFilterData(this.tableData);
          }
        }
      })
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
        this.tableColumns[1].filterData.push(
          Object.assign({}, item, { text: item.group, value: item.group })
        )
      })
    }
  },
  mounted () {
    this.getList(1);
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 110px 40px 0 40px;
  .content-title {
    width: 300px;
    position: absolute;
    left: -2px;
    top: -4px;
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
  margin-top: 30px;
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
  height: 47px !important;
}
</style>
