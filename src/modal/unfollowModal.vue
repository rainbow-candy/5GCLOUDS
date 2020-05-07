<template>
  <el-dialog title="取关数量" :visible.sync="dialogVisible" width="300px">
    <el-input-number v-model="num" controls-position="right" :min="1" label="请输入取关数量"></el-input-number>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';

export default {
  name: 'unfollowModal',
  data () {
    return {
      dialogVisible: false,
      num: 1,
      checkList: []
    }
  },
  methods: {
    open (data) {
      this.num = 1;
      this.dialogVisible = true;
      this.checkList = data;
    },
    submit () {
      var id = '';
      var toSubmit = false;
      this.checkList.forEach(t => {
        if (t.gz_num < this.num) {
          this.$message({
            message: `抖音号为${t.dy_num}的粉丝数量小于取关数量，请重新输入！`,
            type: 'warning'
          });
        } else {
          id += t.id + ',';
          toSubmit = true;
        }
      });
      id = id.substr(0, id.length - 1);
      if (toSubmit) {
        wdsbServer.putDev({ bulk: 1, id: id, unsubscribe: this.num }).then(res => {
          if (res.status === 200) {
            this.dialogVisible = false;
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.$parent.getList();
          }
        })
      }
    },
    // 取消
    cancel () {
      this.dialogVisible = false;
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
/deep/ .el-button--primary {
    background-color: #e68048;
    border-color: #e68048;
}
/deep/ .el-input-number {
    width: 100%;
}
</style>
