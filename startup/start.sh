#!/bin/bash
echo "starting platform_web_server"
nohup npm run start & echo $! > ./startup/process.pid
echo "done!"
