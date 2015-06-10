/*
 * @module grunt-live
 * @author v_b
 * @description Run multiple applications as a grunt task
 * @license MIT
 */

/*jslint node: true */
'use strict';

module.exports = function(grunt) {

  function log(message){
    grunt.log.write(('\r\ngrunt-alive: ' + message + '\r\n').magenta);
  }

  function Alive(appName, args, done){
    var child = null;
    var spawnArgs = args;
    var name = appName;
    var self = this;
    var KILL_SIGNAL = 'SIGKILL';
    var END_SIGNAL = 'SIGINT';
    var ready = done;

    process.on('exit', function() {
      self.end();
    });

    function shutDownChild(signal){
      if(child === null)
        return;

      child.kill(signal);      
    }


    function spawnProcess(args){  
      var child_process = require('child_process');
      var _ = require('lodash');

      if(process.env){
        var processEnv = _.cloneDeep(process.env);
        processEnv = _.defaults(args.opts.env, processEnv);
      }
      
      return child_process.spawn(args.cmd, args.args, args.opts);
    }

    function spawn(){
      child = spawnProcess(spawnArgs);

      child.on('exit', function(code, signal) {
        child = null;
        if (signal !== null) {
          log('[' + name + '] with app [' + spawnArgs.cmd + '], exited with signal: ' + signal);
        } 
        else {
          log('[' + name + '] with app [' + spawnArgs.cmd + '], exited with exit code: ' + code);
        }

        if (signal === KILL_SIGNAL) {
          self.start();          
        }
      });
    }

    function kill(){
      shutDownChild(KILL_SIGNAL);
    }


    this.start = function(){
      if(child !== null){
        kill();
      }
      else{
        log('start [' + name + '] with app [' + spawnArgs.cmd + ']');      
        spawn();
        ready();
      }
      
    };

    this.end = function(){
      log('shutdown [' + name + '] with app [' + spawnArgs.cmd + ']');      
      shutDownChild(END_SIGNAL);
    };
  }

  var _sysList = {};

  grunt.registerMultiTask('alive', 'starts some processes', function() {    
    var doneHandler = this.async();
    var done = function(){
      doneHandler();
    };

    var sys = this.target;
    var args = this.data;

    var alive;
    if(_sysList[sys]){
      alive = _sysList[sys];    
    }
    else{
      alive = new Alive(sys, args, done);    
    }

    _sysList[sys] = alive;
    alive.start();

  });  

};
