{
  "name": "%NOMBRE_APP%",
  "app_id": "324566f8",
  "gulpStartupTasks": [
    "sass",
    "watch"
  ],
  "watchPatterns": [
    "scss/**/*",
    "www/**/*",
    "!www/lib/**/*"
  ],
  "proxies": [
    {
      "path": "/yuberapi/rest/",
      "proxyUrl": "http://192.168.43.49:8080/yuberapi/rest/"
    }
  ]
}
