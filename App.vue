<script>
import Vue from 'vue';

export default {
	onLaunch: function() {
		console.log('App Launch');

		//播放提示音
		Vue.prototype.ScanAudio = function(src) {
			console.log(src);
			
				var music = null;
				music = uni.createInnerAudioContext(); //创建播放器对象
				music.src = src; //选择播放的音频
				music.play(); //执行播放
			
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
