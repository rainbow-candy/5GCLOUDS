<template>
  <div class="box">
    <img src="@/assets/imgs/title-gjczq.png" alt class="content-title" v-show="isActive"/>
    <img src="@/assets/imgs/title-xsfx.png" alt class="content-title" v-show="!isActive"/>
    <div>
      <div class="to-home" @click="toHome">
        <i class="el-icon-refresh-left"></i>返回上级
      </div>
      <img src="@/assets/imgs/newlogo.png" alt class="logo-5g"/>
      <img src="@/assets/imgs/dy-logo.png" alt class="logo" v-if="this.$route.query.type === 'dy'"/>
      <img src="@/assets/imgs/ks-logo.png" alt class="logo" v-if="this.$route.query.type !== 'dy'"/>
    </div>
    <div class="content">
      <div class="tab">
        <img src="@/assets/imgs/btn-gjczq.png" class="span1" @click="tabChange1()"/>
        <img src="@/assets/imgs/btn-xsfx.png" class="span2" @click="tabChange2()"/>
      </div>
      <!-- 关键词摘取 -->
      <div v-show="isActive" class="gjcForm">
        <el-form label-position="left" label-width="110px" :model="form" :rules="rules" ref="gjcForm">
          <el-form-item label="选择设备：" prop="id_list">
            <el-select v-model="form.id_list" placeholder="请选择设备" style="width: 100%">
              <el-option
                v-for="item in tableData"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键词：" prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="获赞数大于：" prop="to_num">
            <el-input-number v-model="form.to_num" controls-position="right" :min="1" label="请输入获赞数" style="width: 100%;"></el-input-number>
          </el-form-item>
          <el-form-item label="采集数量：" prop="likes">
            <el-input-number v-model="form.likes" controls-position="right" :min="1" label="请输入采集数量" style="width: 100%"></el-input-number>
          </el-form-item>
        </el-form>
        <div class="submitZx">
          <el-button type="primary" @click="onSubmit">执行</el-button>
        </div>
      </div>
      <!-- 数据分析 -->
      <div v-show="!isActive" class="sjForm">
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
            <el-button class="sjfx" type="warning" @click="importKeyword(current1);"><i class="el-icon-refresh"></i>刷新</el-button>
          </el-col>
          <el-col :xs="5" :sm="4" :md="3" :lg="2">
            <el-button class="sjfx" type="warning" @click="deleteMore"><i class="el-icon-delete"></i>批量删除</el-button>
          </el-col>
          <el-col :xs="5" :sm="4" :md="3" :lg="2">
            <el-input class="gjcSearch"
            placeholder="关键词搜索"
            v-model="input4" @keyup.enter.native="querygjc(1)">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          </el-col>
        </el-row>
        <base-table ref="sbTable" :columns="tableColumns" :data="xsTableData" selection height="530" @selection-change="selectionRow1">
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </base-table>
        <!-- <base-table ref="sbTable" :columns="tableColumns2" :data="tableData" selection  height="530" @selection-change="selectionRow1" v-if="this.$route.query.type !== 'dy'">
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-delete" @click="deleteRow(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </base-table> -->
        <el-pagination
          class="fx-pagenation"
          @current-change="handleCurrentChange1"
          layout="prev, pager, next, total, jumper"
          :total="total1"
          :current-page="current1"
        ></el-pagination>
        <p>温馨提示：导入的数据会储存48小时后自动清除</p>
      </div>
    </div>
    <privateLetter ref="privateLetterRef"></privateLetter>
  </div>
</template>

<script>
import privateLetter from '@/modal/privateLetter';
import wdsbServer from '@/api/wdsb-server.js';

export default {
  components: { privateLetter },
  data () {
    return {
      total: 1,
      current: 1,
      total1: 1,
      current1: 1,
      isActive: true,
      uploadIng: false,
      fileList: [],
      input4: '',
      form: {
        name: '',
        region: '',
        id_list: '',
        type: '',
        to_num: 1,
        likes: 1
      },
      myHeaders: { authorization: window.sessionStorage.getItem('token') },
      btnSize: window.sessionStorage.getItem('fullWidth') > 770 ? '' : 'mini',
      checkList: [],
      checkList1: [],
      // 导出数据倒计时
      timeout: 0,
      // 设备
      sbColumns: [{
        prop: 'name',
        label: '设备'
      },
      {
        prop: 'group',
        label: '组别',
        filter: true,
        filterData: [],
        width: 200
      }],
      tableColumns: [],
      tableData: [],
      xsTableData: [],
      // 表单必填校验
      rules: {
        name: { required: true, message: '必填', trigger: 'blur' },
        id_list: { required: true, message: '必填', trigger: 'blur' },
        to_num: { required: true, message: '必填', trigger: 'blur' },
        likes: { required: true, message: '必填', trigger: 'blur' }
      }
    }
  },
  methods: {
    toHome () {
      this.$router.go(-1)
    },
    // 关键词搜索执行
    onSubmit () {
      this.$refs.gjcForm.validate((valid) => {
        if (valid) {
          const params = {
            id_list: this.form.id_list,
            key_w: this.form.name,
            key_index: 1,
            to_num: this.form.to_num,
            likes: this.form.likes
          }
          wdsbServer.kwordSearch(params).then(res => {
            if (res.status === 200) {
              this.$message({
                message: res.data,
                type: 'success'
              });
              this.uploadIng = true;
            } else if (res.status === 201) {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(error => {
            if (error.request.status === 500) {
              this.$message.error('服务异常！')
            } else {
              this.$message.error(error.request.response);
            }
          });
        }
      });
    },
    // 关键词搜索下载文件
    exportExcel () {
      if (this.timeout === 0) {
        this.exportExcel1();
      } else {
        this.$message.warning(`请勿频繁操作，请${this.timeout}s后重试`);
      }
    },
    exportExcel1 () {
      wdsbServer.kwordSearch({ out_xls: 1 }).then(res => {
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
      wdsbServer.getKword({ page: page }).then(res => {
        if (res.status === 200) {
          this.xsTableData = res.data.results;
          this.total1 = res.data.count;
          this.getFilterData(this.xsTableData, 'tableColumns', 'device');
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
      if (!this.isActive) {
        this.isActive = true;
      }
    },
    tabChange2 () {
      if (this.isActive) {
        this.isActive = false;
      }
      this.importKeyword();
    },
    letter () {
      if (this.checkList.length === 0) {
        this.$message.warning('请选择用户！')
      } else {
        var num = '';
        this.checkList.forEach(t => {
          num += t.dy_num + '|'
        });
        num = num.substr(0, num.length - 1);
        this.$refs.privateLetterRef.open(this.tableData, num);
      }
    },
    querygjc (page) {
      wdsbServer.keySearch({ key_clue: this.input4, page: page }).then(res => {
        if (res.status === 200) {
          this.xsTableData = res.data.results;
          this.total1 = res.data.count;
          this.getFilterData(this.xsTableData, 'tableColumns', 'device');
        }
      }).catch(error => {
        if (error.request.status === 500) {
          this.$message.error('服务异常！')
        } else {
          this.$message.error(error.request.response);
        }
      });
    },
    // 判断关键词是否正在执行
    isImplement () {
      wdsbServer.isImplement().then(res => {
        if (res.status === 200) {
          console.log(res);
          if (res.data.msg.length > 0) {
            this.uploadIng = true;
          }
        }
      }).catch(error => {
        if (error.request.status === 500) {
          this.$message.error('服务异常！')
        } else {
          this.$message.error(error.request.response);
        }
      });
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
    deleteMore () {
      var id = '';
      this.checkList.forEach(t => {
        id += t.id + ','
      });
      id = id.substr(0, id.length - 1);
      this.deletes(id)
    },
    // 关键词表格复选框选中
    selectionRow (data) {
      this.checkList = data;
      this.loading = false;
    },
    handleCurrentChange (val) {
      this.current = val;
      this.getList(val);
    },
    // 线索表格复选框选中
    selectionRow1 (data) {
      this.checkList1 = data;
    },
    handleCurrentChange1 (val) {
      this.current1 = val;
      this.$refs.sbTable.handleCurrentChange();
      if (this.input4) {
        this.querygjc(val);
      } else {
        this.importKeyword(val);
      }
    },
    getList (page) {
      wdsbServer.myDev({ mydev_online: 1, page: page, page_size: 100 }).then(res => {
        if (res.status === 200) {
          if (res.data.results.length > 0) {
            this.total = res.data.count;
            this.tableData = res.data.results;
            this.getFilterData(this.tableData, 'sbColumns', 'group');
          }
        }
      }).catch(error => {
        if (error.request.status === 500) {
          this.$message.error('服务异常！')
        } else {
          this.$message.error(error.request.response);
        }
      });
    },
    // 获取筛选数组
    getFilterData (data, columns, name) {
      // 空对象
      var obj = {}
      const newData = data.concat();
      this[columns][1].filterData = [];
      // 遍历
      for (var i = 0; i < newData.length; i++) {
        if (newData[i][name]) {
          if (obj[newData[i][name]] === undefined) {
            // 随便贴一个不为空的值
            obj[newData[i][name]] = 1;
          } else {
            newData.splice(i--, 1)
          }
        } else {
          newData.splice(i--, 1)
        }
      }
      newData.forEach((item, index) => {
        this[columns][1].filterData.push(
          Object.assign({}, item, { text: item[name], value: item[name] })
        )
      })
    }
  },
  mounted () {
    if (this.$route.query.type === 'dy') {
      this.tableColumns = [
        {
          prop: 'dy_num',
          label: '用户抖音号',
          width: 200
        },
        {
          prop: 'taskKey',
          label: '关键词',
          width: 200
        },
        {
          prop: 'content',
          label: '评论内容',
          minWidth: 200
        }
      ];
    } else {
      this.tableColumns = [{
        prop: 'name',
        label: '快手号'
      },
      {
        prop: 'num',
        label: '评论内容'
      },
      {
        prop: 'taskKey',
        label: '关键词',
        filter: true,
        filterData: []
      }]
    }
    this.getList();
    // 是否正在执行
    // this.isImplement();
    // 空对象
    var obj1 = {}
    const newData1 = this.tableData.concat();
    // 遍历
    for (let i = 0; i < newData1.length; i++) {
      if (obj1[newData1[i].taskKey] === undefined) {
        // 随便贴一个不为空的值
        obj1[newData1[i].taskKey] = 1;
      } else {
        newData1.splice(i--, 1)
      }
    }
    // 关键词
    newData1.forEach((item, index) => {
      this.tableColumns2[2].filterData.push(
        Object.assign({}, item, { text: item.taskKey, value: item.taskKey })
      )
    })
  }
}
</script>

<style lang="less" scoped>
.box {
  .content-title {
    width: 300px;
    position: absolute;
    left: -2px;
    top: -4px;
  }
}
.content {
  padding: 130px 40px 0 40px;
  .tab {
    display: flex;
    margin-top: 20px;
    // 位置修改
    position: absolute;
    top: 24px;
    left: 265px;
    img {
      width: 170px;
      cursor: pointer;
    }
    .span2 {
      margin-left: -37px;
    }
  }
  .gjcForm {
    width: 500px;
    margin-top: 50px;
    /deep/ .el-form-item__label {
      color: black;
      font-weight: 600;
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
    /deep/ .el-button {
      color: #fff;
      border-color: #e68048;
      background-color: #e68048;
      width: 200px;
      margin-left: 100px;
    }
    /deep/ .el-pagination {
      bottom: -15px;
    }
    .submitZx {
      width: 100%;
      text-align: center;
    }
  }
  .sjForm {
    .btns {
      .sjfx, /deep/ .el-input__inner {
        background-color: #e68048;
        border-color: #e68048;
        color: #fff;
        width: 106px;
        margin-right: 10px;
      }
      .gjcSearch {
        width: 140px;
        /deep/ .el-input__inner {
          background-color: #fff;
          border-color: #ccc;
          color: black;
          width: 100%;
          margin-right: 10px;
        }
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
  .required {
    position: relative;
    left: -9px;
    top: 27px;
    color: #f56c7e;
    font-size: 15px;
  }
}

@media screen and (max-width:770px ) {
  .content {
    padding: 82px 0 0 10px;
    .tab {
      top: 13px;
      left: 0px;
      img {
        width: 70px;
        height: 24px;
      }
      .span2 {
        margin-left: -15px;
      }
    }
    .gjcForm {
      width: 90vw;
      .submitZx {
        margin-top: 40px;
      }
    }
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
        .gjcSearch {
          width: 120px;
        }
      }
    }
  }
}
/deep/ .el-input-number .el-input__inner {
  text-align: left;
}
</style>
