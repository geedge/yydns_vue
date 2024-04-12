import { WS } from "@/components/websocket/websocket.js";

const install = function(Vue) {
  const websoketLib = {
    //参数&方法 
    WS({ url, openFn, messageFn, errorFn, isInit = false } = {}) {
      return new WS({ url, openFn, messageFn, errorFn, isInit });
    },
  };
  Vue.prototype.websoketLib = websoketLib;
};

export default {
  install
};

