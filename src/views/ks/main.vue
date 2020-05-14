<template>
  <div>
    <img src="@/assets/imgs/ks/title-ks.png" alt class="content-title"/>
    <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
    <div class="to-home" @click="toHome"><i class="el-icon-s-home"></i>返回主界面</div>
    <img src="@/assets/imgs/ks-logo.png" alt class="logo" />
    <div class="content">
      <div class="row">
        <img src="@/assets/imgs/wdsb.png" alt class="leftImg" @click="wdsb" />
        <img src="@/assets/imgs/fbrw.png" alt class="rightImg" @click="fbrw" />
      </div>
      <div class="row">
        <img src="@/assets/imgs/gjcss.png" alt class="leftImg" @click="gjcss" />
        <img src="@/assets/imgs/rwlb.png" alt class="rightImg" @click="ckrw" />
      </div>
      <div class="row">
        <img src="@/assets/imgs/khfk.png" alt class="centerImg" @click="xxfk" />
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
.content-title {
  width: 300px;
  position: absolute;
  left: -2px;
  top: -3px;
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
.content {
  position: absolute;
  top: 18%;
  left: 0;
  width: 100%;
  .row {
    margin: 15px 0;
  }
  img {
    width: 20%;
    max-width: 380px;
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
