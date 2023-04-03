import { WebSocketServer } from "../index";

const wss = new WebSocketServer({port: 8900, debug: true});

wss.on('connection', conn => {
  conn.on('message', (data: { msg: Buffer }) => {
    console.log(data.msg.toString());
    conn.send(Buffer.from('23333'), true);
  });
  conn.on('end', () => console.log('end'));
})