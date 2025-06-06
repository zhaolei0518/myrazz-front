<template>
	<view class="page" :style="{ height: `${sysHeight}px`, width: `${sysWidth}px` }">
		<view class="titleView" :style="{ bottom: `${100}px` }">
			{{currentIndex+1}}/{{totalWord}}
		</view>
		
		<view
			v-for="(item, index) in visibleCards"
			class="move-view"
			:key="index"
			@touchend="touchend"
			@tap.stop="tapCard(item)"
			@touchmove="touchMove"
			@touchstart="touchStart"
			:style="{
				transform: index === 0 ? 'none' : `translateY(${index * 10}px) scale(${1 - index * 0.05})`,
				zIndex: `${9999 - index}`,
				opacity: index < 3 ? `${1 - index * 0.1}` : '0.7'
			}"
		>
			<view class="cardBox">
				<card-box 
					:thumbnail="item && item.thumbnail ? `${apiHost}api/files/${item.collectionId}/${item.id}/${item.thumbnail}?thumb=0x512` : ''" 
					:bgColor="item ? item.bgColor : ''" 
					:en="item ? item.en : ''" 
					:zh="item ? item.zh : ''" 
					:phonetic="item ? item.phonetic : ''" 
					ref="cardBox">
				</card-box>
			</view>
		</view>

		<!-- 底部操作按钮 -->
		<view class="action-buttons">
			<!-- 左箭头按钮 -->
			<view class="action-btn-wrapper" @tap.stop="swipeRight">
				<view class="action-btn">
					<image src="/static/icons/left.png" mode="aspectFit"></image>
				</view>
			</view>
			
			<!-- 播放按钮 -->
			<view class="action-btn-wrapper" @tap.stop="playSound">
				<view class="action-btn">
					<image src="/static/icons/play.png" mode="aspectFit"></image>
				</view>
			</view>
			
			<!-- 收藏按钮 -->
			<view class="action-btn-wrapper" @tap.stop="toggleFavorite">
				<view class="action-btn">
					<image :src="isFavorite ? '/static/icons/like_active.png' : '/static/icons/like.png'" mode="aspectFit"></image>
				</view>
			</view>
			
			<!-- 右箭头按钮 -->
			<view class="action-btn-wrapper" @tap.stop="swipeLeft">
				<view class="action-btn">
					<image src="/static/icons/right.png" mode="aspectFit"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import wordbiz from '@/components/wordbiz/wordbiz.js';
import cardBox from './card-box';

