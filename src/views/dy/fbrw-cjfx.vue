<template>
  <div>
    <div class="search_str" v-show="$parent.isClick">
      <el-form label-position="right" :model="ruleForm" label-width="160px" :rules="rules" ref="ruleForm" class="ruleForm">
        <!--  -->
        <el-form-item label="选择设备：" prop="id">
          <el-select v-model="ruleForm.id" placeholder="请选择设备" style="width: 400px">
            <el-option
              v-for="item in $parent.tableData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抖音号：" prop="search_str">
          <el-input type="text" v-model="ruleForm.search_str" placeholder="请输入抖音号"></el-input>
        </el-form-item>
        <!-- 执行方式 -->
        <div class="required">*</div><el-form-item label="执行方式：">
          <div class="zxfs" style="display: flex;">
            <div :class="{ active: isActive }" @click="implement(0)">立即执行</div>
            <div :class="{ active: !isActive }" @click="implement(1)">定时执行</div>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-date-picker
            v-model="ruleForm.task_time"
            v-show="timing"
            type="datetime"
            :picker-options="pickerOptions"
            placeholder="选择执行时间"
            value-format="yyyy-MM-dd HH:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="zxBtn" @click="onSubmit">执行</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="sjForm" v-show="!$parent.isClick">
      <el-row :gutter="10" class="btns">
        <el-col :xs="5" :sm="4" :md="3" :lg="2">
          <el-button class="sjfx" type="warning" @click="exportExcel"><i class="el-icon-upload2"></i>导出线索</el-button>
        </el-col>
        <el-col :xs="5" :sm="4" :md="3" :lg="2">
          <el-upload
            class="upload-demo"
            action="http://112.74.103.26/api/task/kword/"
            :headers="myHeaders"
            name="to_file"
            :data="uploadParms"
            multiple
            :show-file-list=false
            accept=".xls, .xlsx"
            :on-success="onSuccess"
            :file-list="fileList">
            <el-button  class="sjfx" type="primary"><i class="el-icon-download"></i>导入线索</el-button>
          </el-upload>
        </el-col>
        <el-col :xs="5" :sm="4" :md="3" :lg="2">
          <el-button class="sjfx" type="warning" @click="letter">关注+私信</el-button>
        </el-col>
        <el-col :xs="5" :sm="4" :md="3" :lg="2">
          <el-button class="sjfx" type="warning" @click="importKeyword(current1)"><i class="el-icon-refresh"></i>刷新</el-button>
        </el-col>
        <el-col :xs="5" :sm="4" :md="3" :lg="2">
          <el-button class="sjfx" type="warning" @click="deleteMore"><i class="el-icon-delete"></i>批量删除</el-button>
        </el-col>
      </el-row>
      <base-table ref="sbTable" :columns="tableColumns" :data="xsTableData" selection height="530" @selection-change="selectionRow1" style="margin-top: 10px;">
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </base-table>
      <el-pagination
        class="fx-pagenation"
        @current-change="handleCurrentChange1"
        layout="prev, pager, next, total, jumper"
        :total="total1"
        :current-page="current1"
      ></el-pagination>
      <p>温馨提示：导入的数据会储存48小时后自动清除</p>
    </div>
    <privateLetter ref="privateLetterRef"></privateLetter>
  </div>
</template>

<script>
import privateLetter from '@/modal/privateLetter';
import wdsbServer from '@/api/wdsb-server.js';

