import helper from "libs/helper";
import Message from "shared/components/Message";

export default async reg => {
  console.log("register service worker success :) ");
  if (window.PushManager) {
    const subscription = await reg.pushManager.getSubscription();
    // 如果用户没有订阅
    if (!subscription) {
      subscribeUser(reg);
    } else {
      console.log("你已经订阅文章更新,感谢");
    }
  }
};

export const urlBase64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  //atob 将 base64 转成明文
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

//订阅
export const subscribeUser = reg => {
  const applicationServerPublicKey =
    "BPLEO8R2RHdRTAwmXss6dgN83W0o--pgF6foBb_RGWe40ZiXithcLIILEtHwFYzcuVQcctAe8iiJVsFScK_40vQ";
  const applicationServerKey = urlBase64ToUint8Array(
    applicationServerPublicKey
  );
  reg.pushManager
    .subscribe({
      userVisibleOnly: true, //消息是否必须可见 必填
      applicationServerKey: applicationServerKey
    })
    // 用户同意
    .then(async subscription => {
      // Message.warning("功能待完成!")
      console.log("一位老铁订阅成功:", JSON.stringify(subscription));

      const data = await helper.postJson("/article/add-subscription", {
        subscription: JSON.stringify(subscription)
      });
      console.log("订阅成功:", data);
      Message.success("订阅成功! 有新文章会推送给你!");
    })
    // 用户不同意或者生成失败
    .catch(err => {
      Message.info("江湖再见!");
      console.log("一位老铁订阅失败:", err);
    });
};
