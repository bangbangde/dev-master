#!/usr/bin/env node

const net = require("net");
const hosts = require("../index");
const [ip, host] = process.argv.slice(2);

if (!net.isIP(ip)) throw new Error('ip error:' + ip);

hosts.set(ip, host);
