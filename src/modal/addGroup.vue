<template>
  <el-dialog title="组别昵称" :visible.sync="dialogVisible" :width="dialogWidth">
    <!-- <el-input v-model="group"  placeholder="请输入组别昵称" maxlength="6" show-word-limit></el-input> -->
    <el-form label-width="100px">
      <el-form-item label="组别昵称：">
        <el-select v-model="group" placeholder="请选择组别昵称">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择设备：">
        <div style="height: 320px">
          <base-table ref="sbTable" :columns="sbColumns" :data="tableData" selection height="340" @selection-change="selectionRow"
          ></base-table>
          <el-pagination
            class="sp-pagenation"
            @current-change="handleCurrentChange"
            layout="prev, pager, next, total"
            :total="total"
            :current-page="current"
          ></el-pagination>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';

export default {
  name: 'addGroup',
  data () {
    return {
      total: 1,
      current: 1,
      dialogVisible: false,
      group: '',
      checkList: [],
      options: [{
        value: '推荐点赞',
        label: '推荐点赞'
      }, {
        value: '同城点赞',
        label: '同城点赞'
      }, {
        value: '搜索关注',
        label: '搜索关注'
      }, {
        value: '粉丝关注',
        label: '粉丝关注'
      }, {
        value: '转发评论',
        label: '转发评论'
      }, {
        value: '指定转发评论',
        label: '指定转发评论'
      }, {
        value: '直播助力',
        label: '直播助力'
      }, {
        value: '上传视频',
        label: '上传视频'
      }],
      sbColumns: [
        {
          prop: 'name',
          label: '设备'
        },
        {
          prop: 'group',
          label: '组别',
          filter: true,
          filterData: [],
          width: 200
        }
      ],
      tableData: [],
      currentCheck: {},
      dialogWidth: ''
    }
  },
  mounted () {
    this.dialogWidth = window.sessionStorage.getItem('fullWidth') > 770 ? '800px' : '100%';
  },
  methods: {
    open (data, tableData) {
      this.current = 1;
      this.dialogVisible = true;
      this.group = '';
      this.getList(this.current);
    },
    // 表格复选框选中
    selectionRow (data) {
      this.checkList = data;
      this.loading = false;
    },
    handleCurrentChange (val) {
      this.current = val;
      this.$refs.sbTable.handleCurrentChange();
      this.getList(val);
    },
    submit () {
      if (this.group === '') {
        this.$message({
          type: 'warning',
          message: '请输入组别昵称！'
        });
        return;
      }
      if (this.checkList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择设备！'
        });
        return;
      }
      const params = {
        id_list: '',
        group: this.group,
        bulk: 1
      }
      if (this.checkList.length > 1) {
        // 批量修改的接口
        this.checkList.forEach(t => {
          params.id_list += t.id + ','
        });
        params.id_list = params.id_list.substr(0, params.id_list.length - 1);
      } else {
        // 单独修改的接口
        params.id_list = this.checkList[0].id;
      }
      wdsbServer.putDev(params).then(res => {
        if (res.status === 200) {
          this.dialogVisible = false;
          this.$message({
            message: '分组新增成功！',
            type: 'success'
          });
          this.$parent.getList();
        }
      })
    },
    // 重新勾选
    reSelect () {
      setTimeout(() => {
        if (this.currentCheck[this.current - 1]) {
          this.currentCheck[this.current - 1].forEach((row) => {
            this.$refs.sbTable.toggleSelection(row, true);
          });
        }
      }, 500);
    },
    getList (page) {
      this.tableData = [];
      const _this = this;
      wdsbServer.myDev({ mydev: 1, page: page }).then(res => {
        if (res.status === 200) {
          if (res.data.results.length > 0) {
            this.total = res.data.count;
            this.tableData = res.data.results;
            this.getFilterData(this.tableData);
            this.reSelect();
          }
        }
      }, function () {
        _this.$message({
          type: 'error',
          message: '服务异常！'
        });
      })
    },
    // 获取筛选数组
    getFilterData (data) {
      // 空对象
      var obj = {}
      const newData = data.concat();
      this.sbColumns[1].filterData = [];
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
        this.sbColumns[1].filterData.push(
          Object.assign({}, item, { text: item.group, value: item.group })
        )
      })
    }
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog__header {
    background-color: #e68048;
    /deep/ .el-dialog__title {
        color: #fff;
    }
    /deep/ .el-dialog__close {
        color: #fff;
    }
}
/deep/ .el-select {
  width: 100%;
}
/deep/ .el-button--primary {
    background-color: #e68048;
    border-color: #e68048;
}
.el-icon-plus {
    height: 30px;
    line-height: 30px;
    width: 30px;
    text-align: center;
    border-radius: 7px;
    background-color: #e68048;
    color: #fff;
    cursor: pointer;
}
/deep/ .el-pagination {
  bottom: -75px;
}
</style>
