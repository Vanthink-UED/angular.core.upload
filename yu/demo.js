var app = angular.module('myapp',[]);
app.controller('myCtrl',function($scope){
	console.log('hello');
	// console.log(document.getElementById('my'));



}).directive('upload', ['$http', function($http) {
	return {
		restrict: 'AE',
		template: '<div>'
				  + '<span>上传图片</span>'
				  + '<form class="form-upload" id="imgUpload"  method="post" enctype="multipart/form-data" action="{{url}}">'
				  	+ '<input class="upload-img" name="{{inputOfFile}}" type="file" accept="{{accept}}"/>'
				  + '</form>'
				  + '</div>'
				  + '<div class="modal">'
            	  	+ '<div class="wrap-img">'
                  		+ '<img class="preview" src="http://img1.vued.vanthink.cn/vtimgaef846bebea3271b0c48bc571222b37c-47220160624170005.png">'
                  		+ '<div class="crop" id="crop"></div>'
		          	+ '</div>'
		          	+ '<div class="foot-btn">'
		          		+ '<button ng-click="uploadImag()" type="button" class="btn btn-upload">保存</button>'
		          		+ '<button ng-click="cancelUpload()" id="cancelUpload" type="button" class="btn btn-cancel">取消</button>'
		          	+ '</div>'
		          + '</div>'
				  ,
	    scope:{
	        iscrop: '@',
	        inputOfFile: '@',
	        url: '@',
	        accept: '@',
	        uploadedCallback:'&?',
	        uploadImag: '&?',
	        cancelUpload: '&?',
	    },
	    link: function($scope, $element, attrs) {
	    	if(!$scope.url){
	    		console.log('url is Empty!');
	    	}


			if(!attrs.accept){
	            $scope.accept = 'image/*';
	        }

	        // init a virtual form
	        function initForm($el, options, data) {
	            /*var defaultOPtions = {
	                extensions: [] ,     // file type .jpg .png
	                inputOfFile: attrs.inputUpload,    // to server input name
	            };

	            var options = angular.extend(defaultOPtions,options);*/
	            $el.css("position", "relative");

	            var form = $el.find('form');

	            var inputUpload = form.children('input[type = "file"]');
	            console.log(form.children('input[type = "file"]'));

	            return form;


	        }


	        var form = initForm($element,attrs,$scope.data);

	        var inputUpload = form.children('input[type="file"]');
	        // console.log(inputUpload);

	        inputUpload.on('change',function(e){
	        	// crop
	        	if(attrs.iscrop == 'true') {
	        		// 修改上传的图片
	        		var file = e.target.files[0];

	        		var r = new FileReader();
	                r.readAsDataURL(file);

	                $(r).load(function(){
	                    var src = this.result;

	                    var img = document.getElementById('crop').previousSibling;
	                    img.setAttribute('src',src);

	                    //获取到后让他可以拖拽,可以改变大小
	                    dragable();
	                    changeType();
	                    changeSize();
	                });

	                //出现截图的部分，wrap是图片
	        		var wrap = document.getElementById('my').childNodes[1];
	        		wrap.style.display = 'block';

	        		// console.log(wrap);


	        		return;
	        	}
	        	
	        	var data = new FormData();

	            angular.forEach(e.target.files, function(key, value)
	            {
	                data.append(attrs.inputOfFile, key);
	            });

	        	$http({
	                // url: attrs.url,
	                url: './corp.php',
	                method: 'POST',
	                data: data,
	                headers: {
	                    'Content-Type': undefined,
	                },
	                transformRequest: angular.identity
	            }).then(function(res) {
	                form.children("input[type=file]").val('');

	                console.log(res);
	                $scope.uploadedCallback(res.data);

	            },function errorCallback(response) {
	                console.error(response);
	            });

	            form.children("input[type=file]").attr("disabled", false);
	        });
	
			//拖拽事件
			function dragable(){
				var drag = document.getElementById('crop');
				var style = drag.style;
				var x = 0, y = 0;

				var wrap = drag.parentNode.offsetHeight;
				var wx = drag.parentNode.offsetLeft;
				var wy = drag.parentNode.offsetTop;


				//移动截图位置的大小
				drag.onmousedown = function(e){

					e.stopPropagation();

					// console.log(isDrag(e));

					e = e||event;
					x = e.clientX - drag.offsetLeft;
					y = e.clientY - drag.offsetTop;

					//判断是否在边缘，是的话不进行操作，不是进行相应的拖拽
					if( isDrag(e) ) {
						return;
					}else {
						drag.onmousemove = function(e){ 
							e = e||event;

							if(e.clientX - x <= 0) {
								style.top = e.clientY - y + 'px';
								style.left = '0px';
								// drag.onmousemove = null;

							}else if(e.clientX - x + 100 > 400){
								style.left = 400 - 100 + 'px';
								style.top = e.clientY - y + 'px';
								// drag.onmousemove = null;

							} else if(e.clientY - y <= 0){
								style.top = '0px';
								style.left = e.clientX - x + 'px';
								// drag.onmousemove = null;

							}else if(e.clientY - y + 100 > wrap){
								style.left = e.clientX - x + 'px';							
								style.top = wrap - 100 + 'px';
								// drag.onmousemove = null;

							}else {
								style.left = e.clientX - x + 'px';							
								style.top = e.clientY - y + 'px';
								
							}
						};
						drag.onmouseup=function(){
							drag.onmousemove = null;
						}
					}

				}
			}

			//判断改点点击到底时拖拽事件还是放大事件
			function isDrag (e) {
				var crop = document.getElementById('crop');
				var style = crop.style;
				var x = 0, y = 0;

				var wrap = crop.parentNode;
				var wrapX = wrap.offsetLeft;
				var wrapY = wrap.offsetTop;

				var bx = wrapX + crop.offsetLeft + crop.clientWidth + 2;
				var by = wrapY + crop.offsetTop + crop.clientHeight + 2;

				return position(e, bx, by, style);				
			}


			//只是检测在变换鼠标的样式
			function changeType () {
				var crop = document.getElementById('crop');
				var style = crop.style;
				var x = 0, y = 0;

				var wrap = crop.parentNode;
				var wrapX = wrap.offsetLeft;
				var wrapY = wrap.offsetTop;
				// var wrap = drag.parentNode.offsetHeight;

				//去扩充文本框
				wrap.onmousemove = function(e) {
					e = e||event;
					x = e.clientX;
					y = e.clientY;

					//某些点的时候去检测什么时候出现拉伸的鼠标图标

					// var bx = wrapX + crop.offsetLeft + crop.clientWidth;
					// var by = wrapY + crop.offsetTop + crop.clientHeight;

					var setX = x - wrapX - crop.offsetLeft - crop.clientWidth - 2;
					var setY = y - wrapY - crop.offsetTop - crop.clientHeight - 2;

					if(setX < 2 && setX > -2 && setY < 2 && setY > -2) {
						style.cursor = 'se-resize';
					}else if (setX < 2 && setX > -2) {
						style.cursor = 'e-resize';
						/*document.onmousedown = function (e){
							
						}*/

					}else if (setY < 2 && setY > -2){
						style.cursor = 's-resize';
					}else {
						style.cursor = '';
					}
					
				}
			}

			//确定边框的位置
			function position (e, bx, by, style) {
				e = e||event;
				x = e.clientX;
				y = e.clientY;

				//某些点的时候去检测什么时候出现拉伸的鼠标图标

				var setX = x - bx;
				var setY = y - by;

				if(setX < 2 && setX > -2 && setY < 2 && setY > -2) {			
					return true;
				}else if (setX < 2 && setX > -2) {
					return true
				}else if (setY < 2 && setY > -2){
					return true;
				}else {
					return false;
				}
			}

			function changeSize (){
			    	//增加或者减少的尺寸
			    var x, y;

			    var crop = document.getElementById('crop');
				var wrap = crop.parentNode; 

			    var isClick = false;

			    document.onmousemove = function(e) {
			        var mx = e.clientX;
			        var my = e.cliernY;

			        var wx = wrap.offsetLeft;
			        var wy = wrap.offsetTop;

			        var cx = crop.offsetLeft;
			        var cy = crop.offsetTop;

			        x = mx - cx - crop.offsetWidth - wx;

			        document.onmousedown = function (){
			            if(Math.abs(x) <3) {
			                isClick = true;
			            }

			        }

			        if(isClick) {
			            console.log('start change' + Math.abs(x));
			            var style = crop.style;
			            style.width = style.height = x + crop.offsetWidth + 'px';
			        }

			        document.onmouseup = function () {
			            isClick = false;

			            /*console.log('toCropImgX:' + crop.offsetLeft);
			            console.log('toCropImgY:' + crop.offsetTop);
			            console.log('toCropImgW:' + crop.offsetWidth);
			            console.log('toCropImgH:' + crop.offsetWidth);*/

			        }
			        
			    }

			}

			$scope.uploadImag = function() {
				var crop = document.getElementById('crop');

				//传递给后台的数据
				var toCropImgX = crop.offsetLeft;
				var toCropImgY = crop.offsetTop;
				var toCropImgW = crop.offsetWidth;
				var toCropImgH = crop.offsetWidth;

				/*$http({
	                // url: attrs.url,
	                url: './corp.php',
	                method: 'POST',
	                data: data,
	                headers: {
	                    'Content-Type': undefined,
	                },
	                transformRequest: angular.identity
	            }).then(function(res) {
	                form.children("input[type=file]").val('');

	                $scope.uploadedCallback(res.data);

	            },function errorCallback(response) {
	                console.error(response);
	            });*/
			}

			$scope.cancelUpload = function() {
				var wrap = document.getElementById('my').childNodes[1];
	        	wrap.style.display = 'none';
				form.children("input[type=file]").val('');
			}
			

	    }
		
	}


}]);