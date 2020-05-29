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
        <el-col v-for="(item, index) in colList1" :key="index" :xs="12">
          <img :src="item.src" alt="" @click="publishTask(item.src, item.label)" :class="item.name">
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';

export default {
  data () {
    return {
      colList1: [{
        src: require('@/assets/imgs/czyh.png'),
        label: '垂直养号'
      }, {
        src: require('@/assets/imgs/srm.png'),
        label: '上热门'
      }, {
        src: require('@/assets/imgs/tjdz.png'),
        label: '推荐点赞'
      }, {
        src: require('@/assets/imgs/tcdz.png'),
        label: '同城点赞',
        name: 'tcdz'
      }, {
        src: require('@/assets/imgs/ssgz.png'),
        label: '搜索关注'
      }, {
        src: require('@/assets/imgs/fsgz.png'),
        label: '粉丝关注'
      }, {
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
      wdsbServer.clicknum({ task_name: label }).then(res => {
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 130px 10% 0 10%;
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
    padding: 20px 0;
    width: 20%;
    img {
      width: 150px;
      height: 188px;
    }
  }
}
@media screen and (max-width:1100px ) {
  .content {
    margin-top: -35px;
    .el-col {
      padding: 8px 0;
      width: 50%;
      img {
        width: 130px;
        height: 170px;
      }
    }
  }
}
@media screen and (max-width:770px ) {
  .content {
    margin-top: -35px;
    .el-col {
      padding: 8px 0;
      width: 50%;
      img {
        width: 95px;
        height: 119px;
      }
      .zdzf {
        width: 100px;
      }
      .tcdz {
        width: 94px;
      }
    }
  }
}
</style>
