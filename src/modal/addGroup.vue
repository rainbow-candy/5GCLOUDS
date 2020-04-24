<template>
  <el-dialog title="组别昵称" :visible.sync="dialogVisible" width="30%">
    <el-input v-model="group"  placeholder="请输入组别昵称" maxlength="6" show-word-limit></el-input>
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
      dialogVisible: false,
      group: '',
      checkList: []
    }
  },
  methods: {
    open (data) {
      this.dialogVisible = true;
      this.group = '';
      this.checkList = data;
    },
    submit () {
      if (this.group === '') {
        this.$message({
          type: 'warning',
          message: '请输入组别昵称！'
        });
        return;
      }
      const params = {
        bulk: '1',
        id: '',
        group: this.group
      }
      if (this.checkList.length > 1) {
        // 批量修改的接口
        this.checkList.forEach(t => {
          params.id += t.id + ','
        });
        params.id = params.id.substr(0, params.id.length - 1);
      } else {
        // 单独修改的接口
        params.id = this.checkList[0].id;
      }
      const url = 'task/my_dev/' + params.id + '/';
      wdsbServer.putDev(url, params).then(res => {
        if (res.status === 200) {
          this.dialogVisible = false;
          this.$message({
            message: '分组新增成功！',
            type: 'success'
          });
          this.$parent.getList();
        }
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
/deep/ .el-button--primary {
    background-color: #e68048;
    border-color: #e68048;
}
</style>
