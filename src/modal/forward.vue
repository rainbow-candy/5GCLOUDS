<template>
  <el-dialog title="选择用户" :visible.sync="dialogVisible" width="800px" :before-close="cancel">
    <div style="display: flex;">
      <el-table :data="sbData" class="sbNameTable" border stripe @row-click="selectSB" :row-class-name="tableRowClassName" style="max-width: 111px;">
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
      <el-table :data="tableData" class="sbNameTable" border stripe @selection-change="selectionRow" row-key="id">
        <el-table-column
          type="selection"
          width="50"
          align="center"
          :reserve-selection="true">
        </el-table-column>
        <el-table-column label="已关注用户" align="center">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.attention }}</span>
          </template>
        </el-table-column>
        <el-table-column label="关键词" align="center" prop="key_word" :filters="keyWordFilter">
        </el-table-column>
      </el-table>
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
      sbData: [],
      tableData: [],
      currentCheck: {},
      lastRow: 0,
      keyWordFilter: []
    }
  },
  methods: {
    open (data) {
      this.sbData = [];
      data.map(item => {
        this.sbData.push(
          Object.assign({}, item, { 'iconName': 'el-icon-caret-bottom' })
        )
      })
      this.current = 1;
      this.dialogVisible = true;
      this.getList(1);
    },
    // 表格复选框选中
    selectionRow (data) {
      this.checkList = data;
    },
    tableRowClassName ({ row, rowIndex }) {
      // 把每一行的索引放进row
      row.index = rowIndex;
    },
    selectSB (row) {
      if (this.lastRow !== row.index) {
        this.sbData[this.lastRow].iconName = 'el-icon-caret-bottom';
      }
      this.lastRow = row.index;
      if (row.iconName === 'el-icon-caret-bottom') {
        row.iconName = 'el-icon-caret-right';
        this.getList(row.id)
      } else if (row.iconName === 'el-icon-caret-right') {
        row.iconName = 'el-icon-caret-bottom';
      }
    },
    submit () {
      if (this.checkList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选用户！'
        });
      } else {
        var content = '';
        this.checkList.forEach(t => {
          content += t.attention + '|'
        });
        content = content.substr(0, content.length - 1);
        this.dialogVisible = false;
        this.$parent.ruleForm.content = content;
      }
    },
    // 取消
    cancel () {
      this.dialogVisible = false;
      this.$parent.zbjzf('0');
    },
    getList (id) {
      this.tableData = [];
      const _this = this;
      wdsbServer.forward({ zbzf: id }).then(res => {
        if (res.status === 200) {
          if (res.data.results.length > 0) {
            this.total = res.data.count;
            res.data.results.map((item) => {
              this.tableData.push(
                Object.assign({}, item, { iconName: 'el-icon-caret-bottom' })
              )
            })
            this.getFilterData(this.tableData);
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
      this.keyWordFilter = [];
      // 遍历
      for (var i = 0; i < newData.length; i++) {
        if (newData[i].key_word) {
          if (obj[newData[i].key_word] === undefined) {
            // 随便贴一个不为空的值
            obj[newData[i].key_word] = 1;
          } else {
            newData.splice(i--, 1)
          }
        } else {
          newData.splice(i--, 1)
        }
      }
      newData.forEach((item, index) => {
        this.keyWordFilter.push(
          Object.assign({}, item, { text: item.key_word, value: item.key_word })
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
/deep/ .el-table__empty-text {
  width: 100%;
}
/deep/ .el-table__column-filter-trigger {
  line-height: 20px;
  i {
    font-size: 18px;
  }
}
</style>
