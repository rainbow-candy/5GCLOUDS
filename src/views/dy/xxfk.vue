<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-khfk.png" alt class="content-title"/>
      <div class="to-home" @click="toHome">
        <i class="el-icon-refresh-left"></i>返回上级
      </div>
      <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
      <img src="@/assets/imgs/dy-logo.png" alt class="logo" v-if="this.$route.query.type === 'dy'"/>
      <img src="@/assets/imgs/ks-logo.png" alt class="logo" v-if="this.$route.query.type !== 'dy'"/>
    </div>
    <div class="content">
      <el-form :model="form" ref="form" :rules="rules" label-width="120px" label-position="left">
        <el-form-item label="反馈内容：" prop="email_content">
          <el-input type="textarea" v-model="form.email_content" :rows="12" placeholder="请输入反馈内容"></el-input>
        </el-form-item>
        <!-- <el-form-item
          prop="email_user"
          label="收件者邮箱："
        >
          <el-input v-model="form.email_user"></el-input>
        </el-form-item> -->
        <div style="text-align: center;"><el-button @click="submit">提交</el-button></div>
      </el-form>
    </div>
  </div>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';

export default {
  data () {
    return {
      form: {
        email_content: ''
      },
      rules: {
        email_user: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        email_content: [
          { required: true, message: '请输入反馈内容', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    toHome () {
      this.$router.go(-1)
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          wdsbServer.feedback(this.form).then(res => {
            if (res.status === 200) {
              this.$alert('<h3>感谢您的帮助与支持!</h3>', '反馈成功', {
                dangerouslyUseHTMLString: true,
                center: true
              });
            }
          }).catch(error => {
            if (error.request.status === 500) {
              this.$message.error('服务异常！')
            } else {
              this.$message.error(error.request.response);
            }
          });
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 130px 40px 0 40px;
  .content-title {
    width: 300px;
    position: absolute;
    left: -2px;
    top: -4px;
  }
}
.content {
  margin-top: 30px;
  /deep/ .el-form-item__label {
    font-size: 15px;
    color: black;
  }
  /deep/ .el-button {
    width: 200px;
    color: #ffffff;
    border-color: #e68048;
    background-color: #e68048;
  }
}
</style>
