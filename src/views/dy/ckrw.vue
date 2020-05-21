<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-rwlb.png" alt class="content-title"/>
      <div class="to-home" @click="toHome">
        <div><i class="el-icon-refresh-left"></i>返回上级</div>
      </div>
      <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
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
        <el-button class="refresh-btn" @click="getList(val)">
          <i class="el-icon-refresh"></i>刷新
        </el-button>
      </div>
      <base-table :columns="tableColumns" :data="tableData" ref="baseTable" selection height="528" @selection-change="selectionRow" @renderHearder="renderHearder">
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-view" @click="checkRow(scope.row)">详情</el-button>
            <el-button type="text" icon="el-icon-video-play" @click="suspendRow(scope.row)" v-if="scope.row.zt === '正在执行'">停止</el-button>
            <el-button type="text" icon="el-icon-video-pause" @click="startRow(scope.row)" v-if="scope.row.zt !== '正在执行'">继续</el-button>
            <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </base-table>
      <el-pagination
        class="sp-pagenation"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="val"
        :page-sizes="[10, 20, 50]"
        :page-size="10"
        layout="prev, pager, next, total, sizes, jumper"
        :total="total"
      >
      </el-pagination>
      <p>温馨提示：任务列表仅保留设备最近的三条任务</p>
      <checkTask ref="checkTask"></checkTask>
    </div>
  </div>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';
import checkTask from '@/modal/checkTask.vue';

