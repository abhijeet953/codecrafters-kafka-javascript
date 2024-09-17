import net from "net";

//we will use functions to properly refactor the code.
// the general thing is to take out the first 4 byte which gives us the length of the header + message
// then we can handle the header and message separately




const server = net.createServer((conn) => {

  conn.on('data', (data) => {

    console.log(data);

    let header = data.subarray(0,4).readUint32BE(0);
    console.log("header :",header);


  });
});

server.listen(9092, "127.0.0.1")