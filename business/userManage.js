const database = require('../database/database');
const validation = require('../common/validation');
const mailer = require('../common/sendMail')
const crypto = require('crypto');

function JSONObject(code,data,msg)
{
	return {
		'code':code,
		'data':data,
		'msg':msg
	}
}


async function getUserList()
{
	var users = await database.models.candyuser.findAll();
	// console.log(users);
	if (users == null) {
		return JSONObject(200,{},'暂无用户');
	}else{
		return JSONObject(200,users,'用户列表获取成功');
	}
}

async function getMe(privateCode)
{
	var user = await database.models.candyuser.findOne({
		where:{
			privateCode:privateCode
		}
	})
	if (user == null) {
		return JSONObject(400,{},'用户不存在');
	}else{
		return JSONObject(200,user.dataValues,'');
	}
}

async function register(ethAddr,inviterCode)
{
	var isEthAddr = validation.ethValidation(ethAddr);
	if (isEthAddr == false) {
		//不是有效的以太地址;
		return JSONObject(400,{},'非法的以太坊地址')
	}else{
		//是有效的以太坊地址
		var user = await database.models.candyuser.findOne({
			where:{
				ethAddr:ethAddr
			}
		});
		if (user == null) {
			//用户不存在新建用户
			var newUser = await database.models.candyuser.create({
				ethAddr:ethAddr,
				privateCode:crypto.createHash('md5').update(ethAddr+Date.now()).digest("hex"),
				inviterCode:(inviterCode==undefined?'':inviterCode)
			})
			if (newUser != null) {
				return JSONObject(200,newUser.dataValues,'注册成功')
			}else{
				return JSONObject(500,{},'注册失败')
			}
		}else{
			//用户已经注册
			return JSONObject(200,user.dataValues,'以太坊地址已注册')
		}
	}
}

async function sendVerifyMail(privateCode,mail)
{
	var isMailAddr = validation.mailValidation(mail);
	if (isMailAddr == true) {
		var user = await database.models.candyuser.findOne({
			where:{
				privateCode:privateCode
			}
		});
		if (user == null) {
			return JSONObject(400,{},'该用户不存在');
		}else{
			var result = await user.update({
				mail:mail
			})
			if (result == null) {
				return JSONObject(500,{},'更新邮箱信息失败');
			}else{
				//发送跳转验证邮件
				return JSONObject(200,{},'邮箱发送成功');
			}
		}
	}else{
		return JSONObject(400,{},'非法的邮箱地址')
	}
}

async function mailVerify(privateCode)
{
	var user = await database.models.candyuser.findOne({
		where:{
			privateCode:privateCode
		}
	});
	if (user == null) {
		return JSONObject(400,{},'该用户不存在');
	}else{
		var result = await user.update({
			mailVerify:true
		})
		if (result == null) {
			return JSONObject(500,{},'验证邮箱失败');
		}else{
			return JSONObject(200,{},'验证邮箱成功');
		}
	}
}


async function joinTelegram(privateCode,telegramId)
{
	var user = await database.models.candyuser.findOne({
		where:{
			privateCode:privateCode
		}
	});
	if (user == null) {
		return JSONObject(400,{},'该用户不存在');
	}else{

		if (user.dataValues.joinTelegram == true) {
			return JSONObject(400,{},'该用户已经加入telegram群');
		}else{
			var result = await user.update({
				joinTelegram:true,
				telegramId:telegramId,
				totalCoin:++user.totalCoin
			});
			if (result ==null) {
				return JSONObject(500,{},'请在telegram群里重新输入命令');
			}else{
				inviteSuccess(result);
				return JSONObject(200,{},'加入telegram群成功');
			}
		}
	}
}

async function telegramVerify(privateCode)
{
	var user = await database.models.candyuser.findOne({
		where:{
			privateCode:privateCode
		}
	})
	if (user == null) {
		return JSONObject(400,{},'该用户不存在');
	}else{
		if (user.dataValues.joinTelegram == true) {
			return JSONObject(200,user.dataValues,'该用户已经加入telegram群');
		}else{
			return JSONObject(400,{},'该用户没有加入telegram群');
		}
	}
}


async function shareTwitter(privateCode)
{
	var user = await database.models.candyuser.findOne({
		where:{
			privateCode:privateCode
		}
	});
	if (user == null) {
		return JSONObject(400,{},'该用户不存在');
	}else{
		var updateContent = {
			twitterTaskSign:false,
			twitterShareTimes:user.dataValues.twitterShareTimes+1
		}
		if (user.twitterTaskSign == true) {
			updateContent.totalCoin = ++user.totalCoin;
		}
		var result = await user.update(updateContent);
		if (result ==null) {
			return JSONObject(500,{},'twitter分享失败');
		}else{
			inviteSuccess(result);
			return JSONObject(200,{},'twitter分享成功');
		}
	}
}

async function shareFacebook(privateCode)
{
	var user = await database.models.candyuser.findOne({
		where:{
			privateCode:privateCode
		}
	});
	if (user == null) {
		return JSONObject(400,{},'该用户不存在');
	}else{
		var updateContent = {
			facebookTaskSign:false,
			facebookShareTimes:user.dataValues.facebookShareTimes+1
		}
		if (user.facebookTaskSign == true) {
			updateContent.totalCoin = ++user.totalCoin;
		}
		var result = await user.update(updateContent);
		if (result ==null) {
			return JSONObject(500,{},'facebook分享失败');
		}else{
			inviteSuccess(result);
			return JSONObject(200,{},'facebook分享成功');
		}
	}
}

//user.dataValues 用户数据
async function inviteSuccess(user)
{
	//mailVerify == true 邮箱验证暂时取消
	var userData = user.dataValues;
	if (userData.verifyAll == false) {
		if (userData.joinTelegram == true && userData.twitterTaskSign == false && userData.facebookTaskSign == false && userData.mailVerify ==true && userData.verifyAll == false) {
			var updateUser = await user.update({
				verifyAll:true
			});
			if (updateUser != null) {
				var inviter = await database.models.candyuser.findOne({
					where:{
						privateCode:updateUser.dataValues.inviterCode
					}
				});
				if (inviter != null) {
					var inviteCount = inviter.dataValues.inviteCount+1;
					var totalCoin = parseInt(inviter.dataValues.totalCoin)+1;
					var result = await inviter.update({
						inviteCount:inviteCount,
						totalCoin:totalCoin
					})
					if (result != null) {
						console.log('更新邀请者奖励success')
					}
				}
			}
		}
	}
}


module.exports = {
	getUserList:getUserList,
	getMe:getMe,
	register:register,
	sendVerifyMail:sendVerifyMail,
	mailVerify:mailVerify,
	joinTelegram:joinTelegram,
	telegramVerify:telegramVerify,
	shareTwitter:shareTwitter,
	shareFacebook:shareFacebook
}




