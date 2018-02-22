

//获取完整的页面有效数据列表
runbt_getDataList = function(htmlData){
    var objE = document.createElement("div"); 
    objE.innerHTML = htmlData;
    var htmlDom = objE.childNodes;
    
    var $doc = $(htmlDom).find('div',"id='wrapper'");
    console.log($doc)
    var $list = $doc.find('li')
    var json = []
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

shenmidizhi_getDataList = function(htmlData){
    var objE = document.createElement("div"); 
    objE.innerHTML = htmlData;
    var htmlDom = objE.childNodes;
    
    var $td_list = $(htmlDom).find('td',"class='x-item'");
    console.log($td_list)
    var json = []
    for(var i=0;i<$td_list.length;i++)
    {
        var a_list = $($td_list[i]).find('a');
        var item = new Object();
        item.name = a_list[0].innerText;
        
        item.magent = a_list[1].href;
        item.thunder = ""
        json[json.length] = item;
    }
    console.log("解析成功");
    console.log(json);
    return json;
}

btbit_getDataList = function(htmlData){
    var objE = document.createElement("div"); 
    objE.innerHTML = htmlData;
    var htmlDom = objE.childNodes;
    var div_list = $(htmlDom).find("div[class='rs']");
    console.log(div_list);

    var json = [];
    for(var i=0;i<div_list.length;i++)
    {
        var item = new Object();
        item.name = $(div_list[i]).find("h3")[0].innerText;
        var sbar = $(div_list[i]).find("div[class='sbar']");
        item.magent = $(sbar).find('a')[0].href;
        item.thunder = "";
        console.log(item);
        json[json.length] = item;
    }

    return json;
}

bearbt_getDataList = function(htmlData){
    var objE = document.createElement("div"); 
    objE.innerHTML = htmlData;
    var htmlDom = objE.childNodes;
    var li_list = $(htmlDom).find("li");
    console.log(li_list);

    var json = [];
    for(var i=0;i<li_list.length;i++)
    {
        var item = new Object();
        var a_list = $(li_list[i]).find('a');
        item.name = a_list[0].innerText;
        item.magent = a_list[1].href;
        item.thunder = "";
        json[json.length] = item;
    }

    return json;
}
zhongziso_getDataList = function(htmlData){
    var objE = document.createElement("div"); 
    objE.innerHTML = htmlData;
    var htmlDom = objE.childNodes;
    var ul_list = $(htmlDom).find("ul[class='list-group']");

    //console.log(ul_list);

    var json = [];
    for(var i=0;i<ul_list.length;i++)
    {
        var item = new Object();
        var a_list = $(ul_list[i]).find('a');
        item.name = a_list[0].innerText;
        item.magent = a_list[1].href;
        item.thunder = a_list[2].href;
        console.log(a_list);
        json[json.length] = item;
    }

    return json;
}