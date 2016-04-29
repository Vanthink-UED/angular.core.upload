# angular.core.upload 上传组件

A light weight upload plugin for upload

[DEMO]()

### start


```js

<script src="./build/angular.core.upload.min.js"></script>
// js
var app =angular.module('demo',['van.core.upload'])

    app.controller('test', function ($scope) {
        $scope.upload = function(data) {
            alert(data);
        }
    })
```

``` html

<div van-core-upload url="upload.php" input-of-file="image" on-success-upload="upload" />

```
### options

`url` your server url @string rg:./src/upload.php;required;

`on-success-upload`: after finish your uploading your callback @function;required;

`input-of-file`: upload file form name @string;required

`extensions`: limit the file type @string eg:jpg,png;


### MIT LICENSE
