import net from "net";

const server = net.createServer((conn) => {

  conn.on('data', (data) => {

    console.log(data);

    let messageLength = data.subarray(0, 4).readUInt32BE();
    let apiKey = data.subarray(4, 6).readUInt16BE();
    let apiVersion = data.subarray(6, 8).readUInt16BE();
    let correlationId = data.subarray(8, 12).readUInt32BE();

    console.log("Message Length :", messageLength);
    console.log("apiKey :", apiKey);
    console.log("apiVersion :", apiVersion);
    console.group("Correlation ID :", correlationId)

    if (apiKey == 18) {
      if (apiVersion < 0 || apiVersion > 4) {
        let res = Buffer.alloc(5);
        res.writeInt32BE(correlationId, 0);
        res.writeUInt8(0, 5);
        console.log("APIVERSION IS OUTSIDE THE BOUNDS");
        conn.write(res);
      }
      else {
        let res = Buffer.alloc(22);
        res.writeUInt32BE(16, 0); // Total length of the response excluding length prefix
        res.writeUInt32BE(correlationId, 4);
        res.writeUInt16BE(0, 8); // Error code
        res.writeUInt8(8, 10); // Length of the following fields + 1
        res.writeUInt16BE(apiKey, 11);
        res.writeUInt16BE(4, 13); // Min version
        res.writeUInt16BE(4, 15); // Max version
        res.writeUInt8(0, 17); // _tagged_fields[0] length
        res.writeUInt32BE(0, 18); // Throttle time
        res.writeUInt8(0, 22); // _tagged_fields length
        console.log(res);
        conn.write(res);
      }
    }

  });
});

server.listen(9092, "127.0.0.1")