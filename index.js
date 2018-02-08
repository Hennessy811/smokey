// /start - начало общения, доступные команды. Можно выбрать подписаться на "Курилку", или на "Оповещения"
// Если выбран канал, то юзер добавляется в список получателей сообщений данного канала
// Юзер может отписаться от получения новостей из выбранного канала
// В выбранном канале юзер может отправить сообщение, которое придёт только слушателям данного канала
// Если юзер подписан более чем на один канал, то перед отправкой необходимо выбрать целевой канал

// response.json:
// { message_id: 40,
//     from:
//     { id: 264414372,
//         is_bot: false,
//         first_name: 'Dmitrij',
//         last_name: 'Malakhov',
//         username: 'Hennessy81',
//         language_code: 'ru' },
//     chat:
//     { id: 264414372,
//         first_name: 'Dmitrij',
//         last_name: 'Malakhov',
//         username: 'Hennessy81',
//         type: 'private' },
//     date: 1518006297,
//         text: 'msg',
//     reply:
//     { text: [Function],
//         photo: [Function],
//         video: [Function],
//         videoNote: [Function],
//         file: [Function],
//         sticker: [Function],
//         audio: [Function],
//         voice: [Function],
//         game: [Function],
//         action: [Function],
//         location: [Function],
//         place: [Function: bound place]
//     }
// }

let fs = require('fs');

let users = require('./users.json');

let smoke = Array.prototype.slice.call(users.smoke);
let info = Array.prototype.slice.call(users.info);

const token = '500983492:AAFRGhC0yjaC-MaFwgLjuISgSgp-YbOKeDk';

const TeleBot = require('telebot');
const bot = new TeleBot(token);
const commands = ['/smoke', '/unsmoke', '/info', '/uninfo', '/itstimetosmoke'];

function updateUsersList() {
    fs.writeFile('users.json', JSON.stringify(users), 'utf8', function (err, data){
        if (err){
            console.log(err);
        } else {
            console.log('gotcha!')
        }
    })
}

bot.on(['/start', '/hello'], (msg) => msg.reply.text('Привет! /help для получения списка команд'));

bot.on('/help', (msg) => {
    for (let i = 0; i < commands.length; i++) {
        msg.reply.text(commands[i]);
    }
});

bot.on('/smoke', (msg) => {
    if (smoke.includes(String(msg.from.id))) {
        msg.reply.text("Ты уже есть в списке!")
    } else {
        smoke.push(String(msg.from.id));
        users.smoke = smoke;
        updateUsersList();
        return msg.reply.text("Ты в списке!")
    }
});
bot.on('/unsmoke', (msg) => {
    if (smoke.includes(String(msg.from.id))) {
        smoke.splice(smoke.indexOf(String(msg.from.id)), 1);
        users.smoke = smoke;
        updateUsersList();
        return msg.reply.text("Бросил!")
    } else {
        return msg.reply.text("Ты и так не курил!")
    }
});
bot.on('/info', (msg) => {
    if (info.includes(String(msg.from.id))) {
        msg.reply.text("Ты уже есть в списке!")
    } else {
        info.push(String(msg.from.id));
        users.info = info;
        updateUsersList();
        return msg.reply.text("Ты в списке ВАЖНОЕ!")
    }
});
bot.on('/uninfo', (msg) => {
    if (info.includes(String(msg.from.id))) {
        info.splice(info.indexOf(String(msg.from.id)), 1);
        users.info = info;
        updateUsersList();
        return msg.reply.text("Отписался!")
    } else {
        return msg.reply.text("Ты и так не получешь сообщения!")
    }
});

bot.on('/itstimetosmoke', (msg) => {
    for (let i = 0; i < smoke.length; i++) {
        bot.sendMessage(smoke[i], 'Пора идти курить!');
    }
});

bot.start();