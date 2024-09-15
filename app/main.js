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
        const res = Buffer.alloc(32); // Allocate a buffer of the required size

        // Write Correlation ID (4 bytes)
        console.log(res);
        res.writeUInt32BE(correlationID, 0);

        // Write Error Code (2 bytes)
        console.log(res);
        res.writeUInt16BE(0, 4);

        // Write Length (1 byte) – Length of the rest of the response body
        console.log(res);
        res.writeUInt8(8, 6); // Corrected length to 8 based on the BufferWriter example
        console.log(res);

        // Write API Key (2 bytes)
        console.log(res);
        res.writeUInt16BE(18, 7);

        // Write Min Version (2 bytes)
        console.log(res);
        res.writeUInt16BE(4, 9);

        // Write Max Version (2 bytes)
        console.log(res);
        res.writeUInt16BE(4, 11);

        // Write _tagged_fields[0] Length (1 byte)
        console.log(res);
        res.writeUInt8(0, 13); // Length of tagged fields
        console.log(res);

        // Write Throttle Time (4 bytes)
        console.log(res);
        res.writeUInt32BE(0, 14);

        // Write _tagged_fields Length (1 byte)
        console.log(res);
        res.writeUInt8(0, 18); // Length of additional tagged fields
        connection.write(res);
      default:
        connection.write(correlationIDString);
        let errorCode = Buffer.alloc(2);
        errorCode.writeUInt16BE(0);
        connection.write(errorCode);
    }

  });
});

server.listen(9092, "127.0.0.1")