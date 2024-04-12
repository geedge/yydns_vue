<template>
    <div
      style="height: 100%;
      background: #002833;"
    >
      <div class="indexContainer" id="terminal" ref="terminal" v-resize="onResize"></div>
    </div>
</template>
  
<script>
  // 引入xterm，请注意这里和3.x版本的引入路径不一样
  import { Terminal } from "xterm";
  import "xterm/css/xterm.css";
  import "xterm/lib/xterm.js";
  import { FitAddon } from "xterm-addon-fit";

  import resize from 'vue-resize-directive';
  
  export default {
    name: "Shell",
    directives: { resize },
    data() {
      return {
        nodeId: '',
        showOrder: "", // 保存服务端返回的命令
        inputList: [],
        shellWs: "",
        term: "", // 保存terminal实例
        rows: 40,
        cols: 100,
        urlParam: {
            Tag: 'tag',
            name: 'name',
            pod: 'pod'
        },
        commandPrefix: 'target'
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
      this.rows = document.querySelector(".indexContainer").offsetHeight / 16 - 6;
      this.cols = document.querySelector(".indexContainer").offsetWidth / 14;
  
      let term = new Terminal({
        rendererType: "canvas", //渲染类型
        rows: parseInt(_this.rows), //行数
        cols: parseInt(_this.cols), // 不指定行数，自动回车后光标从下一行开始
        convertEol: true, //启用时，光标将设置为下一行的开头
        fontSize: 16, //字体大小
        //   scrollback: 50, //终端中的回滚量
        disableStdin: false, //是否应禁用输入。
        cursorStyle: "underline", //光标样式
        cursorBlink: true, //光标闪烁
        // theme: {
        //   foreground: "#7e9192", //字体
        //   background: "#002833", //背景色
        //   cursor: "help", //设置光标
        //   lineHeight: 16
        // }
        theme: {
            foreground: "yellow", //字体
            background: "#060101", //背景色
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
    //   document.querySelector(".indexContainer").addEventListener('resize', resizeScreen)
  
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
  
        function runFakeTerminal(_this) {
        if (term._initialized) {
            return;
        }

        term._initialized = true;

        term.prompt = () => {
            term.write("\r\n ");
        };

        // term.writeln("Welcome to xterm.js");
        // term.writeln(
        //     "This is a local terminal emulation, without a real terminal in the back-end."
        // );
        // term.writeln("Type some keys and commands to play around.");

        // term.writeln("root@target:/#");
        // term.prompt();

        // 监控键盘输入事件
        // / **
        //     *添加事件监听器，用于按下键时的事件。事件值包含
        //     *将在data事件以及DOM事件中发送的字符串
        //     *触发了它。
        //     * @返回一个IDisposable停止监听。
        //  * /
        let last = 0;

        term.onKey(function(event) {
            // 可打印状态，即不是alt键ctrl等功能健时
            // console.log(event, '输入的key======')
            const printable = !event.domEvent.altKey && !event.domEvent.altGraphKey && !event.domEvent.ctrlKey && !event.domEvent.metaKey

            // !key.charCodeAt(0).altKey && !key.charCodeAt(0).altGraphKey && !key.charCodeAt(0).ctrlKey && !key.charCodeAt(0).metaKey;

            // 因服务端返回命令包含乱码，但使用write方法输出时并不显示，故将真实显示内容截取出来
            let show = ''
            if (_this.showOrder) {
                let index = _this.showOrder.indexOf("sh");
                show = _this.showOrder.substr(index, _this.showOrder.length - 1);
            }

            //  当输入回车时
            if (event.domEvent.keyCode === 13) {
            if (_this.order == "cls" || _this.order == "clear") {
                _this.order = "";
                return false;
            }
            //先将数据发送
            term.prompt();
            // 判断如果不是英文给出提醒
            let reg = /[a-zA-Z]/;
            // let order = {
            //     Data: _this.order,
            //     Op: "stdin"
            // };
            let order = _this.order

            if (!reg.test(_this.order)) {
                term.writeln("请输入有效指令~");
            } else {
                // 发送数据
                _this.inputList.push(_this.order);
                last = _this.inputList.length - 1;
                _this.onSend(order);
                // 清空输入内容变量
            }
            } else if (event.domEvent.keyCode === 8) {
            // 当输入退
            // 当前行字符长度如果等于后端返回字符就不进行删除
            if(_this.order.length > 0) {
                _this.order = _this.order.substr(0, _this.order.length - 1);
                term.write('\b \b')
            }
            // if (term._core.buffer.x > _this.showOrder.length) {
            //     term.write("\b \b"); // 输出退格
            // }

            // // 将输入内容变量删除

            // if (_this.trim(_this.order) == _this.trim(_this.showOrder)) {
            //     return false;
            // } else {
            //     _this.order = _this.order.substr(0, _this.order.length - 1);
            //     term.write('\b \b')
            // }
            } else if (event.domEvent.keyCode === 127) {
              if (term._core.buffer.x > (_this.showOrder.length + 2)) {
                term.write('\b \b')
                _this.order = _this.order.substr(0, _this.order.length - 1)
              }
            }  else if (event.domEvent.keyCode === 38 || event.domEvent.keyCode === 40) {
            let len = _this.inputList.length;
            let code = event.domEvent.keyCode;

            if (code === 38 && last <= len && last >= 0) {
                // 直接取出字符串数组最后一个元素
                let inputVal = _this.inputList[last];
                term.write(inputVal);
                if (last > 0) {
                last--;
                }
            }
            if (code === 40 && last < len) {
                // last现在为当前元素
                if (last == len - 1) {
                return;
                }
                if (last < len - 1) {
                last++;
                }

                let inputVal = _this.inputList[last];
                term.write(inputVal);
            }
            } else if (event.domEvent.keyCode === 9) {
            // 如果按tab键前输入了之前后端返回字符串的第一个字符，就显示此命令
            if (_this.order !== "" && show.indexOf(_this.order) == 0) {
                term.write(_this.showOrder);
            }
            } else if (event.key == '\x16') {
              navigator.clipboard.readText().then(clipText => {
                term.write(clipText);
            })
            //ctrol+ c copy
        } else if (event.key == '\x03' && term.hasSelection()) {
            navigator.clipboard.writeText(term.getSelection())
        } else if (printable) {
              let key = event.key
            // // 当为可打印内容时
            // if (/[a-zA-Z]/.test(key)) {
            //     key = key.toLowerCase();
            // }
            // 存入输入内容变量
            _this.order = _this.order + key;
            // 将变量写入终端内
            term.write(key);
            }
        });

        _this.term = term;
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
            //   let data = JSON.parse(e.data);
            //   if (data.Data == "\n" || data.Data == "\r\nexit\r\n") {
            //     _this.$message("连接已关闭");
            //   }
              // 打印后端返回数据
            //   _this.term.write(data.Data);

                let backData = ''
                // 创建一个包含文本内容的Blob对象
                var blob = e.data;
                // 创建一个新的FileReader对象
                var reader = new FileReader();
                // 读取Blob并将其转换为字符串
                reader.onloadend = function () {
                    backData = reader.result; // 获得转换后的字符串
                    console.log(backData, '服务端websockt返回结果===='); // 输出结果到控制台
                    let index = _this.order?.length;
                    backData = backData.substring(index, backData.length);
                    // 如果返回字符包含这些字符显示close提示
                    if (backData == "\n" || backData == "\r\nexit\r\n") {
                    alert("closed");
                    }
                    if (backData.trim() === 'Connected!') {
                      _this.term.write(backData)
                      _this.term.write(`root@${_this.commandPrefix}:/#`);
                    } else {
                      _this.term.write(backData)
                    }
                    _this.showOrder = backData;
                    _this.order = "";
                };
                
                // 开始读取Blob
                reader.readAsText(blob);
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
              const wsUrl = 'ws://' + window.g.baseURL + res.result
              this.wsShell(wsUrl)
              this.commandPrefix = res.result.split('/')[3]
            }
        }).catch(err => {
            console.log(err)
        })
      },
      // 全屏时重新设置控制台行高
      onResize() {
        this.rows = document.querySelector(".indexContainer").offsetHeight / 16 - 6;
        this.cols = document.querySelector(".indexContainer").offsetWidth / 14;
        this.term.resize(parseInt(this.rows), parseInt(this.cols))
        // canvas背景全屏
        var fitAddon = new FitAddon();
        this.term.loadAddon(fitAddon);
        try {
            fitAddon.fit();
            // 窗口大小改变时触发xterm的resize方法，向后端发送行列数，格式由后端决定
            // 这里不使用size默认参数，因为改变窗口大小只会改变size中的列数而不能改变行数，所以这里不使用size.clos,而直接使用获取我们根据窗口大小计算出来的行列数
            term.onResize(() => {
                this.onSend({ Op: "resize", Cols: term.cols, Rows: term.rows });
            });
        } catch (e) {
            console.log("e", e.message);
        }
      },
    }
  };
</script>
<style lang="less" scoped>
.indexContainer {
    height: calc(100% - 0px);
}
</style>
    