<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-fbrw.png" alt class="search_str-title"/>
      <img :src="this.$route.query.src" alt style="width:120px;" />
      <img src="@/assets/imgs/newlogo.png" alt style="width: 50px;position: absolute;right: 170px;top: 20px;"/>
      <div class="to-home" @click="toHome">
        <!-- <div v-if="this.$route.query.type === 'dy'">
          <i class="el-icon-s-home"></i>返回抖音首页
        </div>
        <div v-if="this.$route.query.type !== 'dy'">
          <i class="el-icon-s-home"></i>返回快手首页
        </div> -->
        <i class="el-icon-refresh-left"></i>返回上级
      </div>
      <img src="@/assets/imgs/dy-logo.png" alt class="logo" v-if="this.$route.query.type === 'dy'" />
      <img src="@/assets/imgs/ks-logo.png" alt class="logo" v-if="this.$route.query.type !== 'dy'" />
    </div>
    <div class="search_str">
      <el-form label-position="right" label-width="180px">
        <el-form-item label="选择设备：">
          <i class="el-icon-plus" @click="xzsb"></i>
          <base-table :columns="sbColumns" :data="tableData" selection v-show="sbShow" height="182" @selection-change="selectionRow"></base-table>
        </el-form-item>
        <el-form-item label="点赞数量：" v-if="this.$route.query.name === '推荐点赞' || this.$route.query.name === '同城点赞'">
          <el-input-number v-model="to_num" controls-position="right" :min="1" label="请输入点赞数量"></el-input-number>
        </el-form-item>
        <el-form-item label="搜索内容（大类）：" v-if="this.$route.query.name === '转发评论' || this.$route.query.name === '搜索关注'">
          <el-input type="text" v-model="search_str"></el-input>
        </el-form-item>
        <el-form-item label="搜索内容（抖音ID号）：" v-if="this.$route.query.name === '指定转发评论' || this.$route.query.name === '粉丝关注'">
          <el-input type="text" v-model="search_str"></el-input>
        </el-form-item>
        <el-form-item label="直播间号：" v-if="this.$route.query.name === '直播助力'">
          <el-input type="text" v-model="search_str"></el-input>
        </el-form-item>
        <el-form-item label="评论内容：" v-if="this.$route.query.name === '推荐点赞' || this.$route.query.name === '同城点赞'">
          <el-input type="textarea" v-model="content" :rows="3" maxlength="100" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="弹幕文案" v-if="this.$route.query.name === '直播助力'">
          <el-upload
            class="upload-demo"
            action="http://112.74.103.26/api/task/dev/"
            :on-change="beforeUpload"
            :before-remove="beforeRemove"
            multiple
            :limit="1"
            show-file-list
            :auto-upload="false"
            :on-exceed="handleExceed"
            accept=".txt"
            :file-list="fileList">
            <div class="djsc">选择txt文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="关注数量：" v-if="this.$route.query.name === '搜索关注' || this.$route.query.name === '粉丝关注'">
          <el-input-number v-model="to_num" controls-position="right" :min="1" label="请输入关注数量"></el-input-number>
          <!-- <el-input type="number" v-model="to_num"></el-input> -->
        </el-form-item>
        <el-form-item label="私信内容：" v-if="this.$route.query.name === '搜索关注' || this.$route.query.name === '粉丝关注'">
          <el-input type="textarea" v-model="content" :rows="3"></el-input>
        </el-form-item>
        <!-- <el-form-item label="选择素材：" v-if="this.$route.query.name === '上传视频'">
          <i class="el-icon-plus" @click="xzsc"></i>
        </el-form-item> -->
        <div v-if="this.$route.query.name.indexOf('转发评论') !== -1">
          <el-form-item label="转发数量：">
            <el-input-number v-model="to_num" controls-position="right" :min="1" label="请输入转发数量"></el-input-number>
          </el-form-item>
          <el-form-item label="评论(@昵称)：">
            <el-input type="textarea" v-model="content" :rows="3" maxlength="100" show-word-limit placeholder="输入网红昵称即可"></el-input>
          </el-form-item>
        </div>
        <!-- 上传视频 -->
        <div v-if="this.$route.query.name === '上传视频'">
          <el-form-item label="视频文本：">
            <el-input v-model="spwb" maxlength="30" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="#话题：">
            <el-input v-model="spht" maxlength="10" show-word-limit @input="htKeyup" placeholder="禁止输入特殊字符和空格"></el-input>
          </el-form-item>
          <el-form-item label="@好友：">
            <el-input v-model="sphy" maxlength="10" show-word-limit @input="hyKeyup" placeholder="禁止输入特殊字符和空格"></el-input>
          </el-form-item>
          <el-form-item label="定位：">
            <el-input v-model="sphy" maxlength="10" show-word-limit @input="hyKeyup" placeholder="禁止输入特殊字符和空格"></el-input>
          </el-form-item>
          <el-form-item label="视频素材：">
            <el-upload
              class="upload-demo"
              action="http://112.74.103.26/api/task/dev/"
              :on-change="beforeUpload"
              :before-remove="beforeRemove"
              multiple
              :limit="1"
              show-file-list
              :auto-upload="false"
              :on-exceed="handleExceed"
              :file-list="fileList">
              <div class="djsc">选择文件</div>
              <div class="el-upload__tip" slot="tip">文件最大100M</div>
            </el-upload>
          </el-form-item>
        </div>
        <!-- 执行方式 -->
        <el-form-item label="执行方式：">
          <div class="zxfs" style="display: flex;">
            <div :class="{ active: isActive }" @click="implement('0')">立即执行</div>
            <div :class="{ active: !isActive }" @click="implement('1')">定时执行</div>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="time"
            v-show="timing"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="选择执行时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="zxBtn" @click="onSubmit" :disabled="selectTableRow.length === 0">执行</el-button>
        </el-form-item>
      </el-form>
    </div>
    <xzscModal ref="xzscModal"></xzscModal>
  </div>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';
