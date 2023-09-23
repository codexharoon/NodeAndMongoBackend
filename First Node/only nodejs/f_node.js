const http = require('http');
const port = 8000;

const server = http.createServer(
    (req,res) => {
        let url = req.url;
        if(req.url == '/'){
            res.statusCode = 200;
            res.setHeader('content-type','text/html');
            res.write("<h1>Home Page</h1>");
            res.end;
        }
        else if(req.url == '/about'){
            res.statusCode = 200;
            res.setHeader('content-type','text/html');
            res.write("<h1>About Page</h1>");
            res.end;
        }
        else{
            // res.write("<h1>"+ url + " page</h1>");
            res.statusCode = 404;
            res.setHeader('content-type','text/html');
            res.write("<h1 style=\"color: red\";>404 Page not Found!</h1>");
            res.end;
        }
    }
);


server.listen(port,()=>{
    console.log('server start at port '+port);
}
    
);