

//获取完整的页面有效数据列表
runbt_getDataList = function(htmlData){
    var objE = document.createElement("div"); 
    objE.innerHTML = htmlData;
    var htmlDom = objE.childNodes;
    var $doc = $(htmlDom[23]);
    var $list = $doc.find('li')
    var json = [
    ]
    
    
    var index = 0;
    for(var i=0;i<$list.length;i++)
    {
        var a_list = $($list[i]).find('a');
        var item = new Object();
        item.name = a_list[0].innerText;
        item.magent = a_list[1].href;
        item.thunder = a_list[2].href;
        json[json.length] = item;
    }
    console.log("解析成功");
    return json;
}