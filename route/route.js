const Router = require('koa-router');
const router = new Router();
const userManage = require('../business/userManage');
const sourceManage = require('../business/sourceManage');
const mailer = require('../common/sendMail')

const rp = require('request-promise');



//获取所有用户
router.get('/getUserList', async(ctx)=>{
	var resObject = await userManage.getUserList();
	ctx.body=resObject;
})

//获取个人信息
router.get('/getMe', async(ctx)=>{
	var privateCode = ctx.request.query.privateCode;
	var resObject = await userManage.getMe(privateCode);
	ctx.body=resObject;
})

router.get('/source', async(ctx)=>{
	var type = ctx.request.query.type;
	var remoteAddr = ctx.request.header['x-real-ip'];
	console.log('type='+type+'****'+'ip:'+remoteAddr);
	var resObject = await sourceManage.source(type,remoteAddr);
	ctx.redirect('https://t.me/IoTChain');
	ctx.status = 302;
})


// router.get('/getInfo', async(ctx)=>{
// 	var ip = '207.97.227.239'
	
// 	var result = await sourceManage.getInfo(ip);
	
// 	ctx.body = result;
// })


//注册
router.post('/register', async(ctx)=>{
	var ethAddr = ctx.request.body.ethAddr;
	var inviterCode = ctx.request.body.inviterCode;
	var resObject = await userManage.register(ethAddr,inviterCode);
	ctx.body=resObject;
})

//发送验证邮件
router.post('/sendVerifyMail', async(ctx)=>{
	var privateCode = ctx.request.body.privateCode;
	var mail = ctx.request.body.mail;
	var resObject = await userManage.sendVerifyMail(privateCode,mail);
	if (resObject.code == 200) {
		mailer(privateCode,mail,function(error, info){
			// if (error) {
			// 	ctx.body = {code:500,msg:'邮件发送失败',data:{}};
			// }
			// ctx.body = {code:200,msg:'邮件发送成功',data:{}};
		});
	}
	ctx.body = resObject;
})

//邮箱验证完成
router.post('/mailVerify', async(ctx)=>{
	var privateCode = ctx.request.body.privateCode;
	var resObject = await userManage.mailVerify(privateCode);
	ctx.body = resObject;
})

//加入telegram
router.post('/joinTelegram', async(ctx)=>{
	var privateCode = ctx.request.body.privateCode;
	var telegramId = ctx.request.body.telegramId
	var resObject = await userManage.joinTelegram(privateCode,telegramId);
	ctx.body=resObject;
})

//验证加入telegram
router.post('/telegramVerify', async(ctx)=>{
	var privateCode = ctx.request.body.privateCode;
	var resObject = await userManage.telegramVerify(privateCode);
	ctx.body=resObject;
})

//twitter分享成功
router.post('/shareTwitter', async(ctx)=>{
	var privateCode = ctx.request.body.privateCode;
	var resObject = await userManage.shareTwitter(privateCode);
	ctx.body=resObject;
})

//facebook分享成功
router.post('/shareFacebook', async(ctx)=>{
	var privateCode = ctx.request.body.privateCode;
	var resObject = await userManage.shareFacebook(privateCode);
	ctx.body=resObject;
})


module.exports = router;