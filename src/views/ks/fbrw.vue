<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-fbrw.png" alt class="content-title"/>
      <img src="@/assets/imgs/newlogo.png" alt style="width: 50px;position: absolute;right: 170px;top: 20px;"/>
      <div class="to-home" @click="toHome"><i class="el-icon-s-home"></i>返回快手首页</div>
      <img src="@/assets/imgs/ks-logo.png" alt="" class="logo">
    </div>
    <div class="content">
      <el-row>
        <el-col :span="6" v-for="(item, index) in colList1" :key="index">
          <img :src="item.src" alt="" @click="publishTask(item.src)">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" v-for="(item, index) in colList2" :key="index">
          <img :src="item.src" alt="" @click="publishTask(item.src)">
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>

export default {
  data () {
    return {
      colList1: [{
        src: require('@/assets/imgs/ks/gzwh.png')
      }, {
        src: require('@/assets/imgs/ks/ssdl.png')
      }, {
        src: require('@/assets/imgs/ks/ssksh.png')
      }, {
        src: require('@/assets/imgs/ks/zbzl.png')
      }],
      colList2: [{
        src: require('@/assets/imgs/ks/fx.png')
      }, {
        src: require('@/assets/imgs/ks/scsp.png')
      }, {
        src: require('@/assets/imgs/ks/tcdz.png')
      }]
    }
  },
  methods: {
    toHome () {
      this.$router.go(-1);
    },
    // 跳转发布任务2
    publishTask (src) {
      this.$router.push({
        path: '/publishTask2',
        query: { src: src }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 100px 40px 0 40px;
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
}
.content {
  margin-top: 30px;
  .el-col {
    text-align: center;
    padding: 30px 0;
    img {
      width: 150px;
    }
  }
}
</style>
