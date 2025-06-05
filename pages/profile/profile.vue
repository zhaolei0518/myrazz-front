<template>
	<view class="profile-container">
		<view class="login-section" v-if="!isLoggedIn">
			<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
			<view class="login-text">请登录</view>
			<button class="login-btn" type="primary" @click="login">立即登录</button>
		</view>
		<view class="user-info" v-else>
			<image class="avatar" :src="userInfo.avatarUrl || '/static/logo.png'" mode="aspectFill"></image>
			<view class="user-name">{{userInfo.nickName || '用户名'}}</view>
		</view>
		
		<view class="menu-list">
			<view class="menu-item" @click="handleMenuItem('history')">
				<text class="menu-icon">📚</text>
				<text class="menu-text">学习记录</text>
				<text class="menu-arrow">></text>
			</view>
			<view class="menu-item" @click="handleMenuItem('favorites')">
				<text class="menu-icon">⭐</text>
				<text class="menu-text">收藏单词</text>
				<text class="menu-arrow">></text>
			</view>
			<view class="menu-item" @click="handleMenuItem('settings')">
				<text class="menu-icon">⚙️</text>
				<text class="menu-text">设置</text>
				<text class="menu-arrow">></text>
			</view>
			<view class="menu-item" @click="handleMenuItem('about')">
				<text class="menu-icon">ℹ️</text>
				<text class="menu-text">关于我们</text>
				<text class="menu-arrow">></text>
			</view>
		</view>
		
		<view class="logout-btn" v-if="isLoggedIn" @click="logout">
			退出登录
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isLoggedIn: false,
			userInfo: {
				nickName: '',
				avatarUrl: ''
			}
		}
	},
	onLoad() {
		// 检查是否已登录
		this.checkLoginStatus();
	},
	methods: {
		checkLoginStatus() {
			// 从本地存储获取用户信息
			const userInfo = uni.getStorageSync('userInfo');
			if (userInfo) {
				this.isLoggedIn = true;
				this.userInfo = JSON.parse(userInfo);
			}
		},
		login() {
			// 在实际应用中，这里应该调用微信登录API
			uni.showModal({
				title: '登录提示',
				content: '此功能需要登录，是否前往登录？',
				success: (res) => {
					if (res.confirm) {
						// 模拟登录过程
						uni.showLoading({
							title: '登录中...'
						});
						
						setTimeout(() => {
							// 模拟登录成功
							const mockUserInfo = {
								nickName: '测试用户',
								avatarUrl: '/static/logo.png'
							};
							
							// 保存用户信息
							uni.setStorageSync('userInfo', JSON.stringify(mockUserInfo));
							this.isLoggedIn = true;
							this.userInfo = mockUserInfo;
							
							uni.hideLoading();
							uni.showToast({
								title: '登录成功',
								icon: 'success'
							});
						}, 1500);
					}
				}
			});
		},
		logout() {
			uni.showModal({
				title: '退出提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除用户信息
						uni.removeStorageSync('userInfo');
						this.isLoggedIn = false;
						this.userInfo = {
							nickName: '',
							avatarUrl: ''
						};
						
						uni.showToast({
							title: '已退出登录',
							icon: 'success'
						});
					}
				}
			});
		},
		handleMenuItem(type) {
			// 如果未登录，则提示登录
			if (!this.isLoggedIn) {
				this.login();
				return;
			}
			
			// 根据不同的菜单项执行不同的操作
			switch(type) {
				case 'history':
					uni.showToast({
						title: '学习记录功能开发中',
						icon: 'none'
					});
					break;
				case 'favorites':
					uni.showToast({
						title: '收藏单词功能开发中',
						icon: 'none'
					});
					break;
				case 'settings':
					uni.showToast({
						title: '设置功能开发中',
						icon: 'none'
					});
					break;
				case 'about':
					uni.showToast({
						title: '关于我们功能开发中',
						icon: 'none'
					});
					break;
			}
		}
	}
}
</script>

<style lang="scss">
.profile-container {
	padding: 20px;
	background-color: #f8f8f8;
	min-height: 100vh;
}

.login-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;
	background-color: #ffffff;
	border-radius: 10rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.avatar {
	width: 150rpx;
	height: 150rpx;
	border-radius: 75rpx;
	margin-bottom: 20rpx;
}

.login-text {
	font-size: 32rpx;
	color: #333;
	margin-bottom: 30rpx;
}

.login-btn {
	width: 60%;
	margin-top: 20rpx;
}

.user-info {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 40rpx 0;
	background-color: #ffffff;
	border-radius: 10rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.user-name {
	font-size: 36rpx;
	font-weight: bold;
	margin-top: 20rpx;
	color: #333;
}

.menu-list {
	background-color: #ffffff;
	border-radius: 10rpx;
	padding: 0 20rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.menu-item {
	display: flex;
	align-items: center;
	height: 100rpx;
	border-bottom: 1rpx solid #f0f0f0;
	
	&:last-child {
		border-bottom: none;
	}
}

.menu-icon {
	margin-right: 20rpx;
	font-size: 40rpx;
}

.menu-text {
	flex: 1;
	font-size: 30rpx;
	color: #333;
}

.menu-arrow {
	color: #ccc;
	font-size: 30rpx;
}

.logout-btn {
	margin-top: 50rpx;
	height: 90rpx;
	line-height: 90rpx;
	text-align: center;
	background-color: #ffffff;
	border-radius: 10rpx;
	color: #ff5a5f;
	font-size: 32rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}
</style>
