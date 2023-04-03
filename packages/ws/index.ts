import crypto from "node:crypto";
import net from "node:net";
import { join } from "node:path";
import { EventEmitter } from "node:stream";

interface WSSOptions {
  port?: number // default 8567
  debug?: boolean
}

export interface Message {
  from: 'client'|'server',
  msg: Buffer,
  time: number,
  isString: boolean
}

export interface Connection extends EventEmitter {
  id: string
  connectedAt: number
  status: string
  remoteAddress: string | undefined
  messages: Array<Message>
  frameCache: {
    isString: boolean,
    data: Buffer
  } | null
  send: (data: Buffer, isString: boolean) => void
}

// declare module ws {
//   class WebSocketServer extends EventEmitter {
//     on(event: 'connection', listener: (conn:Connection) => void): this;
//   }
// }

//////////////////////
// helper functions //
//////////////////////

function getSecWebsocketKey(data: string){
  const lines = data.split('\r\n');
  let key = "";
  lines.some(text => {
    if (text.startsWith('Sec-WebSocket-Key')) {
      key = text.split(':')[1].trim();
      return true;
    }
  })
  return key;
}

function getSecWebSocketAccept(key: string) {
  const MAGIC_STRING = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  return crypto.createHash('sha1')
  .update(key + MAGIC_STRING)
  .digest('base64');
}

const unmask = (buffer: Buffer, mask: Buffer) => {
  const length = buffer.length;
  for (var i = 0; i < length; i++) {
      buffer[i] ^= mask[i & 3];
  }
}

function genSocketId() {
  const date = new Date();
  return String(date.getDate()).padStart(2, "0")
    + String(date.getMinutes()).padStart(2, "0")
    + String(date.getSeconds()).padStart(2, "0")
    + Math.random().toString(32).substring(2);
}

function checkUpgrade(data: Buffer) {
  const dataString = data.toString();
  return dataString.includes('Upgrade: websocket');
}

function sendMessage(socket: net.Socket, data: Buffer, isString = true) {
  // 向客户端回复一条消息（需要编码成合法的数据帧）
  var responsePayloadLength = data.length;
  var responseFrame;

  if (responsePayloadLength < 126) {
    responseFrame = Buffer.alloc(responsePayloadLength + 2);
    responseFrame[1] |= responsePayloadLength;
    data.copy(responseFrame, 2);
  } else {
    // 未处理数据大于 64位 长度的情况
    responseFrame = Buffer.alloc(responsePayloadLength + 4);
    responseFrame[1] |= 126;
    responseFrame.writeUInt16BE(responsePayloadLength, 2);
    data.copy(responseFrame, 4);
  }

  responseFrame[0] |= parseInt(isString ? "10000001": "10000010", 2);

  socket.write(responseFrame);
}

/**
 * 简易专用 websocket 服务
 */
export class WebSocketServer extends EventEmitter {

  on(event: 'connection', listener: (conn:Connection) => void): this;
  on(event: string, listener: (...args: any[]) => void) {
    super.on(event, listener);
    return this;
  }

  protected options: WSSOptions;
  protected server: net.Server;

  // private socketsMap: WeakMap<net.Socket, string> = new WeakMap();
  private wsConnections: Map<string, Connection> = new Map();

  constructor(options: WSSOptions) {
    super();
    const port = options.port = options.port || 8567;
    this.options = options;
    this.server = this.createServer();
    if (options.debug) {
      this.server.on('listening', () => console.log(`\n;;;\n[tcp server]:on listening]\n;;;`));
      this.server.on('connection', () => console.log(`\n;;;\n[tcp server]:on connection]\n;;;`));
      this.server.on('error', (err) => console.log(`\n;;;\n[tcp server]:on error]\n;;;`, err));
      this.server.on('close', () => console.log(`\n;;;\n[tcp server]:on close]\n;;;`));
      this.server.on('drop', () => console.log(`\n;;;\n[tcp server]:on drop]\n;;;`));
    }
    this.server.listen(port);
  }

  private createServer() {
    return net.createServer(
      this.handleConnect.bind(this)
    );
  }

  private handleConnect(connection: net.Socket) {
    console.log('tcp connected!');

    const id = genSocketId();

    if (this.options.debug) {
      const eventNames = [ 'connect', 'ready', 'data', 'timeout', 'end', 'error', 'close' ];
      eventNames.forEach(e => {
        connection.on(e, (...args) => {
          console.log(`\n;;;\n[debug:socket[new]:on ${e}]\n;;;`, ...args);
        })
      })
    }

    connection.on('data', this.handleSourceData.bind(this, id, connection));
  }

