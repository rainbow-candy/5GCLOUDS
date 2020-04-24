<template>
  <el-dialog title="私信内容" :visible.sync="dialogVisible" width="30%">
    <el-input v-model="name"  placeholder="请输入私信内容"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'privateLetter',
  data () {
    return {
      dialogVisible: false,
      name: ''
    }
  },
  methods: {
    open () {
      this.dialogVisible = true;
      this.name = '';
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
