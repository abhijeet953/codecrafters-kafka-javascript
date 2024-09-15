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
        const res = new BufferWriter();
            res.withLengthPrefix(res => {
                res.writeInt32(correlationIdString)
                res.writeInt16(0) // Error code
                res.writeUInt8(2) // length + 1
                res.writeInt16(18) // api_key[0]
                res.writeInt16(4) // min_version[0]
                res.writeInt16(4) // max_version[0]
                res.writeUInt8(0) // _tagged_fields[0] length
                res.writeInt32(0) // throttle_time_ms
                res.writeUInt8(0) // _tagged_fields length
            })
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