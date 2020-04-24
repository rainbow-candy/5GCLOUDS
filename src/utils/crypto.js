import CryptoJS from 'crypto-js';
/**
 * DES 操作
 * @description
 * 加密解密
 */
export const crypto = {
  encryptByDES (strMessage, key) {
    key = key || '\u0067\u0072\u0065\u0061\u0074\u006d\u0061\u0070';
    var keyHex = CryptoJS.enc.Utf8.parse(key);
    var encrypted = CryptoJS.DES.encrypt(strMessage, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  },
  decryptByDES (strMessage, key) {
    key = key || '\u0067\u0072\u0065\u0061\u0074\u006d\u0061\u0070';
    const keyHex = CryptoJS.enc.Utf8.parse(key);
    const decrypted = CryptoJS.DES.decrypt(
      {
        ciphertext: CryptoJS.enc.Base64.parse(strMessage)
      },
      keyHex,
      {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
};
