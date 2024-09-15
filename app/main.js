import net from "net";

const server = net.createServer((connection) => {

  connection.on('data', (data) => {
    console.log(data);
    let length = data.subarray(0, 4).readUInt32BE();
    console.log(length);
    let apiKey = data.subarray(4, 6).readUInt16BE();
    let apiVersion = data.subarray(6, 8).readUInt16BE();
    let correlationID = data.subarray(8, 12).readUInt32BE();
    let correlationIDString = correlationID.toString();
    console.log(apiKey)
    console.log(apiVersion);
    console.log(correlationID);

    switch (apiKey) {
      case 18:
        if (apiVersion < 0 || apiVersion > 4) {
          connection.write(correlationIDString);
          let errorCode = Buffer.alloc(2);
          errorCode.writeUInt16BE(35);
          connection.write(errorCode);
        }
        
      default:
        connection.write(correlationIDString);
        let errorCode = Buffer.alloc(2);
        errorCode.writeUInt16BE(-1);
        connection.write(errorCode);
    }

  });
});

server.listen(9092, "127.0.0.1")