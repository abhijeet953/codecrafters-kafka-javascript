import net from  "net";

const server = net.createServer((connection)=>{

  connection.on('data',(data)=>{
    console.log(data);
    let length = data.subarray(0,4).readUInt32BE();
    console.log(length);
    let apiKey  = data.subarray(4,6).readUInt16BE();
    let apiKeyResponse = data.subarray(6,8).readUInt16BE();
    let correlationID = data.subarray(8,12).readUInt32BE();
    console.log(apiKey)
    console.log(apiKeyResponse);
    console.log(correlationID)

  });
});

server.listen(9092,"127.0.0.1")