<template>
	<view  @tap="tapCard()"  class="cardBox" :style="{ backgroundColor: `${bgColor}` }">
		<view class="top" ><image :class="'item-' + animation" class="img" :src="thumbnail" mode="widthFix"></image></view>
		<view class="bottom">
			<!-- <view class="bottomItem">{{ phoneticSymbol }}</view> -->
			<view class="bottomItem">{{ en }}</view>
			<view class="bottomItem">{{ zh }}</view>
		</view>
	</view>
</template>

<script>
// const font_url = 'https://vkceyugu.cdn.bspapp.com/VKCEYUGU-aliyun-ejy4ervx875u217485/236fea70-58a4-11eb-b680-7980c8a877b8.ttf';

export default {
	props: {
		thumbnail: {
			type: String,
			default: ''
		},
		// bgColor: {
		// 	type: String,
		// 	default: ''
		// },
		// phoneticSymbol: {
		// 	type: String,
		// 	default: ''
		// },
		en: {
			type: String,
			default: ''
		},
		zh: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			loveAnimation: { 0: {} },
			loatheAnimation: { 0: {} },
			loveAni: null,
			loatheAni: null,
			animation: '', // 动画样式
			bgColor:"rgb(111,111,111)",
		};
	},
	mounted() {
		//touch移动喜欢动画
		this.loveAni = uni.createAnimation({
			duration: 0
		});
		//touch移动不喜欢动画
		this.loatheAni = uni.createAnimation({
			duration: 0
		});
		// this.loadFontFaceFromWeb();
	},
	methods: {
		tapCard(){
			this.animation = 'shake';
			setTimeout(() => {
				this.animation = '';
			}, 500);
		},
		clearAnimation() {
			this.loveAnimation[0] = this.loveAni.export();
			this.loatheAnimation[0] = this.loatheAni.export();
		},
		_back() {
			//touch移动喜欢动画
			this.loveAni = uni.createAnimation({
				duration: 200
			});
			//touch移动不喜欢动画
			this.loatheAni = uni.createAnimation({
				duration: 200
			});
			this.loveAni.opacity(0).step();
			this.loveAnimation[0] = this.loveAni.export();
			this.loatheAni.opacity(0).step();
			this.loatheAnimation[0] = this.loatheAni.export();
		},
		moveRight(ratio) {
			this.loveAni.opacity(0.3 + 0.7 * ratio).step();
			this.loveAnimation[0] = this.loveAni.export();
			this.loatheAni.opacity(0).step();
			this.loatheAnimation[0] = this.loatheAni.export();
		},
		moveLeft(ratio) {
			this.loveAni.opacity(0).step();
			this.loveAnimation[0] = this.loveAni.export();
			this.loatheAni.opacity(0.3 + 0.7 * ratio).step();
			this.loatheAnimation[0] = this.loatheAni.export();
		},
		moveCenter() {
			this.loveAni.opacity(0.3).step();
			this.loveAnimation[0] = this.loveAni.export();
			this.loatheAni.opacity(0.3).step();
			this.loatheAnimation[0] = this.loatheAni.export();
		},
		// loadFontFaceFromWeb() {
			// uni.loadFontFace({
				// family: 'font-test',
				// source: `url("${font_url}")`
			// });
		// }
	},
	watch: {
		cardData(newVal) {
			console.log(newVal);
			this.item = newVal;
		}
	}
};
</script>

<style lang="scss" scoped>
.cardBox {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	border-radius: 20rpx;
	border: 2px solid #e9e7ef;
	.top {
		width: 600rpx;
		height: 700rpx;
		.img {
			width: 600rpx;
			height: 700rpx;
		}
	}
	.bottom {
		position: relative;
		bottom: 0;
		width: 600rpx;
		display: flex;
		flex-direction: column;
		color: #202020;
		background-color: #ffffff;
		font-size: 45rpx;
		font-weight: bold;
		.bottomItem {
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			font-family: font-test;
		}
	}
}
.item-shake {
	animation: shake 0.8s !important;
}
@keyframes shake {
	0%,
	100% {
		transform: translateX(0);
		transform: translateY(0);	
	}

	10% {
		transform: translateX(-9px);
		transform: translateY(9px);
	}

	20% {
		transform: translateX(8px);
		transform: translateY(-8px);
	}

	30% {
		transform: translateX(-7px);
		transform: translateY(7px);
	}

	40% {
		transform: translateX(6px);
		transform: translateY(-6px);
	}

	50% {
		transform: translateX(-5px);
		transform: translateY(5px);
	}

	60% {
		transform: translateX(4px);
		transform: translateY(-4px);
	}

	70% {
		transform: translateX(-3px);
		transform: translateY(3px);
	}

	80% {
		transform: translateX(2px);
		transform: translateY(-2px);
	}

	90% {
		transform: translateX(-1px);
		transform: translateY(-1px);
	}
}
</style>
