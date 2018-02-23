const clipboard = require('electron').clipboard
const ipcRenderer = require('electron').ipcRenderer

var theLastSearchText = "";
var theLastSearchDriver = document.getElementById("search-driver-list").value;
console.log("默认引擎是："+theLastSearchDriver);
//网页按钮事件集合
function setMagent(magent_Btn)
{
    var magent_Text = magent_Btn.parentNode.children[5].innerHTML;
    console.log(magent_Text);
    clipboard.writeText(magent_Text);
}
function setThunder(thunder_Btn)
{
    var thunder_Text = thunder_Btn.parentNode.children[7].innerHTML;
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
    var search_driver = document.getElementById('search-driver-list').value;
    if(search_text !=theLastSearchText||search_driver !=theLastSearchDriver)
    {
        document.getElementById("search-list").innerHTML = "";//清空上一个搜索项的数据
        document.getElementById("load-more-button").hidden = true;//重新隐藏加载按钮知道获得新数据
        theLastSearchText = search_text;
        theLastSearchDriver = search_driver;
    }
    ipcRenderer.send("SpliderPlease",search_text,search_driver);

}
//监听主进程返回的数据
ipcRenderer.on("SpliderMsg",function(event,data,type){
    var massage_array = {};
    //根据搜索引擎类型调用相应的函数(manager-driver.js里面的函数)获取数据列表.
    switch(type){
        case "runbt":console.log("调用runbt引擎");massage_array = runbt_getDataList(data);break;
        case "shenmidizhi":console.log("调用神秘地址引擎");massage_array = shenmidizhi_getDataList(data); break;
        //case "btcili":console.log("调用btcili引擎");massage_array = shenmidizhi_getDataList(data);break;
        case "btbit":console.log("调用btbit引擎");massage_array = btbit_getDataList(data); break;
        case "bearbt":console.log("调用Bt熊引擎");massage_array = bearbt_getDataList(data); break;
        case "zhongziso":console.log("调用zhongziso引擎");massage_array = zhongziso_getDataList(data); break;
        default: console.log(data); break;
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
        //console.log(li_html);
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
    var li_html = ["<li><span>" , name , "</span><br>"].join("");
    if(magent!="")
    {
        li_html+="<button onclick=\"setMagent(this)\">复制磁力链接</button>";
    }
    else
    {
        console.log("这个元素没有磁链");
        li_html+="<button hidden>没有磁力链接</button>"
    }
    if(thunder!="")
    {
        li_html+="<button onclick=\"setThunder(this)\">复制迅雷链接</button>";
    }
    else
    {
        console.log("这个元素没有迅雷链接");
        li_html+="<button hidden>没有迅雷链接</button>"
    }
    
    li_html = [li_html , "<br><span style=\"display:inline-block;width:60%;word-wrap:break-word;white-space:normal;\" >",magent,"</span><br><span style=\"display:inline-block;width:60%;word-wrap:break-word;white-space:normal;\">",thunder,"</span><hr><br></li>"].join("");
    //console.log($.parseHTML(li_html));
    return $.parseHTML(li_html);
}
//
//判断光标是否在输入框里
var isOnInput = false;
document.getElementById("search-text-input").onfocus=function(){
    console.log("input 获取焦点");
    isOnInput = true;
}
document.getElementById("search-text-input").onblur =function(){
    console.log("input 失去焦点");
    isOnInput = false;
}

document.oncontextmenu = ()=>{
    var arg1="";
    if(window.getSelection)
    {
        arg1 = window.getSelection().toString();
    }
    //console.log("光标是否在输入框内？"+document.getElementById("search-text-input"));
    ipcRenderer.send("show-pointer-menu",arg1,isOnInput);
    console.log("光标是否在输入框里？"+isOnInput);
}
ipcRenderer.on('PasteText',function(e,arg){
    console.log("需要粘贴："+arg);
    document.getElementById("search-text-input").value += arg;
    
})