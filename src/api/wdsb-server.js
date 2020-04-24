import { fetch } from '@/apiconfig/index'

const wdsbServer = {
  // 我的设备列表
  myDev (params) {
    return fetch('task/my_dev/', 'get', params)
  },
  // 设备新增分组
  putDev (url, params) {
    return fetch(url, 'put', params)
  },
  // 删除任务
  deleteDev (url, params) {
    return fetch(url, 'delete', params)
  },
  // 暂停任务
  suspendDev (url, params) {
    return fetch(url, 'put', params)
  },
  // 信息反馈
  feedback (params) {
    return fetch('user/feedback/', 'post', params)
  }
};

export default wdsbServer;
