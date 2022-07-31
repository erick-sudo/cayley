"use strict"

let http = require('http');
let url = require('url');
let path = require('path');
let fs = require('fs');
const { spawn } = require('child_process');
let qs = require('node:querystring');

let asynchFunction = function(rq,rs,callback) {
	process.nextTick(function() {
		callback(rq,rs);
	});
}

function readAndSendFile(request,response){
	let filename = url.parse(request.url).pathname;
	let root = process.cwd();

	if(path.normalize(filename).substring(0,5)=='/cgi/'){
		let N = qs.parse(request.url.substring(request.url.indexOf("?")+1))['Number'];
		let table = spawn(path.normalize(root+filename),[N]);
		let table_data = "";
		table.stdout.on("data", data => {
			table_data += data;
		});
		table.stderr.on("data", data=> {
			logInformation(`stderr: ${error.message}`,'logs/FileAccessErrors.txt');
		});
		table.on('error', (error) => {
			logInformation(`error: ${error.message}`,'logs/ServerErrors.txt');
		});
		table.on("close", code => {
			//console.log(`EXIT CODE ${code}`);
			logInformation(`${request.socket.remoteAddress} ${request.method} [CGI Request] ${filename}`,"logs/Access.txt");
			if (code == 0) {
				response.writeHead(200,{'Content-Type':`text/html`,'Access-Control-Allow-Origin':'*'});
				response.write(table_data);
				response.end();
			}
		});
		return
	}

	fs.readFile(path.join(root,filename), function(err,data) {
		if (err){
			logInformation(`${request.socket.remoteAddress} ${request.method} 404 ${filename}`,'logs/FileAccessErrors.txt');
			response.writeHead(404,{'Content-Type':'text/html'});
			response.write(fileNotFound());
			response.end();
		} else{
			logInformation(`${request.socket.remoteAddress} ${request.method} 200 ${filename}`,"logs/Access.txt");
			response.writeHead(200,{'Content-Type':`text/${path.extname(filename).substring(1)}`});
			response.write(data);
			response.end();
		}
	});
}

function logInformation(info,filename){
	fs.open(filename,"a",(err,fd) => {
		if (err) console.log(err);
		fs.write(fd,`\n ${Date()} `+info,(err) => {
			fs.close(fd, err => {
				if(err) throw err;
			})
		});
	});
}



function fileNotFound(){
	return "<h1>404 {File not Found}</h1>";
}

http.createServer((req,res) => {
	asynchFunction(req,res,readAndSendFile);
	}).listen(assignPort(), () => {console.log('Server running on port 1999')});

function assignPort(){
	let port = process.env.PORT;
	if(port == null || port == ""){
		port = 1999;
	}
	return port;
}