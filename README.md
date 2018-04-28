## 数据列表已tag的形式展现可维护
支持mobx数据管理
* 支持tag排序
* 支持tag的添加
* 支持tag的删除
* 支持tag的搜索

### 交换数组元素参考
 ```javascript
    var swapItems = function(arr, index1, index2) {
        arr[index1] = arr.splice(index2, 1, arr[index1])[0];
        return arr;
    };

    // 上移
    $scope.upRecord = function(arr, $index) {
        if($index == 0) {
            return;
        }
        swapItems(arr, $index, $index - 1);
    };

    // 下移
    $scope.downRecord = function(arr, $index) {
        if($index == arr.length -1) {
            return;
        }
        swapItems(arr, $index, $index + 1);
    };
```