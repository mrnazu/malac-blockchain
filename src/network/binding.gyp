{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "rpc.c",
        "webs.c"
      ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').include\")"
      ]
    }
  ]
}