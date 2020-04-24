<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-fbrw.png" alt class="content-title"/>
      <img :src="this.$route.query.src" alt style="width:120px;" />
      <img src="@/assets/imgs/newlogo.png" alt style="width: 50px;position: absolute;right: 170px;top: 20px;"/>
      <div class="to-home" @click="toHome">
        <div v-if="this.$route.query.type === 'dy'">
          <i class="el-icon-s-home"></i>返回抖音首页
        </div>
        <div v-if="this.$route.query.type !== 'dy'">
          <i class="el-icon-s-home"></i>返回快手首页
        </div>
      </div>
      <img src="@/assets/imgs/dy-logo.png" alt class="logo" v-if="this.$route.query.type === 'dy'" />
      <img src="@/assets/imgs/ks-logo.png" alt class="logo" v-if="this.$route.query.type !== 'dy'" />
    </div>
    <div class="content">
      <el-form label-position="left" label-width="100px">
        <el-form-item label="选择设备：">
          <i class="el-icon-plus" @click="xzsb"></i>
          <base-table :columns="sbColumns" :data="tableData" selection v-show="sbShow" height="182" @selection-change="selectionRow"></base-table>
        </el-form-item>
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
  </div>
</template>

<script>
import wdsbServer from '@/api/wdsb-server.js';

export default {
  data () {
    return {
      sbShow: false,
      isActive: true,
      timing: false,
      num: '0',
      time: '',
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
    toHome () {
      this.$router.go(-2)
    },
    // 选择设备
    xzsb () {
      this.sbShow = !this.sbShow
    },
    // 表格复选框选中
    selectionRow (data) {
      this.selectTableRow = data;
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
        this.ljzx(this.task_time);
      } else {
        this.ljzx();
      }
    },
    // 立即执行
    ljzx (time) {
      const params = {
        bulk: '1',
        id: '',
        task_nick: this.$route.query.name
      };
      if (time) {
        params.task_time = time;
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
      const url = 'task/my_dev/' + params.id + '/';
      wdsbServer.putDev(url, params).then(res => {
        if (res.status === 200) {
          this.$message({
            message: '执行成功！',
            type: 'success'
          });
          this.selectTableRow = [];
        }
      })
    },
    p (s) {
      return s < 10 ? '0' + s : s
    },
    // 获取筛选数组
    getFilterData (data) {
      // 空对象
      var obj = {}
      const newData = data.concat();
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
          res.data.forEach((t) => {
            t.device.group = t.group;
            t.device.id = t.id;
            this.tableData.push(t.device);
          });
          this.getFilterData(this.tableData);
        }
      })
    }
  },
  mounted () {
    this.getList();
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
.content {
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
  /deep/ .el-table {
    width: 300px;
  }
  /deep/ .el-form-item__label {
    font-size: 15px;
    color: black;
  }
  .zxfs {
    display: flex;
    div {
      width: 80px;
      border: 1px solid #ccc;
      text-align: center;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
    }
    .active {
      background-color: #53bce0;
    }
  }
}
</style>
