# grunt-alive
> Run multiple applications as a grunt task

## Notes:
    * Non-blocking the task-runner
    * Restarts the applications when the task is called again

## Gruntfile.js Example

 ```javascript  
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      
      sass: {
        dist: {
          files: {
            'src/public/css/style.css': 'src/public/css/style.scss'
          }
        }
      },
      
      watch: {
        options: {
          nospawn: true,
          livereload: true
        },
        server: {
          files: [
            'src/bin/www',
            'src/app.js',
            'src/config.js',
            'src/routes/*.js',
            'src/lib/*.js',
            'src/utils/*.js'
          ],
          tasks: ['alive']
        }
      },
      alive:{
        webserver: {
          cmd: 'node',
          args: ['--debug', './bin/www'],
          opts: {
            stdio: 'inherit',
            env: { NODE_ENV: 'development'}
          }
        }
      }
    });
```

## Gruntfile.js example with multiple applications

```javascript
      alive:{
        frontend: {
          cmd: 'node',
          args: ['--debug', './bin/www'],
          opts: {
            stdio: 'inherit',
            env: { NODE_ENV: 'development'}
          }
        },
        backend: {
          cmd: 'node',
          args: ['--debug', './bin/backend'],
          opts: {
            stdio: 'inherit',
            env: { NODE_ENV: 'development'}
          }
        }
      }
```


## License (MIT)

Copyright (c) 2015, Viktor Braun.

## Author: Viktor Braun ([v_b][0])
[0]: http://github.com/v-braun/
