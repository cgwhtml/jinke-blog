/*
 * @Author: jinke.li 
 * @Date: 2017-05-16 16:19:29 
 * @Last Modified by: jinke.li
 * @Last Modified time: 2018-08-22 21:07:32
 */
import React from "react";
import ReactDOM from "react-dom";
import { AppContainer as HotLoader } from "react-hot-loader"; //react-hot-loader  热更新可以保存状态
import { Provider } from "react-redux";
import { host } from "../config";
import registerWebPush from "libs/webpush"
import { version as VERSION, name as APPNAME } from "../package.json";

const MODE = process.env.NODE_ENV || "development"

import App from "app";
import store from "store";
import "./style.less";

const render = Component => {
  ReactDOM.render(
    <HotLoader>
      <Provider store={store}>
        <Component />
      </Provider>
    </HotLoader>,
    document.getElementById("root")
  );
};
render(App);
//webpack内置对象
if (module.hot) {
  module.hot.accept("app", () => {
    render(App);
  });
}

// 如果支持 sw
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(MODE === "development" ? `/sw.js` : `${host}/sw.js`) //返回一个promise对象
    .then(registerWebPush)
    .catch(err => console.error("serviceWorker register failed:", err));
}

//网站相关信息
console.log(`
[]                         [===]                                  ======       ============
||            []            |}       []     /==\                    ||                ||
||            ||            |}             |N   N|                  || /)        === ||
||            ||            |}|      ||    ||   ||                / || /         | | ||
||            ||            |}|      ||    ||   ||               /_/||            +  ||
||_ _ _ _ /|  ||          / /| }     ||    ||   ||              ___ ||_____    \      ||
|_ _ _ _ _>/  0-0        /__,|/_)    0-0   UU   UU             /——————————/     \__,,,||

`);
console.table({
  APPNAME,
  VERSION,
  MODE
});
