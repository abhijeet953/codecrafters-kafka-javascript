import net from "net";

const server = net.createServer((conn)=>{

  conn.on('data',(data)=>{

    console.log(data);

  });
});

server.listen(9092,"127.0.0.1")