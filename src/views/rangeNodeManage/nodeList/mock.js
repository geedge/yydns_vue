const getTargetsResponse ={
    "code": 200,
    "message": "success",
    "result": {
        "items": [
            {
              "setting_id": 1,
              "traffic_collect_task_id": 1,
              "id": 1,
              "ip": "1.1.1.1",
              "pod_name": "pod_name1",
              "nick_name": "第一节点",
              "status": "未部署",
              "onion": "onion1",
              "create_time": "2023-12-26T10:51:15.363Z",
              "complete_time": "2023-12-26T10:51:15.363Z"
            },
            {
              "setting_id": 2,
              "traffic_collect_task_id": 2,
              "id": 2,
              "ip": "2.2.2.2",
              "pod_name": "pod_name2",
              "nick_name": "第二节点",
              "status": "已部署",
              "onion": "onion2",
              "create_time": "2023-12-26T10:51:15.363Z",
              "complete_time": "2023-12-26T10:51:15.363Z"
            }
          ],
      "total": 0,
      "page": 1,
      "size": 50,
      "pages": 0
    }
  }

export { getTargetsResponse }