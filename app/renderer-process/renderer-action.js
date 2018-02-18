const clipboard = require('electron').clipboard
const ipcRenderer = require('electron').ipcRenderer

var theLastSearchText = "";

//网页按钮事件集合
function setMagent(magent_Btn)
{
    var magent_Text = magent_Btn.parentNode.children[4].innerHTML;
    console.log(magent_Text);
    clipboard.writeText(magent_Text);
}
function setThunder(thunder_Btn)
{
    var thunder_Text = thunder_Btn.parentNode.children[6].innerHTML;
    console.log(thunder_Text);
    clipboard.writeText(thunder_Text);
}
function searchBtnClicked()
{
    var search_text = document.getElementById("search-text-input").value;
    console.log("需要搜索的关键字是："+search_text);
    //若为非法字符则退出且警告
    if(search_text == ""||search_text=="\\"||search_text=="=")
    {
        alert("非法的字符，关键字不能为空格，斜杠，等号等特殊字符")
        return;
    }
    sendSearchToMain(search_text);
}
function loadMoreBtnClicked()
{
    ipcRenderer.send("SpliderMorePlease");
    document.getElementById("load-more-button").disabled = true;//使按钮点击失效
    document.getElementById("load-more-button").value = "正在加载..."
}



//向主进程通信,传送需要查询的数据
function sendSearchToMain(search_text)
{
    
    if(search_text !=theLastSearchText)
    {
        document.getElementById("search-list").innerHTML = "";//清空上一个搜索项的数据
        document.getElementById("load-more-button").hidden = true;//重新隐藏加载按钮知道获得新数据
    }
    ipcRenderer.send("SpliderPlease",search_text);

}
//监听主进程返回的数据
ipcRenderer.on("SpliderMsg",function(event,data,type){
    var massage_array = {};
    //根据类型获取数据列表
    switch(type){
        case "runbt":massage_array = runbt_getDataList(data);
        default: break;
    }
    
    console.log("共有"+massage_array.length);
    //使"获取更多按钮"显示
    document.getElementById("load-more-button").hidden = false;
    document.getElementById("load-more-button").disabled = false;//使按钮点击存活
    document.getElementById("load-more-button").value = "加载更多"
    //向ol列表加入更多的li
    for(var index = 0;index<massage_array.length;index++)
    {
        var item = massage_array[index];
        var li_html = make_li(item.name,item.magent,item.thunder);
        console.log(li_html);
        $("#search-list").append(li_html);
    }
});


/*列表项的标准
<span>种子名称</span>
<button onclick="setMagent(this)">复制磁力链接</button>
<button onclick="setThunder(this)">复制迅雷链接</button>
<br>
<span>磁力链接地址</span>
<br>
<span>迅雷链接地址</span>
*/
//制作一个li的html对象
function make_li(name,magent,thunder)
{
    var li_html = ["<li><span>" , name , "</span><button onclick=\"setMagent(this)\">复制磁力链接</button><button onclick=\"setThunder(this)\">复制迅雷链接</button><br><span>",magent,"</span><br><span>",thunder,"</span><hr><br></li>"].join("");
    console.log($.parseHTML(li_html));
    return $.parseHTML(li_html);
}
//

