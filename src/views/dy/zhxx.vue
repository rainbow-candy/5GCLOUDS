<template>
  <div class="box">
    <div>
      <img src="@/assets/imgs/title-zhxx.png" alt class="content-title"/>
      <img src="@/assets/imgs/newlogo.png" alt style="width: 50px;position: absolute;right: 170px;top: 20px;"/>
      <div class="to-home" @click="toHome" title="返回抖音首页"><i class="el-icon-s-home"></i>返回抖音首页</div>
      <img src="@/assets/imgs/dy-logo.png" alt="" class="logo">
    </div>
    <div class="content">
      <div class="btn">
        <el-button class="refresh-btn"><i class="el-icon-refresh"></i>刷新</el-button>
        <el-input
          placeholder="请输入抖音号"
          v-model="input4">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </div>
      <base-table :columns="tableColumns" :data="tableData">
      </base-table>
    </div>
    <addGroup ref="addGroup"></addGroup>
  </div>
</template>

<script>
import addGroup from '@/modal/addGroup';

export default {
  components: { addGroup },
  data () {
    return {
      input4: '',
      tableColumns: [
        {
          prop: 'name',
          label: '抖音号'
        },
        {
          prop: 'task',
          label: '设备',
          filter: true,
          filterData: []
        },
        {
          prop: 'num',
          label: '获赞数量'
        },
        {
          prop: 'taskKey',
          label: '关注数量'
        },
        {
          prop: 'zt',
          label: '粉丝数量'
        },
        {
          prop: 'qk',
          label: '日期',
          sortable: true
        }
      ],
      tableData: [{
        name: '1号',
        num: 'XIAOMI',
        taskKey: '1',
        zt: '正在执行',
        qk: '在线'
      }, {
        name: '2号',
        num: 'XIAOMI',
        taskKey: '2',
        zt: '正在执行',
        qk: '在线'
      }]
    }
  },
  methods: {
    toHome () {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  padding: 100px 40px 0 40px;
  .content-title {
    width: 300px;
    position: absolute;
    left: -4px;
    top: -3px;
  }
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
  margin-top: 30px;
  .btn {
    margin-bottom: 20px;
    i {
      margin-right: 10px;
    }
  }
  /deep/ .el-input {
    width: 150px;
    margin-left: 20px;
  }
  .add-btn {
    color: #fff;
    border-color: #53bce0;
    background-color: #53bce0;
  }
  .refresh-btn {
    color: #fff;
    border-color: #e68048;
    background-color: #e68048;
  }
}
</style>
