#!/bin/bash

git pull origin main
yarn build
pm2 delete pnpm build

echo "Stopping all PM2 processes..."
pm2 stop all

echo "Deleting all PM2 processes..."
pm2 delete all

echo "Stopping PM2 daemon..."
pm2 kill

pm2 start npm --name "superchat" -- start 

