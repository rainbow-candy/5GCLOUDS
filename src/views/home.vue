<template>
  <el-container>
  <el-header>
    <div class="logo_box">
      <img src="../assets/logo.png" />
      <span>后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">注销账号</el-button>
  </el-header>
  <el-container>
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="toggle-button" @click="toggleCollapse">|||</div>
      <el-menu background-color="#333744" text-color="#fff" active-text-color="#409BFF"
      :collapse="isCollapse" :collapse-transition="false" router>
        <el-submenu :index="menu.id + ''" :key="menu.id" v-for="menu in menusList">
          <template slot="title">
            <i :class="iconsObj[menu.id]"></i>
            <span>{{menu.authName}}</span>
          </template>
          <el-menu-item :index="chils.path + ''" :key="chils.id" v-for="chils in menu.children">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{chils.authName}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
import { App } from '@/utils/auth';

export default {
  data () {
    return {
      menusList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      this.$router.push('/login')
      App.clear();
      // userAuth.clear();
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menusList = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style lang="less" scoped>
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  > div {
    height: 60px;
    display: flex;
    align-items: center;
    > img {
      height: 60px;
    }
    > span {
      padding-left: 10px;
    }
  }
}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #EAEDF1;
}
.el-container{
  height: 100%;
}
.iconfont{
  margin-right: 10px;
}
.el-menu {
    border-right: none;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
