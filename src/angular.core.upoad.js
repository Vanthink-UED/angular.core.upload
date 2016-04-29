/**
 * angular upload plugin
 *  20160429
 * doc here : https://github.com/Vanthink-UED/angular.core.upload
**/

'use strict';

angular.module('van.core.upload',[])
.directive('vanCoreUpload',['$http', function($http) {
    return {
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
                    $loading.remove();
                    $scope.onSuccessUpload(res);

                },function errorCallback(response) {
                    $loading.remove();
                    console.error(response);
                });
                $form.find("input[type=file]").attr("disabled", "disabled")

            });
        }
    }
}])
