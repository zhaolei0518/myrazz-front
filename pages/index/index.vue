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
				]
			}
			},
			methods:{
				sidebarClick:function(cat){
					console.log(cat);
					uni.navigateTo({
						url:`/pages/cardDetail/cardDetail?cat=${cat}&title=${cat}`,
						// success: function(res) {
						//     // 通过eventChannel向被打开页面传送数据
						// 	let data= {
						// 	"title":"titlexx",
						// 	"words":[{
						// 		"_id": "60053e29503e481e95211404",
						// 		"enWord": "squirrel",
						// 		"enVoiceURL": "https://mp-e8fb124d-4949-40ed-9db8-fb30109550f4.cdn.bspapp.com/shizika/60053e29503e481e95211404.mp3",
						// 		"enPhonetic": "[ˈskwɜːrəl]",
						// 		"zhWord": "松鼠",
						// 		"type": 0,
						// 		"imgURL": "https://mp-e8fb124d-4949-40ed-9db8-fb30109550f4.cdn.bspapp.com/shizika/60053e29503e481e95211404.png"
						// 	}]
						// }
						//     res.eventChannel.emit('acceptDataFromOpenerPage', { data: data })
						//   }
						
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