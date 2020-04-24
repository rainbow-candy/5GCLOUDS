// 缓存信息
export const setUserLocal = () => {
  const now = new Date();
  const dateTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return dateTime.getTime();
};