export default {
  name: 'cjfxModal',
  components: { privateLetter },
  data () {
    return {
      total1: 1,
      current1: 1,
      isActive: true,
      timing: false,
      fileList: [],
      ruleForm: {
        id: '',
        search_str: '',
        task_time: '',
        task_nick: this.$route.query.name,
        app_type: this.$route.query.type,
        bulk: 1
      },
      uploadParms: { zbjcj: 1 },
      myHeaders: { authorization: window.sessionStorage.getItem('token') },
      btnSize: window.sessionStorage.getItem('fullWidth') > 770 ? '' : 'mini',
      checkList: [],
      checkList1: [],
      // 导出数据倒计时
      timeout: 0,
      tableColumns: [
        {
          prop: 'dy_num',
          label: '主播抖音号'
        },
        {
          prop: 'user_nick',
          label: '用户昵称'
        },
        {
          prop: 'user_num',
          label: '用户抖音号'
        }
      ],
      // 表单必填校验
      rules: {
        id: { required: true, message: '必填', trigger: 'blur' },
        search_str: { required: true, message: '必填', trigger: 'blur' },
        content: { required: true, message: '必填', trigger: 'blur' },
        check_time: { required: true, message: '必填', trigger: 'blur' }
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      xsTableData: []
    }
  },
  methods: {
    // 关键词搜索下载文件
    exportExcel () {
      if (this.timeout === 0) {
        this.exportExcel1();
      } else {
        this.$message.warning(`请勿频繁操作，请${this.timeout}s后重试`);
      }
    },
    exportExcel1 () {
      wdsbServer.kwordSearch({ zbjcj: 1, out_xls: 1 }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '导出成功！',
            type: 'success'
          });
          const goUrl = 'http://112.74.103.26/media/' + res.data.msg1;
          window.open(goUrl, '_self');
          this.timeout = 30;
          var int = window.setInterval(() => {
            if (this.timeout > 0) {
              this.timeout--;
            } else {
              window.clearInterval(int);
            }
          }, 1000);
        } else if (res.status === 201) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      }).catch(error => {
        if (error.request.status === 500) {
          this.$message.error('服务异常！')
        } else {
          this.$message.error(error.request.response);
        }
      });
    },
    // 导入数据
    onSuccess (response) {
      this.$message.success('导入成功！');
      this.current1 = 1;
      this.importKeyword(1);
    },
    importKeyword (page) {
      wdsbServer.keySearch({ zbjcj: 1, page: page }).then(res => {
        if (res.status === 200) {
          this.xsTableData = res.data.results;
          this.total1 = res.data.count;
        }
      }).catch(error => {
        if (error.request.status === 500) {
          this.$message.error('服务异常！')
        } else {
          this.$message.error(error.request.response);
        }
      });
    },
    letter () {
      if (this.checkList1.length === 0) {
        this.$message.warning('请选择用户！')
      } else {
        var num = '';
        this.checkList1.forEach(t => {
          num += t.user_num + '|'
        });
        num = num.substr(0, num.length - 1);
        this.$refs.privateLetterRef.open(this.$parent.tableData, num);
      }
    },
    deletes (id) {
      wdsbServer.kwordSearch({ del_id: 1, id_list: id }).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '删除成功！',
            type: 'success'
          });
          this.importKeyword(this.current1);
        } else if (res.status === 201) {
          this.$message({
            message: res.data.msg,
            type: 'error'
          });
        }
      }).catch(error => {
        if (error.request.status === 500) {
          this.$message.error('服务异常！')
        } else {
          this.$message.error(error.request.response);
        }
      });
    },
    deleteRow (row) {
      this.deletes(row.id)
    },
    // 线索表格复选框选中
    selectionRow1 (data) {
      this.checkList1 = data;
    },
    deleteMore () {
      var id = '';
      this.checkList1.forEach(t => {
        id += t.id + ','
      });
      id = id.substr(0, id.length - 1);
      this.deletes(id)
    },
    handleCurrentChange1 (val) {
      this.current1 = val;
      this.$refs.sbTable.handleCurrentChange();
      this.importKeyword(val);
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
    onSubmit () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (!this.isActive) {
            if (!this.ruleForm.task_time) {
              this.$message.warning('请选择定时执行的时间');
            } else if (new Date(this.ruleForm.task_time).getTime() < new Date().getTime() + 600000) {
              this.$message.warning('请选择十分钟后的任意时间');
            } else {
              this.ljzx();
            }
          } else {
            this.ljzx();
          }
        } else {
          return false;
        }
      });
    },
    ljzx () {
      // 立即执行不需要传task_time
      wdsbServer.putDev(this.ruleForm).then(res => {
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
      }).catch(error => {
        if (error.request.status === 500) {
          this.$message.error('服务异常！')
        } else {
          this.$message.error(error.request.response);
        }
      });
    }
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.sjForm {
  margin-top: 50px;
  .btns {
    .sjfx, /deep/ .el-input__inner {
      background-color: #e68048;
      border-color: #e68048;
      color: #fff;
      width: 106px;
      margin-right: 10px;
    }
  }
  .el-table {
    margin-top: 20px;
  }
  p {
    margin-top: 15px;
    color: #9c9a9a;
  }
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
.zxBtn {
  color: #fff;
  border-color: #e68048;
  background-color: #e68048;
  width: 200px;
  margin-left: 100px;
}
.ruleForm {
  width: 650px;
  margin-top: 45px;
  /deep/ .el-table, /deep/ .el-input, /deep/.el-textarea, /deep/ .el-input-number {
    width: 400px;
    /deep/ .el-input__inner {
      text-align: left;
    }
  }
}
/deep/ .el-form-item__label {
  font-size: 15px;
  color: #000;
}
.required {
  position: relative;
  left: 64px;
  top: 27px;
  color: #f56c7e;
  font-size: 15px;
}

@media screen and (max-width:770px ) {
  .sjForm {
    .btns {
      .sjfx, /deep/ .el-input__inner {
        width: 72px;
      }
      /deep/ .el-button {
        span {
          margin-left: -13px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
