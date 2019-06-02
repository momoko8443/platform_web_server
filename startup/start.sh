#!/bin/bash
echo "starting platform_web_server"
nohup DOMAIN=47.111.18.121 npm run start  & echo $! > ./startup/process.pid
echo "done!"
