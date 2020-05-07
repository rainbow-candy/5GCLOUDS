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
      <el-form label-position="right" :model="ruleForm" label-width="170px" :rules="rules" ref="ruleForm" style="width: 650px;" class="ruleForm">
        <div class="required">*</div><el-form-item label="选择设备：">
          <i class="el-icon-plus" @click="xzsb"></i>
          <!-- <base-table :columns="sbColumns" :data="tableData" selection v-show="sbShow" height="182" @selection-change="selectionRow"></base-table> -->
        </el-form-item>
        <el-form-item label="点赞数量：" v-if="this.$route.query.name === '推荐点赞' || this.$route.query.name === '同城点赞'" prop="to_num">
          <el-input-number v-model="ruleForm.to_num" controls-position="right" :min="1" label="请输入点赞数量"></el-input-number>
        </el-form-item>
        <el-form-item label="搜索内容（大类）：" v-if="this.$route.query.name === '转发评论' || this.$route.query.name === '搜索关注'" prop="search_str">
          <el-input type="text" v-model="ruleForm.search_str" minlength="1" placeholder="请输入搜索内容"></el-input>
        </el-form-item>
        <el-form-item label="搜索抖音ID号：" v-if="this.$route.query.name === '指定转发评论' || this.$route.query.name === '粉丝关注'" prop="search_str">
          <el-input type="text" v-model="ruleForm.search_str" minlength="1" maxlength="15" show-word-limit placeholder="请输入抖音ID号"></el-input>
        </el-form-item>
        <el-form-item label="评论内容：" v-if="this.$route.query.name === '推荐点赞' || this.$route.query.name === '同城点赞'">
          <el-input type="textarea" v-model="ruleForm.content" :rows="4" :maxlength="maxlength" show-word-limit placeholder="评论条数以“|”分隔" @input="plnrChange"></el-input>
        </el-form-item>
        <el-form-item label="关注数量：" v-if="this.$route.query.name === '搜索关注' || this.$route.query.name === '粉丝关注'" prop="to_num">
          <el-input-number v-model="ruleForm.to_num" controls-position="right" :min="1" label="请输入关注数量"></el-input-number>
          <!-- <el-input type="number" v-model="to_num"></el-input> -->
        </el-form-item>
        <el-form-item label="私信内容：" v-if="this.$route.query.name === '搜索关注' || this.$route.query.name === '粉丝关注'">
          <el-input type="textarea" v-model="ruleForm.content" :rows="3" placeholder="请输入私信内容"></el-input>
        </el-form-item>
        <!-- <el-form-item label="选择素材：" v-if="this.$route.query.name === '上传视频'">
          <i class="el-icon-plus" @click="xzsc"></i>
        </el-form-item> -->
        <div v-if="this.$route.query.name.indexOf('转发评论') !== -1">
          <el-form-item label="转发数量：" prop="to_num">
            <el-input-number v-model="ruleForm.to_num" controls-position="right" :min="1" label="请输入转发数量"></el-input-number>
          </el-form-item>
          <el-form-item label="评论(@抖音号)：">
            <el-input type="textarea" v-model="ruleForm.content" :rows="3" maxlength="100" show-word-limit placeholder="输入网红抖音号即可"></el-input>
          </el-form-item>
        </div>
        <!-- 直播助力 -->
        <div v-if="this.$route.query.name === '直播助力'">
          <el-form-item label="直播间号：" prop="search_str">
            <el-input type="text" v-model="ruleForm.search_str" placeholder="请输入直播间号"></el-input>
          </el-form-item>
          <div class="required" style="left: 60px;">*</div><el-form-item label="直播间转发：">
          <div class="zxfs" style="display: flex;">
            <div :class="{ active: isActives }" @click="zbjzf('0')">否</div>
            <div :class="{ active: !isActives }" @click="zbjzf('1')">是</div>
          </div>
        </el-form-item>
          <el-form-item label="弹幕文案：">
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
              <div class="djsc">选择excel文件</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="观看时间："  prop="to_num">
            <el-input-number v-model="ruleForm.to_num" controls-position="right" :min="5" :max="240" label="请输入观看时间"></el-input-number>
          </el-form-item>
        </div>
        <!-- 上传视频 -->
        <div v-if="this.$route.query.name === '上传视频'">
          <el-form-item label="视频文本：" prop="spwb">
            <el-input v-model="ruleForm.spwb" maxlength="30" show-word-limit placeholder="请输入视频文本"></el-input>
          </el-form-item>
          <el-form-item label="#话题：">
            <el-input v-model="ruleForm.spht" maxlength="10" show-word-limit @input="htKeyup" placeholder="禁止输入特殊字符和空格"></el-input>
          </el-form-item>
          <el-form-item label="@好友：">
            <el-input v-model="ruleForm.sphy" maxlength="10" show-word-limit @input="hyKeyup" placeholder="禁止输入特殊字符和空格"></el-input>
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
        <!-- 执行方式 -->
        <div class="required">*</div><el-form-item label="执行方式：">
          <div class="zxfs" style="display: flex;">
            <div :class="{ active: isActive }" @click="implement('0')">立即执行</div>
            <div :class="{ active: !isActive }" @click="implement('1')">定时执行</div>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="ruleForm.time"
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
      <div style="position: relative;height: 468px;border-left:1px solid #ccc;" v-show="sbShow">
        <base-table :columns="sbColumns" :data="tableData" selection height="420" @selection-change="selectionRow" style="max-width: 550px;margin-left: 70px;"></base-table>
        <el-pagination
          class="fbrw-pagenation"
          @current-change="handleCurrentChange"
          layout="prev, pager, next, total, jumper"
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
      sbShow: false,
      isActive: true,
      isActives: true,
      timing: false,
      ruleForm: {
        time: '',
        search_str: '',
        to_num: '',
        content: '',
        spwb: '',
        spht: '',
        sphy: ''
      },
      fileList: [],
      toFileList: [],
      // 表单必填校验
      rules: {
        to_num: { required: true, message: '必填', trigger: 'blur' },
        spwb: { required: true, message: '必填', trigger: 'blur' },
        // toFileList: { required: true, message: '必填' },
        search_str: { required: true, message: '必填', trigger: 'blur' }
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
          label: '组别（可筛选）',
          filter: true,
          filterData: [],
          width: 180
        },
        {
          prop: 'stats',
          label: '工作状态',
          sortable: true,
          backColor: true
        }
      ],
      tableData: [],
      selectTableRow: [],
      total: 0,
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
    // 直播间是否转发
    zbjzf (num) {
      if (this.num !== num) {
        this.isActives = !this.isActives
      }
      this.num = num;
      if (num === '1') {
        this.$refs.forwardModal.open();
      }
    },
    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.ruleForm.time) {
            const d = new Date(this.ruleForm.time);
            const resDate = d.getFullYear() + '-' + this.p((d.getMonth() + 1)) + '-' + this.p(d.getDate())
            const resTime = this.p(d.getHours()) + ':' + this.p(d.getMinutes()) + ':' + this.p(d.getSeconds())
            this.ruleForm.task_time = resDate + ' ' + resTime;
            if (this.$route.query.name === '上传视频' || this.$route.query.name === '直播助力') {
              this.submit(this.ruleForm.task_time);
            } else {
              this.ljzx(this.ruleForm.task_time);
            }
          } else {
            if (this.$route.query.name === '上传视频' || this.$route.query.name === '直播助力') {
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
        bulk: 1
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
      wdsbServer.putDev(params).then(res => {
        if (res.status === 200) {
          if (res.data === '') {
            this.$message({
              message: '执行成功！',
              type: 'success'
            });
          } else {
            this.$message({
              message: res.data,
              type: 'error',
              duration: 3000,
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
    // 切换分页
    handleCurrentChange (val) {
      this.current = val;
      this.getList(val);
    },
    getList (page) {
      this.tableData = [];
      wdsbServer.myDev({ mydev: 1, page: page }).then(res => {
        if (res.status === 200) {
          res.data.results.forEach((t) => {
            switch (t.stats) {
              case 0:
                t.stats = '未执行';
                break;
              case 1:
                t.stats = '正在执行';
                break;
              case 2:
                t.stats = '执行失败';
                break;
              default:
                t.stats = '执行成功';
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
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    // 上传视频
    submit (time) {
      if (this.toFileList.length === 0) {
        this.$message.warning('请上传文件')
      } else {
        const params = {
          id: ''
        };
        const formData = new FormData();
        // 立即执行不需要传task_time
        if (!this.isActive) {
          formData.append('task_time', time);
          if (time === undefined) {
            this.$message.warning('请选择定时执行的时间');
          }
        }
        console.log(this.selectTableRow);
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
          this.ruleForm.content = this.ruleForm.spwb + ',,,,,' + this.ruleForm.spht + ',,,,,' + this.ruleForm.sphy;
        }
        // 观看直播时间
        formData.append('id', params.id);
        formData.append('task_nick', this.$route.query.name);
        formData.append('app_type', this.$route.query.type);
        formData.append('content', this.ruleForm.content);
        if (this.$route.query.name === '直播助力') {
          formData.append('to_num', this.ruleForm.to_num);
          formData.append('search_str', this.ruleForm.search_str);
        }
        formData.append('to_file', this.toFileList[0]);
        formData.append('bulk', 1);
        const url = 'http://192.168.1.52:8888/api/task/dev/';
        this.makeXMLHttpRequest(url, formData, this)
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
              type: 'success'
            });
          }
        }
      };
      request.open('POST', url);
      request.setRequestHeader('authorization', window.sessionStorage.getItem('token'));
      request.send(data);
    }
  },
  mounted () {
    this.getList(1);
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
  left: 73px;
  top: 27px;
  color: #f56c7e;
  font-size: 15px;
}
</style>
