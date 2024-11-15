<template>
	<view class="box" v-if="SHOW_TOP">
		<view class="arrow" :style="{ marginRight: marRight + 'px', marginTop: marTop + 'px' }"></view>
		<view class="body">
			<view class="textContent">{{ text }}</view>
			<view class="split-line"></view>
			<view class="cancle_btn" @click="okHandler"><image src="../../static/common/tipsClose.png" mode=""></image></view>
		</view>
	</view>
</template>

<script>
const STORAGE_KEY_ONE = 'ADD-MYAPP-KEY-ONE';

export default {
	data() {
		return {
			SHOW_TOP: false,
			SHOW_TOP_key: 1,
			marRight: 66,
			marTop: 0
		};
	},

	props: {
		text: {
			type: String,
			default: '添加到我的小程序'
		},
		isCustom: { //是否开启了自定义头部
			type: Boolean,
			default: false
		}
	},
	onReady() {
		this.initTips();
	},
	methods: {
		initTips: function() {
			// 判断是否已经显示过
			let cacheOne = uni.getStorageSync(STORAGE_KEY_ONE);
			const now = +new Date();
			// 校验缓存数据 以及缓存时间是否过期(关闭后缓存一个月 一个月后重新提示用户)
			if (cacheOne && now - cacheOne < 30 * 24 * 3600000) return;
			// 处理根据系统信息处理位移箭头位置（重点）
			let systemInfo = wx.getSystemInfoSync();
			let client = wx.getMenuButtonBoundingClientRect();
			if (systemInfo && client) {
				this.marRight = systemInfo.screenWidth - client.left - 28;
				if (this.isCustom) {
					this.marTop = client.bottom + client.top - systemInfo.statusBarHeight;
				}
			}
			// 没显示过，则进行展示
			this.SHOW_TOP = true;
		},
		okHandler: function() {
			const storage_key = this.SHOW_TOP_key;
			let key = STORAGE_KEY_ONE;

			this.SHOW_TOP = false;
			uni.setStorage({
				key,
				data: +new Date()
			});
		}
	}
};
</script>

<style scoped>
.box {
	position: fixed;
	top: 0;
	/* left: 0; */
	right: 0;
	z-index: 10073;
	display: flex;
	justify-content: flex-end;
	align-items: flex-end;
	flex-direction: column;
	width: 600rpx;
}
.arrow {
	width: 0;
	height: 0;
	margin-right: 120rpx;
	border-width: 10rpx;
	border-style: solid;
	border-color: transparent transparent rgba(0, 0, 0, 0.7) transparent;
}
.body {
	background-color: rgba(0, 0, 0, 0.7);
	/* box-shadow: 0 10rpx 20rpx -10rpx #34b5e2; */
	border-radius: 8rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 70rpx;
	padding: 0 18rpx 0 30rpx;
	margin-right: 60rpx;
}
.textContent {
	color: #fff;
	font-size: 26rpx;
	font-weight: 400;
	/* padding: 0 10rpx; */
}
.split-line {
	padding: 0 20rpx;
	height: 100%;
	position: relative;
}
.split-line:after {
	content: '';
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	width: 2rpx;
	height: 40rpx;
	background: #a6a6a6;
}
.cancle_btn {
	display: flex;
	justify-content: center;
}

.cancle_btn image {
	width: 22rpx;
	height: 22rpx;
}
</style>
