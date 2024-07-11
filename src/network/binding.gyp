{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "rpc.c"
      ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")"
      ]
    }
  ],
  "include_dirs": [
    "<!(node -p \"require('node-addon-api').include\")"
  ]
}