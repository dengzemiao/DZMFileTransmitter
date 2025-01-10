## 一、 简介

* 基于 `nodejs` 实现的本地局域网文件传输器，支持`手机`、`电脑`、`ipad`等设备互相局域网内传递文件。需要多台设备需要传输文件时，启动该服务本地传输即可。

## 二、使用

* [安装 node.js]((https://nodejs.org/en/download))：

  * 创建项目时初始版本：`v14.15.0`，新版本也是没问题的，用的都是常用函数，这个版本只是留个记录。

  * 所以，随便安装一个 [nodejs](https://nodejs.org/en/download) 版本即可。

  * 也可以通过 [nvm 版本管理器安装 node.js](https://blog.csdn.net/zz00008888/article/details/119934444)，随意任选一种安装方式即可。

* 安装好 `node` 并下载好代码，，打开命令行，进入到项目根目录，安装依赖：

  ```sh
  $ npm i
  ```

  如果遇到依赖安装报错，可以移除 `package-lock.json` 与 `node_modules`，再次执行上面命令重新安装依赖。

* 运行服务

  ```sh
  $ npm run start
  ```

* 然后就可以通过 `ip + 端口` 访问使用了

  ```sh
  # 本机访问路径，这个只能本机
  http://localhost:3000

  # 局域网内访问路径，需要知道运行服务的当前电脑 ip + 端口进行访问，这可以同局域网内的任意机器
  http://10.0.xx.xxx:3000
  ```
