// src/config.js

const isProdEnv = process.env.REACT_APP_RUN_MODE === 'prod';

if (isProdEnv) {
  console.log = function() {};
  console.error = function() {};
  console.warn = function() {};
}