export default {
	mixins: [wordbiz],
	components: { cardBox },
	data() {
		return {
			words:[],
			cat:"",
			currentIndex: 0, // 当前显示的卡片索引
			totalWord: 0,
			allCards: [], // 存储所有获取到的卡片
			currentPage: 1, // 当前页码
			pageSize: 10, // 每页数量
			isLoading: false, // 是否正在加载数据
			sysHeight: 0,
			sysWidth: 0,
			apiHost:'http://www.word.heluobo.top/',
			startX: 0,
			startY: 0,
			isFavorite: false
		};
	},
	computed: {
		// 当前要显示的卡片（当前卡片及后面的几张）
		visibleCards() {
			// 确保allCards已加载并且不为空
			if (!this.allCards || this.allCards.length === 0) {
				return [];
			}
			return this.allCards.slice(this.currentIndex, this.currentIndex + 5);
		},
		// 当前显示的卡片信息
		currentShowWordInfo() {
			return this.allCards[this.currentIndex] || null;
		}
	},
	onLoad(options) {
		uni.setNavigationBarTitle({
			title:options.title
		})
		this.cat = options.cat;
		
		const sysInfo = uni.getSystemInfoSync();
		this.sysHeight = sysInfo.windowHeight;
		this.sysWidth = sysInfo.windowWidth;
		
		// 检查是否有收藏的单词列表
		try {
			this.favoriteWords = uni.getStorageSync('favoriteWords') || [];
		} catch (e) {
			console.error('获取收藏列表失败:', e);
			this.favoriteWords = [];
		}
		
		// 加载第一页数据
		this.loadData();
	},
	methods: {
		// 加载数据
		async loadData() {
			if (this.isLoading) return;
			
			this.isLoading = true;
			const wordlist = await this.getWordsByCat(this.cat, this.currentPage, this.pageSize);
			this.isLoading = false;
			
			if (wordlist.items && wordlist.items.length > 0) {
				// 将获取到的卡片添加到allCards数组
				this.allCards = this.allCards.concat(wordlist.items);
				this.totalWord = wordlist.totalItems;
				
				// 如果是第一页，播放第一张卡片的语音
				if (this.currentPage === 1 && this.currentIndex === 0) {
					// 检查当前单词是否在收藏列表中
					this.updateFavoriteStatus();
					this.playCurrentCardSound();
				}
				
				// 更新当前页码
				this.currentPage++;
			} else if (this.currentPage === 1) {
				// 第一页没有数据时显示提示
				uni.showToast({
					title: '该分类暂无单词数据',
					icon: 'none',
					duration: 2000
				});
			}
		},
		
		// 检查是否需要加载更多数据
		checkNeedLoadMore() {
			// 如果当前索引接近末尾，并且还有更多数据可以加载，则加载下一页
			if (this.currentIndex >= this.allCards.length - 3 && this.allCards.length < this.totalWord) {
				this.loadData();
			}
		},
		async getWordsByCat(cat,page,page_size){
			try {
				var result = await uni.request({
					url: this.apiHost + 'api/collections/word/records',
					method: 'GET',
					data: {
						page : page,
						perPage : page_size,
						filter : `cat="${cat}"`,
					}
				});
				if (result.statusCode === 200) {
					return result.data;
				} else {
					console.error('获取单词数据失败:', result);
					uni.showToast({
						title: '获取单词数据失败',
						icon: 'none'
					});
					return {items: [], totalItems: 0};
				}
			} catch (error) {
				console.error('请求单词数据异常:', error);
				uni.showToast({
					title: '网络错误，请重试',
					icon: 'none'
				});
				return {items: [], totalItems: 0};
			}
		},
		// 播放当前卡片的声音
		playCurrentCardSound() {
			if (this.currentShowWordInfo && this.currentShowWordInfo.voice && 
				this.currentShowWordInfo.collectionId && this.currentShowWordInfo.id) {
				this.ScanAudio(`${this.apiHost}api/files/${this.currentShowWordInfo.collectionId}/${this.currentShowWordInfo.id}/${this.currentShowWordInfo.voice}`);
			} else if (this.currentShowWordInfo) {
				console.warn('无法播放声音：当前卡片数据不完整', this.currentShowWordInfo);
			}
		},
		
		// 更新收藏状态
		updateFavoriteStatus() {
			this.isFavorite = this.favoriteWords && this.currentShowWordInfo && 
				this.favoriteWords.includes(this.currentShowWordInfo.id);
		},
		
		// 向左滑动 - 显示下一张卡片
		swipeLeft() {
			if (this.$refs.cardBox && this.$refs.cardBox[0]) {
				this.$refs.cardBox[0].moveLeft(1);
				this.showNextCard();
			}
		},
		
		playSound() {
			this.playCurrentCardSound();
		},
		toggleFavorite() {
			// 切换收藏状态
			this.isFavorite = !this.isFavorite;
			
			// 如果当前有单词信息
			if (this.currentShowWordInfo) {
				// 这里可以添加保存收藏状态的逻辑，例如保存到本地存储
				try {
					// 获取已收藏单词列表
					let favoriteWords = uni.getStorageSync('favoriteWords') || [];
					
					if (this.isFavorite) {
						// 添加到收藏
						favoriteWords.push(this.currentShowWordInfo.id);
						uni.showToast({
							title: '已添加到收藏',
							icon: 'success',
							duration: 1500
						});
					} else {
						// 从收藏中移除
						favoriteWords = favoriteWords.filter(id => id !== this.currentShowWordInfo.id);
						uni.showToast({
							title: '已取消收藏',
							icon: 'none',
							duration: 1500
						});
					}
					
					// 保存更新后的收藏列表
					uni.setStorageSync('favoriteWords', favoriteWords);
				} catch (e) {
					console.error('保存收藏状态失败:', e);
				}
			}
		},
		// 向右滑动 - 显示上一张卡片
		swipeRight() {
			if (this.allCards.length > 0 && this.$refs.cardBox && this.$refs.cardBox[0]) {
				this.$refs.cardBox[0].moveRight(1);
				this.showPrevCard();
			}
		},
		// 显示下一张卡片
		showNextCard() {
			// 检查是否已经到最后一张
			if (this.currentIndex >= this.totalWord - 1) {
				this.ScanAudio('/static/voice/sound_unbelievable.mp3');
				uni.showModal({
					content: '已经学完，是否再来一遍？',
					showCancel: true,
					success: (res) => {
						if (res.confirm) {
							// 重置索引和数据
							this.currentIndex = 0;
							this.allCards = [];
							this.currentPage = 1;
							this.loadData();
						}
					}
				});
				return;
			}
			
			// 更新当前索引
			this.currentIndex++;
			
			// 检查是否需要加载更多数据
			this.checkNeedLoadMore();
			
			// 更新收藏状态
			this.updateFavoriteStatus();
			
			// 播放声音
			this.playCurrentCardSound();
		},
		tapCard(item) {
			// 添加检查确保item及其必要属性存在
			if (item && item.collectionId && item.id && item.voice_slow) {
				this.ScanAudio(`${this.apiHost}api/files/${item.collectionId}/${item.id}/${item.voice_slow}`);
			} else {
				console.warn('无法播放声音：卡片数据不完整', item);
			}
		},
		
		// 触摸开始
		touchStart(e) {
			this.startX = e.touches[0].clientX;
			this.startY = e.touches[0].clientY;
		},
		
		// 触摸移动
		touchMove(e) {
			if (this.allCards.length == 0 || !this.$refs.cardBox || !this.$refs.cardBox[0]) return;
			
			let moveX = e.touches[0].clientX - this.startX;
			let moveY = e.touches[0].clientY - this.startY;
			
			// 计算移动比例
			let ratio = Math.abs(moveX) / 100;
			if (ratio > 1) ratio = 1;
			
			// 判断移动方向
			if (moveX > 20) {
				this.$refs.cardBox[0].moveRight(ratio);
			} else if (moveX < -20) {
				this.$refs.cardBox[0].moveLeft(ratio);
			} else {
				this.$refs.cardBox[0].moveCenter();
			}
		},
		
		// 显示上一张卡片
		showPrevCard() {
			// 检查是否已经是第一张
			if (this.currentIndex <= 0) {
				uni.showToast({
					title: '已经是第一张卡片',
					icon: 'none',
					duration: 1500
				});
				return;
			}
			
			// 更新当前索引
			this.currentIndex--;
			
			// 更新收藏状态
			this.updateFavoriteStatus();
			
			// 播放声音
			this.playCurrentCardSound();
		},
		
		// 触摸结束
		touchend(e) {
			if (this.allCards.length == 0 || !this.$refs.cardBox || !this.$refs.cardBox[0]) return;
			
			let moveX = e.changedTouches[0].clientX - this.startX;
			let moveY = e.changedTouches[0].clientY - this.startY;
			
			// 判断结束动作
			if (Math.abs(moveX) < 40) {
				// 移动距离太小，恢复原位
				this.$refs.cardBox[0]._back();
			} else if (moveX > 0) {
				// 右滑，显示上一张
				this.$refs.cardBox[0].clearAnimation();
				this.showPrevCard();
			} else {
				// 左滑，显示下一张
				this.$refs.cardBox[0].clearAnimation();
				this.showNextCard();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	width: 100%;
	position: absolute;
	display: flex;
	align-items: center;
	justify-content: center;
}

.titleView {
	position: absolute;
	width: 100%;
	text-align: center;
	z-index: 999;
}

.move-view {
	width: 600rpx;
	position: absolute;
	height: 1200rpx;
	left: 50%;
	top: 50%;
	margin-left: -300rpx;
	margin-top: -600rpx;
	transition: all 0.3s ease;
}

.cardBox {
	position: relative;
	width: 600rpx;
	height: 1000rpx;
}

.action-buttons {
	position: fixed;
	bottom: 40px;
	width: 100%;
	display: flex;
	justify-content: space-around;
	padding: 0 20px;
	z-index: 99;
}

.action-btn-wrapper {
	/* 确保包装器有足够大的点击区域 */
	padding: 10px;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 200;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background: rgba(255, 255, 255, 0.95);
	border-radius: 40px;
	width: 80px;
	height: 80px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
	border: none;
	transition: all 0.2s ease;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	transform: translateZ(0);
	backface-visibility: hidden;
	position: relative;
	cursor: pointer;
	
	image, svg {
		width: 36px;
		height: 36px;
		pointer-events: none;
	}
}

.action-btn-wrapper:active .action-btn {
	background: rgba(245, 245, 245, 0.95);
	transform: translateZ(0) scale(0.92);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
</style>
