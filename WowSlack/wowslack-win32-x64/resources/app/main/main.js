const electron = require('electron');
const url = require('url');
const path = require('path');
const request = require('request');

const {
    app,
    BrowserWindow
} = electron; //get specifc items from electron
const ipcMain = electron.ipcMain; //get the IPC main compoent

//need this all the time,decalre them here
let MainWindow;
let ChildWindow;

app.on('ready', function () { //once the app is ready
    MainWindow = new BrowserWindow({ //create the main window
        width: 1281,
        height: 800,
        minWidth: 1281,
        minHeight: 800,
        maxWidth: 1281,
        maxHeight: 800,
      // autoHideMenuBar: true, //hide the menu bar
        icon: path.join(__dirname, '../assets/ws.png')
    })
    MainWindow.on("close", (evt) => { //whenever the main window closes, quite the app
        app.quit();
    });
    MainWindow.hide(); //dont want to show this until user logs in

    let $ = require('jquery');
    MainWindow.$ = $; //assign jquery globaly, this works some times
    ChildWindow = new BrowserWindow({ //create the child window
        width: 800,
        height: 900,
        minWidth: 800,
        minHeight: 900,
        maxWidth: 1281,
        maxHeight: 900,
     //   autoHideMenuBar: true, //hide the menu bar
        parent: MainWindow
    })

    ChildWindow.on("close", (evt) => { //whenever the child window is closed, just hide instead
        evt.preventDefault();
        ChildWindow.hide();
    });

    MainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../mainpage/MainPage.html'),
        protocol: 'file',
        slashes: true,
        show: false
    }));


    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../login/loginWindow.html'),
        //pathname: path.join(__dirname, '../TheTutoiralIFondOnYoutube/workplz.html'),
        protocol: 'file',
        slashes: true,
        show: false
    }));

    ChildWindow.once('ready-to-show', () => {
        child.show()
    })

    //get a acess token from blizzard for the API on app one
    request('https://eu.battle.net/oauth/token?grant_type=client_credentials&client_id=cc03f6bfa99541d9b2644e450b96eadf&client_secret=e1rRSqs6k5QES9yxMaDNV1PXL4QrDDQI', {
        json: true
    }, (err, res, body) => {

        global.Token = body.access_token
    })


});

//reload function,this will reload all details into the mainPage.html
ipcMain.on('asynchronous-message', (event, args) => {
    ChildWindow.hide(); //when we do login,close the login window
    global.uid = args
    MainWindow.show();
    MainWindow.webContents.send('info', args);
    MainWindow.webContents.send('loadProfilePage');

});

//whenever someone makes an account,put them back to login
ipcMain.on('accountCreated', () => {
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../login/loginWindow.html'),
        protocol: 'file',
        slashes: true,
        show: false
    }));
})

//fired when the user loads the profile page
ipcMain.on('tabChangeProfile', (sender, args) => {
    MainWindow.webContents.send('loadProfilePage');
})

//fired when item calc page is loaded
ipcMain.on('load-itemCalc', (sender, args) => {

    MainWindow.webContents.send("load-itemCalc");
})

ipcMain.on('create-account', (event, args) => {
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../login/loginWindow.html'),
        protocol: 'file',
        slashes: true
    }));
});

//whenever a user logs in, I store there user details, mainly so I can get at them for messaging later
ipcMain.on("storeUserDetails", (event, userDetails) => { //handly way I can set global vars for the users when logging in

    global.userDetails = userDetails;

});

//store the auth token, not used at the moment, but may be useful if I need to re-request a token
ipcMain.on("storeAuthToken", (event, authToken) => { //store the Auth token in the global namespace

    global.Token = authToken;
});

//whenever a hits the exit button, we can close the window, and then the app quits
ipcMain.on('sign-out', (event, args) => {
    MainWindow.close();
});

//loads the char create in the child window
ipcMain.on('load-charCreate', (event, args) => {
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../createChar/charCreate.html'),
        protocol: 'file',
        slashes: true
    }));
    ChildWindow.show(); //when we do login,close the login window
});

//loads the guild create in the child window
ipcMain.on('load-guildCreate', (event, args) => {
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../guildCreate/guildCreate.html'),
        protocol: 'file',
        slashes: true
    }));
    ChildWindow.show(); //when we do login,close the login window
});

//whenever a user loads a guild,save that ID, this will be overwriteen when a new guild is loaded
ipcMain.on("load-Guild", (event, args) => {
    global.loadGuildID = args;
})
//loads the guild chat page, sends the guild ID and the channel
ipcMain.on('load-guildChatpage', (event, args, args2) => {

    MainWindow.webContents.send("load-guildChatpage", args, args2);
})

//loads the event page
ipcMain.on('load-guildEventPage', (event, args) => {
    global.Gid = args; 
    MainWindow.webContents.send("load-guildEventPage", args);
});

//loads the event create in the child window
ipcMain.on('load-eventCreate', (event, args) => {
    global.Gid = args; 
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../guildCalendar/AddEvent/AddEvent.html'),
        protocol: 'file',
        show: false,
        slashes: true
    }));

    ChildWindow.show();
});

//lodas event edit in the child window
ipcMain.on('load-eventEdit', (sender, args) => {
    console.log("Hmm little kiten")
    ChildWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../guildCalendarV2/EventEdit/eventEdit.html'),
        protocol: 'file',
        show: false,
        slashes: true
    }));
    global.editEventID = args;
    ChildWindow.show();
});

//hide the child window once a event is added
ipcMain.on('eventAdded', () => {
    ChildWindow.hide();
})
//or updated
ipcMain.on('eventUpdated', () => {
    ChildWindow.hide();
});
//send the message to the main page, that we are done loading
ipcMain.on('toggleLoaderOff', () => {
    MainWindow.webContents.send('toggleLoaderOff');
})