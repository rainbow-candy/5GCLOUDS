<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-fbrw.png" alt class="content-title"/>
      <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
      <div class="to-home" @click="toHome"><i class="el-icon-refresh-left"></i>返回上级</div>
      <img src="@/assets/imgs/dy-logo.png" alt="" class="logo">
    </div>
    <div class="content">
      <el-row>
        <el-col v-for="(item, index) in colList1" :key="index" :xs="12" :sm="6">
          <img :src="item.src" alt="" @click="publishTask(item.src, item.label)">
        </el-col>
      </el-row>
      <el-row>
        <el-col v-for="(item, index) in colList2" :key="index" :xs="12" :sm="6">
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
  padding: 120px 40px 0 40px;
  width: 90%;
  margin-left: 5%;
  .content-title {
    width: 300px;
    position: absolute;
    left: 0px;
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
    .zdzf {
      width: 179px;
    }
  }
}
@media screen and (max-width:770px ) {
  .content {
    margin-top: -35px;
    .el-col {
      padding: 8px 0;
      img {
        width: 95px;
      }
      .zdzf {
        width: 103px;
      }
    }
  }
}
</style>
