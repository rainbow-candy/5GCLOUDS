<template>
  <div>
    <img src="@/assets/imgs/zhu-home.png" alt class="zhu-home" />
    <img src="@/assets/imgs/logout.png" alt class="logout-home" @click="logout"/>
    <img src="@/assets/imgs/right-home.png" alt class="right-home" />
    <img src="@/assets/imgs/left-home.png" alt class="left-home" />
    <div style="position: absolute;right: 40px;">
      <!-- <div @click="logout" class="logout"><i class="el-icon-switch-button"></i>退出登录</div> -->
    </div>
    <div class="content">
      <div style="text-align: center;">
        <!-- <el-popover
          placement="top"
          title="提示"
          width="200"
          trigger="manual"
          content="快手功能正在开发中。"
          v-model="visible">
          <img src="@/assets/imgs/ks-btn.png" alt class="ks" @click="visible = !visible" slot="reference"/>
        </el-popover> -->
        <img src="@/assets/imgs/ks-btn.png" alt class="ks" @click="toKS" />
        <img src="@/assets/imgs/dy-btn.png" alt class="dy" @click="toDY" />
      </div>
    </div>
  </div>
</template>

<script>
// import { App } from '@/utils/auth';
import loginServer from '@/api/login-server.js';
import router from '@/router/index.js';

export default {
  data () {
    return {
      visible: false
    }
  },
  methods: {
    logout () {
      // App.clear();
      // userAuth.clear();
      loginServer
        .logout()
        .then((res) => {
          if (res.status === 200) {
            router.go(-1);
            router.push('/login')
            window.localStorage.clear();
          }
        })
    },
    toKS () {
      this.$router.push({
        path: '/ksmain',
        query: { type: 'ks' }
      });
    },
    toDY () {
      this.$router.push({
        path: '/dymain',
        query: { type: 'dy' }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.zhu-home {
  position: absolute;
  left: -1px;
  top: -6px;
  width: 21%;
}
.logout-home {
  position: absolute;
  cursor: pointer;
  right: 0;
  top: -4px;
  width: 21%;
}
.right-home {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 21%;
}
.left-home {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 21%;
}
.logout {
  font-size: 20px;
  font-weight: 600;
  top: 50px;
  right: 1rem;
  position: relative;
  cursor: pointer;
}
.content {
  position: absolute;
  top: 40%;
  left: 0;
  width: 100%;
  img {
    width: 20%;
    max-width: 400px;
  }
  .ks {
    cursor: pointer;
  }
  .dy {
    margin-left: 3%;
    cursor: pointer;
  }
}
</style>
