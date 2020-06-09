<template>
  <div>
    <el-form
      label-position="right"
      :model="ruleForm"
      label-width="160px"
      :rules="rules"
      ref="ruleForm"
      class="ruleForm"
    >
      <el-form-item label="搜索内容（大类）：" prop="search_str" v-if="this.$route.query.name === '搜索点赞'">
        <el-input type="text" v-model="ruleForm.search_str" minlength="1" placeholder="请输入搜索内容（大类）"></el-input>
      </el-form-item>
			<el-form-item label="搜索内容（ID号）：" prop="search_str" v-if="this.$route.query.name === '精准点赞'">
        <el-input type="text" v-model="ruleForm.search_str" minlength="1" placeholder="请输入搜索内容（ID号）"></el-input>
      </el-form-item>
      <el-form-item label="标签：" prop="to_num">
        <el-input-number
          controls-position="right"
          :min="1"
          v-model="ruleForm.to_num"
          placeholder="请输入标签"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="关注数量：" prop="content">
        <el-input-number
          v-model="ruleForm.content"
          controls-position="right"
          :min="1"
          placeholder="请输入关注数量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="点赞数量：" prop="content">
        <el-input-number
          v-model="ruleForm.content"
          controls-position="right"
          :min="1"
          placeholder="请输入点赞数量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="收藏数量：" prop="content">
        <el-input-number
          v-model="ruleForm.content"
          controls-position="right"
          :min="1"
          placeholder="请输入收藏数量"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="评论内容：">
        <el-radio v-model="radio" label="1">手动输入</el-radio>
        <el-radio v-model="radio" label="2">批量上传</el-radio>
        <el-input
          type="textarea"
          v-model="ruleForm.content"
          :rows="2"
          show-word-limit
          placeholder="评论条数以“|”分隔"
          @input="plnrChange"
          v-if="radio === '1'"
        ></el-input>
        <div class="plnr" v-if="radio === '2'">
          <div class="xzmb" @click="xzmb">
            <i class="el-icon-download"></i>下载评论模板
          </div>
          <el-upload
            class="upload-demo"
            action="http://112.74.103.26/api/task/dev/"
            :on-change="beforeUpload"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            show-file-list
            :auto-upload="false"
            :on-exceed="handleExceed"
            accept=".xls, .xlsx"
            :file-list="fileList"
          >
            <div class="xzmb">
              <i class="el-icon-upload2"></i>上传评论模板
            </div>
          </el-upload>
        </div>
      </el-form-item>
      <!-- 执行方式 -->
      <div class="required">*</div>
      <el-form-item label="执行方式：">
        <div class="zxfs" style="display: flex;">
          <div :class="{ active: isActive }" @click="implement(0)">立即执行</div>
          <div :class="{ active: !isActive }" @click="implement(1)">定时执行</div>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="ruleForm.task_time"
          v-show="timing"
          type="datetime"
          :picker-options="pickerOptions"
          placeholder="选择执行时间"
          value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="zxBtn" @click="onSubmit" :disabled="$parent.$parent.selectTableRow.length === 0">执行</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import wdsbServer from '@/api/wdsb-server.js';

export default {
  name: 'ssdzModal',
  data () {
    return {
      isActive: true,
      timing: false,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      radio: '1',
      ruleForm: {
        task_time: '',
        search_str: '',
        to_num: undefined,
        content: undefined,
        at_me: undefined,
        check_time: undefined
      },
      fileList: [],
      toFileList: [],
      rules: {
        to_num: { required: true, message: '必填', trigger: 'blur' },
        at_me: { required: true, message: '必填', trigger: 'blur' },
        search_str: { required: true, message: '必填', trigger: 'blur' },
        content: { required: true, message: '必填', trigger: 'blur' },
        check_time: { required: true, message: '必填', trigger: 'blur' }
      }
    }
  },
  methods: {
    getParms () {
      return this.ruleForm
    },
    // 评论内容修改
    plnrChange (e) {
      const arr = e.split('|');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 100) {
          // this.$message.warning('单条评论不能超过100字');
          this.$alert('单条评论不能超过100字', '', {
            center: true
          });
        }
      }
    },
    // 切换执行方式
    implement (num) {
      if (this.num !== num) {
        this.isActive = !this.isActive
      }
      this.num = num;
      if (num === 0) {
        this.timing = false;
      } else {
        // 定时执行
        this.timing = !this.timing;
      }
    },
    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const formData = new FormData();
          if (!this.isActive) {
            formData.append('task_time', this.ruleForm.task_time);
            if (!this.ruleForm.task_time) {
              this.$message.warning('请选择定时执行的时间');
            } else if (new Date(this.ruleForm.task_time).getTime() < new Date().getTime() + 600000) {
              this.$message.warning('请选择十分钟后的任意时间');
            } else {
              this.ljzx(formData);
            }
          } else {
            this.ljzx(formData);
          }
        } else {
          return false;
        }
      });
    },
    ljzx (formData) {
      const params = {
        id: ''
      };
      if (this.$parent.$parent.selectTableRow.length > 1) {
        // 批量修改的接口
        this.$parent.$parent.selectTableRow.forEach(t => {
          params.id += t.id + ','
        });
        params.id = params.id.substr(0, params.id.length - 1);
      } else if (this.$parent.$parent.selectTableRow.length === 1) {
        // 单独修改的接口
        params.id = this.$parent.$parent.selectTableRow[0].id;
      }
      // 观看直播时间
      formData.append('id', params.id);
      formData.append('search_str', this.ruleForm.search_str);
      formData.append('to_num', this.ruleForm.to_num);
      formData.append('content', this.ruleForm.content);
      formData.append('check_time', this.ruleForm.check_time);
      if (this.radio === '1') {
        formData.append('content', this.ruleForm.content);
      } else {
        formData.append('to_file', this.toFileList[0]);
      }
      formData.append('bulk', 1);
      formData.append('task_nick', this.$route.query.name);
      formData.append('app_type', this.$route.query.type);
      const url = 'http://112.74.103.26/api/task/dev/';
      this.$parent.$parent.makeXMLHttpRequest(url, formData, this)
    },
    // 上传视频
    beforeUpload (file, fileList) {
      if (file.size / 1024 / 1024 > 50) {
        this.$message.warning('文件超过50M，上传失败！')
      } else {
        this.toFileList[0] = file.raw;
      }
    },
    handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 1 个文件!');
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    }
  }
}
</script>

<style lang="less" scoped>
.zxfs {
  display: flex;
  div {
    width: 200px;
    border: 1px solid #ccc;
    text-align: center;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
  }
  .active {
    color: #fff;
    background-color: #53bce0;
  }
}
.required {
  position: relative;
  left: 64px;
  top: 27px;
  color: #f56c7e;
  font-size: 15px;
}
.zxBtn, .el-button.is-disabled {
  color: #fff;
  border-color: #e68048;
  background-color: #e68048;
  width: 200px;
  margin-left: 100px;
}
</style>
