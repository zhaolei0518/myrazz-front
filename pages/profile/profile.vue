<template>
	<view class="profile-container">
		<view class="login-section" v-if="!isLoggedIn">
			<image class="avatar" src="/static/logo.png" mode="aspectFill"></image>
			<view class="login-text">请登录</view>
			<button class="login-btn wechat-btn" open-type="getUserInfo" @getuserinfo="onGetUserInfo">
				<image src="/static/common/ic_btn_cn~iphone.png" mode="aspectFit" class="wechat-icon"></image>
				微信一键登录
			</button>
			<view class="login-tips">登录后可同步学习记录和收藏</view>
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
import api from '../../utils/api.js';

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
			// 从本地存储获取token和用户信息
			const token = uni.getStorageSync('token');
			const userInfo = uni.getStorageSync('userInfo');
			
			// 只有token和userInfo都存在才认为是已登录状态
			if (token && userInfo) {
				this.isLoggedIn = true;
				this.userInfo = JSON.parse(userInfo);
				
				// 可以在这里添加token有效性验证逻辑
				// 例如检查token是否过期，如果过期则清除登录状态
				
				console.log('用户已登录，token:', token);
			} else {
				// 如果token不存在但userInfo存在，清除userInfo
				if (!token && userInfo) {
					uni.removeStorageSync('userInfo');
				}
				
				this.isLoggedIn = false;
				console.log('用户未登录');
			}
		},
		onGetUserInfo(e) {
			if (e.detail.errMsg === 'getUserInfo:ok') {
				uni.showLoading({
					title: '登录中...'
				});
				
				// 1. 获取微信登录凭证code
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						// 2. 调用实际API登录接口
						api.login(loginRes.code, e.detail.userInfo)
							.then(res => {
								if (res.statusCode === 200 && res.data.code === 200) {
									// 保存token和用户ID
									uni.setStorageSync('token', res.data.data.token);
									uni.setStorageSync('userId', res.data.data.userId);
									
									// 保存用户基本信息
									const userInfo = {
										nickName: e.detail.userInfo.nickName,
										avatarUrl: e.detail.userInfo.avatarUrl
									};
									uni.setStorageSync('userInfo', JSON.stringify(userInfo));
									
									this.isLoggedIn = true;
									this.userInfo = userInfo;
									
									// 获取更详细的用户信息
									this.fetchUserDetails(res.data.data.userId);
									
									uni.hideLoading();
									uni.showToast({
										title: '登录成功',
										icon: 'success'
									});
								} else {
									uni.hideLoading();
									uni.showToast({
										title: res.data.message || '登录失败',
										icon: 'none'
									});
								}
							})
							.catch(err => {
								uni.hideLoading();
								uni.showToast({
									title: '网络请求失败',
									icon: 'none'
								});
								console.error('API请求失败:', err);
							});
					},
					fail: (err) => {
						uni.hideLoading();
						uni.showToast({
							title: '微信登录失败',
							icon: 'none'
						});
						console.error('微信登录失败:', err);
					}
				});
			} else {
				uni.showToast({
					title: '授权失败',
					icon: 'none'
				});
			}
		},
		
		// 获取用户详细信息
		fetchUserDetails(userId) {
			api.getUserInfo(userId)
				.then(res => {
					if (res.statusCode === 200) {
						// 合并用户信息
						const userDetails = res.data;
						const userInfo = {
							...this.userInfo,
							level: userDetails.level || 1,
							points: userDetails.points || 0
						};
						
						// 更新本地存储和状态
						uni.setStorageSync('userInfo', JSON.stringify(userInfo));
						this.userInfo = userInfo;
					}
				})
				.catch(err => {
					console.error('获取用户详情失败:', err);
				});
		},
		logout() {
			uni.showModal({
				title: '退出提示',
				content: '确定要退出登录吗？',
				success: (res) => {
					if (res.confirm) {
						// 清除用户信息和token
						uni.removeStorageSync('userInfo');
						uni.removeStorageSync('token');
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
			// 如果未登录，则提示需要登录
			if (!this.isLoggedIn) {
				uni.showModal({
					title: '提示',
					content: '此功能需要登录后才能使用',
					confirmText: '去登录',
					success: (res) => {
						// 用户点击确定，不需要做额外操作，因为界面上已经有登录按钮
					}
				});
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

.wechat-btn {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: #07c160;
	border: none;
	color: #ffffff;
	font-size: 28rpx;
}

.wechat-icon {
	width: 40rpx;
	height: 40rpx;
	margin-right: 10rpx;
}

.login-tips {
	font-size: 24rpx;
	color: #999;
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
