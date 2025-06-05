export default { 
	data(){
		return{
			page:1,
			page_size:3,
			number:3, //展示卡片数量，同时设置animationData对象
			moveRotate:{ x:0,y:0 }, //设置位移图片旋转角度距离  card中心点 - 指向坐标
			delMoveD: uni.getSystemInfoSync().screenHeight,//设置删除移动距离
			touchMoveD: 100,//设置card移动距离,   card移动距离/touchMoveD = 其他card变化比率
			rotate:0, //旋转deg 设置第2张卡片transform opacity
			scale:{ x:1,y:1 }, //缩放
			skew:{ x:0,y:0 }, //倾斜px
			translate:{ x:0,y:0 }, //位移px
			opacity:1,  //透明度，参数范围 0~1
			type:false, //是否拥有两套代码
			
			
			moveX:0, //记录移动值
			moveY:0, //
			oldTouces:{},
			oldMove:{},
			touchAnimation:null,
			animationData:{}, 
			dataList:[],
			delTime:150,
			cardId:0,
			x:0,
			y:0,
			sysHeight:0,
			sysWidth:0,
			delFlag:false, //app下禁止快速滑动150ms
		}
	},
	created() {
		this.init()
		this.sysHeight = uni.getSystemInfoSync().windowHeight
		this.sysWidth = uni.getSystemInfoSync().windowWidth
	},
	async mounted() {
		
		this.createAnimation()
		await this.getData(this.page,this.page_size)
	},
	methods:{
		//初始值设置
		init(){
			
		},
		//获取数据
		getData(page,page_size){
			
		},
		createAnimation(){
			//touch移动动画
			this.touchAnimation = uni.createAnimation({
				duration:0
			});
			//其他卡片移动
			this.moveAnimation = uni.createAnimation({
				duration:0
			});
			//删除动画
			this.delanimation = uni.createAnimation({
				duration:this.delTime,
				
			});
			//删除时其他card动画
			this.endanimation = uni.createAnimation({
				duration:200
			});
		},
		touchStart(e){
		
			this.oldTouces = e.touches[0]
			
		},
		touchMove(e) {
			
			if(this.delFlag) return
			
			
			let { oldTouces } = this
			
			
			let newTouces = e.touches[0]
			//平移
			this.moveX = newTouces.clientX-oldTouces.clientX
			this.moveY = newTouces.clientY-oldTouces.clientY
			this.dataList[0].moveX = this.moveX
			this.dataList[0].moveY = this.moveY
			
			this.dataList[0].animation = false
			//移动图片旋转角度
			let angle = this.calcAngleDegrees(this.moveX- this.moveRotate.x,this.moveY- this.moveRotate.y )
			
			//移动card动画
			if(this.type){
				//#ifdef APP-PLUS
				this.touchAnimation.translateX(this.moveX).translateY(this.moveY).rotate(angle).step();
				//#endif
				//#ifndef APP-PLUS
				this.touchAnimation.rotate(angle).step();
				//#endif
			}else{
				this.touchAnimation.rotate(angle).step();
			}
			this.animationData[0] = this.touchAnimation.export()
			
			//其他card动画
			let d = this.moveX*this.moveX + this.moveY*this.moveY
			let ratio = Math.sqrt(d) / this.touchMoveD 
			ratio = ratio > 1 ? 1 : ratio
			
			for (var i = 1; i < this.number; i++) {
				
				if(this.rotate!=0) this.moveAnimation.rotate( this.rotate*(i-ratio) )
				if(this.opacity!=1) this.moveAnimation.opacity( 1-(1-this.opacity)*(i-ratio) )
				if(this.scale.x!=1) this.moveAnimation.scaleX( 1-(1-this.scale.x)*(i-ratio) )
				if(this.scale.y!=1) this.moveAnimation.scaleY( 1-(1-this.scale.y)*(i-ratio) )
				if(this.skew.x!=0) this.moveAnimation.skewX( this.skew.x*(i-ratio) )
				if(this.skew.y!=0) this.moveAnimation.skewY( this.skew.y*(i-ratio) )
				if(this.translate.x!=0) this.moveAnimation.translateX( this.translate.x*(i-ratio) )
				if(this.translate.y!=0) this.moveAnimation.translateY( this.translate.y*(i-ratio) )
				
				this.moveAnimation.step()
				this.animationData[i] = this.moveAnimation.export()
			}
			//触摸中视图变化
			this.moveJudge(this.moveX,this.moveY,ratio)
		},
		touchend(e){
			this.endJudge(this.moveX,this.moveY)
		},
		//触摸中判断
		moveJudge(x,y,ratio){
			
		},
		//触摸结束判断
		endJudge(x,y){
			if(x!=0||y!=0){
				this._del()
			}
		},
		//返回card
		_back(){
			console.log("_back-------------");
			let { oldMove } = this
			//移动图片旋转角度
			let angle = this.calcAngleDegrees(this.moveX- this.moveRotate.x,this.moveY- this.moveRotate.y )
			//移动card动画
			
			if(this.type){
				//#ifdef APP-PLUS
				this.delanimation.translateX(-this.moveX/3).translateY(-this.moveY/3).rotate(0).step();
				//#endif

			}else{
				
			}
			
			
			this.moveX = 0
			this.moveY = 0
			this.dataList[0].moveX = 0
			this.dataList[0].moveY = 0
			this.dataList[0].animation = true
			this.delanimation.translateX(this.moveX).translateY(this.moveY).rotate(0).step();
			this.animationData[0] = this.delanimation.export()
			setTimeout(() => {
				//清除动画
				this.animationData[0] = this.delanimation.export()
				for (var i = 1; i < this.number; i++) {
					this.animationData[i] = this.moveAnimation.export()
				}
				this.moveX = 0
				this.moveY = 0
			}, this.delTime)
			
			//其他card动画
			let ratio = 0
			
			for (var i = 1; i < this.number; i++) {
				
				if(this.rotate!=0) this.endanimation.rotate( this.rotate*(i-ratio) )
				if(this.opacity!=1) this.endanimation.opacity( 1-(1-this.opacity)*(i-ratio) )
				if(this.scale.x!=1) this.endanimation.scaleX( 1-(1-this.scale.x)*(i-ratio) )
				if(this.scale.y!=1) this.endanimation.scaleY( 1-(1-this.scale.y)*(i-ratio) )
				if(this.skew.x!=0) this.endanimation.skewX( this.skew.x*(i-ratio) )
				if(this.skew.y!=0) this.endanimation.skewY( this.skew.y*(i-ratio) )
				if(this.translate.x!=0) this.endanimation.translateX( this.translate.x*(i-ratio) )
				if(this.translate.y!=0) this.endanimation.translateY( this.translate.y*(i-ratio) )
				
				this.endanimation.step()
				this.animationData[i] = this.endanimation.export()
			}
		},
		//删除card
		_del(){
		
			if(this.type) {
				//#ifdef APP-PLUS
				this.delFlag = true
				//#endif
			}
			
			
			//移动card动画
			let d = this.moveX*this.moveX + this.moveY*this.moveY
			let y = this.moveY*this.delMoveD/Math.sqrt(d)
			let x = this.moveX*this.delMoveD/Math.sqrt(d)
			this.delanimation.translateX(x).translateY(y).step();
			this.animationData[0] = this.delanimation.export()
			setTimeout(() => {
				
				//清除动画
				this.animationData[0] = this.delanimation.export()
				for (var i = 1; i < this.number; i++) {
					this.animationData[i] = this.moveAnimation.export()
				}
				// 展示下一个单词
				this.moveX = 0
				this.moveY = 0
				this.dataList[0].moveX = 0
				this.dataList[0].moveY = 0
				this.dataList.splice(0,1)
				this.nextCard(this.moveX,this.moveY)
			
			
				console.log("_del==datalistlent,pageidx---------------",this.dataList.length)
				if(this.dataList.length==1) {
					this.page++
					console.log("load new words",this.page);
					this.getData(this.page,this.page_size)
				}
				if(this.type) {
					//#ifdef APP-PLUS
					this.delFlag = false
					//#endif
				}
			}, this.delTime)
			
			//其他card动画
			let ratio = 1
			
			for (var i = 1; i < this.number; i++) {
				
				if(this.rotate!=0) this.endanimation.rotate( this.rotate*(i-ratio) )
				if(this.opacity!=1) this.endanimation.opacity( 1-(1-this.opacity)*(i-ratio) )
				if(this.scale.x!=1) this.endanimation.scaleX( 1-(1-this.scale.x)*(i-ratio) )
				if(this.scale.y!=1) this.endanimation.scaleY( 1-(1-this.scale.y)*(i-ratio) )
				if(this.skew.x!=0) this.endanimation.skewX( this.skew.x*(i-ratio) )
				if(this.skew.y!=0) this.endanimation.skewY( this.skew.y*(i-ratio) )
				if(this.translate.x!=0) this.endanimation.translateX( this.translate.x*(i-ratio) )
				if(this.translate.y!=0) this.endanimation.translateY( this.translate.y*(i-ratio) )
				
				this.endanimation.step()
				this.animationData[i] = this.endanimation.export()
			}
		},
		nextCard(){
			console.log("parent del-crad-js",this.dataList[0])
		},
		calcAngleDegrees(x, y) {
			return Math.atan2(y, x) * 180 / Math.PI + 90;
		}
	},
	watch:{
			
			
			
	},
	watch:{
		number:{
			immediate:true,
			handler(newVal,oldVal){
				for (var i = 0; i < newVal; i++) {
					let a = {}
					a[i] = {}
					this.animationData = {...this.animationData,...a}
				}
			}
		},
		dataList:{ // 数据变化
			handler(newVal,oldVal){
				// this.number = newVal.length;
				console.log("data-list-handler",newVal.length, oldVal.length);
				for (let item of newVal) {
					if(!item._id){
						console.log("data-list-handler init",this.cardId);
						
						item._id = this.cardId++
						item.moveX = 0
						item.moveY = 0
						item.animation = false
					} 
				}
				
			}
		}
	}
}

