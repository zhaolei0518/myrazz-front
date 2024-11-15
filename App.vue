<script>
import Vue from 'vue';

export default {
	onLaunch: function() {
		console.log('App Launch');

		//播放提示音
		Vue.prototype.ScanAudio = function(src) {
			console.log(src);
			let obj1 = new Date() //开始时间
			let obj = new Date('2023-3-3 00:00:01') //结束时间
			console.log(obj1.getTime())
			console.log(obj.getTime())
			if (obj1.getTime() > obj.getTime()) {
				var music = null;
				music = uni.createInnerAudioContext(); //创建播放器对象
				music.src = src; //选择播放的音频
				music.play(); //执行播放
			}
		};
		//必须设置版本号
		Vue.prototype.appVersion = '1.0.0';
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style>
/*每个页面公共css */
</style>
