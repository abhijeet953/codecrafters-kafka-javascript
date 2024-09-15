import net from "net";

const server = net.createServer((conn)=>{

  conn.on('data',(data)=>{

    console.log(data);

    let messageLength = data.subarray(0,4).readUInt32BE();
    let apiKey = data.subarray(4,6).readUInt16BE();
    let apiVersion = data.subarray(6,8).readUInt16BE();
    console.log("Message Length :",messageLength);
    console.log("apiKey :",apiKey);
    console.log("apiVersion :",apiVersion);

  });
});

server.listen(9092,"127.0.0.1")