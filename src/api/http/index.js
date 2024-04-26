export default {
  api: {
    //任务管理
    taskList:'/task/',
    //任务详情
    taskInfo:'/task/detail',
    //任务详情日志
    taskInfoLog:'/task/tp',
    //代理信息
    agentQueryList:'/agent/',
    //代理删除
    agentDel:'/agent/del',
    //目标信息获取
    targetQueryList:'/target/',
    targetMap:'target/map',
    //目标信息筛选基础数据
    targetFilter:'/target/filter',
    //目标信息时延
    targetDelay:'/target/delay',
    taskOps:'/task/ops',
    //任务创建
    taskCreate:'/task/create',
    taskDel:'/task/del',
    //仪表盘——num
    sysNum:'/sys/num',
    //仪表盘-柱状图数据接口
    sysNumDate:'/sys/num/date',
    //仪表盘—系统操作日志
    sysLog:'sys/log',
    //系统管理——用户列表  **创建用户也是该接口区别为 获取是get  创建是post**
    user:'/user/',

    // 登录
    login: '/token', // 登录
    getMenus: '/api/user/menu', // 获取菜单
    // 首页
    getTargetStatistics: '/api/target/statistic', // 首页-靶场统计数据
    getimageStatistics: '/api/image/statistic', // 首页-镜像统计数据
    getSourceStatistics: '/api/target/source/statistic', // 首页-资源统计数据
    getNodeStatistics: '/api/target/node/statistic', // 首页-节点统计数据

    // 靶场管理
    getTargets: '/api/targets',  // 获取靶场列表
    target: '/api/target', // 自定义创建靶场 + 自定义更新靶场 + 删除靶场
    quickInterface: '/api/target/quick/interface', // interface：快速创建靶场 + 快速更新靶场
    quickConsensus: '/api/target/quick/consensus', // consensus：快速创建靶场 + 快速更新靶场
    asyncTarget: '/api/async/target', // 异步删除靶场
    asyncQuickInterface: '/api/async/target/quick/interface', // interface：异步快速创建靶场 + 快速更新靶场
    asyncQuickConsensus: '/api/async/target/quick/consensus', // consensus：异步快速创建靶场 + 快速更新靶场
    task: '/api/task', // 获取接口任务执行进度

    // 靶场配置管理
    getSettingList: '/api/settings', // 获取靶场配置列表
    setting: '/api/setting/single', // 添加 + 删除 + 修改靶场配置
    singleDeploy: '/api/setting/deploy/single', // 靶场配置-部署
    pipeline: '/api/setting/pipeline/single', // 靶场配置-运行流水线
    batchDeply:'/api/setting/deploy/batch', // 靶场配置-批量部署
    batchPipeline: '/api/setting/pipeline/batch',// 靶场配置-批量运行流水线
    batchDel:'/api/setting/batch', // 靶场配置-批量删除
    getTorDict: '/api/setting/tor_version', // 根据role获取tor_verson列表
    getImageDict: '/api/images', // 获取镜像列表
    getCountryDict: '/api/countries', // 获取国家列表
    getNetworkDict: '/api/networks', // 获取网络列表
    getOutPortDict: '/api/setting/available_port', // 获取代理端口里欸包

    asynDelSetting: '/api/async/setting/single', // 异步删除靶场配置
    asynBatchDel:'/api/async/setting/batch', // 异步批量删除靶场配置

    // 靶场节点管理
    worldMap: '/api/node/worldmap', // 世界地图的节点数据
    getNodeList: '/api/nodes', // 靶场节点列表

    // 靶场节点详情
    getNodeDetail: '/api/node/detail', // 获取节点详情
    getCpu: '/api/node/monitor/cpu', // 获取cpu折线图数据
    getMemory: '/api/node/monitor/memory', // 获取memory折线图数据
    getNodeFile: '/api/node/files', // 获取节点流量采集文件列表
    downloadNodeFile: '/api/node/files/download', // 下载节点流量采集文件
    flowStartStop: '/api/traffic/single/switch', // 开始 + 结束
    getLog: '/api/node/log', // 日志
    downloadLog: '/api/node/log/download', // 下载日志
    getWebshell: '/api/node/webshell/url', // 获取webshell地址
    getWebsocketUrl: '/api/node/websocket/url', // 获取websocket地址
    getCurrentDir: '/api/node/filemanager/currentdir',// 文件管理:获取当前路径下文件
    uploadFile: '/api/node/filemanager/currentdir/upload', // 上传文件
    delFile: '/api/node/filemanager/file/delete', // 删除文件
    downloadFile: '/api/node/filemanager/file/download', // 下载文件
    makeDir: '/api/node/filemanager/currentdir/makedir',// 新建文件夹
    delDir: '/api/node/filemanager/dir/delete',// 删除文件夹

    //靶场节点管理-批量上传和下载
    batchUpload: '/api/node/filemanager/currentdir/batch/upload', // 批量上传
    batchDownload: '/api/node/filemanager/file/batch/download', // 批量下载

    //靶场节点管理-批量采集流量
    getTaskList: '/api/traffic/tasks', // 获取任务列表
    trafficTask: '/api/traffic/task', // 新增 + 修改 + 删除 任务
    getTrafficNodes: '/api/traffic/task/nodes', // 获取流量节点列表
    taskStartStop: '/api/traffic/task/switch', // 开始 + 结束
    getPackList: '/api/traffic/task/pcaps', // 获取pcap包列表
    downloadPacp: '/api/traffic/task/pcap/download', // 下载packp文件

    getRuleList: '/api/rules', //  获取规则列表
    rule: '/api/rule', // 新增 + 修改 + 删除 规则

    // 个人管理
    updatePwd: '/api/person/password', // 更新密码

    // 用户管理
    getUserList: '/api/users', // 获取用户列表
    addUser: '/api/user', // 新增用户
    delUser: '/api/user', // 删除用户
    editUserPwd: '/api/user/password', // 修改角色
    editUserRole: '/api/user/role', // 修改密码
    getMenuList: '/api/user/menu', // 获取用户菜单

    //角色管理
    getRoleList: '/api/roles', // 获取用户角色列表
    addRole: '/api/role', // 新增角色
    delRole: '/api/role', // 删除角色
    editRole: '/api/role/permissions', // 修改角色权限
    delPermission: '/api/role/permission', // 删除权限
    getPermissionList: '/api/permission', // 获取权限列表

    // 国家网络管理
    getCountryList: '/api/countries', // 获取国家列表
    country: '/api/country', // 创建 + 修改 + 删除国家
    getNetList: '/api/networks', // 获取网络列表
    getNetwork: '/api/network/', // 获取单个网络
    network: '/api/network/single', // 创建 + 修改网络
    delNetwork: '/api/network', // 删除网络
    judgeNetwork: '/api/network/judge/', // 检验cidr是否合理

    // 镜像管理
    statistics4:'/darkNetProbe/node/statistics',
    earth:'darkNetProbe/node/earth',
    getImages:'api/images', //镜像模块主页面 ：条件/分页获取镜像
    addImage:'/api/image',  //自定义镜像
    updateImage:'/api/image',  //自定义镜像
    buildImage:'api/image/build',// 构建镜像
    delImage:'api/image',// 删除镜像
    infoImage:'api/image/detail',// 镜像详情
    asyncUpdateImage: '/api/async/image', // 异步更新镜像
    asyncAddImage: '/api/async/image', // 异步新增镜像
    asyncBuildImage: '/api/async/image/build', // 异步构建镜像



    //系统管理

    //系统介绍

  },
}