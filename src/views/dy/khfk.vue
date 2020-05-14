<template>
  <el-dialog title="客户反馈" :visible.sync="dialogVisible" width="65%" v-loading="loading" element-loading-text="正在反馈中..."
    element-loading-spinner="el-icon-loading">
    <el-input type="textarea" v-model="form.email_content" :rows="rows" placeholder="请输入反馈内容"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';

export default {
  name: 'khfkModal',
  data () {
    return {
      dialogVisible: false,
      form: {
        email_content: ''
      },
      loading: false,
      rows: ''
    }
  },
  mounted () {
    this.rows = window.sessionStorage.getItem('fullWidth') > 770 ? 17 : 5;
  },
  methods: {
    open () {
      this.dialogVisible = true;
      this.form.email_content = '';
    },
    submit () {
      if (this.form.email_content) {
        this.loading = true;
        wdsbServer.feedback(this.form).then(res => {
          if (res.status === 200) {
            this.loading = false;
            this.$alert('<h3>感谢您的帮助与支持!</h3>', '反馈成功', {
              dangerouslyUseHTMLString: true,
              center: true
            }).then(() => {
              this.dialogVisible = false;
            });
          }
        })
      } else {
        this.$message({
          message: '请输入反馈内容！',
          type: 'warning'
        });
      }
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
