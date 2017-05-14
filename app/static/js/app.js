$.defaultPage = 'main.html';
$.subPagesDirectory = 'views/';
$.page404 = '404.html';
$.mainContent = $('#ui-view');

// Main navigation
$.navigation = $('.menu > ul.nav');

$.panelIconOpened = 'icon-arrow-up';
$.panelIconClosed = 'icon-arrow-down';

// Default colors
$.brandPrimary = '#20a8d8';
$.brandSuccess = '#4dbd74';
$.brandInfo = '#63c2de';
$.brandWarning = '#f8cb00';
$.brandDanger = '#f86c6b';

$.grayDark = '#2a2c36';
$.gray = '#55595c';
$.grayLight = '#818a91';
$.grayLighter = '#d1d4d7';
$.grayLightest = '#f8f9fa';

'use strict';

/// Load JS file asynchronously in ajax mode
function loadJS(jsFiles, pageScript) {
    var i;
    var body;
    var script;

    for (i = 0; i < jsFiles.length; i++) {
        body = document.getElementsByTagName('body')[0];
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = false;
        script.src = jsFiles[i];
        body.appendChild(script);
    }

    if (pageScript) {
        body = document.getElementsByTagName('body')[0];
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = false;
        script.src = pageScript;
        body.appendChild(script);
    }

    init();
}

/// Load CSS file asynchronously in ajax mode
function loadCSS(cssFile, end, callback) {
    var cssArray = {};
    var head;
    var s;

    if (!cssArray[cssFile]) {
        cssArray[cssFile] = true;
        if (end === 1) {
            head = document.getElementsByTagName('head')[0];
            s = document.createElement('link');
            s.setAttribute('rel', 'stylesheet');
            s.setAttribute('type', 'text/css');
            s.setAttribute('href', cssFile);

            s.onload = callback;
            head.appendChild(s);
        } else {
            var style = document.getElementById('main-style');
            head = document.getElementsByTagName('head')[0];
            s = document.createElement('link');
            s.setAttribute('rel', 'stylesheet');
            s.setAttribute('type', 'text/css');
            s.setAttribute('href', cssFile);

            s.onload = callback;
            head.insertBefore(s, style);
        }
    } else if (callback) {
        callback();
    }
}

var paceOptions = { elements: false, restartOnRequestAfter: false };

var url = location.hash.replace(/^#/, '');
if (url !== '') {
    setUpUrl(url);
} else {
    setUpUrl($.defaultPage);
}

$(document).on('click', 'a.nav-link[href!="#"]', function (e) {
    var target;
    if ($(this).attr('target') === '_top') {
        e.preventDefault();
        target = $(e.currentTarget);
        window.location = (target.attr('href'));
    } else if ($(this).attr('target') === '_blank') {
        e.preventDefault();
        target = $(e.currentTarget);
        window.open(target.attr('href'));
    } else {
        e.preventDefault();
        target = $(e.currentTarget);
        setUpUrl(target.attr('href'));
    }
});

function setUpUrl(url) {
    $('.menu .nav .nav-link').removeClass('active');
    $('.menu .nav a[href="' + url.split('?')[0] + '"]').addClass('active');
    loadPage(url);
}

function loadPage(url) {
    $.ajax({
        type: 'GET',
        url: $.subPagesDirectory + url,
        dataType: 'html',
        cache: false,
        async: false,
        beforeSend: function () { $.mainContent.animate({ opacity: 0 }, 250); },
        success: function () {
            Pace.restart();
            $('html, body').animate({scrollTop: 0}, 0);
            $.mainContent.load($.subPagesDirectory + url, null, function (responseText) {
                window.location.hash = url;
                $.mainContent.delay(250).animate({ opacity: 1 }, 250)
            });
        },
        error: function () { window.location.href = $.page404; }
    });
}

$(document).on('click', '.card-actions a', function (e) {
    e.preventDefault();

    if ($(this).hasClass('btn-close')) {
        $(this).parent().parent().parent().fadeOut();
    } else if ($(this).hasClass('btn-minimize')) {
        var $target = $(this).parent().parent().next('.card-block');
        if (!$(this).hasClass('collapsed')) {
            $('i', $(this)).removeClass($.panelIconOpened).addClass($.panelIconClosed);
        } else {
            $('i', $(this)).removeClass($.panelIconClosed).addClass($.panelIconOpened);
        }

    } else if ($(this).hasClass('btn-setting')) {
        $('#myModal').modal('show');
    }

});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function init(url) {

    /* ---------- Tooltip ---------- */
    $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({"placement": "bottom", delay: {show: 400, hide: 200}});

    /* ---------- Popover ---------- */
    $('[rel="popover"],[data-rel="popover"],[data-toggle="popover"]').popover();

}
