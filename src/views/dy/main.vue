<template>
  <div>
    <img src="@/assets/imgs/title-dy.png" alt class="content-title"/>
    <div class="to-home" @click="toHome" title="返回主界面"><i class="el-icon-s-home"></i>返回主界面</div>
    <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
    <img src="@/assets/imgs/dy-logo.png" alt class="logo"/>
    <div class="content">
      <el-row>
        <el-col :xs="12" :sm="8" v-for="(item, index) in colList1" :key="index">
          <img :src="item.src" alt="" @click="publishTask(item.src, item.label, item.name)">
        </el-col>
      </el-row>
    </div>
    <khfkModal ref="khfkModal"></khfkModal>
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
      fullWidth: document.documentElement.clientWidth,
      colList1: [{
        src: require('@/assets/imgs/wdsb.png'),
        label: '/equipment',
        name: '我的设备'
      }, {
        src: require('@/assets/imgs/fbrw.png'),
        label: '/PublishTask',
        name: '发布任务'
      }, {
        src: require('@/assets/imgs/rwlb.png'),
        label: '/checkTask',
        name: '查看任务'
      }, {
        src: require('@/assets/imgs/gjcss.png'),
        label: '/keyWord',
        name: '关键词搜索'
      }, {
        src: require('@/assets/imgs/khfk.png'),
        label: '/feedback',
        name: '客户反馈'
      }, {
        src: require('@/assets/imgs/zhxx.png'),
        label: '/account',
        name: '账号信息'
      }]
    }
  },
  methods: {
    toHome () {
      this.$router.push({
        path: '/home'
      })
    },
    publishTask (src, label, name) {
      if (label === '/feedback') {
        this.$refs.khfkModal.open();
      } else {
        this.$router.push({
          path: label,
          query: {
            src: src,
            type: 'dy',
            name: name
          }
        });
      }
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
  top: 18%;
  left: 0;
  width: 100%;
  .el-row {
    width: 1000px;
    margin: 50px auto;
  }
  .el-col {
    text-align: center;
    padding: 20px 0;
    img {
      width: 280px;
      height: 150px;
      cursor: pointer;
    }
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
