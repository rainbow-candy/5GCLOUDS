<template>
    <div class="login_container" style="text-align: center;">
        <img src="../assets/imgs/left-back.png" alt="" class="left-back">
        <img src="../assets/imgs/right-back.png" alt="" class="right-back">
        <div class="content">
          <img src="../assets/imgs/newlogo.png" alt="" class="logos">
              <!-- 登录表单区域 -->
          <el-form :model="loginForm" label-width="0px" class="login_form" :rules="rules" ref="loginFormRef">
              <el-form-item prop="username">
                  <el-input placeholder="请输入账号" prefix-icon="iconfont icon-user" v-model="loginForm.username" @keyup.enter.native="onSubmit"></el-input>
              </el-form-item>
              <el-form-item prop="password">
                  <el-input placeholder="请输入密码" prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password" @keyup.enter.native="onSubmit" show-password></el-input>
              </el-form-item>
              <el-row class="btns">
                  <el-button type="primary" @click="onSubmit" @keyup.enter.native="onSubmit">登录</el-button>
                  <el-button  type="info" @click="resetLoginForm">取消</el-button>
              </el-row>
          </el-form>
        </div>
    </div>
</template>

<script>
import { crypto } from '@/utils/crypto.js';
import loginServer from '@/api/login-server.js';
import { setUserLocal } from '@/api/user-server.js';
import { App } from '@/utils/auth';
import jwtDecode from 'jwt-decode'

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 提交
    onSubmit () {
      this.$refs.loginFormRef.validate((valid) => {
        this.loading = true;
        if (valid) {
          const params = {
            username: this.loginForm.username,
            password: crypto.encryptByDES(this.loginForm.password)
          };
          const _this = this;
          loginServer
            .login(params)
            .then((res) => {
              if (res.data.token) {
                const parameter = {
                  token: 'JWT ' + res.data.token
                };
                window.sessionStorage.setItem('token', parameter.token);
                window.localStorage.setItem('expire', res.data.expire);
                if (!res.data.is_chrome) {
                  this.$message('建议使用谷歌浏览器！');
                  window.setInterval(() => {
                    location.reload();
                  }, 1000);
                } else {
                  location.reload();
                }
                // 获取token过期时间
                const expires = setUserLocal();
                // 设置token缓存
                parameter.expires = expires;
                App.setToken(jwtDecode(parameter.token));
              } else {
                this.$message({
                  type: 'error',
                  message: res.data.error
                });
              }
            }, function () {
              _this.$message({
                type: 'error',
                message: '服务异常！'
              });
            })
            .finally(() => {
              this.loading = false;
            });
        }
      });
    },
    // token验证
    checkTokenByAppKey (parameter) {
      return loginServer.checkTokenByAppKey(parameter).then((res) => {
        if (res.success) {
          // 获取token过期时间
          const expires = setUserLocal();
          // 设置token缓存
          parameter.expires = expires;
          App.setToken(parameter);
          this.$message({
            type: 'success',
            message: '登录成功'
          });
          window.localStorage.setItem('userName', res.data.userName);
          // reload
          location.reload();
        } else {
          App.clear()
        }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #fff;
  height: 100%;
  .left-back {
    position: absolute;
    left: 0;
    height: 100%;
  }
  .right-back {
    position: absolute;
    right: 0;
    height: 100%;
  }
}
.logos {
  margin-top: 9%;
}
.login_form {
  width: 450px;
  background-color: #fff;
  border-radius: 3px;
  position: relative;
  left: 50%;
  top: 150px;
  transform: translate(-50%, -50%);
  padding: 0 20px 20px 20px;
  box-sizing: border-box;
}
.btns {
  display: flex;
  justify-content: center;
  /deep/ .el-button {
    width: 50%;
  }
  /deep/ .el-button--primary {
    background-color: #97392b;
    border-color: #97392b;
  }
}
@media screen and (max-width:770px ) {
  .left-back, .right-back {
    display: none;
  }
  .login_form {
    width: 85vw;
    padding: 0 7vw;
  }
  .logo {
    margin-top: 10vh;
    width: 75vw;
  }
}
</style>