export default {
  components: { checkTask },
  data () {
    return {
      total: 0,
      val: 1,
      page_size: 10,
      tableColumns: [
        {
          prop: 'name',
          label: '设备',
          filter: true,
          filterData: [],
          minWidth: 100
        },
        {
          prop: 'group',
          label: '分组',
          filter: true,
          filterData: [],
          minWidth: 100
        },
        {
          prop: 'task_nick',
          label: '任务昵称',
          filter: true,
          filterData: [],
          minWidth: 130
        },
        {
          prop: 'task_date',
          label: '创建时间',
          sortable: true,
          minWidth: 130,
          type: 'time'
        },
        {
          prop: 'zt',
          label: '工作状态',
          filter: true,
          filterData: [],
          backColor: true,
          minWidth: 130
        }
      ],
      selectTableRow: [],
      tableData: [],
      // 定时器
      timers: null,
      parms: {}
    }
  },
  methods: {
    toHome () {
      this.$router.go(-1)
    },
    cancel () {
    },
    checkRow (row) {
      this.$refs.checkTask.open(row);
    },
    // 继续
    startRow (row) {
      console.log(row);
      if (row.online === 0) {
        this.$message.warning('该设备已离线，请打开APP开启！')
      } else {
        this.$confirm('是否确认继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.suspendVideo(row.key, { stop_task: 1 });
        })
      }
    },
    // 停止
    suspendRow (row) {
      this.$confirm('是否确认停止?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.suspendVideo(row.key, { stop_task: 2 });
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
        this.suspendVideo(ids, { stop_task: 2 });
      })
    },
    // 删除当前行
    deleteRow (row) {
      if (row.stats === 1) {
        this.$confirm('正在执行的任务不能删除，请先停止任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      } else {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.pauseVideo(row.id);
        })
      }
    },
    // 批量删除
    deletes () {
      let ids = '';
      this.selectTableRow.forEach(t => {
        ids += t.id + ',';
      });
      ids = ids.substr(0, ids.length - 1);
      var age2 = this.selectTableRow.find((item) => {
        return item.stats === 1;
      });
      if (!age2) {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.pauseVideo(ids);
        })
      } else {
        this.$confirm('正在执行的任务不能删除，请先停止任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
      }
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
          this.getList(this.val);
        } else if (res.status === 201) {
          this.$message.warning(res.data);
        }
      }).catch((error) => {
        this.$message.error('服务异常，退出失败！')
        console.log(error.response);
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
          this.getList(1);
          this.val = 1;
          this.selectTableRow = [];
          this.$refs.baseTable.clearSelection();
        }
      })
    },
    // 切换条数
    handleCurrentChange (val) {
      this.getList(val);
      this.val = val;
      this.$refs.baseTable.handleCurrentChange();
    },
    // 分页
    handleSizeChange (val) {
      console.log(this.parms)
      this.page_size = val;
      this.getList(this.val);
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
    // 获取列表
    getList (page, key, label) {
      const parms = {
        task: '1',
        app_type: this.$route.query.type,
        page: page,
        page_size: this.page_size
      }
      if (key) {
        this.parms = {};
        console.log(1)
        this.parms[key] = label;
      }
      this.getList1(parms);
    },
    getList1 (parms) {
      parms = Object.assign({}, parms, this.parms);
      wdsbServer.myDev(parms).then(res => {
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
            });
            this.tableData = datas;
          } else {
            this.total = 0;
            this.tableData = []
          }
        }
      })
    },
    getFilter (Arr, key) {
      var hash = {};
      Arr = Arr.reduce((arr, current) => {
        if (current[key]) {
          if (hash[current[key]] === undefined) {
            hash[current[key]] = true;
            arr.push(current);
          }
        }
        return arr;
        // hash[current[key]] ? '' : hash[current[key]] = true && arr.push(current);
      }, []);
      var Arr1 = [];
      Arr.forEach((item, index) => {
        Arr1.push(
          Object.assign({}, item, { text: item[key], value: item[key] })
        )
      })
      return Arr1;
    },
    getSBList () {
      wdsbServer.myDev({ task: 1, app_type: this.$route.query.type, is_name: 1, page_size: 100 }).then(res => {
        if (res.status === 200) {
          this.tableColumns[0].filterData = [];
          if (res.data.results.length > 0) {
            res.data.results.forEach((item) => {
              this.tableColumns[0].filterData.push(
                Object.assign({}, { value: item.name, text: item.name })
              )
            });
            this.tableColumns[0].filterData.unshift({ value: '', text: '全部' });
          } else {
            this.tableColumns[0].filterData = [];
          }
        }
      })
    },
    getFZList () {
      wdsbServer.myDev({ task: 1, app_type: this.$route.query.type, is_group: 1, page_size: 100 }).then(res => {
        if (res.status === 200) {
          this.tableColumns[1].filterData = [];
          if (res.data.results.length > 0 && res.data.results[0].group !== null) {
            res.data.results.forEach((item) => {
              this.tableColumns[1].filterData.push(
                Object.assign({}, { value: item.group, text: item.group })
              )
            });
            this.tableColumns[1].filterData.unshift({ value: '', text: '全部' });
          } else {
            this.tableColumns[1].filterData = [];
          }
        }
      })
    }
  },
  // 实例创建完成
  created () {
    this.getList();
    this.getSBList();
    this.getFZList();
    this.tableColumns[2].filterData = [{
      value: '',
      text: '全部'
    }, {
      value: '垂直养号',
      text: '垂直养号'
    }, {
      value: '推荐点赞',
      text: '推荐点赞'
    }, {
      value: '同城点赞',
      text: '同城点赞'
    }, {
      value: '搜索关注',
      text: '搜索关注'
    }, {
      value: '粉丝关注',
      text: '粉丝关注'
    }, {
      value: '转发评论',
      text: '转发评论'
    }, {
      value: '指定转发评论',
      text: '指定转发评论'
    }, {
      value: '直播助力',
      text: '直播助力'
    }, {
      value: '上传视频',
      text: '上传视频'
    }];
    this.tableColumns[4].filterData = [{
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
      }, 15000);
    }
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

@media screen and (max-width:770px ) {
  .box {
    padding: 110px 0 0 3px;
  }
  .content {
    margin-top: -30px;
    /deep/ .el-button {
      width: 88px;
      span {
        margin-left: -13px;
        font-size: 12px;
      }
    }
  }
}
</style>
