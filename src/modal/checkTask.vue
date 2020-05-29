<template>
  <el-dialog title="查看详情" :visible.sync="dialogVisible" :width="dialogWidth">
    <!-- 垂直点赞 -->
    <el-form label-width="120px" v-if="form.task_nick === '垂直养号'">
      <div class="check1">搜索大类：{{form.search_str}}</div>
      <el-form-item label="点赞数量：">
        <p>{{form.to_num}}</p>
      </el-form-item>
      <div class="check1" v-if="!form.to_file">评论内容：{{form.content ? form.content : zero}}</div>
      <div class="check1" v-if="!form.to_file">@好友：{{form.at_me ? form.at_me : zero}}</div>
      <el-form-item label="评论内容：" v-if="form.to_file">
        <a :href="form.to_file">点击下载文件查看评论内容</a>
      </el-form-item>
    </el-form>
    <!-- 上热门 -->
    <el-form label-width="120px" v-if="form.task_nick === '上热门'">
      <div class="check1">抖音号：{{form.search_str}}</div>
      <div class="check1">观看视频数量：{{form.to_num}}</div>
      <div class="check1">单个视频观看次数：{{form.content}}</div>
      <div class="check1">单个视频观看时间：{{form.check_time}}</div>
    </el-form>

    <!-- 点赞 -->
    <el-form label-width="120px" v-if="form.task_nick === '推荐点赞' || form.task_nick === '同城点赞'">
      <el-form-item label="点赞数量：">
        <p>{{form.to_num}}</p>
      </el-form-item>
      <div class="check1" v-if="!form.to_file">评论内容：{{form.content ? form.content : zero}}</div>
      <div class="check1" v-if="!form.to_file">@好友：{{form.at_me ? form.at_me : zero}}</div>
      <el-form-item label="评论内容：" v-if="form.to_file">
        <a :href="form.to_file">点击下载文件查看评论内容</a>
      </el-form-item>
    </el-form>

    <!-- 关注 -->
    <el-form label-width="120px" v-if="form.task_nick === '搜索关注' || form.task_nick === '粉丝关注'">
      <div class="check1" v-if="form.task_nick === '搜索关注'">搜索内容(大类)：{{form.search_str}}</div>
      <div class="check1" v-if="form.task_nick === '粉丝关注'">搜索内容(抖音ID号)：{{form.search_str}}</div>
      <el-form-item label="关注数量：">
        <p>{{form.to_num}}</p>
      </el-form-item>
      <div class="check1">私信内容：{{form.content ? form.content : zero}}</div>
    </el-form>

    <!-- 评论 -->
    <el-form label-width="120px" v-if="form.task_nick === '转发评论' || form.task_nick === '指定转发评论'">
      <div class="check1" v-if="form.task_nick === '转发评论'">搜索内容(大类)：{{form.search_str}}</div>
      <div class="check1" v-if="form.task_nick === '指定转发评论'">搜索内容(抖音ID号)：{{form.search_str}}</div>
      <el-form-item label="转发数量：">
        <p>{{form.to_num}}</p>
      </el-form-item>
      <div class="check1" v-if="!form.to_file">@好友：{{form.at_me ? form.at_me : zero}}</div>
      <el-form-item label="评论内容：" v-if="form.to_file">
        <a :href="form.to_file">点击下载文件查看评论内容</a>
      </el-form-item>
    </el-form>

    <!-- 直播 -->
    <el-form label-width="120px" v-if="form.task_nick === '直播助力'">
      <div class="check1">抖音号：{{form.search_str}}</div>
      <div class="check1">观看时间：{{form.to_num}}</div>
      <div class="check1" v-if="!form.to_file">弹幕文案：{{zero}}</div>
      <el-form-item label="弹幕文案：" v-if="form.to_file">
        <a :href="form.to_file">点击下载文件查看弹幕内容</a>
      </el-form-item>
    </el-form>

    <!-- 上传视频 -->
    <el-form label-width="120px" v-if="form.task_nick === '上传视频'">
      <div class="check1">视频文本：{{form.content1}}</div>
      <div class="check1">#话题：{{form.content2 ? form.content2 : zero}}</div>
      <div class="check1">@好友：{{form.content3 ? form.content3 : zero}}</div>
      <div class="check1">视频素材：{{form.to_file ? form.to_file : zero}}</div>
    </el-form>

    <!-- 关键词搜索 -->
    <el-form label-width="120px" v-if="form.task_nick === '关键词搜索'">
      <div class="check1">关键词：{{form.search_str}}</div>
    </el-form>

    <!-- 取消关注 -->
    <el-form label-width="120px" v-if="form.task_nick === '取消关注'">
      <div class="check1">取关数量：{{form.to_num}}</div>
    </el-form>

    <!-- 同步 -->
    <el-form label-width="120px" v-if="form.task_nick === '同步'">
      <div class="check1">无详情</div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'checkTask',
  data () {
    return {
      zero: '无',
      form: {
        to_num: '',
        task_nick: '',
        to_file: '',
        content: '',
        search_str: ''
      },
      dialogWidth: '',
      dialogVisible: false
    }
  },
  methods: {
    open (data) {
      this.dialogVisible = true;
      this.form = data;
      if (this.form.task_nick === '上传视频') {
        const arr = this.form.content.split(',,,,,');
        this.form.content1 = arr[0];
        this.form.content2 = arr[1];
        this.form.content3 = arr[2];
      }
    }
  },
  mounted () {
    this.dialogWidth = window.sessionStorage.getItem('fullWidth') > 770 ? '300px' : '100%';
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog__header {
    background-color: #e68048;
    /deep/ .el-dialog__title {
        color: #fff;
    }
    /deep/ .el-dialog__close {
        color: #fff;
    }
}
/deep/.el-dialog__body {
  padding: 20px 0;
}
/deep/ .el-form-item {
  margin: 0rem 2rem 1rem 0rem !important;
  /deep/.el-form-item__content {
    line-height: 30px;
  }
}
.check1 {
  margin: 0 2rem 1rem 38px;
  height: 30px;
  line-height: 30px;
}
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
/deep/ .el-pagination {
  bottom: -75px;
}
</style>
