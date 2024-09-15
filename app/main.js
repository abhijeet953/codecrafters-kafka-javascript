import net from "net";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  //Now we have to extract the correlation ID from the 
  //incoming request

  connection.on("data",(data)=>{
    connection.write(data.subarray(4,12));
  });

  // const coorelationID = 7;
  // const response = Buffer.from([0,0,0,0,0,0,0,coorelationID]);
  // connection.write(response);
});

server.listen(9092, "127.0.0.1");
