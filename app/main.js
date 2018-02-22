
console.log("主进程初始化...");
const {app , BrowserWindow} = require('electron');
const path = require('path');
const url = require("url");
const http = require('http');
const ipcMain = require('electron').ipcMain
const driver = require('./main-process/HttpDriver');//自定义的搜索引擎

var theNowSearchText = "";
var theNowSearchDriver = "";
let win;//这是显示的窗口

const createWindow = () =>{
    win = new BrowserWindow({
        width: 1000,
        height: 600
    });
    const URL = url.format({
        pathname: path.join(__dirname,"index.html"),
        protocol:'file',
        slashes:true
    });
    win.loadURL(URL);
    //win.webContents.openDevTools();
    win.setMenu(null);
    win.on('close',()=>{
        win = null;
    });
}


//检测app准备好后创建一个窗口
app.on('ready',createWindow);
//检测app内所有窗口都关闭后，app退出，程序结束
app.on('window-all-close',()=>{
    app.quit();
});

//监听渲染进程传送的搜索数据请求通信
ipcMain.on("SpliderPlease",function(event,arg,search_driver)
{
    theNowSearchText = arg;
    theNowSearchDriver = search_driver;
    console.log("主进程监听到爬虫请求，爬虫关键字为："+arg+"搜索引擎为："+search_driver);
    driver.get(theNowSearchText,search_driver,win,"Next_Search_Text");
});

//请求更多的数据
ipcMain.on("SpliderMorePlease",function(event){
    driver.get(theNowSearchText,theNowSearchDriver,win,"Next_Page");
});