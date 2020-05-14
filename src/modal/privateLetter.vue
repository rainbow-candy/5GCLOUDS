<template>
  <el-dialog title="私信内容" :visible.sync="dialogVisible" :width="dialogWidth">
    <el-input type="textarea" :rows="3" v-model="name"  placeholder="请输入私信内容"></el-input>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';

export default {
  name: 'privateLetter',
  data () {
    return {
      dialogVisible: false,
      name: '',
      checkList: [],
      dialogWidth: ''
    }
  },
  methods: {
    open (data) {
      this.dialogVisible = true;
      this.name = '';
      this.checkList = data;
    },
    submit () {
      if (this.name === '') {
        this.$message.warning('请输入私信内容！');
      } else {
        const params = {
          gz_sx: this.name,
          id_list: ''
        }
        this.checkList.forEach(t => {
          params.id_list += t.id + ','
        });
        params.id_list = params.id_list.substr(0, params.id_list.length - 1);
        const _this = this;
        wdsbServer.kwordSearch(params).then(res => {
          if (res.status === 200) {
            this.$message({
              message: res.data.msg,
              type: 'success'
            });
            this.uploadIng = true;
          } else if (res.status === 201) {
            this.$message({
              message: res.data.msg,
              type: 'warning'
            });
          }
        }, function () {
          _this.$message({
            type: 'error',
            message: '服务异常！'
          });
        })
      }
    }
  },
  mounted () {
    this.dialogWidth = window.sessionStorage.getItem('fullWidth') > 770 ? '400px' : '100%';
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
