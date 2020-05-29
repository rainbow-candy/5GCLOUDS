<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-fbrw.png" alt class="content-title"/>
      <img :src="this.$route.query.src" alt class="content-title-gn" />
      <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
      <div class="to-home" @click="toHome">
        <i class="el-icon-refresh-left"></i>返回上级
      </div>
      <div class="to-home to-list" @click="toList">
        <i class="el-icon-s-fold"></i>进入任务列表
      </div>
      <img src="@/assets/imgs/dy-logo.png" alt class="logo"/>
    </div>
    <div class="search_str">
      <el-form label-position="right" :model="ruleForm" label-width="160px" :rules="rules" ref="ruleForm" class="ruleForm">
        <div class="required">*</div><el-form-item label="选择设备：">
          <i class="el-icon-plus" @click="xzsb"></i>
        </el-form-item>
        <el-form-item label="搜索内容（大类）：" v-if="this.$route.query.name === '转发评论' || this.$route.query.name === '搜索关注' || this.$route.query.name === '垂直养号'" prop="search_str">
          <el-input type="text" v-model="ruleForm.search_str" minlength="1" placeholder="请输入搜索内容"></el-input>
        </el-form-item>
        <el-form-item label="点赞数量：" v-if="this.$route.query.name === '推荐点赞' || this.$route.query.name === '同城点赞' || this.$route.query.name === '垂直养号'" prop="to_num">
          <el-input-number v-model="ruleForm.to_num" controls-position="right" :min="1" label="请输入点赞数量"></el-input-number>
        </el-form-item>
        <el-form-item label="搜索抖音ID号：" v-if="this.$route.query.name === '指定转发评论' || this.$route.query.name === '粉丝关注'" prop="search_str">
          <el-input type="text" v-model="ruleForm.search_str" minlength="1" maxlength="15" show-word-limit placeholder="请输入抖音ID号"></el-input>
        </el-form-item>
        <!--  -->
        <el-form-item label="关注数量：" v-if="this.$route.query.name === '搜索关注' || this.$route.query.name === '粉丝关注'" prop="to_num">
          <el-input-number v-model="ruleForm.to_num" controls-position="right" :min="1" label="请输入关注数量"></el-input-number>
        </el-form-item>
        <el-form-item label="私信内容：" v-if="this.$route.query.name === '搜索关注' || this.$route.query.name === '粉丝关注'">
          <el-input type="textarea" v-model="ruleForm.content" :rows="3" placeholder="请输入私信内容"></el-input>
        </el-form-item>
        <el-form-item label="转发数量：" prop="to_num" v-if="this.$route.query.name.indexOf('转发评论') !== -1">
          <el-input-number v-model="ruleForm.to_num" controls-position="right" :min="1" label="请输入转发数量"></el-input-number>
        </el-form-item>
        <el-form-item label="点赞数量筛选：" v-if="this.$route.query.name === '指定转发评论'">
          <el-input-number v-model="ruleForm.likes" controls-position="right" :min="0" label="请输入最少点赞数量"></el-input-number>
        </el-form-item>
        <div v-if="this.$route.query.name.indexOf('转发评论') !== -1 || this.$route.query.name.indexOf('点赞') !== -1 || this.$route.query.name === '垂直养号'">
          <div class="required" style="left: 63px;" v-if="this.$route.query.name.indexOf('转发评论') !== -1">*</div>
          <el-form-item label="评论内容：">
            <el-radio v-model="radio" label="1">手动输入</el-radio>
            <el-radio v-model="radio" label="2">批量上传</el-radio>
            <el-input type="textarea" v-model="ruleForm.content" :rows="2" :maxlength="maxlength" show-word-limit placeholder="评论条数以“|”分隔" @input="plnrChange" v-if="radio === '1'"></el-input>
            <div class="plnr" v-if="radio === '2'">
              <div class="xzmb" @click="xzmb"><i class="el-icon-download"></i>下载评论模板</div>
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
                accept=".xls, .xlsx"
                :file-list="fileList">
                <div class="xzmb"><i class="el-icon-upload2"></i>上传评论模板</div>
                </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="@好友：" v-if="radio === '1'">
            <el-input type="text" v-model="ruleForm.at_me" minlength="1" maxlength="15" show-word-limit placeholder="请输入抖音ID号"></el-input>
          </el-form-item>
        </div>
        <!-- 直播助力 -->
        <div v-if="this.$route.query.name === '直播助力'">
          <el-form-item label="抖音号：" prop="search_str">
            <el-input type="text" v-model="ruleForm.search_str" placeholder="请输入抖音号"></el-input>
          </el-form-item>
          <div class="required" style="left: 50px;">*</div><el-form-item label="直播间转发：">
            <div class="zxfs" style="display: flex;">
              <div :class="{ active: isActives }" @click="zbjzf('0')">否</div>
              <div :class="{ active: !isActives }" @click="zbjzf('1')">是</div>
            </div>
          </el-form-item>
          <el-form-item label="弹幕文案：">
            <div class="plnr">
              <div class="xzmb" @click="xzmb"><i class="el-icon-download"></i>下载弹幕模板</div>
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
                accept=".xls, .xlsx"
                :file-list="fileList">
                <div class="xzmb"><i class="el-icon-upload2"></i>上传弹幕模板</div>
                </el-upload>
            </div>
          </el-form-item>
          <el-form-item label="观看时间："  prop="to_num">
            <el-input-number v-model="ruleForm.to_num" controls-position="right" placeholder="以分钟为单位" :min="5" :max="240"></el-input-number>
          </el-form-item>
        </div>
        <!-- 上传视频 -->
        <div v-if="this.$route.query.name === '上传视频'">
          <el-form-item label="视频文本：" prop="spwb">
            <el-input v-model="ruleForm.spwb" maxlength="30" show-word-limit placeholder="请输入视频文本"></el-input>
          </el-form-item>
          <el-form-item label="#话题：">
            <el-input v-model="ruleForm.search_str" maxlength="10" show-word-limit @input="htKeyup" placeholder="请勿输入特殊字符和空格"></el-input>
          </el-form-item>
          <el-form-item label="@好友：">
            <el-input v-model="ruleForm.at_me" maxlength="10" show-word-limit placeholder="请勿输入特殊字符和空格"></el-input>
          </el-form-item>
          <div class="required">*</div><el-form-item label="视频素材：">
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
              <div class="djsc">选择文件（文件最大50M）</div>
            </el-upload>
          </el-form-item>
        </div>
        <!-- 上热门 -->
        <div v-if="this.$route.query.name === '上热门'">
          <el-form-item label="抖音号：" prop="search_str">
            <el-input type="text" v-model="ruleForm.search_str" placeholder="请输入抖音号"></el-input>
          </el-form-item>
          <el-form-item label="观看视频数量："  prop="to_num">
            <el-input-number v-model="ruleForm.to_num" controls-position="right" :min="0" label="请输入观看数量"></el-input-number>
          </el-form-item>
          <el-form-item label="单个视频观看次数："  prop="content">
            <el-input-number v-model="ruleForm.content" controls-position="right" :min="0" label="请输入单个视频观看数量"></el-input-number>
          </el-form-item>
          <el-form-item label="单个视频观看时间："  prop="check_time">
            <el-input-number v-model="ruleForm.check_time" controls-position="right" :min="0"  placeholder="大于单个视频的时长（单位为秒）"></el-input-number>
          </el-form-item>
        </div>
        <!-- 执行方式 -->
        <div class="required">*</div><el-form-item label="执行方式：">
          <div class="zxfs" style="display: flex;">
            <div :class="{ active: isActive }" @click="implement(0)">立即执行</div>
            <div :class="{ active: !isActive }" @click="implement(1)">定时执行</div>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="ruleForm.time"
            v-show="timing"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="选择执行时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="zxBtn" @click="debounce" :disabled="selectTableRow.length === 0">执行</el-button>
        </el-form-item>
      </el-form>
      <div style="position: relative;height: 468px;border-left:1px solid #ccc;" v-show="sbShow">
        <base-table ref="sbTable" :columns="sbColumns" :data="tableData" selection height="430" @selection-change="selectionRow" style="max-width: 550px;margin-left: 70px;"></base-table>
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
    <xzscModal ref="xzscModal"></xzscModal>
    <forwardModal ref="forwardModal"></forwardModal>
  </div>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';
