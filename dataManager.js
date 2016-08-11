/*jshint node: true, bitwise:true, curly:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true, node:true, asi:false, es5: true, evil: true, nomen: true */
'use strict';

/**
 *  创造优雅的代码，享受开发的乐趣。
 *  网站: swiftcafe.io
 *  微信公众号: swift-cafe
 */


var PromiseKit = require("promise");
var promiseHelper = require("./promiseHelper");
var path = require("path");
var fs = require("fs");

/**
 * 数据管理类
 * @constructor
 */
function DataManager() {

}

// apiURL, imageFolder, imageKey, jsonFileName

/**
 * @description 更新数据文件
 * 
 * @param {Object} options
 * @param {string} options.url 请求的 API 
 * @param {string} options.SavedJSONFolder JSON 数据文件的保存路径
 * @param {string} options.SavedImgFolder 图片下载保存路径
 * @param {string} options.savedFileName JSON 文件的保存路径
 * @param {function} options.cbImgURL 获取图片 URL 的回调
 * @param {function} options.cbImgName 获取图片名称的回调
 * @param {function} options.cbSetImgURL 设置图片 URL 的回调
 * @return {promise} Promise 对象
 */
DataManager.prototype.updateContent = function (options) {

	var apiURL = options.url;
	var imageFolder = options.SavedImgFolder;
	var jsonFileName = options.savedFileName;
	var jsonPath = options.SavedJSONFolder;
	var cbImgURL = options.cbImgURL;
	var cbImgName = options.cbImgName;
	var cbSetImgURL = options.cbSetImgURL;

	var promise = new promiseHelper();
	console.log("任务开始：" + apiURL);	

	return new PromiseKit(function(fullfill, reject) {

		promise.requestJSON(apiURL).then(function(items) {
			
			console.log("JSON 解析完成.");			
			console.log("清理图片目录...");
			promise.clearFolder(imageFolder).then(function(){
				
				console.log("清理完成。");	
				console.log("开始下载图片..." + items.length);	
				
				PromiseKit.all(items.map(function(item){
					
					return promise.downloadImage(item, imageFolder, cbImgURL, cbImgName, cbSetImgURL);
						
				})).done(function(){

					console.log("图片下载完成。");
					console.log("开始保存 JSON");
					fs.writeFile(path.join(jsonPath, jsonFileName), JSON.stringify(items), function(err) {

						if (err) {
							
							console.log("保存文件失败。");
							reject();

						} else {

							console.log("成功");
							fullfill();

						}

					});
					

				}, function(){

					console.log("图片下载失败。");	
					reject();

				});	

			});
			
		});

	});

};


module.exports = DataManager;