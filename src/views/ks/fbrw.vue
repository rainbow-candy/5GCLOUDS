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
        <el-col :xs="12" :sm="8" v-for="(item, index) in colList1" :key="index">
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
        src: require('@/assets/imgs/ks/czyh.png'),
        label: '垂直养号'
      }, {
        src: require('@/assets/imgs/ks/srm.png'),
        label: '上热门'
      }, {
        src: require('@/assets/imgs/ks/fxdz.png'),
        label: '发现点赞'
      }, {
        src: require('@/assets/imgs/ks/tcdz.png'),
        label: '同城点赞'
      }, {
        src: require('@/assets/imgs/ks/ssgz.png'),
        label: '搜索关注'
      }, {
        src: require('@/assets/imgs/ks/zfpl.png'),
        label: '转发评论'
      }, {
        src: require('@/assets/imgs/ks/zbzl.png'),
        label: '直播助力'
      }, {
        src: require('@/assets/imgs/ks/zbjcj.png'),
        label: '直播间采集'
      }, {
        src: require('@/assets/imgs/ks/scsp.png'),
        label: '上传视频'
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
    padding: 10px 0;
    img {
      width: 150px;
      height: 197px;
      cursor: pointer;
    }
  }
}
@media screen and (max-width:770px ) {
  .content {
    margin-top: 10px;
    .el-col {
      text-align: center;
      padding: 0;
      img {
        width: 92px;
        height: 121px;
      }
    }
  }
}
</style>
