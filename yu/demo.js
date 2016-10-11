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
				  + '<input class="upload-img" name="{{inputOfFile}}" type="file" accept="image/*"/>'
				  + '</form>'
				  + '</div>'
				  + '<div class="modal">'
            	  	+ '<div class="wrap-img">'
                  		+ '<img class="preview" src="http://img1.vued.vanthink.cn/vtimgaef846bebea3271b0c48bc571222b37c-47220160624170005.png">'
                  		+ '<div class="crop" id="crop"></div>'
		          	+ '</div>'
		          + '</div>'
				  ,
	    scope:{
	        iscrop: '@',
	        inputOfFile: '@',
	        url: '@',
	        uploadedCallback:'&?'
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
	            var defaultOPtions = {
	                extensions: [] ,     // file type .jpg .png
	                inputOfFile: '',    // to server input name
	            };

	            var options = angular.extend(defaultOPtions,options);
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

	                    dragable();
	                });

	                //出现截图的部分
	        		var wrap = document.getElementById('my').childNodes[1];
	        		wrap.style.display = 'block';

	        		console.log(wrap);


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
				console.log(wrap);

				//去扩充文本框
				drag.onmouseover = function(e) {
					/*var mx = e.clientX;
					if(mx == )*/
				}
				//移动截图位置的大小
				drag.onmousedown = function(e){
					e = e||event;
					x = e.clientX - drag.offsetLeft;
					y = e.clientY - drag.offsetTop;


					drag.onmousemove = function(e){ 
						e = e||event;
						//让他父级中移动
						console.log(e.clientY - y + 100);
						style.left = e.clientX - x + 'px';							
						style.top = e.clientY - y + 'px';
						if(e.clientX - x <= 0) {
							style.top = e.clientY - y + 'px';
							style.left = '0px';
							drag.onmousemove = null;

						}else if(e.clientX - x + 100 > 400){
							style.left = 400 - 100 + 'px';
							style.top = e.clientY - y + 'px';
							drag.onmousemove = null;

						} else if(e.clientY - y <= 0){
							style.top = '0px';
							style.left = e.clientX - x + 'px';
							drag.onmousemove = null;

						}else if(e.clientY - y + 100 > wrap){
							style.left = e.clientX - x + 'px';							
							style.top = wrap - 100 + 'px';
							drag.onmousemove = null;

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
		
	}


}]);