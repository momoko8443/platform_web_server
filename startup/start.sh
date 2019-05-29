#!/bin/bash
echo "starting platform_web_server"
nohup node ./server.js  & echo $! > ./startup/process.pid
echo "done!"
