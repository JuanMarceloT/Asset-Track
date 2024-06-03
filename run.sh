#!/bin/bash

# Array to store terminal PIDs
pids=()

# Function to add PID to the array
add_pid() {
    pids+=("$1")
}

# Function to kill all terminal processes
kill_terminals() {
    for pid in "${pids[@]}"; do
        kill -9 "$pid"
    done
}


# Trap to catch script exit and kill terminals
trap 'kill_terminals' EXIT

echo "executing database"
gnome-terminal -- bash -c "cd repo;docker compose up;" &
add_pid $!

echo "executing node"
gnome-terminal -- bash -c "cd controller;nodemon main.js;" &
add_pid $!

echo "executing React"
gnome-terminal -- bash -c "cd View; npm start;" &
add_pid $!

# Wait for all commands to finish
wait
