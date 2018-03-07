const database = require('../database/database');
var rp = require('request-promise');


function JSONObject(code,data,msg)
{
	return {
		'code':code,
		'data':data,
		'msg':msg
	}
}

async function source(type,remoteAddr)
{
	var newUser = false;

	var record = await database.models.source_record.create({
		type:type,
		ip:remoteAddr
	})
	if (record != null) {
		console.log('更新访问记录成功');
		var visitor = await database.models.visitor.findOne({
			where:{
				user_ip:record.dataValues.ip
			}
		})
		if (visitor != null) {
			//用户存在
			var result = await visitor.update({
				visitTimes:visitor.dataValues.visitTimes+1
			})
			if (result != null) {
				console.log('用户信息更新成功');
			}else{
				console.log('用户信息更新失败');
			}
		}else{
			//用户不存在
			newUser = true;
			var location = await getInfo(remoteAddr);
			var newVisitorInfo = {
				user_ip:remoteAddr,
				visitTimes:1
			}
			if (location.code == 200) {
				newVisitorInfo.country = location.data.country;
				newVisitorInfo.province = location.data.region;
				newVisitorInfo.city = location.data.city;
			}
			var newVisitor = await database.models.visitor.create(newVisitorInfo);
			if (newVisitorInfo != null) {
				console.log('新用户添加成功');
			}else{
				console.log('新用户添加失败');
			}
		}

		var source = await database.models.source.findOne({
			where:{
				type:type
			}
		})
		if (source != null) {
			//来源存在
			var result = await source.update({
				total_ip:newUser==true?(source.dataValues.total_ip+1):source.dataValues.total_ip,
				totalTimes:source.dataValues.totalTimes+1
			})
			if (result != null) {
				console.log('来源信息更新成功');
			}
		}else{
			var newSource = await database.models.source.create({
				type:type,
				total_ip:newUser==true?1:0,
				totalTimes:1
			})
			if (newSource != null) {
				console.log('来源信息添加成功');
			}
		}
		return JSONObject(200,{},'访问记录成功');

	}else{
		return JSONObject(500,{},'更新访问来源记录失败')
	}
}

async function getInfo(ip)
{
	if (ip == undefined) {
		ip = '47.91.197.22'
	}
	var result = await getIpInfo(ip);
	result = JSON.parse(result);
	if (result.code == 0) {
		return JSONObject(200,result.data,'IP定位成功');
	}else{
		return JSONObject(400,{},'无法获取IP定位');
	}
}


function getIpInfo(ip)
{
	var url = 'http://ip.taobao.com/service/getIpInfo.php?ip=' + ip ; 
	return rp(url)
    .then(function (result) {
        return result;
    })
    .catch(function (err) {
    	return err;
    });
}


module.exports = {
	source:source,
	getInfo:getInfo
}