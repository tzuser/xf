const request=require('request');
const fs=require('fs');
const urlencode=require('urlencode');
const md5=require('md5');
const Base64 = require('js-base64').Base64;
var player = require('play-sound')(opts = {})

const APPID="5b67c4ab";
const API_KEY="358e56b2385183929e9d5cb6b1a2a005";

//时间戳
const timeStamp=(time)=>{
	return  Math.floor(time/1000);
}
//授权认证
const authorize=({json})=>{
	let curTime=timeStamp(+new Date()).toString();
	let jsonString=JSON.stringify(json).replace(/:/g,": ");
	const paramBase64=Base64.encode(jsonString);
	const checkSum=md5(API_KEY+curTime+paramBase64);
	let res={
		"X-Appid":APPID,
		"X-CurTime":curTime,
		"X-CheckSum":checkSum,
		"X-Param":paramBase64,
		'Content-Type':'application/x-www-form-urlencoded; charset=utf-8',

	}
	return res;
}

const test=()=>{
	let param={
		auf:"audio/L16;rate=16000",
		aue:"raw",
		voice_name:"xiaoyan",
	}
	let headerAuthorize=authorize({json:param})
	request({
		method: 'POST',
		url:"http://api.xfyun.cn/v1/service/v1/tts",
		headers: headerAuthorize,
		form:{text:"科大讯飞成立于1999年，是中国领先的智能化语音技术提供商，其语音核心技术代表世界领先水平。我们提供的语音合成效果，达到了真正可商用的标准，您可以在这里输入任意文本进行语音合成体验。"},
	},function (e, r, body) {
		if(e){console.error(e)}
		player.play('./test.mp3');
	}).pipe(fs.createWriteStream('test.mp3'))
}

test()
