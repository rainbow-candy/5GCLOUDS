<template>
  <el-dialog title="选择用户" :visible.sync="dialogVisible" width="800px">
    <div style="display: flex;">
      <el-table :data="tableData" class="sbNameTable" border stripe @row-click="selectSB" :row-class-name="tableRowClassName" style="max-width: 111px;">
        <el-table-column
          label="设备"
          width="110"
          align="center"
          >
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
            <i :class="scope.row.iconName"></i>
          </template>
        </el-table-column>
      </el-table>
      <el-table :data="tableData" class="sbNameTable" border stripe>
        <el-table-column
          type="selection"
          width="50"
          align="center">
        </el-table-column>
        <el-table-column label="已关注用户" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关键词" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.group }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--  -->
      <!-- <base-table ref="sbTable" :columns="sbColumns" :data="tableData" selection height="380" @selection-change="selectionRow"
      ></base-table> -->
    </div>
    <!-- <el-pagination
    class="xzyh-pagenation"
    @current-change="handleCurrentChange"
    layout="prev, pager, next, total"
    :total="total"
    :current-page="current"
    ></el-pagination> -->
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
          prop: 'name1',
          label: '已关注用户'
        },
        {
          prop: 'group',
          label: '关键词',
          filter: true,
          filterData: []
        }
      ],
      tableData: [],
      currentCheck: {},
      lastRow: 0
    }
  },
  methods: {
    open (data, tableData) {
      this.current = 1;
      this.dialogVisible = true;
      this.getList(this.current);
    },
    // 表格复选框选中
    selectionRow (data) {
      this.checkList = data;
      this.loading = false;
    },
    tableRowClassName ({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    selectSB (row) {
      console.log(row.index);
      if (this.lastRow !== row.index) {
        console.log(11);
        this.tableData[this.lastRow].iconName = 'el-icon-caret-bottom';
      }
      this.lastRow = row.index;
      if (row.iconName === 'el-icon-caret-bottom') {
        row.iconName = 'el-icon-caret-right';
      } else if (row.iconName === 'el-icon-caret-right') {
        row.iconName = 'el-icon-caret-bottom';
      }
    },
    handleCurrentChange (val) {
      this.current = val;
      this.$refs.sbTable.handleCurrentChange();
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
      this.$parent.zbjzf('0');
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
            res.data.results.map((item) => {
              this.tableData.push(
                Object.assign({}, item, { iconName: 'el-icon-caret-bottom' })
              )
            })
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
      this.sbColumns[2].filterData = [];
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
        this.sbColumns[2].filterData.push(
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
    bottom: 66px;
}
.base-table {
  height: 380px;
}
.sbNameTable {

}
</style>
