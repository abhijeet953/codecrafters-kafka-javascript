import net from "net";

const server = net.createServer((conn) => {

  conn.on('data', (data) => {

    console.log(data);

    let api_version_bytes = data.subarray(6,8).readUInt16BE(0);
    let correlation_bytes = data.subarray(8,12).readUInt32BE(0);

    console.log(api_version_bytes);
    console.log(correlation_bytes);

    

  });
});

server.listen(9092, "127.0.0.1")