fs     = require 'fs'
{exec} = require 'child_process'
util   = require 'util'


task 'watch:all', 'Watch all coffee-script files in all directories', ->
	invoke 'watch:test'
	invoke 'watch:app'
	invoke 'watch:public'

task 'watch:test', 'Watch all coffee-script files in the test directory', ->
	
	
task 'watch', 'Watch coffee-script files in directory passed as option', (options) ->
	log "Options #{options}"
	dir = options.dir or '.'
	log "Directory #{dir}"
	files = fs.readDirSync(dir)

	
coffee = (options = "", file) ->
  log "Compiling #{file}"
  exec "coffee #{options} --compile #{file}", (err, stdout, stderr) -> 
    handleError(err) if err
    log "Compiled #{file}"
    
handleError = (error) ->
	log error
	
log = (message) ->
	util.log message
