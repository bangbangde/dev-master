#! /usr/bin/node

/**
 * 功能：设置 hosts 文件
 * 
 * 该脚本假设 hosts 脚本位于
 * > /etc/hosts (mac/linux)
 * > C:/Windows/System32/drivers/etc/hosts (windows)
 */
var fs = require('fs');
var os = require('os');

const WINDOWS = process.platform === 'win32'
const EOL = os.EOL;
const HOSTS_FILE_PATH = WINDOWS
? 'C:/Windows/System32/drivers/etc/hosts'
: '/etc/hosts'

function getHostsContent() {
  const source = fs.readFileSync(HOSTS_FILE_PATH, { encoding: 'utf8' }).split(EOL);
  const map = {};
  source.forEach((item, index) => {
    if (item.startsWith('#')) return;
    const sharpIndex = item.indexOf('#');
    const comment = sharpIndex >= 0 ? item.substring(sharpIndex) : null;
    const matches = /^\s*(\S+)\s+(\S+)/.exec(item);
    
    if (matches === null) return;

    const ip = matches[1];
    const host = matches[2];
    map[host] = {
      line: index,
      ip,
      host,
      comment,
      source: item
    }
  })
  return {
    source,
    map
  }
}

function writeHostsFile(content) {
  var stat = fs.statSync(HOSTS_FILE_PATH);
  fs.writeFileSync(HOSTS_FILE_PATH, content, { mode: stat.mode });
  return true
}

function set(ip, host, comment = 'by set-hosts.js') {
  const {source, map} = getHostsContent();
  const target = map[host];
  if (target) {
    source[target.line] = target.source.replace(target.ip, ip);
  } else {
    source.push(`${ip} ${host} # ${comment}`);
  }
  writeHostsFile(source.join(EOL));
}

function get(host) {
  const {source, map} = getHostsContent();
  const target = map[host];
  return target?.ip;
}

function remove(host) {
  const {source, map} = getHostsContent();
  const target = map[host];
  if (target) {
    source.splice(target.line, 1);
    writeHostsFile(source.join(EOL));
  } else {
    console.warn('not found', host);
  }
}

module.exports = {
  getHostsContent,
  writeHostsFile,
  set,
  get,
  remove
}