import net from "net";

const server = net.createServer((conn) => {

  conn.on('data', (data) => {

    console.log(data);

    const correlationId_bytes = data.subarray(8,12);

    console.log(correlationId_bytes);

  });
});

server.listen(9092, "127.0.0.1")