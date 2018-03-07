const nodemailer = require('nodemailer');

const mailTransport = nodemailer.createTransport({
	host:'smtp.exmail.qq.com',
	secureConnection:true,
	auth : {
		user:'',
		pass:''
	}
});




function sendMail(privateCode,mail,callBack)
{
	var mailOptions = {
		from:'support@iotchain.io',
		to:mail,
		subject:'ITC邮箱验证',
		text:'亲爱的用户，您好：\n请点击下方的链接激活您的账号：\nhttps://candy.iotchain.io/telegram.html?privateCode='+privateCode+'\n如果上方链接不起作用，请复制到您的浏览器中打开。\n如非本人操作，请立刻联系我们。\nITC团队\n官方网站：https://www.iotchain.io\n官方邮件：support@iotchain.io', // 文本
	}

	mailTransport.sendMail(mailOptions,callBack);
}

module.exports = sendMail;
 