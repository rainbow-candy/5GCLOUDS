<template>
  <div>
    <img src="@/assets/imgs/home.png" alt class="home-img" />
    <div class="to-home" @click="toHome" title="返回原始首页"><i class="el-icon-s-home"></i>主界面</div>
    <img src="@/assets/imgs/ks-logo.png" alt class="logo" />
    <div class="content">
      <div>
        <img src="@/assets/imgs/wdsb.png" alt class="leftImg" @click="wdsb" />
        <img src="@/assets/imgs/fbrw.png" alt class="rightImg" @click="fbrw" />
      </div>
      <div>
        <img src="@/assets/imgs/gjcss.png" alt class="leftImg" @click="gjcss" />
        <img src="@/assets/imgs/ckrw.png" alt class="rightImg" @click="ckrw" />
      </div>
      <div>
        <img src="@/assets/imgs/xxfk.png" alt class="centerImg" @click="xxfk" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toHome () {
      this.$router.go(-1)
    },
    // 进入我的设备页面
    wdsb () {
      this.$router.push('/equipment');
    },
    // 发布任务
    fbrw () {
      this.$router.push('/ksPublishTask');
    },
    // 关键词搜索
    gjcss () {
      this.$router.push('/keyWord');
    },
    // 查看任务
    ckrw () {
      this.$router.push('/checkTask');
    },
    // 信息反馈
    xxfk () {
      this.$router.push('/feedback');
    }
  }
}
</script>

<style lang="less" scoped>
.home-img {
  width: 100%;
  height: 40%;
  position: absolute;
}
.to-home {
  font-size: 1.5rem;
  position: absolute;
  left: 50px;
  top: 30px;
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
.content {
  position: absolute;
  top: 27%;
  left: 0;
  width: 100%;
  img {
    width: 20%;
    max-width: 400px;
    cursor: pointer;
  }
  .leftImg {
    margin-left: 28%;
  }
  .rightImg {
    margin-left: 2%;
  }
  .centerImg {
    margin-left: 39%;
  }
}
</style>
