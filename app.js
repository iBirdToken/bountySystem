const Koa = require('koa');
const app = new Koa();
const router = require('./route/route');
const bodyParser = require('koa-bodyparser');
const cors = require('koa-cors');


app.use(bodyParser());
app.use(cors());
app.use(router.routes(), router.allowedMethods());
// response

app.on('error', function (err, ctx) {
	console.log(err)
	// logger.error('server error', err, ctx)
})

app.listen(3000);





/*****telegramBot******/
const TelegramBot = require('node-telegram-bot-api');
const token = '462566247:AAFHrPPnTn2miIbN_7O7rAYG06WQJK6yVVM';
const bot = new TelegramBot(token, {polling: true});
const request = require('request');


bot.onText(/\/echo ([0-9a-fA-F]{32})/, (msg, match) => {
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  var telegramId = msg.from.first_name+' '+msg.from.last_name;
  request.post({
  	json:{
  		privateCode:resp,
  		telegramId:telegramId
  	},
  	url:'http://localhost:3000/joinTelegram'
  },function(error, response, body){
    if (error) {
      bot.sendMessage(chatId, '加入telegram任务失败,请再次输入', {reply_to_message_id:msg.message_id});
    }else{
      if (body.code == 200) {
        bot.sendMessage(chatId, '完成joinTelegram任务', {reply_to_message_id:msg.message_id});
      }else{
        bot.sendMessage(chatId, body.msg, {reply_to_message_id:msg.message_id});
      }
    }
  	
  })
  // send back the matched "whatever" to the chat
});

