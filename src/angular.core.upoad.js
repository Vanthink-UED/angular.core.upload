/**
 * angular upload plugin
 *  20160429
 * doc here : https://github.com/Vanthink-UED/angular.core.upload
**/

'use strict';

angular.module('van.core.upload',[])
.directive('vanCoreUpload',['$http', function($http) {
    /*return {
        restrict: 'A',

        scope: {
            onSuccessUpload: '&?',
            extensionError: '&?',
            inputOfFile: '@',
            enableDrag: '@',
            extensions: '@',
            data: '&',
        },

        link: function($scope,$element,attrs) {

            if(!attrs.url){
                return console.error('url not setted');
            }

            // init a virtual form
            function initForm($el,options,data) {
                var defaultOPtions = {
                    extensions: [] ,     // file type .jpg .png
                    inputOfFile: '',    // to server input name


                };

                var options = angular.extend(defaultOPtions,options);
                $el.css("position", "relative");

                var htmlStr = '<form  method="post" enctype="multipart/form-data" action="' + options.url + '">';
                    htmlStr += '<input name="' + options.inputOfFile + '" type="file" accept="image/*" />';
                var dataArr = [];
                if (typeof data === 'object') {
                    for(var key in data) {
                        var str = '<input type="hidden" name=' + key + '> value="' + data[key] +  '"';
                        dataArr.push(str);
                    }
                }
                    htmlStr += dataArr.join('') + '</form>';

                var $form = $(htmlStr);
                var $inputUpload = $form.find('input[type="file"]');

                $form.css("display", "none");

                // add min width and height
                var w = $el.width() <= 0 ? 132 : $el.width();
                var h = $el.height() <= 0 ? 32 : $el.height();
                $form.css({
                    cursor: "pointer",
                    display: "block",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: w,
                    height: h,
                    cursor: "hand",
                    opacity: 0,
                    overflow: "hidden"
                });
                $form.find('input[type="file"]').css({
                    width: w,
                    height: h
                });
                var self = this;

                $el.append($form);

                return $form;


            }


            var $form = initForm($element,attrs,$scope.data);
            var $inputUpload = $form.find('input[type="file"]');
            $inputUpload.on("change", function (e) {
                var fileVal = $inputUpload.val().replace(/C:\\fakepath\\/i, "");
                var fileExt = fileVal.substring(fileVal.lastIndexOf(".") + 1);

                if($scope.extensions) {
                    var reg = new RegExp('^[' + $scope.extensions.replace(',','|') + ']+$','i');
                    if (!reg.test(fileExt)) {
                        return typeof $scope.extensionError === 'function' ? console.error('file type not support') : $scope.extensionError() ;
                    }
                }
                var data = new FormData();
                $.each(e.target.files, function(key, value)
                {
                    data.append(attrs.inputOfFile, value);
                });

                if (typeof $scope.data === 'object') {
                    $.each($scope.data, function(key, value){
                        data.append(key, value);
                    });

                }


                // use svg icon
                var icon_str = '<div class="core-upload-svg-icon" style="position:absolute;left:0;top:0;width:100%;height:100%;text-align:center;background-color:';
                    icon_str += $element.css('background-color');
                    icon_str += ';">';
                    icon_str += '<svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="25px" style="vertical-align:middle;" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><path fill="#fff" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z" transform="rotate(293.601 25 25)"><animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"></animateTransform></path></svg>';
                    icon_str += '</div>';
                var $loading = angular.element(icon_str);
                $element.append($loading);
                $http({
                    url: attrs.url,
                    method: 'POST',
                    data: data,
                    headers: {
                        'Content-Type': undefined
                    },
                }).then(function(res) {
                    $form.find("input[type=file]").val('');
                    $form.find("input[type=file]").attr("disabled", false);
                    $loading.remove();
                    $scope.onSuccessUpload(res);

                },function errorCallback(response) {
                    $form.find("input[type=file]").val('');
                    $form.find("input[type=file]").attr("disabled", false);
                    $loading.remove();
                    console.error(response);
                });
                $form.find("input[type=file]").attr("disabled", "disabled")

            });
        }
    }*/
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
                var x = e.clientX;
                var y = e.clientY;

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
}])
