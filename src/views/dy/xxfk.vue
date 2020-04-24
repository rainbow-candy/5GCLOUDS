<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-xxfk.png" alt class="content-title"/>
      <div class="to-home" @click="toHome">
        <div v-if="this.$route.query.type === 'dy'"><i class="el-icon-s-home"></i>返回抖音首页</div>
        <div v-if="this.$route.query.type !== 'dy'"><i class="el-icon-s-home"></i>返回快手首页</div>
      </div>
      <img src="@/assets/imgs/newlogo.png" alt style="width: 50px;position: absolute;right: 170px;top: 20px;"/>
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
        <div style="text-align: center;"><el-button @click="submit">执行</el-button></div>
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
              this.$message({
                message: '信息反馈成功！',
                type: 'success'
              });
            }
          })
        } else {
          this.$message({
            message: '请完善表单！',
            type: 'warning'
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
  .to-home {
    font-size: 1.5rem;
    position: absolute;
    right: 50px;
    top: 90px;
    cursor: pointer;
    i {
      margin-right: 10px;
      font-size: 1.8rem;
    }
  }
  .logo {
    position: absolute;
    top: 15px;
    right: 50px;
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
