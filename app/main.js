import net from  "net";

const server = net.createServer((connection)=>{

  connection.on('data',(data)=>{

    let length = data.subarray(0,4).readUInt32BE();
    console.log(length);
  });
});

server.listen(9092,"127.0.0.1")