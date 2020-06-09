<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-fbrw.png" alt class="search_str-title" v-show="isClick"/>
      <img src="@/assets/imgs/title-cjfx.png" alt class="search_str-title" v-show="!isClick"/>
      <img :src="this.$route.query.src" alt style="width:120px;" v-show="isClick"/>
      <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
      <div class="to-home" @click="toHome">
        <i class="el-icon-refresh-left"></i>返回上级
      </div>
      <div class="to-home to-list" @click="toList">
        <i class="el-icon-s-fold"></i>进入任务列表
      </div>
      <img src="@/assets/imgs/ks-logo.png" alt class="logo"/>
    </div>
    <div class="search_str" v-if="this.$route.query.name !== '直播间采集'">
      <el-form label-position="right" :model="ruleForm" label-width="160px" ref="ruleForm" style="width: 650px;" class="ruleForm">
        <div class="required">*</div>
        <el-form-item label="选择设备：">
          <i class="el-icon-plus" @click="xzsb"></i>
        </el-form-item>
        <czyhModal ref="czyhModal" v-if="this.$route.query.name === '垂直养号'"></czyhModal>
        <dzModal ref="dzModal" v-if="this.$route.query.name.indexOf('点赞') !== -1"></dzModal>
        <ssgzModal ref="ssgzModal" v-if="this.$route.query.name === '搜索关注'"></ssgzModal>
        <zfplModal ref="zfplModal" v-if="this.$route.query.name === '转发评论'"></zfplModal>
        <zbzlModal ref="zbzlModal" v-if="this.$route.query.name === '直播助力'"></zbzlModal>
        <scspModal ref="scspModal" v-if="this.$route.query.name === '上传视频'"></scspModal>
        <srmModal ref="srmModal" v-if="this.$route.query.name === '上热门'"></srmModal>
      </el-form>
      <div style="position: relative;height: 468px;border-left:1px solid #ccc;" v-show="sbShow">
        <base-table ref="sbTable" :columns="sbColumns" :data="tableData" selection height="420" @selection-change="selectionRow" style="max-width: 550px;margin-left: 70px;"></base-table>
        <el-pagination
          class="fbrw-pagenation"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="[10, 20, 50]"
          :page-size="10"
          layout="prev, pager, next, total, sizes"
          :total="total"
        ></el-pagination>
      </div>
    </div>
    <zbjcjModal ref="zbjcjModal" v-if="this.$route.query.name === '直播间采集'"></zbjcjModal>
    <xzscModal ref="xzscModal"></xzscModal>
    <forwardModal ref="forwardModal"></forwardModal>
  </div>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';
import xzscModal from '@/modal/xzscModal';
import forwardModal from '@/modal/forward';
import czyhModal from './modal/czyh'
import dzModal from './modal/dz'
import ssgzModal from './modal/ssgz'
import zfplModal from './modal/zfpl'
import zbzlModal from './modal/zbzl'
import zbjcjModal from './modal/zbjcj'
import scspModal from './modal/scsp'
import srmModal from './modal/srm'

