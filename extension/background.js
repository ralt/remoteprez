chrome.browserAction.onClicked.addListener( function() {
    chrome.tabs.executeScript( null, {
        file: 'socket.io.min.js'
    }, function() {
        chrome.tabs.executeScript( null, {
            file: 'remoteprez.js'
        });
    });
});

