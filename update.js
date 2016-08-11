/*jshint node: true, bitwise:true, curly:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true, node:true, asi:false, es5: true, evil: true, nomen: true */
'use strict';

/**
 *  创造优雅的代码，享受开发的乐趣。
 *  网站: swiftcafe.io
 *  微信公众号: swift-cafe
 */

var DataManager = require("./dataManager");
var queue = require("queue");
var path = require("path");

var dm = new DataManager();
var taskQueue = queue();
taskQueue.concurrency = 1;


var assetPath = "file:\/\/\/asset\/";

/**
 * @description 开启新的数据更新任务
 * @param  {queue} 任务队列
 * @param  {options} 任务配置
 */
function enqueue(queue, options) {

	queue.push(function(cb){
		
		dm.updateContent(options).then(function(){ cb(); });

	});

}

enqueue(taskQueue, {
	"url": "http://api.swiftcafe.io/videos",
	"SavedJSONFolder": "../data/",
	"SavedImgFolder" : "../videoImages/",
	"savedFileName" : "videos.json",
	"cbImgURL" : function(item){ 	
		//...
	},
	"cbImgName" : function(item){

		//...

	},
	"cbSetImgURL" : function(item){

		//...
		
	}
});

enqueue(taskQueue, {
	"url": "http://api.swiftcafe.io/videos",
	"SavedJSONFolder": "../data/",
	"SavedImgFolder" : "../videoImages/",
	"savedFileName" : "videos.json",
	"cbImgURL" : function(item){ 	
		//...
	},
	"cbImgName" : function(item){

		//...

	},
	"cbSetImgURL" : function(item){

		//...
		
	}
});


taskQueue.start(function(){
	console.log("全部完成");
});