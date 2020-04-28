<template>
  <div>
    <el-dialog
      title="选择素材"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form label-width="80px">
        <el-form-item label="文本：">
          <el-input v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="视频：">
          <el-upload
            class="upload-demo"
            action="http://192.168.1.52:8888/api/task/dev/"
            :on-preview="handlePreview"
            :before-upload="beforeUpload"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="submit" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'xzscModal',
  data () {
    return {
      dialogVisible: false,
      name: '',
      fileList: []
    }
  },
  methods: {
    beforeUpload (file, fileList) {
      console.log(file, fileList);
      this.fileList.push(file)
    },
    handlePreview (file) {
      console.log(file);
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    submit () {
      console.log(this.fileList);
      if (this.name === '') {
        this.$message.warning('请输入文本内容')
      } else if (this.fileList.length === 0) {
        this.$message.warning('请上传视频')
      } else {
        console.log(this.fileList);
        console.log(this.name);
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
.submit {
  color: #fff;
  background-color: #e68048;
  border-color: #e68048;
}
/deep/ .el-dialog {
  /deep/ .el-dialog__body {
    /deep/ .el-form {
      /deep/.el-form-item {
        margin: 0rem 2rem 2rem 0rem;
      }
    }
  }
}

</style>
