import { fetch } from '@/apiconfig/index'

const wdsbServer = {
  // 我的设备列表
  myDev (params) {
    return fetch('api/task/dev/', 'get', params)
  },
  // 设备新增分组
  putDev (params) {
    return fetch('api/task/dev/', 'post', params)
  },
  // 删除任务
  deleteDev (params) {
    return fetch('api/task/dev/', 'post', params)
  },
  // 暂停任务
  suspendDev (params) {
    return fetch('api/task/dev/', 'post', params)
  },
  // 八大功能点击量
  clicknum (params) {
    return fetch('api/task/clicknum/', 'post', params)
  },
  // 关键词摘取
  kwordSearch (params) {
    return fetch('api/task/kword/', 'post', params)
  },
  // 线索分析
  getKword (params) {
    return fetch('api/task/kword/?to_clue=1', 'get', params)
  },
  // 关键词搜索
  keySearch (params) {
    return fetch('api/task/kword/', 'get', params)
  },
  // 关键词是否正在执行
  isImplement (params) {
    return fetch('api/task/gjc/', 'get', params)
  },
  // 关键词摘取下载excel
  exportExcel (params) {
    return fetch('media/', 'post', params)
  },
  // 信息反馈
  feedback (params) {
    return fetch('api/user/feedback/', 'post', params)
  },
  // 直播间转发
  forward (params) {
    return fetch('api/task/kword/', 'get', params)
  }

  // 直播间采集
  // 获取数据
  // forward (params) {
  //   return fetch('api/task/kword/', 'get', params)
  // },
};

export default wdsbServer;
