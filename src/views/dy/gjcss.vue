<template>
  <div class="box">
    <img src="@/assets/imgs/title-gjczq.png" alt class="content-title" v-show="isActive"/>
    <img src="@/assets/imgs/title-sjfx.png" alt class="content-title" v-show="!isActive"/>
    <div>
      <div class="to-home" @click="toHome">
        <div v-if="this.$route.query.type === 'dy'"><i class="el-icon-s-home"></i>返回抖音首页</div>
        <div v-if="this.$route.query.type !== 'dy'"><i class="el-icon-s-home"></i>返回快手首页</div>
      </div>
      <img src="@/assets/imgs/newlogo.png" alt style="width: 50px;position: absolute;right: 170px;top: 20px;"/>
      <img src="@/assets/imgs/dy-logo.png" alt class="logo" v-if="this.$route.query.type === 'dy'"/>
      <img src="@/assets/imgs/ks-logo.png" alt class="logo" v-if="this.$route.query.type !== 'dy'"/>
    </div>
    <div class="content">
      <div class="tab">
        <!-- <div class="span1" v-bind:class="{ active: isActive }" @click="tabChange1()">关键词摘取</div>
        <div class="span2" v-bind:class="{ active: !isActive }" @click="tabChange2()">数据分析</div> -->
        <img src="@/assets/imgs/btn-gjczq.png" class="span1" @click="tabChange1()"/>
        <img src="@/assets/imgs/btn-sjfx.png" class="span2" @click="tabChange2()"/>
      </div>
      <!-- 关键词摘取 -->
      <div v-show="isActive" class="gjcForm">
        <el-form label-position="left" label-width="100px" :model="form">
          <el-form-item label="关键词：">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="储存路径：">
            <el-select v-model="form.region" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择设备：">
            <i class="el-icon-plus" @click="xzsb"></i>
            <base-table :columns="sbColumns" :data="tableData" selection v-show="sbShow"></base-table>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">执行</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 数据分析 -->
      <div v-show="!isActive" class="sjForm">
        <div>
          <el-button type="warning"><i class="el-icon-s-data"></i>导入数据</el-button>
          <el-select v-model="sb">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button type="warning" @click="letter">关注+私信</el-button>
        </div>
        <base-table :columns="tableColumns" :data="tableData" selection v-if="this.$route.query.type === 'dy'">
        </base-table>
        <base-table :columns="tableColumns2" :data="tableData" selection v-if="this.$route.query.type !== 'dy'">
        </base-table>
        <p>温馨提示：导入的数据会储存48小时后自动清除</p>
      </div>
    </div>
    <privateLetter ref="privateLetterRef"></privateLetter>
  </div>
</template>

<script>
import privateLetter from '@/modal/privateLetter';

export default {
  components: { privateLetter },
  data () {
    return {
      isActive: true,
      form: {
        name: '',
        region: '',
        type: ''
      },
      sb: '设备',
      sbShow: false,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      // 设备
      sbColumns: [{
        prop: 'name',
        label: '设备'
      },
      {
        prop: 'num',
        label: '组别',
        filter: true,
        filterData: []
      }],
      tableColumns: [
        {
          prop: 'name',
          label: '抖音号'
        },
        {
          prop: 'num',
          label: '评论内容'
        },
        {
          prop: 'taskKey',
          label: '关键词',
          sortable: true
        }
      ],
      tableColumns2: [
        {
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
      this.$router.go(-1)
    },
    onSubmit () {
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
    },
    letter () {
      this.$refs.privateLetterRef.open();
    },
    // 选择设备
    xzsb () {
      this.sbShow = !this.sbShow;
    }
  },
  mounted () {
    // 空对象
    var obj = {}
    const newData = this.tableData.concat();
    // 遍历
    for (let i = 0; i < newData.length; i++) {
      if (obj[newData[i].num] === undefined) {
        // 随便贴一个不为空的值
        obj[newData[i].num] = 1;
      } else {
        newData.splice(i--, 1)
      }
    }
    // 设备
    newData.forEach((item, index) => {
      this.sbColumns[1].filterData.push(
        Object.assign({}, item, { text: item.num, value: item.num })
      )
    })

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
  padding: 130px 40px 0 40px;
  .tab {
    display: flex;
    margin-top: 20px;
    img {
      width: 200px;
      cursor: pointer;
    }
    .span2 {
      margin-left: -42px;
    }
  }
  .gjcForm {
    width: 500px;
    margin-top: 50px;
    /deep/ .el-select {
      width: 100%;
    }
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
  }
  .sjForm {
    margin-top: 50px;
    /deep/ .el-button, /deep/ .el-input__inner {
      background-color: #e68048;
      border-color: #e68048;
      color: #fff;
      width: 106px;
      margin-right: 10px;
    }
    .el-table {
      margin-top: 20px;
    }
    p {
      margin-top: 15px;
      color: #9c9a9a;
    }
  }
  /deep/ .el-select .el-input .el-select__caret {
    margin-right: 20px;
    color: #fff;
  }
}
</style>
