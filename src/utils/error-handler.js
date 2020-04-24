import { Message } from 'element-ui';

// 防止产生过多的提示框
let errorMessageInstance;

/**
 * 错误信息提示
 * @param {String} message 展示信息
 * @param {Boolean} showBox 是否展示提示框，默认不提示
 */
export default function errorMessage (message, showBox = true) {
  errorMessageInstance && errorMessageInstance.close();

  // 打印出错误信息
  console.error('Error ->', message);

  if (showBox) {
    // 显示错误信息
    errorMessageInstance = Message({
      message: formatterMessage(message),
      type: 'error',
      duration: 10000,
      showClose: true,
      onClose () {
        errorMessageInstance = null;
      }
    });

    // 修改 z-index 值，防止与 dialog 冲突
    const style = errorMessageInstance.$el.style;
    style.zIndex = +style.zIndex + 1000;
  }
}

/**
 * 格式化错误信息（限制 80 字）
 * @param {*} msg
 * @return {string}
 */
function formatterMessage (msg) {
  if (msg instanceof Object) {
    msg = JSON.stringify(msg);
  } else {
    msg = String(msg);
  }
  msg = msg.length > 80 ? msg.slice(0, 80) + '...' : msg;
  return msg;
}
