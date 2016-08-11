/*jshint node: true, bitwise:true, curly:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true, node:true, asi:false, es5: true, evil: true, nomen: true */
'use strict';

/**
 *  创造优雅的代码，享受开发的乐趣。
 *  网站: swiftcafe.io
 *  微信公众号: swift-cafe
 */


// 引入需要的库
var request = require("request");
var fs = require("fs");
var path = require("path");
var PromiseKit = require("promise");

/**
 * Promise 工具类
 * @constructor
*/
function PromiseHelper() {

}

/**
 * 请求 URL 数据
 * @param  {string} 请求 URL
 * @return {promise} Promise 对象
 */
PromiseHelper.prototype.requestAPI = function (url) {

	return new PromiseKit(function(fullfill, reject) {

		request(url, function(error, response, body){

			if(!error && response.statusCode == 200) {
				
				fullfill(body);

			} else {

				reject(error);

			}

		});

	});

};

/**
 * 请求数据并解析 JSON
 * @param  {[string]} 请求 URL
 * @return {[promise]} Promise 对象
 */
PromiseHelper.prototype.requestJSON = function (url) {

	return this.requestAPI(url).then(JSON.parse);

};


/**
 * @param  {jsonObject} JSON 对象
 * @param  {[string]} 图片保存路径
 * @param  {[string]} 图片 key
 * @return {[promose]} Promise 对象
 */
PromiseHelper.prototype.downloadImage = function(item, imageFolder, funcImgURL, funcImgName, funcSetImgURL) {

	return new PromiseKit(function(fullfill, reject) {

		if(funcImgURL(item) !== null) {

			// var ext = path.extname(item[imageKey]);
			// var assetFolder;				
			// if(imageKey === "imgURL") {
				
			// 	assetFolder = "videosImage";
			// 	fileName = item.videoId + ext;

			// } else {

			// 	assetFolder = "newsImage";
			// 	fileName = path.basename(item[imageKey]);

			// }
			var fileName = funcImgName(item);
			var filePath = path.join(imageFolder, fileName);
			console.log("download image " + funcImgURL(item));

			request(funcImgURL(item)).pipe(fs.createWriteStream(filePath)).on("finish", function(){
				
				console.log("download finished " + funcImgURL(item));				
				if(funcSetImgURL) {
					funcSetImgURL(item);
				}												
				// item[imageKey] = "assets:\/\/" + assetFolder + "\/" + fileName;				
				fullfill();

			}).on("error", function(){

				console.log("download error");
				reject();

			});

		} else {

			reject();

		}

	});

};

/**
 * 读取指定目录下的所有文件
 * @param  {[string]} 文件所在目录的路径
 * @return {[promise]} Promise 对象
 */
PromiseHelper.prototype.readDir = function(path) {

	return new PromiseKit(function(fullfill, reject) {

		fs.readdir(path, function(err, files){

			if(err) {

				reject(err);

			} else {

				fullfill(files);

			}

		});		

	});

};

/**
 * 删除文件
 * @param  {[string]} 文件路径
 * @return {[promise]} Promise 对象
 */
PromiseHelper.prototype.unlinkFile = function(filePath) {

	return new PromiseKit(function(fullfill, reject) {

		fs.unlink(filePath, function(err){

			if(err) {				
				reject(err);
			}else {
				fullfill();
			}

		});

	});

};

/**
 * 清除图片目录
 * @param  {[string]} 要删除的目录路径
 * @return {[promise]} Promise 对象
 */
PromiseHelper.prototype.clearFolder = function(folderPath) {

	var that = this;

	return new PromiseKit(function(fullfill, reject) {
		
		that.readDir(folderPath).done(function(files) {

			PromiseKit.all(files.map(function(fileName){
				
				return that.unlinkFile(path.join(folderPath, fileName));

			})).then(function(){
				
				fullfill();

			});

		}, reject);
	 

	});

};


module.exports = PromiseHelper;
