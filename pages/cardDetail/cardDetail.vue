<template>
	<view class="page" :style="{ height: `${sysHeight}px`, width: `${sysWidth}px` }">
		<view class="titleView" :style="{ bottom: `${40}px` }">
			{{pageIndex+1}}/{{totalWord}}
		</view>
		<view
			v-for="(item, index) in dataList"
			class="move-view"
			:key="item._id"
			@touchend="touchend"
			@tap="tapCard(item)"
			@touchmove="touchMove"
			@touchstart="touchStart"
			:animation="animationData[index]"
			:style="{
				transform:
					index < number
						? `rotate(${rotate * index}deg) scale(${1 - (1 - scale.x) * index},${1 - (1 - scale.y) * index}) skew(${skew.x * index}deg, ${skew.y *
								index}deg) translate(${translate.x * index}px, ${translate.y * index}px)`
						: `rotate(${rotate * (number - 1)}deg) scale(${1 - (1 - scale.x) * (number - 1)},${1 - (1 - scale.y) * (number - 1)}) skew(${skew.x *
								(number - 1)}deg, ${skew.y * (number - 1)}deg) translate(${translate.x * (number - 1)}px, ${translate.y * (number - 1)}px)`,
				zIndex: `${99999 - item._id}`,
				opacity: index < number ? `${1 - (1 - opacity) * index}` : `${1 - (1 - opacity) * (number - 1)}`
			}"
		>
			<view class="cardBox"><card-box :thumbnail="`${apiHost}/api/files/${item.collectionId}/${item.id}/${item.thumbnail}`" :bgColor="item.bgColor"  :en="item.en" :zh="item.zh" ref="cardBox"></card-box></view>
	
		</view>
		
		</view>
	</view>
</template>

<script>
import wordbiz from '@/components/wordbiz/wordbiz.js';
import cardBox from './card-box';
import PocketBase from 'pocketbase';


// 在页面中定义插屏广告
let interstitialAd = null

