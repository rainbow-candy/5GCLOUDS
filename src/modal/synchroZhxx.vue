<template>
  <el-dialog title="同步" :visible.sync="dialogVisible" width="800px">
    <el-form label-width="100px">
      <el-form-item label="选择设备：">
        <div style="height: 400px">
          <base-table ref="sbTable" :columns="sbColumns" :data="tableData" selection height="380" @selection-change="selectionRow"
            ></base-table>
            <el-pagination
            class="xzyh-pagenation"
            @current-change="handleCurrentChange"
            layout="prev, pager, next, total"
            :total="total"
            :current-page="current"
            ></el-pagination>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';

export default {
  name: 'forwardModal',
  data () {
    return {
      total: 50,
      current: 1,
      dialogVisible: false,
      checkList: [],
      sbColumns: [
        {
          prop: 'name',
          label: '设备'
        },
        {
          prop: 'group',
          label: '组别（可筛选）',
          filter: true,
          filterData: []
        }
      ],
      tableData: [],
      currentCheck: {}
    }
  },
  methods: {
    open () {
      this.current = 1;
      this.dialogVisible = true;
      this.getList(this.current);
    },
    // 表格复选框选中
    selectionRow (data) {
      this.checkList = data;
      this.loading = false;
    },
    handleCurrentChange (val) {
      this.current = val;
      this.getList(val);
    },
    submit () {
      if (this.checkList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选用户！'
        });
        return;
      }
      const params = {
        id_list: '',
        bulk: 1,
        synchronize: 1
      }
      this.checkList.forEach(t => {
        params.id_list += t.id + ','
      });
      params.id_list = params.id_list.substr(0, params.id_list.length - 1);
      wdsbServer.putDev(params).then(res => {
        if (res.status === 200) {
          this.dialogVisible = false;
          this.$message({
            message: res.data.msg,
            type: 'success'
          });
          this.$parent.getList();
        }
      })
    },
    // 取消
    cancel () {
      this.dialogVisible = false;
      this.$parent.zbjzf(0);
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
.xzyh-pagenation {
    bottom: -50px;
}
</style>
