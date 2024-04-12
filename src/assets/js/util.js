//公共方法封装---------  注意：没有挂载到vue实例
import axios from 'axios'
axios.defaults.baseURL = 'http://' + window.g.baseURL;  
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.interceptors.response.use(function (response) {  //设置响应拦截，获取后端相应信息不然接口返回时headers为空
    return response;
}, function (error) {
    return Promise.reject(error);
});

export default {
	formatDate(date) {               //日历日期范围选择---->时间格式转换
		// console.log(date)
		if(date==""||date==undefined){                  //判断是否为空
			return '';
		}else if(date.toString().indexOf('-') > -1) {   //判断是否已经为标准格式
		    return date
		}
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		m = m < 10 ? '0' + m : m;
		var d = date.getDate();
		d = d < 10 ? ('0' + d) : d;
		var hours = date.getHours();
		hours = hours < 10 ? ('0' + hours) : hours;
		var min = date.getMinutes();
		min = min < 10 ? ('0' + min) : min;
		var sec = date.getSeconds();
		sec = sec < 10 ? ('0' + sec) : sec;
		return y + '-' + m + '-' + d + ' ' + hours + ':' + min + ':' + sec;
	},
	exportMethod(data) {            //post请求后端返回的数据流导出excel文件
		if(data.method=="get"){
			axios({
				method: data.method,
				url: data.url,
				params:data.params,
				responseType: 'blob'
			}).then((res) => {
				console.log(res)
				const link = document.createElement('a');
				let blob = new Blob([res.data], {type: 'application/ms-txt.numberformat:@'})      //csv  格式文件   类似excel格式  
				//let blob = new Blob([res.data], {type: 'application/x-excel'})                    //excel  格式文件   
				link.style.display = 'none';
				link.href = URL.createObjectURL(blob);
				link.download = data.name;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}).catch(error => {
				console.log(error)
			});
		}else{
			axios({
				method: data.method,
				url: data.url,
				data:data.params,
				responseType: 'blob'
			}).then((res) => {
				console.log(res)
				const link = document.createElement('a');
				let blob = new Blob([res.data], {type: 'application/ms-txt.numberformat:@'})      //csv  格式文件   类似excel格式  
				//let blob = new Blob([res.data], {type: 'application/x-excel'})                    //excel  格式文件   
				link.style.display = 'none';
				link.href = URL.createObjectURL(blob);
				link.download = data.name;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}).catch(error => {
				console.log(error)
			});
		}
    },
    exportMethod2(data) {            //post请求后端返回的数据流导出pcap文件
		if(data.method=="get"){
			axios({
				method: data.method,
				url: data.url,
				params:data.params,
				responseType: 'blob',
				
			}).then((res) => {
				console.log(res)
				const fileName = res.headers.filename;
				const link = document.createElement('a');
				let blob = new Blob([res.data], {type: 'application/x-pcap'});
				link.style.display = 'none';
				link.href = URL.createObjectURL(blob);
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}).catch(error => {
				console.log(error)
			});
		}else{
			axios({
				method: data.method,
				url: data.url,
				data: data.params,
				responseType: 'blob'
			}).then((res) => {
				const fileName = res.headers.filename;
				const link = document.createElement('a');
				let blob = new Blob([res.data], {type: 'application/x-pcap'});
				link.style.display = 'none';
				link.href = URL.createObjectURL(blob);
				link.download = fileName;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}).catch(error => {
				console.log(error)
			});
		}
    },

	//时间戳转标准格式时间
	formatDateTime(inputTime) {
		var date = new Date(inputTime);
		var y = date.getFullYear();
		var m = date.getMonth() + 1;
		var d = date.getDate();
		var h = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		m = m < 10 ? ('0' + m) : m;
		d = d < 10 ? ('0' + d) : d;
		h = h < 10 ? ('0' + h) : h;
		minute = minute < 10 ? ('0' + minute) : minute;
		second = second < 10 ? ('0' + second) : second;
		// return y + '-' + m + '-' + d+' '+h+':'+minute+':'+second;
		return y + '-' + m + '-' + d;
	},
    nowTime(){      //获取当前时间
    	function format(i) {
	        return (i < 10 ? "0" + i : i);
	    }
	    var date = new Date();
	    var year = date.getFullYear();
	    var month = format(date.getMonth() + 1);
	    var day = format(date.getDate());
	    var arr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	    var week = arr[date.getDay()];
	    var hour = format(date.getHours());
	    var minute = format(date.getMinutes());
	    var second = format(date.getSeconds());
	    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    },
    nowTime2(){      //获取当前时间不带-- 
    	function format(i) {
	        return (i < 10 ? "0" + i : i);
	    }
	    var date = new Date();
	    var year = date.getFullYear();
	    var month = format(date.getMonth() + 1);
	    var day = format(date.getDate());
	    var arr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	    var week = arr[date.getDay()];
	    var hour = format(date.getHours());
	    var minute = format(date.getMinutes());
	    var second = format(date.getSeconds());
	    return year + month + day + hour + minute + second;
    },
    nowTime3(){      //获取当前日期  
    	function format(i) {
	        return (i < 10 ? "0" + i : i);
	    }
	    var date = new Date();
	    var year = date.getFullYear();
	    var month = format(date.getMonth() + 1);
	    var day = format(date.getDate());
	    var arr = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
	    var week = arr[date.getDay()];
	    var hour = format(date.getHours());
	    var minute = format(date.getMinutes());
	    var second = format(date.getSeconds());
	    return year + '-' + month + '-' + day;
    },
    fulltime(val){      //转换时间格式
    	if(!val){
    		return ''
    	}
        let arr = val.split(':');
        if(arr[0] < 10){
        	arr[0] = '0' + arr[0]
        }
        return arr.join(':')
    },
	//时间格式转时间戳
   	formatDateTamp(inputTime) {
		if(!inputTime){
			return ''
		}
		let time=inputTime.getTime()/1000
		return parseInt(time)
  	},
	langfn(val){    //国家名称转义
		if(!val){
			return '';
		}
		let langArr = {"OTHERS":"未知","AA":"阿法尔语","US":"英语","FR":"法语","LI":"林堡语","SE":"北萨米语","AB":"阿布哈兹语","FY":"弗里西亚语","LN":"林加拉语","SG":"桑戈语","AE":"阿维斯陀语","GA":"爱尔兰语","LO":"老挝语","SH":"塞尔维亚-克罗地亚语","AF":"南非语","GD":"苏格兰盖尔语","LT":"立陶宛语","SI":"僧加罗语","AK":"阿坎语","GL":"加利西亚语","LU":"卢巴语","SK":"斯洛伐克语","AM":"阿姆哈拉语","GN":"瓜拉尼语","LV":"拉脱维亚语","SL":"斯洛文尼亚语","AN":"阿拉贡语","GU":"古吉拉特语","MG":"马达加斯加语","SM":"萨摩亚语","AR":"阿拉伯语","GV":"马恩岛语","MH":"马绍尔语","SN":"绍纳语","AS":"阿萨姆语","HA":"豪萨语","MI":"毛利语","SO":"索马里语","AV":"阿瓦尔语","HE":"希伯来语","MK":"马其顿语","SQ":"阿尔巴尼亚语","AY":"艾马拉语","HI":"印地语","ML":"马拉亚拉姆语","SR":"塞尔维亚语","AZ":"阿塞拜疆语","HO":"希里莫图语","MN":"蒙古语","SS":"斯瓦特语","BA":"巴什基尔语","HR":"克罗地亚语","MO":"摩尔达维亚语","ST":"南索托语","BE":"白俄罗斯语","HT":"海地克里奥尔语","MR":"马拉提语","SU":"巽他语","BG":"保加利亚语","HU":"匈牙利语","MS":"马来语","SV":"瑞典语","BH":"比哈尔语","HY":"亚美尼亚语","MT":"马耳他语","SW":"斯瓦希里语","BI":"比斯拉马语","HZ":"赫雷罗语","MY":"缅甸语","TA":"泰米尔语","BM":"班巴拉语","IA":"国际语A","NA":"瑙鲁语","TE":"泰卢固语","BN":"孟加拉语","ID":"印尼语","NB":"书面挪威语","TG":"塔吉克语","BO":"藏语","IE":"国际语E","ND":"北恩德贝勒语","TH":"泰语","BR":"布列塔尼语","IG":"伊博语","NE":"尼泊尔语","TI":"提格里尼亚语","BS":"波斯尼亚语","II":"四川彝语（诺苏语）","NG":"恩敦加语","TK":"土库曼语","CA":"加泰隆语","IK":"依努庇克语","NL":"荷兰语","TL":"他加禄语","CE":"车臣语","IO":"伊多语","NN":"新挪威语","TN":"塞茨瓦纳语","CH":"查莫罗语","IS":"冰岛语","NO":"挪威语","TO":"汤加语","CO":"科西嘉语","IT":"意大利语","NR":"南恩德贝勒语","TR":"土耳其语","CR":"克里语","IU":"因纽特语","NV":"纳瓦霍语","TS":"宗加语","CS":"捷克语","JA":"日语","NY":"尼扬贾语","TT":"塔塔尔语","CU":"古教会斯拉夫语","JV":"爪哇语","OC":"奥克语","TW":"特威语","CV":"楚瓦什语","KA":"格鲁吉亚语","OJ":"奥吉布瓦语","TY":"塔希提语","CY":"威尔士语","KG":"刚果语","OM":"奥洛莫语","UG":"维吾尔语","DA":"丹麦语","KI":"基库尤语","OR":"奥利亚语","UK":"乌克兰语","DE":"德语","KJ":"宽亚玛语","OS":"奥塞梯语","UR":"乌尔都语","DV":"迪维希语","KK":"哈萨克语","PA":"旁遮普语","UZ":"乌兹别克语","DZ":"不丹语","KL":"格陵兰语","PI":"巴利语","VE":"文达语","EE":"埃维语","KM":"高棉语","PL":"波兰语","VI":"越南语","EL":"现代希腊语","KN":"卡纳达语","PS":"普什图语","VO":"沃拉普克语","EN":"英语","KO":"朝鲜语、韩语","PT":"葡萄牙语","WA":"沃伦语","EO":"世界语","KR":"卡努里语","QU":"凯楚亚语","WO":"沃洛夫语","ES":"西班牙语","KS":"克什米尔语","RM":"罗曼什语","XH":"科萨语","ET":"爱沙尼亚语","KU":"库尔德语","RN":"基隆迪语","YI":"依地语","EU":"巴斯克语","KV":"科米语","RO":"罗马尼亚语","YO":"约鲁巴语","FA":"波斯语","KW":"康沃尔语","RU":"俄语","ZA":"壮语","FF":"富拉语","KY":"吉尔吉斯语","RW":"卢旺达语","ZH":"中文","FI":"芬兰语","LA":"拉丁语","SA":"梵语","ZU":"祖鲁语","FJ":"斐济语","LB":"卢森堡语","SC":"萨丁尼亚语","FO":"法罗语","LG":"卢干达语","SD":"信德语"}
		var val = val.toUpperCase();
	  return langArr[val]
	},
	flagsfn(val,obj){
		obj["Authority"] = "Bicon-quanweirenzheng"
		obj["BadExit"] = "Bicon-eyiwenjian"
		obj["Exit"] = "Bicon-cloud_d"
		obj["Fast"] = "Bicon-huo"
		obj["Guard"] = "Bicon-dunpai"
		obj["HSDir"] = "Bicon-wenjianjia"
		obj["Running"] = "Bicon-duihao"
		obj["Stable"] = "Bicon-yunduangoushixin"
		obj["StableDesc"] = "Bicon-guoqi"
		obj["V2Dir"] = "Bicon-wenjianjia1"
		obj["Valid"] = "Bicon-shuangduigou-xianxing"
		if(val.indexOf('Authority')>0){
		 obj["Authority"] = "Bicon-quanweirenzheng active"
		}
		if(val.indexOf('BadExit')>0){
		 obj["BadExit"] = "Bicon-eyiwenjian active"
		}
		if(val.indexOf('Exit')>0){
		 obj["Exit"] = "Bicon-cloud_d active"
		}
		if(val.indexOf('Fast')>0){
		 obj["Fast"] = "Bicon-huo active"
		}
		if(val.indexOf('Guard')>0){
		 obj["Guard"] = "Bicon-dunpai active"
		}
		if(val.indexOf('HSDir')>0){
		 obj["HSDir"] = "Bicon-wenjianjia active"
		}
		if(val.indexOf('Running')>0){
		 obj["Running"] = "Bicon-duihao active"
		}
		if(val.indexOf('Stable')>0){
		 obj["Stable"] = "Bicon-yunduangoushixin active"
		}
		if(val.indexOf('StableDesc')>0){
		 obj["StableDesc"] = "Bicon-guoqi active"
		}
		if(val.indexOf('V2Dir')>0){
		 obj["V2Dir"] = "Bicon-wenjianjia1 active"
		}
		if(val.indexOf('Valid')>0){
		 obj["Valid"] = "Bicon-shuangduigou-xianxing active"
		}
	},
	category(val){
		let cate={
			"Adult":{icon:"Bicon-220",name:'色情',old:'Adult'},
			"Business":{icon:"Bicon-shichangjianguanjigou-shi-nongmaoshichanggonggongzhixu",name:"市场",old:'Business'},
			"Communications":{icon:"Bicon-14",name:"通讯",old:'Communications'},
			"Core Sites":{icon:"Bicon-hexin",name:"核心网站",old:'Core Sites'},
			"Hosting":{icon:"Bicon-shehuituanti",name:"群众",old:'Hosting'},
			"Other Languages":{icon:"Bicon-t",name:"其他语言",old:'Other Languages'},
			"Personal":{icon:"Bicon-boke",name:"个人博客",old:'Personal'},
			"Politics and Religion":{icon:"Bicon-zhengzhi-tianchong",name:"政治宗教",old:'Politics and Religion'},
			"Social":{icon:"Bicon-shehuizuzhi",name:"社会",old:'Social'},
			"Technology":{icon:"Bicon-yingjijishu",name:"技术",old:'Technology'},
			"Gambling":{icon:"Bicon-dubo",name:"赌博",old:'Gambling'},
			"Other":{icon:"Bicon-qita",name:"其他",old:'Other'},
		}
		if(cate[val]!=undefined){
			return cate[val]
		}
	},
	//根据对象的key值进行排序
	sortkey(arr){
		if(!arr){
		return ''
		}
		// console.log(Object.keys(arr))
		let keys = Object.keys(arr).sort(function(a,b){
		return new Date(a) - new Date(b)
		});
		let newarr = {}
		// console.log(keys)
		keys.forEach(item=>{
		newarr[item] = arr[item]
		})
		return newarr
	},
	delarrfn(arr,item){   //需要去重的数组对象, 去重的依据(注意key:必须是字符串)
		let newobj = {};
		arr = arr.reduce((preVal, curVal) => {
			newobj[curVal[item]] ? '' : newobj[curVal[item]] = preVal.push(curVal);
			return preVal
		}, [])
		return arr
	},
	//导出公共代码封装
	tocsv(str){
		str = encodeURIComponent(str);
		var aLink = document.createElement("a");
		aLink.download = "downfile" + ".csv";
		aLink.href = "data:text/csv;charset=utf-8,\ufeff" + str;
		document.body.appendChild(aLink);
		aLink.click();
		document.body.removeChild(aLink);
	},
	//   删除对象为空的属性
	removeProperty(params){
		const keys = Object.keys(params);
		keys.map((key) => {
			if (!params[key]) {
			delete params[key];
			}
		});
	}
}