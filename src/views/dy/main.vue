<template>
  <div>
    <img src="@/assets/imgs/title-dy.png" alt class="content-title"/>
    <div class="to-home" @click="toHome" title="返回主界面"><i class="el-icon-s-home"></i>返回主界面</div>
    <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
    <img src="@/assets/imgs/dy-logo.png" alt class="logo"/>
    <div class="content" v-if="fullWidth > 770">
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
      <khfkModal ref="khfkModal"></khfkModal>
    </div>
    <!-- 手机适配 -->
    <div class="content" v-if="fullWidth <= 770">
      <div>
        <img src="@/assets/imgs/wdsb.png" alt class="ks" @click="wdsb" />
        <img src="@/assets/imgs/fbrw.png" alt class="dy" @click="fbrw" />
      </div>
      <div>
        <img src="@/assets/imgs/rwlb.png" alt class="ks" @click="ckrw" />
        <img src="@/assets/imgs/gjcss.png" alt class="dy" @click="gjcss"/>
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
        <img src="@/assets/imgs/khfk.png" alt class="ks" @click="xxfk" />
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
      <khfkModal ref="khfkModal"></khfkModal>
    </div>
  </div>
</template>

<script>
import khfkModal from './khfk';

export default {
  components: { khfkModal },
  data () {
    return {
      zhxxVisible: false,
      gjcssVisible: false,
      fullWidth: document.documentElement.clientWidth
    }
  },
  methods: {
    toHome () {
      this.$router.push({
        path: '/home'
      })
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
      // this.$router.push({
      //   path: '/feedback',
      //   query: { type: 'dy' }
      // });
      this.$refs.khfkModal.open();
    },
    // 账号信息
    zhxx () {
      this.$router.push({
        path: '/account',
        query: { type: 'dy' }
      });
    },
    handleResize () {
      this.fullWidth = document.documentElement.clientWidth;
      window.sessionStorage.setItem('fullWidth', this.fullWidth);
    }
  },
  created () {
    window.addEventListener('resize', this.handleResize);
    window.sessionStorage.setItem('fullWidth', this.fullWidth);
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.handleResize);
  }
}
</script>

<style lang="less" scoped>
.content-title {
  width: 300px;
  position: absolute;
  left: -2px;
  top: -7px;
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
@media screen and (max-width:770px ) {
  .content {
    img {
      width: 30%;
    }
  }
}
</style>
