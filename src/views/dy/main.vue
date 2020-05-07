<template>
  <div>
    <img src="@/assets/imgs/title-dy.png" alt class="content-title"/>
    <div class="to-home" @click="toHome" title="返回主界面"><i class="el-icon-s-home"></i>返回主界面</div>
    <img src="@/assets/imgs/newlogo.png" alt style="width: 50px;position: absolute;right: 170px;top: 20px;"/>
    <img src="@/assets/imgs/dy-logo.png" alt class="logo"/>
    <div class="content">
      <div>
        <img src="@/assets/imgs/wdsb.png" alt class="ks" @click="wdsb" />
        <img src="@/assets/imgs/fbrw.png" alt class="dy" @click="fbrw" />
        <img src="@/assets/imgs/rwlb.png" alt class="dy" @click="ckrw" />
      </div>
      <div>
        <!-- <el-popover
          placement="bottom"
          title="提示"
          width="270"
          trigger="hover"
          content="升级版将在5月正式上线......"
          v-model="gjcssVisible">
          <img src="@/assets/imgs/gjcss.png" alt class="ks" @click="gjcssVisible = !gjcssVisible" slot="reference"/>
        </el-popover> -->
        <img src="@/assets/imgs/gjcss.png" alt class="ks" @click="gjcss"/>
        <img src="@/assets/imgs/khfk.png" alt class="dy" @click="xxfk" />
        <!-- <el-popover
          placement="bottom"
          title="提示"
          width="270"
          trigger="hover"
          content="升级版将在5月正式上线......">
          <img src="@/assets/imgs/zhxx.png" alt class="dy" @click="zhxxVisible = !zhxxVisible"  slot="reference"/>
        </el-popover> -->
        <img src="@/assets/imgs/zhxx.png" alt class="dy" @click="zhxx" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      zhxxVisible: false,
      gjcssVisible: false
    }
  },
  methods: {
    toHome () {
      this.$router.go(-1)
    },
    // 进入我的设备页面
    wdsb () {
      this.$router.push({
        path: '/equipment',
        query: { type: 'dy' }
      });
    },
    // 发布任务
    fbrw () {
      this.$router.push({
        path: '/publishTask',
        query: { type: 'dy' }
      });
    },
    // 关键词搜索
    gjcss () {
      this.$router.push({
        path: '/keyWord',
        query: { type: 'dy' }
      });
    },
    // 查看任务
    ckrw () {
      this.$router.push({
        path: '/checkTask',
        query: { type: 'dy' }
      });
    },
    // 信息反馈
    xxfk () {
      this.$router.push({
        path: '/feedback',
        query: { type: 'dy' }
      });
    },
    // 账号信息
    zhxx () {
      this.$router.push({
        path: '/account',
        query: { type: 'dy' }
      });
    }
  }
}
</script>

<style lang="less" scoped>
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
.content-title {
  width: 300px;
  position: absolute;
  left: -2px;
  top: -7px;
}
.logo {
  position: absolute;
  top: 15px;
  right: 50px;
}
.content {
  position: absolute;
  top: 30%;
  left: 0;
  width: 100%;
  img {
    width: 20%;
    max-width: 400px;
    cursor: pointer;
  }
  .ks {
    margin-left: 18%;
  }
  .dy {
    margin-left: 2%;
  }
}
</style>
