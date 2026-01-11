const http = require("http");
const fs = require("fs");
const path = require("path");
const host = 'localhost';
const port = 5500;

const server = http.createServer((req,res) => { 
	let filepath = "."+req.url;
	if(filepath === "./"){ 
	filepath = './index.html';
	}

	const extname = path.extname(filepath);
	const mimeTypes = { 
	".html":"text/html",
	".css":"text/css",
	".js":"text/javascript",
	".png":"image/png",
	".svg":"image/svg+xml"
	}; 

	const contentType = mimeTypes[extname] || "application/octet-stream";
	const fileaddress = path.join(__dirname , 'public' , filepath);

	fs.readFile(fileaddress , (err , data) => { 
	if(err){ 
	res.writeHead(404 , {"Content-Type" :"text/plain"});
	res.end("file not found");
	return;
	}
	res.writeHead(200 , {"Content-Type" :contentType});
	res.end(data);
	});
});

server.listen(port , host , () => { 
console.log(`Server running on http://${host}:${port}`);
});
