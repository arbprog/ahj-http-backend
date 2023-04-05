const Koa = require('koa');
const Router = require('koa-router');
const koaBody = require('koa-body').default;
const cors = require('@koa/cors');
const uuid = require('uuid');

const app = new Koa();
const router = new Router();

// const dateee = new Date();

const ticketsFull = [
  // {
  //   id: 1, // идентификатор (уникальный в пределах системы)
  //   name: '1 Поменять краску в принтере', // краткое описание
  //   description: '', // полное описание
  //   status: false, // boolean - сделано или нет
  //   created: dateee, // дата создания (timestamp)
  // },
  // {
  //   id: 2, // идентификатор (уникальный в пределах системы)
  //   name: '2 Переустановить Windows, ПК-Hall24', // краткое описание
  //   description: 'Описание второго тикета', // полное описание
  //   status: true, // boolean - сделано или нет
  //   created: dateee, // дата создания (timestamp)
  // },
  // {
  //   id: 3, // идентификатор (уникальный в пределах системы)
  //   name: '3 Установить обновление KB-XXX', // краткое описание
  //   description: 'Вышло критическое обновление для Windows, нужно поставить обновления', // полное описание
  //   status: true, // boolean - сделано или нет
  //   created: dateee, // дата создания (timestamp)
  // },
]; 

app.use(cors());
app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

// GET
router.get('/', (ctx, next) => {
  // const method = ctx.query.method;
  const params = new URLSearchParams(ctx.request.querystring);
  const { method, id } = { method: params.get("method"), id: params.get("id") };

  // все тикеты
  if (method === 'allTickets') { 
    const tickets = allTickets(ticketsFull);
    ctx.status = 200;
    ctx.body = { tickets };
    return;
  }

  // описание
  if (method === 'ticketById' && id !== null) { 
    const ticket = ticketsFull.find(el => el.id == id);

    if (!ticket) { 
      ctx.status = 400;
      ctx.body = {error: 'wrong id for create'};
      return;
    }

    const { description } = ticket;

    ctx.status = 200;
    ctx.body = { description };
    return;
  }

  // всё остальное для GET
  ctx.status = 200;
  ctx.body = { GET: 'ok', };
});

// POST
router.post('/', (ctx, next) => {
  const { name, description, status } = ctx.request.body;
  const params = new URLSearchParams(ctx.request.querystring);
  const { method, id } = { method: params.get("method"), id: params.get("id") };

  // новый тикет
  if (method === 'createTicket' && id === null) {
    const ticketID = uuid.v4();
    const ticketDate = new Date();
    const created = {
      id: ticketID, // идентификатор (уникальный в пределах системы)
      name: name, // краткое описание
      description: description, // полное описание
      status: status, // boolean - сделано или нет
      created: ticketDate, // дата создания (timestamp)
    }

    ticketsFull.push(created);

    ctx.status = 200;
    ctx.body = { created };
    return;
  }

  // всё остальное для POST
  ctx.status = 400;
  ctx.body = { POST: 'not fount', };
});

// DELETE
router.delete('/', (ctx, next) => {
  const params = new URLSearchParams(ctx.request.querystring);
  const { method, id } = { method: params.get("method"), id: params.get("id") };

  // удаление тикета
  if (method === 'removeTicket' && id !== null) {
    const ticket = ticketsFull.find(el => el.id == id);
    const index = ticketsFull.indexOf(ticket);

    if (index === '-1') {
      ctx.status = 400;
      ctx.body = {error: 'wrong id for remove'};
      return;
    }

    const removedArr = ticketsFull.splice(index,1);
    const removed = removedArr[0];

    ctx.status = 200;
    ctx.body = { removed };
    return;
  }

  // всё остальное для DELETE
  ctx.status = 400;
  ctx.body = { DELETE: 'not fount', };
});

// PUT
router.put('/', (ctx, next) => {
  const { name, description } = ctx.request.body;
  const params = new URLSearchParams(ctx.request.querystring);
  const { method, id } = { method: params.get("method"), id: params.get("id") };

  // изменение статуса
  if (method === 'ticketCompleted' && id !== null) { 
    const ticket = ticketsFull.find(el => el.id == id);

    if (!ticket) { 
      ctx.status = 400;
      ctx.body = {error: 'wrong id for create'};
      return;
    }

    const status = ticket.status = !ticket.status;

    ctx.status = 200;
    ctx.body = { status };
    return;
  }

  // изменение статуса
  if (method === 'ticketEdit' && id !== null) { 
    const edited = ticketsFull.find(el => el.id == id);

    if (!edited) { 
      ctx.status = 400;
      ctx.body = {error: 'wrong id for create'};
      return;
    }

    edited.name = name;
    edited.description = description;

    ctx.status = 200;
    ctx.body = { edited };
    return;
  }

  // всё остальное для PUT
  ctx.status = 400;
  ctx.body = { status: 'not fount', };
});

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(7070, () => {
  console.log('Server running on port 7070');
});

// функция для создания массива тикетов без описания
function allTickets(ticketsFull) {
  const tickets = [];

  if (!ticketsFull) { return false; }

  for (let i = 0; i < ticketsFull.length; i += 1) {
    const {
      id,
      name,
      status,
      created,
    } = ticketsFull[i];
    tickets.push( { id, name, status, created } );
  }

  return tickets;
}