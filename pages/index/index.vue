<template>
	<view>
		<uni-nav-bar statusBar="true" fixed="true" left-icon="" title="英语单词卡片">
			<image style="position: absolute;width: 40px;height: 40px;left: 18px;"
				src="../../static/talent_content_no_opened_book@2x.png" mode="aspectFit" @click="leftBtnClick"></image>
		</uni-nav-bar>
		<xzj-firsthint :isCustom='true' />
		<scroll-view scroll-y="true">
			<view class="item" :class="tapIndex == index ? 'item-' + animation : ''"
				:style="[{ 'background-color': item.item_color }]" v-for="(item, index) in items" :key="index"
				@click="sidebarClick(item.cat)">
				<block :class="index % 2 == 1 ? 'item-fanzhuan' : ''">
					<image style="width: 40%;" :src="item.item_icon" mode="aspectFit"></image>
					<view class="nameBgView">
						<view class="enName">{{ item.en_name }}</view>
						<view class="zhName">{{ item.zh_name }}</view>
					</view>
				</block>
				<view class="item_mask" v-if="item.isLock">
					<image src="../../static/bba_mnp_error_authorize~iphone@2x.png" mode="aspectFit"></image>
				</view>

			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default{
		data() {
			return {
				items:[
					{
						"en_name":"level AA",
						"zh_name":"AA",
						"cat":"AA",
						"item_icon":"/static/animals/cat~iphone.png",
						"isLock":false,
						"item_color":"rgb(25, 138, 250)"
					},
					{
						"en_name":"level A",
						"zh_name":"A",
						"cat":"A",
						"item_icon":"/static/Foods/icon_foods~iphone.png",
						"isLock":true,
						"item_color":"rgb(39, 143, 116)"
					},
					{
						"en_name":"level B",
						"zh_name":"B",
						"cat":"B",
						"item_icon":"/static/DailyLife/icon_dailylife~iphone.png",
						"isLock":true,
						"item_color":"rgb(29, 123, 136)"
					},
					{
						"en_name":"level C",
						"zh_name":"C",
						"cat":"C",
						"item_icon":"/static/Phrases/listen_to_music~iphone.png",
						"isLock":true,
						"item_color":"rgb(19, 123, 126)"
					}
				],
				tapIndex: -1,
				animation: ''
			}
		},
		methods:{
				sidebarClick:function(cat){
					console.log(cat);
					
					// 查找点击的卡片
					const item = this.items.find(item => item.cat === cat);
					
					// 如果卡片被锁定，显示提示信息
					if (item && item.isLock) {
						uni.showToast({
							title: '该级别尚未解锁',
							icon: 'none',
							duration: 2000
						});
						
						// 添加动画效果
						const index = this.items.findIndex(i => i.cat === cat);
						this.tapIndex = index;
						this.animation = 'shake';
						
						setTimeout(() => {
							this.animation = '';
							this.tapIndex = -1;
						}, 800);
						
						return;
					}
					
					// 如果卡片未锁定，则导航到卡片详情页
					uni.navigateTo({
						url:`/pages/cardDetail/cardDetail?cat=${cat}&title=${cat}`
					});
				},
				
				// 左侧按钮点击事件
				leftBtnClick() {
					uni.showToast({
						title: '功能开发中',
						icon: 'none',
						duration: 2000
					});
				}
			}
	}
	
</script>

<style lang="scss" scoped>
	.item {
		margin: 20rpx 30rpx;
		border-radius: 10rpx;
		height: 350rpx;
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}

	.item_mask {
		// margin: 0rpx 30rpx;
		height: 350rpx;
		width: 92%;
		border-radius: 10rpx;
		position: absolute;
		justify-content: space-evenly;
		align-items: center;
		background-color: #000000;
		opacity: 0.5;
		z-index: 99;

		image {
			width: 100%;
		}
	}

	.item-shake {
		animation: shake 0.8s !important;
	}

	.item-fanzhuan {
		flex-direction: row-reverse;

		.enName {
			margin-top: 110rpx;
			font-size: 45rpx;
			font-weight: bold;
			margin-left: 5px;
			font-family: font-test;
		}

		.zhName {
			margin-top: 10rpx;
			font-size: 30rpx;
			font-weight: 400;
			margin-left: 5px;
		}
	}

	.nameBgView {
		display: flex;
		flex-direction: column;
		// text-align: center;
		color: white;
		width: 40%;
	}

	.enName {
		margin-top: 110rpx;
		font-size: 45rpx;
		font-weight: bold;
		// margin-left: 45px;
		font-family: font-test;
	}

	.zhName {
		margin-top: 10rpx;
		font-size: 30rpx;
		font-weight: 400;
		// margin-left: 45px;
	}

	.item image {
		height: 100%;
		/* width: 200rpx; */
	}

	@keyframes shake {

		0%,
		100% {
			transform: translateX(0);
		}

		10% {
			transform: translateX(-9px);
		}

		20% {
			transform: translateX(8px);
		}

		30% {
			transform: translateX(-7px);
		}

		40% {
			transform: translateX(6px);
		}

		50% {
			transform: translateX(-5px);
		}

		60% {
			transform: translateX(4px);
		}

		70% {
			transform: translateX(-3px);
		}

		80% {
			transform: translateX(2px);
		}

		90% {
			transform: translateX(-1px);
		}
	}
</style>
