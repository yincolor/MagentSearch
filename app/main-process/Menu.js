const {Menu , app,ipcMain,BrowserWindow} = require('electron');
const clipboard = require('electron').clipboard;
var selectStr="";
var win;

let template = [
    {
        label:'粘贴',
        enabled:false,
        click:()=>{
            console.log('点击了 粘贴 按钮');
            win.webContents.send('PasteText',clipboard.readText());//发送数据
        }
    },
    {
        label:'复制',
        enabled:true,
        click:()=>{
            //console.log('点击了 复制 按钮，需要复制：'+selectStr);
            var clipboard_text = clipboard.readText();
            if(selectStr != clipboard_text)
            {
                clipboard.writeText(selectStr);
            }
        }
    }
]



//Menu.setApplicationMenu(menu);//设置应用菜单栏
//app.dock.setMenu(menu);//设置dock栏的菜单

ipcMain.on('show-pointer-menu',(e,arg1,arg2)=>{
    selectStr = arg1;
    if(arg2 == true)
    {
        template[0].enabled = true;
    }
    else
    {
        template[0].enabled = false;
    }
    var menu = Menu.buildFromTemplate(template);//根据json建立一个菜单
    win = BrowserWindow.fromWebContents(e.sender);
    menu.popup(win);
})