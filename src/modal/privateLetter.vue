<template>
  <el-dialog title="私信内容" :visible.sync="dialogVisible" :width="dialogWidth">
    <el-form ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="选择设备：" prop="id_list">
        <el-select v-model="form.id_list" multiple collapse-tags placeholder="请选择设备">
          <el-option
            v-for="item in tableData"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="私信内容：" prop="key_w">
        <el-input type="textarea" :rows="3" v-model="form.key_w"  placeholder="请输入私信内容"></el-input>
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
  name: 'privateLetter',
  data () {
    return {
      dialogVisible: false,
      form: {
        key_w: '',
        id_list: '',
        gz_sx: 1,
        user_num: ''
      },
      rules: {
        id_list: { required: true, message: '请选择设备', trigger: 'blur' },
        key_w: { required: true, message: '请输入私信内容', trigger: 'blur' }
      },
      tableData: [],
      dialogWidth: ''
    }
  },
  methods: {
    open (data, num) {
      this.dialogVisible = true;
      this.name = '';
      this.tableData = data;
      this.form.user_num = num;
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.id_list = this.form.id_list.join(',')
          wdsbServer.kwordSearch(this.form).then(res => {
            if (res.status === 200) {
              this.$message({
                message: '执行成功！',
                type: 'success'
              });
              this.uploadIng = true;
              this.dialogVisible = false;
            } else if (res.status === 201) {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(error => {
            this.$message.error(error.request.response);
          })
        }
      })
    }
  },
  mounted () {
    this.dialogWidth = window.sessionStorage.getItem('fullWidth') > 770 ? '500px' : '100%';
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
/deep/ .el-select {
  width: 100%;
}
</style>
