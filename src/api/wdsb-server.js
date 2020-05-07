import { fetch } from '@/apiconfig/index'

const wdsbServer = {
  // 我的设备列表
  myDev (params) {
    return fetch('task/dev/', 'get', params)
  },
  // 设备新增分组
  putDev (params) {
    return fetch('task/dev/', 'post', params)
  },
  // 删除任务
  deleteDev (params) {
    return fetch('task/dev/', 'post', params)
  },
  // 暂停任务
  suspendDev (params) {
    return fetch('task/dev/', 'post', params)
  },
  // 信息反馈
  feedback (params) {
    return fetch('user/feedback/', 'post', params)
  }
};

export default wdsbServer;
