// API基础URL
// const BASE_URL = 'http://localhost:8090'; // PocketBase默认运行在8090端口，根据实际情况修改
const BASE_URL = 'http://www.word.heluobo.top'; // PocketBase默认运行在8090端口，根据实际情况修改

// 通用请求函数
const request = (url, method, data = null) => {
  return new Promise((resolve, reject) => {
    // 获取存储的token
    const token = uni.getStorageSync('token') || '';

    // 请求配置
    const options = {
      url: url,
      method: method,
      header: {
        'Content-Type': 'application/json',
      },
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        console.error('API请求失败:', err);
        reject(err);
      }
    };

    // 如果有token，添加到请求头
    if (token) {
      options.header.Authorization = `Bearer ${token}`;
    }

    // 如果有数据，添加到请求体
    if (data) {
      options.data = data;
    }

    // 发送请求
    uni.request(options);
  });
};

// 导出API函数
export default {
  // 用户登录
  login(code, userInfo) {
    return request(
      `${BASE_URL}/api/wechat/login`,
      'POST',
      { code, userInfo }
    );
  },

  // 获取用户信息
  getUserInfo(userId) {
    return request(
      `${BASE_URL}/api/collections/users/records/${userId}`,
      'GET'
    );
  },

  // 同步用户学习记录
  syncUserData(userId, data) {
    return request(
      `${BASE_URL}/api/collections/user_data/records`,
      'POST',
      {
        user: userId,
        data: JSON.stringify(data),
        updated: new Date().toISOString()
      }
    );
  },

  // 获取用户学习记录
  getUserData(userId) {
    return request(
      `${BASE_URL}/api/collections/user_data/records?filter=(user='${userId}')&sort=-updated&limit=1`,
      'GET'
    );
  },

  // 收藏单词
  favoriteWord(userId, wordId, isFavorite) {
    return request(
      `${BASE_URL}/api/collections/favorites/records`,
      'POST',
      {
        user: userId,
        word: wordId,
        isFavorite: isFavorite,
        created: new Date().toISOString()
      }
    );
  },

  // 获取用户收藏的单词列表
  getFavorites(userId) {
    return request(
      `${BASE_URL}/api/collections/favorites/records?filter=(user='${userId}'%26%26isFavorite=true)&expand=word`,
      'GET'
    );
  }
};