export default {
  components: { xzscModal, forwardModal, czyhModal, dzModal, ssgzModal, zfplModal, zbzlModal, zbjcjModal, scspModal, srmModal },
  data () {
    return {
      sbShow: false,
      isActive: true,
      isActives: true,
      timing: false,
      isClick: true,
      ruleForm: {
        time: '',
        search_str: '',
        to_num: '',
        content: '',
        spwb: '',
        spht: '',
        sphy: ''
      },
      timers: null,
      fileList: [],
      toFileList: [],
      // 设备
      sbColumns: [
        {
          prop: 'name',
          label: '设备'
        },
        {
          prop: 'group',
          label: '组别',
          filter: true,
          filterData: [],
          width: 180
        },
        {
          prop: 'online',
          label: '在线情况',
          sortable: true,
          backColorqk: true
        }
      ],
      page_size: 10,
      tableData: [],
      selectTableRow: [],
      total: 0
    }
  },
  methods: {
    toHome () {
      this.$router.go(-1)
    },
    toList () {
      this.$router.push({
        path: '/checkTask',
        query: { type: 'ks' }
      });
    },
    // 选择设备
    xzsb () {
      this.sbShow = !this.sbShow
    },
    // 表格复选框选中
    selectionRow (data) {
      this.selectTableRow = data;
      this.loading = false;
    },
    // 切换分页
    handleCurrentChange (val) {
      this.current = val;
      this.getList(val);
      this.$refs.sbTable.handleCurrentChange();
    },
    getList (page) {
      var params = {};
      if (this.$route.query.name !== '直播间采集') {
        params = {
          mydev_online: 1,
          page: page,
          page_size: this.page_size
        }
      } else {
        params = {
          mydev_online: 1,
          page: 1,
          page_size: 100
        }
      }
      wdsbServer.myDev(params).then(res => {
        if (res.status === 200) {
          res.data.results.forEach((t) => {
            if (t.online === 1) {
              t.online = '在线';
            } else {
              t.online = '离线';
            }
          });
          this.tableData = res.data.results;
          this.total = res.data.count;
          // this.getFilterData(this.tableData);
        }
      }).catch(error => {
        if (error.request.status === 500) {
          this.$message.error('服务异常！')
        } else {
          this.$message.error(error.request.response);
        }
      });
    },
    tabChange1 () {
      if (!this.isClick) {
        this.isClick = true;
        this.getList(this.current);
      }
    },
    tabChange2 () {
      if (this.isClick) {
        this.isClick = false;
        this.$refs.zbjcjModal.importKeyword();
        clearTimeout(this.timers);
      }
    },

    makeXMLHttpRequest (url, data, _this) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function (res) {
        if (request.readyState === 4) {
          if (request.status === 200) {
            if (request.response === '') {
              _this.$message({
                message: '执行成功！',
                type: 'success'
              });
            } else {
              _this.$message({
                message: request.response,
                type: 'error',
                duration: 3000,
                showClose: true
              });
            }
          } else {
            _this.$message({
              message: '执行失败！',
              type: 'error'
            });
          }
        }
      };
      request.open('POST', url);
      request.setRequestHeader('authorization', window.sessionStorage.getItem('token'));
      request.send(data);
    },
    handleSizeChange (val) {
      this.page_size = val;
      this.getList(1);
    }
  },
  mounted () {
    this.getList(1);
  },
  // 销毁后
  destroyed () {
    clearTimeout(this.timers);
  },
  // 监听
  watch: {
    tableData () {
      if (this.timers) {
        clearTimeout(this.timers);
      }
      this.timers = setTimeout(() => {
        this.getList(this.current);
      }, 3000);
    }
  }
}
</script>

<style lang="less" scoped>
.search_str-title {
  width: 300px;
  position: absolute;
  left: 0px;
  top: -3px;
}
.box {
  padding: 110px 40px 0 40px;
}
.search_str {
  margin-top: 50px;
  display: flex;
  .el-icon-plus {
    height: 30px;
    line-height: 30px;
    width: 30px;
    text-align: center;
    border-radius: 7px;
    background-color: #e68048;
    color: #fff;
    cursor: pointer;
  }
  .ruleForm {
    /deep/ .el-table, /deep/ .el-input, /deep/.el-textarea {
      width: 400px;
      /deep/ .el-input__inner {
        text-align: left;
      }
    }
  }
  /deep/ .el-form-item__label {
    font-size: 15px;
    color: black;
  }
  .zxfs {
    display: flex;
    div {
      width: 200px;
      border: 1px solid #ccc;
      text-align: center;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
    }
    .active {
      color: #fff;
      background-color: #53bce0;
    }
  }
  .djsc {
    width: 400px;
    border: 1px solid #ccc;
    text-align: center;
    height: 40px;
    line-height: 40px;
    cursor: pointer;
    color: #fff;
    background-color: #53bce0;
  }
}
/deep/ .el-input-number {
  width: 400px;
}
.fbrw-pagenation {
  left: 310px;
}
.required {
  position: relative;
  left: 64px;
  top: 27px;
  color: #f56c7e;
  font-size: 15px;
}
.to-list {
  top: 125px;
  font-size: 1.4rem;
}
</style>