export default {
	mixins: [wordbiz],
	components: { cardBox },
	data() {
		return {
			words:[],
			currentShowWordInfo:null,
			pageIndex:0,
			totalWord:0,
			bgViewColors : [
				'#198AFA',
				'#E86280',
				'#6F7EA8',
				'#327560',
				'#6F8FAB',
				'#768D9C',
				'#9599A1',
				'#F4B78C',
				'#F5AD44',
				'#2496D9',
				'#758640',
				'#CD3C4A',
				'#278F74',
				'#6E6E71',
				'#3E9DD6',
				'#E66466',
				'#D5B383'
			],
			dataGroup:[],
			originWords:[],
			apiHost:'https://www.word.heluobo.top'
		};
	},
	onLoad(options) {
		console.log(options)
		uni.setNavigationBarTitle({
			title:options.title
		})
	
		console.log("onload---------------------------")
	},
	mounted() {
	
	},
	methods: {
		//获取数据
		async getData(page,page_size) {
			var wordlist = await this.getWordsByCat(this.options.cat,page,page_size)
			var that = this
			let promise = new Promise((resolve, reject) => {
				console.log("getData")
				
				// that.dataList = that.dataList.concat(wordlist.items);
				that.dataList = wordlist.items
				that.totalWord = wordlist.totalItems;
				that.currentShowWordInfo = that.dataList[this.pageIndex];
				// that.ScanAudio(that.currentShowWordInfo.voiceURL);
				resolve();
			});
			return promise;
		},
		async getWordsByCat(cat,page,page_size){
		
			console.log("getWordsByCat from api", page, page_size)
			const pb = new PocketBase(this.apiHost);
			const wordList = await pb.collection('word').getList(page,page_size, {
				filter: `cat="${cat}"`,
			});
			return wordList
		},
		tapLove() {
			if (this.dataList.length == 0) return;
			this.moveX = 10; //设置角度y为0水平
			this.moveY = 1;
			this._del();
		},
		tapLoathe() {
			if (this.dataList.length == 0) return;
			this.moveX = -10; //设置角度
			this.moveY = 1;
			this._del();
		},
		//设置初始参数
		init() {
			this.number = 0; //card 3
			this.translate = { x: 0, y: 8 }; //y下移10px
			this.scale = { x: 0.95, y: 1 }; //x 缩小0.9
			this.type = true;

			this.moveRotate = {
				//设置位移图片旋转角度距离  card中心点 - 指向坐标
				x: 0,
				y: uni.getSystemInfoSync().screenHeight
			};
		},
		
		//触摸中判断
		moveJudge(x, y, ratio) {
			let el = this.$refs.cardBox[0];

			if (x > 20) {
				el.moveRight(ratio);
			} else if (x < -20) {
				el.moveLeft(ratio);
			} else {
				el.moveCenter();
			}
		},
		//触摸结束判断
		endJudge(x, y) {
			let el = this.$refs.cardBox[0];
			if (Math.abs(x) < 40) {
				this._back();
				el._back();
			} else {
				this._del();
				el.clearAnimation();
			}
		},
		//展示下一个单词
		nextCard(x, y) {
			console.log("nextCard----------",this.dataList.length)	
			if(this.pageIndex == this.totalWord){
				this.ScanAudio('/static/voice/sound_unbelievable.mp3');
				var that = this
				uni.showModal({
			          content: '已经学完，是否再来一遍？',
			          showCancel: true,
			          buttonText: '确定',
			          success: (res) => {
			            if (res.confirm) {
						that.pageIndex = 1
			              console.log('用户点击确定');
						  
						  // that.dataGroup = JSON.parse(decodeURIComponent(that.originWords));
						  that.dataGroup = that.originWords;
						  console.log(that.originWords)
						  console.log(that.dataGroup)
						  that.currentShowWordInfo = that.dataGroup[0]
						  that.ScanAudio(that.currentShowWordInfo.voice);
						  that.getData()
						  
			            } else if (res.cancel) {
			              console.log('用户点击取消');
						  uni.navigateBack({
						  	
						  })
			            }
			          }
			        })
			}else{
				this.pageIndex += 1
			}
			
			// this.currentShowWordInfo = this.dataList[this.pageIndex]
			console.log("next-word=currentShowWordInfo",this.currentShowWordInfo);
			// this.ScanAudio(`${this.apiHost}/api/files/${this.currentShowWordInfo.collectionId}/${this.currentShowWordInfo.id}/${this.currentShowWordInfo.voice}`);			
			return this.pageIndex
		},
		tapCard(item) {
			console.log(item, '点击');
			
			this.ScanAudio(`${this.apiHost}/api/files/${item.collectionId}/${item.id}/${item.voice_slow}`);			
		}
		
	}
};
</script>

<style lang="scss" scoped>
@font-face {
	font-family: 'iconfont';
	src: url('data:application/x-font-woff2;charset=utf-8;base64,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')
		format('woff2');
}

.titleView {
	position: absolute;
	width: 100%;
	text-align: center;
	z-index: 9999999999999;
}
.iconfont {
	font-family: 'iconfont' !important;
	font-size: 12px;
	font-style: normal;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
}
.icon-xinaixin:before {
	content: '\e601';
}
.icon-chacha1:before {
	content: '\e646';
}
.page {
	width: 100%;
	position: absolute;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
}
.move-area {
	position: absolute;
}
.move-view {
	width: 600rpx;
	position: absolute;
	height: 1200rpx;
	left: 50%;
	top: 50%;
	margin-left: -300rpx;
	margin-top: -600rpx;
}
.cardBox {
	position: relative;
	width: 600rpx;
	height: 1000rpx;
}
.actionBtnBgView {

	    display: flex;
	    flex-direction: row;
		z-index: 9999;
		justify-content: space-around;
	.actionImg {
		width: 40%;
		    height: 100%;
	}
}

</style>