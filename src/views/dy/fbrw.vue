<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-fbrw.png" alt class="content-title"/>
      <img src="@/assets/imgs/newlogo.png" alt style="width: 50px;position: absolute;right: 170px;top: 20px;"/>
      <div class="to-home" @click="toHome" title="返回抖音首页"><i class="el-icon-s-home"></i>返回抖音首页</div>
      <img src="@/assets/imgs/dy-logo.png" alt="" class="logo">
    </div>
    <div class="content">
      <el-row>
        <el-col :span="6" v-for="(item, index) in colList1" :key="index">
          <img :src="item.src" alt="" @click="publishTask(item.src, item.label)">
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" v-for="(item, index) in colList2" :key="index">
          <img :src="item.src" alt="" @click="publishTask(item.src, item.label)" :class="item.name">
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
        src: require('@/assets/imgs/tjdz.png'),
        label: '推荐点赞'
      }, {
        src: require('@/assets/imgs/tcdz.png'),
        label: '同城点赞'
      }, {
        src: require('@/assets/imgs/ssgz.png'),
        label: '搜索关注'
      }, {
        src: require('@/assets/imgs/fsgz.png'),
        label: '粉丝关注'
      }],
      colList2: [{
        src: require('@/assets/imgs/zfpl.png'),
        label: '转发评论'
      }, {
        src: require('@/assets/imgs/zdzf.png'),
        label: '指定转发评论',
        name: 'zdzf'
      }, {
        src: require('@/assets/imgs/zbzl.png'),
        label: '直播助力'
      }, {
        src: require('@/assets/imgs/scsp.png'),
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
        path: '/publishTask2',
        query: { src: src, type: 'dy', name: label }
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
    left: 0px;
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
    .zdzf {
      width: 158px;
    }
  }
}
</style>
