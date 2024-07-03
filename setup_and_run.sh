#!/bin/bash

echo "executing database"
gnome-terminal -- bash -c "cd repo;docker compose up;" &

echo "executing node"
gnome-terminal -- bash -c "cd controller;npm install ;nodemon main.js;" &

echo "executing React"
gnome-terminal -- bash -c "cd View;npm install; npm start;" &

echo "executing Yfinance"
gnome-terminal -- bash -c "
cd external_services;
if [ ! -d 'venv' ]; then
  echo 'Creating virtual environment and installing dependencies...';
  python3 -m venv venv;
  source venv/bin/activate;
  pip install -r requirements.txt;
else
  source venv/bin/activate;
fi
python yahoo-api.py;" &

wait
