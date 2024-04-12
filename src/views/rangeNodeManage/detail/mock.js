const getTargetsResponse = {
  "code": 200,
  "message": "success",
  "result": {
    "setting_id": 70,
    "traffic_collect_task_id": null,
    "id": 90,
    "ip": "148.113.2.0",
    "pod_name": "target-11-relay-90-568f44566f-rvbl8",
    "nick_name": "relaykmuhkwkdjy",
    "status": "complete",
    "onion": null,
    "create_time": "2024-01-02T18:36:37",
    "complete_time": "2024-01-02T18:48:20",
    "role": null,
    "owner_setting": {
      "role": "relay",
      "image_id": 34,
      "replicas": "1",
      "bandwidth": 10,
      "memory": 100,
      "service": null,
      "tor_version": "4.8.9",
      "create_time": null,
      "update_time": null,
      "out_port": null,
      "socks_port": 19001,
      "control_port": 19002,
      "or_port": 7000,
      "dir_port": 9030,
      "use_network": {
        "cidr": "148.113.2.0/24"
      }
    }
  }
}

export { getTargetsResponse }