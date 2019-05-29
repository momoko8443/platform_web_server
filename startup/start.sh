#!/bin/bash
echo "starting platform_web_server"
nohup node ./server.js  & echo $! > ./bin/process.pid
echo "done!"
