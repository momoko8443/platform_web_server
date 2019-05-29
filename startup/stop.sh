#!/bin/bash

PIDFILE="./startup/process.pid"  # PID文件路径
echo "stopping platform_web_server" 
if [ -f $PIDFILE ]; then
    echo "pid file exists...." 
    PID=$(cat $PIDFILE)           # 将PID从文件中读取，并作为一个变量
    sudo kill -QUIT $PID
    echo "done!"
fi
