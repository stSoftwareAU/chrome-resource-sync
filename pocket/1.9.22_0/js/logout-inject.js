
! function() {
    var a = function() {
        return void 0 !== window.safari
    };
    if (!a() || window.top == window) {
        var b = document.URL;
        a() && -1 === b.indexOf("e=4") || sendMessage({
            action: "logout"
        }, function(a) {})
    }
}();