import xzscModal from '@/modal/xzscModal';

export default {
  components: { xzscModal },
  data () {
    return {
      sbShow: false,
      isActive: true,
      timing: false,
      num: '0',
      time: '',
      search_str: '',
      to_num: '',
      content: '',
      name: '',
      spwb: '',
      spht: '',
      sphy: '',
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
          label: '组别（可筛选）',
          filter: true,
          filterData: []
        }
      ],
      tableData: [],
      selectTableRow: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      }
    }
  },
  methods: {
    htKeyup (e) {
      this.spht = e.replace(/[^\a-\z\A-\Z0-9\u4e00-\u9fe5_]/g, '');
    },
    hyKeyup (e) {
      this.sphy = e.replace(/[^\a-\z\A-\Z0-9\u4e00-\u9fe5_]/g, '');
    },
    toHome () {
      this.$router.go(-1)
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
    // 切换执行方式
    implement (num) {
      if (this.num !== num) {
        this.isActive = !this.isActive
      }
      this.num = num;
      if (num === '0') {
        this.timing = false;
      } else {
        // 定时执行
        this.timing = !this.timing;
      }
    },
    onSubmit () {
      if (this.time) {
        const d = new Date(this.time);
        const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
        const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
        this.task_time = resDate + ' ' + resTime;
        if (this.$route.query.name === '上传视频' || this.$route.query.name === '直播助力') {
          this.submit(this.task_time);
        } else {
          this.ljzx(this.task_time);
        }
      } else {
        if (this.$route.query.name === '上传视频' || this.$route.query.name === '直播助力') {
          this.submit();
        } else {
          this.ljzx();
        }
      }
    },
    // 立即执行
    ljzx (time) {
      const params = {
        id: '',
        task_nick: this.$route.query.name,
        app_type: this.$route.query.type,
        to_num: this.to_num,
        content: this.content
      };
      // 立即执行不需要传task_time
      if (!this.isActive) {
        params.task_time = time;
        if (time === undefined) {
          this.$message.warning('请选择定时执行的时间');
        }
      }
      if (this.selectTableRow.length > 1) {
        // 批量修改的接口
        this.selectTableRow.forEach(t => {
          params.id += t.id + ','
        });
        params.id = params.id.substr(0, params.id.length - 1);
      } else if (this.selectTableRow.length === 1) {
        // 单独修改的接口
        params.id = this.selectTableRow[0].id;
      }
      const url = 'task/dev/' + params.id + '/';
      wdsbServer.putDev(url, params).then(res => {
        if (res.status === 200) {
          if (res.data === '') {
            this.$message({
              message: '执行成功！',
              type: 'success'
            });
            this.selectTableRow = [];
          } else {
            this.$message({
              message: res.data,
              type: 'error',
              duration: 5000,
              showClose: true
            });
          }
        }
      })
    },
    // 选择素材
    xzsc () {
      this.$refs.xzscModal.dialogVisible = true;
    },
    p (s) {
      return s < 10 ? '0' + s : s
    },
    // 获取筛选数组
    getFilterData (data) {
      // 空对象
      var obj = {}
      const newData = data.concat();
      this.sbColumns[1].filterData = [];
      // 遍历
      for (var i = 0; i < newData.length; i++) {
        if (newData[i].group) {
          if (obj[newData[i].group] === undefined) {
            // 随便贴一个不为空的值
            obj[newData[i].group] = 1;
          } else {
            newData.splice(i--, 1)
          }
        } else {
          newData.splice(i--, 1)
        }
      }
      newData.forEach((item, index) => {
        this.sbColumns[1].filterData.push(
          Object.assign({}, item, { text: item.group, value: item.group })
        )
      })
    },
    getList () {
      this.tableData = [];
      wdsbServer.myDev().then(res => {
        if (res.status === 200) {
          this.tableData = res.data;
          this.getFilterData(this.tableData);
        }
      })
    },

    // 上传视频
    beforeUpload (file, fileList) {
      this.toFileList[0] = file.raw;
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 上传视频
    submit (time) {
      if (this.$route.query.name === '上传视频' && this.spwb === '') {
        this.$message.warning('请输入文本内容')
      } else if (this.toFileList.length === 0) {
        this.$message.warning('请上传文件')
      } else {
        const params = {};
        const formData = new FormData();
        // 立即执行不需要传task_time
        if (!this.isActive) {
          formData.append('task_time', time);
          if (time === undefined) {
            this.$message.warning('请选择定时执行的时间');
          }
        }
        if (this.selectTableRow.length > 1) {
          // 批量修改的接口
          this.selectTableRow.forEach(t => {
            params.id += t.id + ','
          });
          params.id = params.id.substr(0, params.id.length - 1);
        } else if (this.selectTableRow.length === 1) {
          // 单独修改的接口
          params.id = this.selectTableRow[0].id;
        }
        // 拼接content
        if (this.$route.query.name === '上传视频') {
          this.content = this.spwb + ',,,,,' + this.spht + ',,,,,' + this.sphy;
        }
        formData.append('id', '1');
        formData.append('task_nick', this.$route.query.name);
        formData.append('app_type', this.$route.query.type);
        formData.append('content', this.content);
        formData.append('search_str', this.search_str);
        formData.append('to_file', this.toFileList[0]);
        const url = 'http://112.74.103.26/api/task/dev/' + params.id + '/';
        this.makeXMLHttpRequest(url, formData, this)
      }
    },

    makeXMLHttpRequest (url, data, _this) {
      var request = new XMLHttpRequest();
      request.onreadystatechange = function (res) {
        if (request.readyState === 4) {
          if (request.status === 200) {
            _this.$message({
              message: '执行成功！',
              type: 'success'
            });
            _this.selectTableRow = [];
          } else {
            _this.$message({
              message: '执行失败！',
              type: 'success'
            });
          }
        }
      };
      request.open('PUT', url);
      request.setRequestHeader('authorization', window.sessionStorage.getItem('token'));
      request.send(data);
    }
  },
  mounted () {
    this.getList();
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
.search_str {
  margin-top: 50px;
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
  .zxBtn {
    color: #fff;
    border-color: #e68048;
    background-color: #e68048;
    width: 200px;
    margin-left: 100px;
  }
  /deep/ .el-table, /deep/ .el-input, /deep/.el-textarea {
    width: 400px;
    /deep/ .el-input__inner {
      text-align: left;
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
</style>
