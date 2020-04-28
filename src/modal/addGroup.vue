<template>
  <el-dialog title="组别昵称" :visible.sync="dialogVisible" width="30%">
    <!-- <el-input v-model="group"  placeholder="请输入组别昵称" maxlength="6" show-word-limit></el-input> -->
    <el-select v-model="group" placeholder="请选择组别昵称">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';

export default {
  name: 'addGroup',
  data () {
    return {
      dialogVisible: false,
      group: '',
      checkList: [],
      options: [{
        value: '推荐点赞',
        label: '推荐点赞'
      }, {
        value: '同城点赞',
        label: '同城点赞'
      }, {
        value: '搜索关注',
        label: '搜索关注'
      }, {
        value: '粉丝关注',
        label: '粉丝关注'
      }, {
        value: '转发评论',
        label: '转发评论'
      }, {
        value: '指定转发评论',
        label: '指定转发评论'
      }, {
        value: '直播助力',
        label: '直播助力'
      }, {
        value: '上传视频',
        label: '上传视频'
      }]
    }
  },
  methods: {
    open (data) {
      this.dialogVisible = true;
      this.group = '';
      this.checkList = data;
    },
    submit () {
      if (this.group === '') {
        this.$message({
          type: 'warning',
          message: '请输入组别昵称！'
        });
        return;
      }
      const params = {
        id: '',
        group: this.group
      }
      if (this.checkList.length > 1) {
        // 批量修改的接口
        this.checkList.forEach(t => {
          params.id += t.id + ','
        });
        params.id = params.id.substr(0, params.id.length - 1);
      } else {
        // 单独修改的接口
        params.id = this.checkList[0].id;
      }
      const url = 'task/dev/' + params.id + '/';
      wdsbServer.putDev(url, params).then(res => {
        if (res.status === 200) {
          this.dialogVisible = false;
          this.$message({
            message: '分组新增成功！',
            type: 'success'
          });
          this.$parent.getList();
        }
      })
    }
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
/deep/ .el-select {
  width: 100%;
}
/deep/ .el-button--primary {
    background-color: #e68048;
    border-color: #e68048;
}
</style>