  /**
   * 处理原始消息
   */
  private handleSourceData(id: string, socket: net.Socket, data: Buffer) {

    if (!!this.wsConnections.get(id)) {
      const connInfo = this.wsConnections.get(id);
      connInfo && this.handleWebsocketMessage(connInfo, socket, data);
      return;
    }

    if (checkUpgrade(data)) {
      this.handleUpgrade(socket, data);
      const send = sendMessage.bind(null, socket);
      const connInfo: Connection = new (class extends EventEmitter {
        constructor() {
          super();

          Object.assign(this, {
            id,
            status: 'connect',
            connectedAt: Date.now(),
            remoteAddress: socket.remoteAddress,
            messages: [],
            frameCache: null,
            send
          });
        }
      }) as Connection;

      this.wsConnections.set(id, connInfo);

      [ 'connect', 'ready', 'data', 'timeout', 'end', 'error', 'close' ].forEach(e => {
        socket.on(e, (...args) => {
          connInfo.status = e;
        })
      });

      this.emit('connection', connInfo);
      return;
    }

    socket.write(Buffer.from(
      [
        'HTTP/1.1 400 Bad Request',
        '\r\n'
      ].join('\r\n')
    ));
    socket.end();
  }

  /**
   * 最简化握手逻辑
   */
  handleUpgrade(socket: net.Socket, data: Buffer) {
    const dataString = data.toString();
    const key = getSecWebsocketKey(dataString);
    const secWebSocketAccept = getSecWebSocketAccept(key);
    let res = [
      'HTTP/1.1 101 Switching Protocols',
      'Upgrade: websocket',
      `Sec-WebSocket-Accept: ${secWebSocketAccept}`,
      'Connection: Upgrade',
      '\r\n'
    ].join('\r\n');
    socket.write(res);
  }

  /**
   * 处理 ws 消息
   */
  handleWebsocketMessage(conn: Connection, socket: net.Socket, buffer: Buffer) {
    let fin = (buffer[0] & 0b10000000) === 0b10000000; // 是否是最后一帧
    let opcode = buffer[0] & 0b00001111; // 操作码 0x0表示接上一帧 0x1表示文本，0x2表示二进制
    let mask = (buffer[1] & 0b10000000) === 0b10000000; // 是否有掩码
    let payloadLength = buffer[1] & 0b01111111; // 负载长度
    let maskKey: Buffer;
    let payloadData: Buffer;

    if (!mask) {
      // 如果客户端发送的消息没有掩码则关闭连接
      console.log('非法的数据帧', Array.from(buffer).map(v => v.toString(2)),join(' '));
      socket.end();
      return;
    }

    if (opcode === 0x8) {
      // 如果操作码是0x8，表示关闭连接请求
      console.log('客户端请求关闭连接');
      socket.end();
      return;
    }

    if (payloadLength === 126) {
      payloadLength = Number('0b' + Array.from(Uint8Array.prototype.slice.call(buffer, 2, 4)).map(v => v.toString(2)).join(''));
      maskKey = Uint8Array.prototype.slice.call(buffer, 4, 8) as Buffer;
      payloadData = Uint8Array.prototype.slice.call(buffer, 8) as Buffer;
    } else if (payloadLength === 127) {
      payloadLength = Number('0b' + Array.from(Uint8Array.prototype.slice.call(buffer, 2, 10)).map(v => v.toString(2)).join());
      maskKey = Uint8Array.prototype.slice.call(buffer, 10, 14) as Buffer;
      payloadData = Uint8Array.prototype.slice.call(buffer, 14) as Buffer;
    } else {
      maskKey = Uint8Array.prototype.slice.call(buffer, 2, 6) as Buffer;
      payloadData = Uint8Array.prototype.slice.call(buffer, 6) as Buffer;
    }

    var decodedData = Buffer.alloc(payloadLength);
    for (var i = 0; i < payloadLength; i++) {
      decodedData[i] = payloadData[i] ^ maskKey[i % 4];
    }

    if (opcode === 1 || opcode === 2) {
      if (fin) {
        conn.messages.push({
          from: 'client',
          time: Date.now(),
          msg: decodedData,
          isString: opcode === 1
        });
      } else {
        conn.frameCache = {
          isString: opcode === 1,
          data: decodedData
        };
      }
    } else if(opcode === 0) {
      if (conn.frameCache) {
        conn.frameCache.data = Buffer.concat([
          conn.frameCache.data,
          decodedData
        ]);
      } else {
        console.error('unexpected frame droped');
        return;
      }
      if (fin) {
        conn.messages.push({
          from: 'client',
          time: Date.now(),
          isString: conn.frameCache.isString,
          msg: conn.frameCache.data
        })
      }
    }

    if (fin) {
      const message = conn.messages[conn.messages.length - 1];
      conn.emit('message', message);
    }
  }

  sendMessageTo(id: string, data: Buffer, isString = true) {
    const conn = this.wsConnections.get(id);
    if (conn == null) {
      throw new Error('the id (' + id + ') was not found.');
    }
    if (['end', 'close'].includes(conn.status)) {
      throw new Error('the socket (' + id + ') was closed.');
    }
    conn.send(data, isString);
  }

  sendMessageToAll(data: Buffer, isString = true) {
    this.wsConnections.forEach(conn => conn.send(data, isString));
  }
}
