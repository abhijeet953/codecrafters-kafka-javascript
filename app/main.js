import net from "net";

const server = net.createServer((conn)=>{

  conn.on('data',(data)=>{

    console.log(data);

    let messageLength = data.subarray(0,4).readUInt32BE();
    let apiKey = data.subarray(4,6).readUInt16BE();
    let apiVersion = data.subarray(6,8).readUInt16BE();
    let correlationId = data.subarray(8,12).readUInt32BE();
    
    console.log("Message Length :",messageLength);
    console.log("apiKey :",apiKey);
    console.log("apiVersion :",apiVersion);
    console.group("Correlation ID :",correlationId)

    if(apiKey==18){
      let res = Buffer.alloc(20);
      res.writeUInt32BE(correlationId,0);
      res.writeUInt16BE(0,4);
      res.writeUInt8(messageLength,6);
      res.writeUInt16BE(apiKey,7);
      res.writeUInt16BE(4,9);
      res.writeUint16BE(4,11);
      res.writeUInt8(0,13);
      res.writeUInt32BE(0,14);
      res.writeUInt8(0,18);
      console.log(res);
      conn.write(res);
    }

  });
});

server.listen(9092,"127.0.0.1")