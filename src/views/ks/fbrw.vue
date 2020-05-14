<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-fbrw.png" alt class="content-title"/>
      <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
      <div class="to-home" @click="toHome"><i class="el-icon-refresh-left"></i>返回上级</div>
      <img src="@/assets/imgs/ks-logo.png" alt="" class="logo">
    </div>
    <div class="content">
      <el-row>
        <el-col :span="6" v-for="(item, index) in colList1" :key="index">
          <img :src="item.src" alt="" @click="publishTask(item.src, item.label)">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" v-for="(item, index) in colList2" :key="index">
          <img :src="item.src" alt="" @click="publishTask(item.src, item.label)">
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
        src: require('@/assets/imgs/ks/gzwh.png'),
        label: '关注网红'
      }, {
        src: require('@/assets/imgs/ks/ssdl.png'),
        label: '搜索大类'
      }, {
        src: require('@/assets/imgs/ks/ssksh.png'),
        label: '搜索快手号'
      }, {
        src: require('@/assets/imgs/ks/zbzl.png'),
        label: '直播助力'
      }],
      colList2: [{
        src: require('@/assets/imgs/ks/fx.png'),
        label: '发现'
      }, {
        src: require('@/assets/imgs/ks/scsp.png'),
        label: '上传视频'
      }, {
        src: require('@/assets/imgs/ks/tcdz.png'),
        label: '同城点赞'
      }]
    }
  },
  methods: {
    toHome () {
      this.$router.go(-1);
    },
    // 跳转发布任务2
    publishTask (src, label) {
      this.$router.push({
        path: '/kspublishTask2',
        query: { src: src, type: 'ks', name: label }
      });
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 120px 40px 0 40px;
  width: 90%;
  margin-left: 5%;
  .content-title {
    width: 300px;
    position: absolute;
    left: -2px;
    top: -3px;
  }
}
.content {
  margin-top: 30px;
  .el-col {
    text-align: center;
    padding: 30px 0;
    img {
      width: 170px;
    }
  }
}
</style>