import xzscModal from '@/modal/xzscModal';
import forwardModal from '@/modal/forward';

export default {
  components: { xzscModal, forwardModal },
  data () {
    return {
      radio: '1',
      sbShow: false,
      isActive: true,
      isActives: true,
      timing: false,
      ruleForm: {
        time: '',
        search_str: '',
        to_num: undefined,
        content: '',
        spwb: '',
        at_me: '',
        check_time: undefined,
        likes: ''
      },
      fileList: [],
      toFileList: [],
      // 表单必填校验
      rules: {
        to_num: { required: true, message: '必填', trigger: 'blur' },
        spwb: { required: true, message: '必填', trigger: 'blur' },
        // toFileList: { required: true, message: '必填' },
        search_str: { required: true, message: '必填', trigger: 'blur' },
        content: { required: true, message: '必填', trigger: 'blur' },
        check_time: { required: true, message: '必填', trigger: 'blur' }
      },
      // 评论最大长度
      maxlength: '',
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
      tableData: [],
      selectTableRow: [],
      total: 0,
      page_size: 10,
      timers: null,
      timeout: 0,
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      num: 0
    }
  },
  methods: {
    htKeyup (e) {
      // this.spht = e.replace(/[^\a-\z\A-\Z0-9\u4e00-\u9fe5_]/g, '');
    },
    // 禁止输入空格和特殊字符串
    // hyKeyup (e) {
    //   this.sphy = e.replace(/[^\a-\z\A-\Z0-9\u4e00-\u9fe5_]/g, '');
    // },
    // 评论内容修改
    plnrChange (e) {
      const arr = e.split('|');
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > 100) {
          // this.$message.warning('单条评论不能超过100字');
          this.$alert('单条评论不能超过100字', '', {
            center: true
          });
        }
      }
    },
    toHome () {
      this.$router.go(-1)
    },
    toList () {
      this.$router.push({
        path: '/checkTask',
        query: { type: 'dy' }
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
    // 切换执行方式
    implement (num) {
      if (this.num !== num) {
        this.isActive = !this.isActive
      }
      this.num = num;
      if (num === 0) {
        this.timing = false;
      } else {
        // 定时执行
        this.timing = !this.timing;
      }
    },
    // 直播间是否转发
    zbjzf (num) {
      if (this.num !== num) {
        this.isActives = !this.isActives
      }
      this.num = num;
      if (num === '1') {
        this.$refs.forwardModal.open(this.tableData);
      }
    },
    debounce () {
      if (this.timeout === 0) {
        this.onSubmit();
      } else {
        this.$message.warning(`请勿频繁操作，请${this.timeout}s后重试`);
      }
    },
    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.ruleForm.time) {
            // const d = new Date(this.ruleForm.time);
            // const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
            // const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
            // this.ruleForm.task_time = resDate + ' ' + resTime;
            this.ruleForm.task_time = this.ruleForm.time;
            if (this.$route.query.name.indexOf('关注') === -1 && this.$route.query.name !== '上热门') {
              this.submit(this.ruleForm.task_time);
            } else {
              this.ljzx(this.ruleForm.task_time);
            }
          } else {
            if (this.$route.query.name.indexOf('关注') === -1 && this.$route.query.name !== '上热门') {
              this.submit();
            } else {
              this.ljzx();
            }
          }
        } else {
          return false;
        }
      });
    },
    // 立即执行
    ljzx (time) {
      const params = {
        id: '',
        task_nick: this.$route.query.name,
        app_type: this.$route.query.type,
        to_num: this.ruleForm.to_num,
        content: this.ruleForm.content,
        search_str: this.ruleForm.search_str,
        bulk: 1,
        at_me: this.ruleForm.at_me,
        check_time: this.ruleForm.check_time
      };
      // 立即执行不需要传task_time
      if (!this.isActive) {
        params.task_time = time;
        console.log(time)
        if (time === undefined) {
          this.$message.warning('请选择定时执行的时间');
        } else if (new Date(time).getTime() < new Date().getTime() + 600000) {
          this.$message.warning('请选择十分钟后的任意时间');
        } else {
          this.ljzx1(params);
        }
      } else {
        this.ljzx1(params);
      }
    },
    ljzx1 (params) {
      console.log(params)
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
      const _this = this;
      wdsbServer.putDev(params).then(res => {
        if (res.status === 200) {
          if (res.data === '') {
            this.$message({
              message: '执行成功！',
              type: 'success'
            });
            this.timeout = 3;
            var int = window.setInterval(() => {
              if (this.timeout > 0) {
                this.timeout--;
              } else {
                window.clearInterval(int);
              }
            }, 1000);
          } else {
            this.$message({
              message: res.data,
              type: 'error',
              duration: 10000,
              showClose: true
            });
          }
        }
      }, function () {
        _this.$message({
          type: 'error',
          message: '服务异常！'
        });
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
    // 切换分页
    handleCurrentChange (val) {
      this.current = val;
      this.$refs.sbTable.handleCurrentChange();
      this.getList(val);
    },
    getList (page) {
      wdsbServer.myDev({ mydev_online: 1, page: page, page_size: this.page_size }).then(res => {
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
          this.getFilterData(this.tableData);
        }
      })
    },

    // 上传视频
    beforeUpload (file, fileList) {
      if (file.size / 1024 / 1024 > 50) {
        this.$message.warning('文件超过50M，上传失败！')
      } else {
        this.toFileList[0] = file.raw;
      }
    },
    handleExceed (files, fileList) {
      this.$message.warning('当前限制选择 1 个文件!');
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 下载文件模板
    xzmb () {
      if (this.$route.query.name.indexOf('点赞') !== -1 || this.$route.query.name === '垂直养号') {
        window.open('http://112.74.103.26/media/dz.xlsx', '_self');
      } else if (this.$route.query.name.indexOf('转发评论') !== -1) {
        window.open('http://112.74.103.26/media/zfpl.xlsx', '_self');
      } else {
        window.open('http://112.74.103.26/media/zbzl.xlsx', '_self');
      }
    },
    // 上传视频
    submit (time) {
      if (this.toFileList.length === 0) {
        if (this.$route.query.name.indexOf('转发评论') !== -1 || this.$route.query.name.indexOf('点赞') !== -1 || this.$route.query.name === '垂直养号') {
          if (this.radio === '2') {
            this.$message.warning('请上传文件');
            return;
          }
        } else if (this.$route.query.name === '上传视频') {
          this.$message.warning('请上传文件');
          return;
        }
      }
      if (this.$route.query.name.indexOf('转发评论') !== -1 && this.radio === '1') {
        if (this.ruleForm.content === '') {
          this.$message.warning('请输入评论内容');
          return;
        }
      }
      const formData = new FormData();
      // 立即执行不需要传task_time
      if (!this.isActive) {
        formData.append('task_time', time);
        if (time === undefined) {
          this.$message.warning('请选择定时执行的时间');
        } else if (new Date(time).getTime() < new Date().getTime() + 600000) {
          this.$message.warning('请选择十分钟后的任意时间');
        } else {
          this.submit1(formData);
        }
      } else {
        this.submit1(formData);
      }
    },
    submit1 (formData) {
      const params = {
        id: ''
      };
      // 拼接content
      if (this.$route.query.name === '上传视频') {
        this.ruleForm.content = this.ruleForm.spwb;
      }
      // 批量修改的接口
      this.selectTableRow.forEach(t => {
        params.id += t.id + ','
      });
      params.id = params.id.substr(0, params.id.length - 1);

      // 观看直播时间
      formData.append('id', params.id);
      formData.append('content', this.ruleForm.content);
      formData.append('task_nick', this.$route.query.name);
      formData.append('app_type', this.$route.query.type);
      formData.append('search_str', this.ruleForm.search_str);
      formData.append('to_num', this.ruleForm.to_num);
      if (this.$route.query.name === '指定转发评论') {
        formData.append('likes', this.ruleForm.likes);
      }
      formData.append('to_file', this.toFileList[0]);
      formData.append('bulk', 1);
      formData.append('at_me', this.ruleForm.at_me);
      const url = 'http://112.74.103.26/api/task/dev/';
      // const url = 'http://192.168.1.52:8888/api/task/dev/';
      this.makeXMLHttpRequest(url, formData, this);
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
              _this.timeout = 3;
              var int = window.setInterval(() => {
                if (_this.timeout > 0) {
                  _this.timeout--;
                } else {
                  window.clearInterval(int);
                }
              }, 1000);
            } else {
              _this.$message({
                message: request.response,
                type: 'error',
                duration: 10000,
                showClose: true
              });
            }
          } else {
            _this.$message({
              message: '执行失败！',
              type: 'success'
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
.content-title {
  width: 300px;
  position: absolute;
  left: 0px;
  top: -3px;
}
.content-title-gn {
  width: 120px;
}
.box {
  padding: 110px 40px 0 40px;
}
.search_str {
  margin-top: 30px;
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
  .zxBtn {
    color: #fff;
    border-color: #e68048;
    background-color: #e68048;
    width: 200px;
    margin-left: 100px;
  }
  .ruleForm {
    width: 650px;
    /deep/ .el-table, /deep/ .el-input, /deep/.el-textarea, /deep/ .el-input-number {
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
  .plnr {
    display: flex;
    .xzmb {
      width: 200px;
      border: 1px solid #ccc;
      text-align: center;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 0;
      background-color: #53bce0;
      color: #fff;
    }
  }
  // /deep/ .el-upload-list {
  //   margin-left: -193px;
  // }
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

@media screen and (max-width:770px ) {
  .to-list {
    top: 88px;
  }
  .box {
    padding: 40px 0 0 0;
  }
  .content-title-gn {
    width: 50px;
    // margin-top: -50px;
  }
  .search_str {
    margin-top: 10px;
    .ruleForm {
      width: 400px;
      /deep/ .el-table, /deep/ .el-input, /deep/.el-textarea, /deep/ .el-input-number {
        width: 200px;
        /deep/ .el-input__inner {
          text-align: left;
        }
      }
    }
    .djsc {
      width: 200px;
    }
    .plnr {
      .xzmb {
        width: 100px;
      }
    }
    /deep/ .el-upload-list {
      margin-left: -100px;
    }
    .zxfs {
      div {
        width: 100px;
      }
    }
    .zxBtn {
      margin-left: 0;
    }
  }
}
</style>
