import Koa from 'koa';
import koaBody from 'koa-body';
import session from 'koa-session';
import controller from './controller';

const PORT = process.env.PORT || 3001;

const app = new Koa();

// common
app.use(async (ctx, next) => {
  const {method} = ctx;
  if(method === 'OPTIONS') {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', '*');
    return ctx.status = 200;
  }
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  ctx.set('Access-Control-Allow-Origin', `*`);
});

app.use(session(app));
app.use(koaBody());

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

controller(app);
app.listen(PORT);
