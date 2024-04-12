<template>
    <!-- <div class="content"> -->
        <!-- <div id="xterm" class="xterm"/> -->
    <div id="log" style="margin:10px auto;">
        <div class="console" id="terminal"></div>
    </div>
    <!-- </div> -->
</template>

<script>
import "xterm/css/xterm.css";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
export default {
	name: "Xterm",
    props: {
        // socketURI: {
        // type: String,
        // default: ''
        // },
    },
	data() {
		return {
            term: null, //terminal 黑窗口容器
            socket: null,
            rows: 32,
            cols: 20,
            SetOut: false,
            isKey: false,
			prefix: "[root@serverip ~]# "//前缀
			// inputText: "",//输入内容，每次回车后进行ws通信然后清空此数据
		};
	},
	watch: {},
    mounted() {
        this.initSocket()
    },
    beforeDestroy() {
        this.socket.close()
        // this.term.dispose()
  },
	methods: {
		//初始化黑窗口
		async initTerm() {
			const term = new Terminal({
                rendererType: "canvas", //渲染类型
                rows: this.rows, //行数
                // cols: this.cols,// 设置之后会输入多行之后覆盖现象
                convertEol: true, //启用时，光标将设置为下一行的开头
                // scrollback: 10,//终端中的回滚量
                fontSize: 14, //字体大小
                disableStdin: false, //是否应禁用输入。
                cursorStyle: "block", //光标样式
                // cursorBlink: true, //光标闪烁
                scrollback: 30,
                tabStopWidth: 4,
                theme: {
                    foreground: "yellow", //字体
                    background: "#060101", //背景色
                    cursor: "help" //设置光标
                }
			});

            const attachAddon = new AttachAddon(this.socket);
            const fitAddon = new FitAddon();
            term.loadAddon(attachAddon);
			term.loadAddon(fitAddon);
			//开启Xterm终端
			term.open(document.getElementById("terminal"));

            term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
            term.focus();
            this.term = term;
            // if (term._initialized) {
            //     return
            // }
            // term._initialized = true
            // term.prompt = () => {
            //     term.write('\r\n$ ')
            // }

            // term.writeln('Welcome to xterm.js')
            // term.writeln('This is a local terminal emulation, Type some keys and commands to play around')
            // term.writeln('')
            // term.prompt()

            // // xterm.4.x 输入
            // term.onKey(e => {
            //     const ev = e.domEvent
            //     const printable = !ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey
            //     if (ev.keyCode === 13) {
            //         term.prompt()
            //     } else if (ev.keyCode === 8) {
            //         // Do not delete the prompt
            //         if (term._core.buffer.x > 2) {
            //             term.write('\b \b')
            //         }
            //     } else if (printable) {
            //         term.write(e.key);
            //         this.socket.send(e.key);
            //     }
            // })
            // this.term = term
		},
		// //事件
		// termKeyCode() {
		// 	const TERMINAL_INPUT_KEY = {
		// 		BACK: 8, // 退格删除键
		// 		ENTER: 13, // 回车键
		// 		UP: 38, // 方向盘上键
		// 		DOWN: 40, // 方向盘键
		// 		LEFT: 37, // 方向盘左键
		// 		RIGHT: 39, // 方向盘右键
		// 	};
		// 	const { eqpCode, server } = this.selectObj;
		// 	let inputText = "";
		// 	let currentIndex = 0;
		// 	let inputTextList = [];
		// 	this.term.onKey((e) => {
		// 		const { key, domEvent } = e;
		// 		const { keyCode, altKey, altGraphKey, ctrlKey, metaKey } = domEvent;

		// 		const printAble = !(altKey || altGraphKey || ctrlKey || metaKey); // 禁止相关按键
		// 		const totalOffsetLength = inputText.length + this.prefix.length; // 总偏移量
		// 		const currentOffsetLength = this.term._core.buffer.x; // 当前x偏移量

		// 		switch (keyCode) {
		// 			//删除
		// 			case TERMINAL_INPUT_KEY.BACK:
		// 				if (currentOffsetLength > this.prefix.length) {
		// 					const cursorOffSetLength = this.getCursorOffsetLength(totalOffsetLength - currentOffsetLength, "\x1b[D"); // 保留原来光标位置

		// 					this.term._core.buffer.x = currentOffsetLength - 1;
		// 					this.term.write("\x1b[?K" + inputText.slice(currentOffsetLength - this.prefix.length));
		// 					this.term.write(cursorOffSetLength);
		// 					inputText = `${inputText.slice(0, currentOffsetLength - this.prefix.length - 1)}${inputText.slice(
		// 						currentOffsetLength - this.prefix.length
		// 					)}`;
		// 				}
		// 				break;
		// 			//回车
		// 			case TERMINAL_INPUT_KEY.ENTER: {
		// 				this.term.write("\r\n");
		// 				console.log("inputText", inputText);
		// 				//ws 通信参数
		// 				let wsParams = { EqpCode: eqpCode, Action: "terminal", Data: inputText };
		// 				this.$emit("websocketSend", wsParams, server);

		// 				if (!inputText.trim()) {
		// 					this.term.prompt();
		// 					return;
		// 				}

		// 				if (inputTextList.indexOf(inputText) === -1) {
		// 					inputTextList.push(inputText);
		// 					currentIndex = inputTextList.length;
		// 				}

		// 				this.term.prompt();
		// 				inputText = "";
		// 				break;
		// 			}

		// 			case TERMINAL_INPUT_KEY.UP: {
		// 				if (!inputTextList[currentIndex - 1]) break;

		// 				const offsetLength = this.getCursorOffsetLength(inputText.length, "\x1b[D");

		// 				inputText = inputTextList[currentIndex - 1];
		// 				this.term.write(offsetLength + "\x1b[?K");
		// 				this.term.write(inputTextList[currentIndex - 1]);
		// 				this.term._core.buffer.x = totalOffsetLength;
		// 				currentIndex--;

		// 				break;
		// 			}
		// 			case TERMINAL_INPUT_KEY.LEFT:
		// 				if (currentOffsetLength > this.prefix.length) {
		// 					this.term.write(key); // '\x1b[D'
		// 				}
		// 				break;

		// 			case TERMINAL_INPUT_KEY.RIGHT:
		// 				if (currentOffsetLength < totalOffsetLength) {
		// 					this.term.write(key); // '\x1b[C'
		// 				}
		// 				break;
		// 			default: {
		// 				// 在当前的坐标写上 key 和坐标后面的字符
		// 				// 移动停留在当前位置的光标
		// 				if (!printAble) break;
		// 				if (totalOffsetLength >= this.term.cols) break;
		// 				if (currentOffsetLength >= totalOffsetLength) {
		// 					this.term.write(key);
		// 					inputText += key;
		// 					break;
		// 				}
		// 				let cursorOffSetLength = this.getCursorOffsetLength(totalOffsetLength - currentOffsetLength, "\x1b[D");
		// 				this.term.write("\x1b[?K" + `${key}${inputText.slice(currentOffsetLength - this.prefix.length)}`);
		// 				this.term.write(cursorOffSetLength);
		// 				inputText = inputText.slice(0, currentOffsetLength) + key + inputText.slice(totalOffsetLength - currentOffsetLength);
		// 				break;
		// 			}
		// 		}
		// 	});
		// },
		// //限制和后端交互，只有输入回车键才显示结果
		// termPromt() {
		// 	this.term.prompt = () => {
		// 		this.term.write(this.prefix);
		// 	};
		// },
		//获取光标当前位置
		getCursorOffsetLength(offsetLength, subString) {
			let cursorOffsetLength = "";
			for (let offset = 0; offset < offsetLength; offset++) {
				cursorOffsetLength += subString;
			}
			return cursorOffsetLength;
		},
		//写入黑窗口
		wirteTerm(data) {
			console.log("写入黑窗口", data);
			this.term.writeln(data);
			this.term.prompt();
		},
		// //加载基础数据
		// pageLoad(data) {
		// 	this.selectObj = data;
		// 	this.drawerFlag = true;
		// 	this.$nextTick(() => {
		// 		this.initTerm();
		// 	});
		// },
		cancelClick() {
			this.drawerFlag = false;
			//关闭弹框
			this.term.dispose(document.getElementById("xterm"));
		},
        initSocket() {
            const wsurl = 'ws://172.16.0.120:30598/ws/target-19-austria-80-110-35-0-24/target-19-relay-127-54b5df76f4-8958g/relay-127'
            this.socket = new WebSocket(wsurl);
            this.socketOnClose();
            this.socketOnOpen();
            this.socketOnError();
        },
        socketOnOpen() {
            this.socket.onopen = () => {
                console.log('socket 连接成功')
                // 链接成功后
                this.initTerm()
            }
            // this.socket.onmessage = function(evt) {
            // // let str = new TextDecoder().decode(evt.data);
            //     // console.log('onmessage=====', evt)
            //     this.term.write(evt.data);
            // };
        // //返回
            // this.socket.onmessage = function(evt) {
            // // let str = new TextDecoder().decode(evt.data);
            //     console.log('onmessage=====', evt)
            //     this.term.write(evt.data);
            // };
        },
        socketOnClose() {
            this.socket.onclose = (e) => {
                console.log('socket 关闭:' + '错误码==' + e.code + '；错误原因==' + e.reason + '；wasClean==' + e.wasClean)
            }
        },
        socketOnError() {
            this.socket.onerror = () => {
                console.log('socket 连接失败')
            }
        }
	},
};
</script>

<style lang='less' scoped="scoped">
// .content {
//     ::v-deep .el-textarea__inner {
//         background-color: #1A2648;
//     }
// }
.xterm-screen{
  min-height: calc(100vh);
}
</style>
<style scoped>
 h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

</style>