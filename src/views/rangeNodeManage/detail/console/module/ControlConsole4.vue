<template>
    <div
      style="height: 100%;
      background: #002833;"
    >
      <div class="indexContainer" id="terminal" ref="terminal"></div>
    </div>
  </template>
  
  <script>
  // 引入xterm，请注意这里和3.x版本的引入路径不一样
  import { Terminal } from "xterm";
  import "xterm/css/xterm.css";
  import "xterm/lib/xterm.js";
  import { FitAddon } from "xterm-addon-fit";
  
  export default {
    name: "Shell",
    data() {
      return {
        nodeId: '',
        shellWs: "",
        term: "", // 保存terminal实例
        rows: 40,
        cols: 100,
        urlParam: {
            Tag: 'tag',
            name: 'name',
            pod: 'pod'
        }
      };
    },
    watch: {
        '$store.state.range.nodeId': {
            handler(newVal, oldVal) {
                this.nodeId = newVal
            },
            immediate: true
        }
    },  
    created() {
      this.getWebsocketUrl()
    },
  
    mounted() {
      let _this = this;
      localStorage.setItem('commands', '')
      // 获取容器宽高/字号大小，定义行数和列数
    //   this.rows = document.querySelector(".indexContainer").offsetHeight / 16 - 6;
    //   this.cols = document.querySelector(".indexContainer").offsetWidth / 14;
  
      let term = new Terminal({
        rendererType: "canvas", //渲染类型
        // rows: parseInt(_this.rows), //行数
        // cols: parseInt(_this.cols), // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        //   scrollback: 50, //终端中的回滚量
        disableStdin: false, //是否应禁用输入。
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        theme: {
          foreground: "#7e9192", //字体
          background: "#002833", //背景色
          cursor: "help", //设置光标
          lineHeight: 16
        }
      });
  
      // 创建terminal实例
      term.open(this.$refs["terminal"]);
  
      // 换行并输入起始符“$”
      term.prompt = () => {
        term.write("\r\n$ ");
      };
      term.prompt();
  
      // // canvas背景全屏
      var fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      fitAddon.fit();
  
      window.addEventListener("resize", resizeScreen);
  
      // 内容全屏显示
      function resizeScreen() {
        // 不传size
  
        try {
          fitAddon.fit();
  
          // 窗口大小改变时触发xterm的resize方法，向后端发送行列数，格式由后端决定
          // 这里不使用size默认参数，因为改变窗口大小只会改变size中的列数而不能改变行数，所以这里不使用size.clos,而直接使用获取我们根据窗口大小计算出来的行列数
          term.onResize(() => {
            _this.onSend({ Op: "resize", Cols: term.cols, Rows: term.rows });
          });
        } catch (e) {
          console.log("e", e.message);
        }
      }
  
    //   function runFakeTerminal(_this) {
    //     if (term._initialized) {
    //       return;
    //     }
    //     // 初始化
    //     term._initialized = true;
  
    //     term.writeln("Welcome to use Superman. ");
    //     term.writeln(
    //       `This is Web Terminal of pod\x1B[1;3;31m ${
    //         _this.urlParam.podName
    //       }\x1B[0m in namespace\x1B[1;3;31m ${_this.urlParam.namespace}\x1B[0m`
    //     );
  
    //     term.prompt();
  
    //     // / **
    //     //     *添加事件监听器，用于按下键时的事件。事件值包含
    //     //     *将在data事件以及DOM事件中发送的字符串
    //     //     *触发了它。
    //     //     * @返回一个IDisposable停止监听。
    //     //  * /
    //     //   / ** 更新：xterm 4.x（新增）
    //     //  *为数据事件触发时添加事件侦听器。发生这种情况
    //     //  *用户输入或粘贴到终端时的示例。事件值
    //     //  *是`string`结果的结果，在典型的设置中，应该通过
    //     //  *到支持pty。
    //     //  * @返回一个IDisposable停止监听。
    //     //  * /
    //     // 支持输入与粘贴方法
    //     term.onData(function(key) {
    //       let order = {
    //         Data: key,
    //         Op: "stdin"
    //       };
    //       _this.onSend(key);
    //       // 为解决窗体resize方法才会向后端发送列数和行数，所以页面加载时也要触发此方法
    //       _this.onSend({
    //         Op: "resize",
    //         Cols: parseInt(term.cols),
    //         Rows: parseInt(term.rows)
    //       });
    //     });
  
    //     _this.term = term;
    //   }
    //   runFakeTerminal(_this);
        function runFakeTerminal(_this) {
            if (term._initialized) {
                return;
            }

            term._initialized = true;

            term.prompt = () => {
                term.write("\r\n ");
            };

            term.writeln("Welcome to xterm.js");
            term.writeln(
                "This is a local terminal emulation, without a real terminal in the back-end."
            );
            term.writeln("Type some keys and commands to play around.");
            term.writeln("");
            term.prompt();

            // 监控键盘输入事件
            // / **
            //     *添加事件监听器，用于按下键时的事件。事件值包含
            //     *将在data事件以及DOM事件中发送的字符串
            //     *触发了它。
            //     * @返回一个IDisposable停止监听。
            //  * /
      // 添加事件监听器，支持输入方法
            term.onData( function (key) {
                if (key.charCodeAt(0) == 13) { // 回车
                if(_this.command === 'clear') {
                    term.clear()
                }
                if (_this.command.trim().length === 0) {
                    term.prompt()
                } else {
                    // 保存命令
                    let commands = localStorage.getItem('commands') ? JSON.parse(localStorage.getItem('commands')) : []
                    commands.push(_this.command)
                    localStorage.setItem('commands', JSON.stringify(commands))
                    localStorage.setItem('index', commands.length)
                    // _this.sendData(0)
                    _this.onSend(localStorage.getItem('commands'))
                }
                _this.command = ''
                } else if (key === '\u001b[A') {   // 向上方向
                let commands = localStorage.getItem('commands') ? JSON.parse(localStorage.getItem('commands')) : []
                // console.log(commands)
                let index = localStorage.getItem('index') ? localStorage.getItem('index') : commands.length
                index = parseInt(index)
                if (commands.length && index < commands.length + 1 && index > 0) {
                    // 删除现有命令
                    for (let i = 0; i < _this.command.length; i++) {
                    if (term._core.buffer.x > (_this.sshPrompt.length + 2)) {
                        term.write('\b \b')
                    }
                    }
                    _this.command = commands[index - 1]
                    term.write(_this.command)
                    localStorage.setItem('index', index - 1)
                }
                } else if (key  === '\u001b[B') {   // 向下方向
                let commands = localStorage.getItem('commands') ? JSON.parse(localStorage.getItem('commands')) : []
                let index = localStorage.getItem('index') ? localStorage.getItem('index') : commands.length
                index = parseInt(index)
                if (commands.length && index < commands.length - 1 && index > -1) {
                    // 删除现有命令
                    for (let i = 0; i < _this.command.length; i++) {
                    if (term._core.buffer.x > (_this.sshPrompt.length + 2)) {
                        term.write('\b \b')
                    }
                    }
                    _this.command = commands[index + 1]
                    term.write(_this.command)
                    localStorage.setItem('index', index + 1)
                }
                } else if (key.charCodeAt(0) === 9) {  // tab键
                let params = {
                    consoleUUID: _this.activeMsf,
                    cmd: _this.command
                }
                // tab补全
                _this.$apis.readTabsComplete(params).then((res) => {
                    if (res.code === 200) {
                    if (res.data.length) {
                        for (let i = 0; i < _this.command.length; i++) {
                        term.write('\b \b')
                        }
                        let data = res.data.join('\r\n')
                        _this.command = res.data[res.data.length - 1]
                        if (res.data.length > 1) {
                        term.write('\r\n')
                        term.write(data)
                        term.prompt()
                        term.write(res.data[res.data.length - 1])
                        } else {
                        term.write(_this.command)
                        }
                    }
                    } else {
                    _this.$message.error(res.message())
                    }
                })
                } else if (key.charCodeAt(0) === 127) {
                if (term._core.buffer.x > (_this.sshPrompt.length + 2)) {
                    term.write('\b \b')
                    _this.command = _this.command.substr(0, _this.command.length - 1)
                }
                } else{
                _this.command += key
                term.write(key)
                }
            })

            _this.term = term;

            // 粘贴事件
            term.onData(function(data) {
                _this.order = data;
                term.write(data);
            });
        }
        runFakeTerminal(_this);
    },
  
    methods: {
    
      /**
       * **wsShell 创建页面级别的websocket,加载页面数据
       * ws 接口:/xxx/xxx/xxx
       * 参数:无
       * ws参数:
       * @deployId   任务id
       * @tagString  当前节点
       * 返回:无
       * **/
      wsShell(url) {
        const _this = this;
        let tag = this.urlParam.Tag;
        let name= this.urlParam.name;
        let pod= this.urlParam.pod;
  
        // let query = `?tag=${tag}&name=${name}&pod=${pod}`;
        // let url = `xxxx/xxxx${query}`;// websocket连接接口
        // let url = 'ws://172.16.0.120:30598/ws/target-19-austria-80-110-35-0-24/target-19-relay-127-54b5df76f4-8958g/relay-127'
  
        this.shellWs = this.websoketLib.WS({
          url,
          isInit: true,
          openFn(e) {
            console.log('连接websocket成功===', e)
            //   _this.term.resize({ rows: _this.rows, cols: 100 }); //终端窗口重新设置大小 并触发term.on("resize")
          },
          messageFn(e) {
            console.log("message", e);
            if (e) {
                _this.term.write(e.data);
            //   let data = JSON.parse(e.data);
            //   if (data.Data == "\n" || data.Data == "\r\nexit\r\n") {
            //     _this.$message("连接已关闭");
            //   }
              // 打印后端返回数据
            //   _this.term.write(data.Data);
            }
          },
          errorFn(e) {
            //出现错误关闭当前ws,并且提示
            console.log("error", e);
            _this.$message.error({
              message: "ws 请求失败,请刷新重试~",
              duration: 5000
            });
          }
        });
      },
  
      onSend(data) {
        // data = this.websoketLib.isObject(data) ? JSON.stringify(data) : data;
        // data = this.websoketLib.isArray(data) ? data.toString() : data;
        // data = data.replace(/\\\\/, "\\");
        this.shellWs.onSend(data);
      },
  
      //删除左右两端的空格
      trim(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "");
      },
      // 获取websocket地址
      getWebsocketUrl() {
        const reqParams = { node_id: this.nodeId }
        this.$axios.get(this.$http.api.getWebsocketUrl, reqParams).then(res => {
            if (res.code == 200 || res.code == "OK") {
                this.wsShell(res.result)
            }
        }).catch(err => {
            console.log(err)
        })
      }
    }
  };
  </script>
    