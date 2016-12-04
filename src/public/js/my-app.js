// Initialize your app
var myApp = new Framework7({
    onPageInit: function (page) {
        $.ajax({
            type: 'GET',
            url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2F2d-gate.org%2Fforum-78-1.html'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
            dataType: 'json',
            success: function (res) {
                if (res['query']['results'] === null) {
                    alert('資料暫時無法取得！');
                    return false;
                }

                var results = res['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div']['div']['div'];
                var weekNewAnime = results[0]['div'][1]['div'][1]['div']['table']['tbody']['tr'];
                var pages = results[2]['div']['label']['span']['title'];
                pages = pages.trim().replace(/共/g, '');
                pages = pages.trim().replace(/頁/g, '');
                pages = parseInt(pages);

                var renderStr = '';

                for (index in weekNewAnime) {
                    var weekName = weekNewAnime[index]['th'];

                    renderStr += '<li class="item-divider">' + weekName.trim() + '</li>';

                    if (weekNewAnime[index]['td'] === null) {
                        continue;
                    }

                    var animes = weekNewAnime[index]['td']['div'];

                    if(animes.length === undefined) {
                        renderStr += renderOneAnime(animes);

                    } else {
                        renderStr += renderAnimes(animes);
                    }

                    renderStr += '</a></li>';
                }

                $('#new-anime-lists').html(renderStr);
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
});

// Export selectors engine
var $$ = Dom7;

var currAnimePage = 0;
var currNewsPage = 0;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar

    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for search page:

$$(document).on('click', '#search-anime', function (page) {
    // run createContentPage func after link was clicked
    myApp.closePanel();
    myApp.showPreloader('載入中...');
    createContentPage();
});

$$(document).on('click', 'a[name="anime-link"]', function (e) {
    e.preventDefault = false;
    var animeLink = $$('a[name="anime-link"]').attr('data-link');

    requestPage(animeLink);
});

$$(document).on('input propertychange', '#search-anime-input', function (e) {
    
});

$$(document).on('click', '#android-app', function (e) {
    myApp.closePanel();
});

function renderOneAnime(animes) {
    var animeNameLink = animes['a']['href'];
    var renderStr = '';

    renderStr += '<li><a href="#" name="anime-link" class="item-link item-content" data-link="' + 'http://2d-gate.org/' + animeNameLink + '">';
    renderStr += '<div class="item-inner">';

    var animeName = animes['a']['content'];
    var spanLen = animes['a']['span'];

    if (spanLen.length === undefined) {
        var animeFont = animes['a']['span']['content'];
        var animeChapter = animes['a']['span']['content'];
    } else {
        var animeFont = animes['a']['span'][0]['content'];
        var animeChapter = animes['a']['span'][1]['content'];
    }

    renderStr += '<div class="item-title">' + animeName + '</div>';

    if (animeFont !== animeChapter) {
        renderStr += '<div class="item-after">' + '<span class="badge">' + animeFont + '</span>'  + '<span class="badge">' + animeChapter + '</span>' + '</div>';
    } else {
        renderStr += '<div class="item-after">' + '<span class="badge">' + animeChapter + '</span>' + '</div>';
    }
    
    renderStr += '</div>';

    return renderStr;
}

function renderAnimes(animes) {
    var renderStr = '';

    for (animeIndex in animes) {
        var animeNameLink = animes[animeIndex]['a']['href'];

        renderStr += '<li><a href="#" name="anime-link" class="item-link item-content" data-link="' + 'http://2d-gate.org/' + animeNameLink + '">';
        renderStr += '<div class="item-inner">';

        var animeName = animes[animeIndex]['a']['content'];
        var spanLen = animes[animeIndex]['a']['span'];

        if (spanLen.length === undefined) {
            var animeFont = animes[animeIndex]['a']['span']['content'];
            var animeChapter = animes[animeIndex]['a']['span']['content'];
        } else {
            var animeFont = animes[animeIndex]['a']['span'][0]['content'];
            var animeChapter = animes[animeIndex]['a']['span'][1]['content'];
        }
        
        renderStr += '<div class="item-title">' + animeName + '</div>';
        
        if (animeFont !== animeChapter) {
            renderStr += '<div class="item-after">' + '<span class="badge">' + animeFont + '</span>'  + '<span class="badge">' + animeChapter + '</span>' + '</div>';
        } else {
            renderStr += '<div class="item-after">' + '<span class="badge">' + animeChapter + '</span>' + '</div>';
        }
        
        renderStr += '</div>';
    }

    return renderStr;
}

function initialList () {
    var link = 'http://2d-gate.org/forum.php?mod=forumdisplay&fid=78&sortid=2&sortid=2&filter=sortid&page=1#.WEPrzdV96Ul';

    $.ajax({
        type: 'GET',
        url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url= '" + link + "'") + "&format=json&env=" + encodeURIComponent('store://datatables.org/alltableswithkeys'),
        dataType: "json",
        success: function (response) {
            var totalPage = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div']['div']['div'][2]['div']['label']['span']['title'];
            var pageAnimeLists = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div']['div']['div'][3]['div'][1]['form']['ul']['li'];

            var currPage = totalPage.replace(' ', '');
            currPage = currPage.replace(' ', '');

            currPage = currPage.replace('頁', '');
            currPage = currPage.replace('共', '');

            console.log(parseInt(currPage));
            console.log(JSON.stringify(pageAnimeLists));
            
            myApp.hidePreloader();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function animeNews () {
    var link = 'http://2d-gate.org/forum-61-1.html#.WESSjdV96Uk';
    
    $.ajax({
        type: 'GET',
        url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url= '" + link + "'") + "&format=json&env=" + encodeURIComponent('store://datatables.org/alltableswithkeys'),
        dataType: "json",
        success: function (success) {

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function scrollNews(page) {
    var link = 'http://2d-gate.org/forum-61-' + page + '.html#.WESSjdV96Uk';
}

function otherPageLists (page) {
    var link = 'http://2d-gate.org/forum.php?mod=forumdisplay&fid=78&sortid=2&sortid=2&filter=sortid&page=' + page + '#.WEPrzdV96Ul';
}

function requestPage (link) {
    $.ajax({
        type: "GET",
        async: true,
        url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url= '" + link + "'") + "&format=json&env=" + encodeURIComponent('store://datatables.org/alltableswithkeys'),
        dataType: "json",
        success: function (response) {
            var infoRoot = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div'][1];

            //get DISQUS embeded JS and contents (embeded the comments)

            //get the information of animes

            var detailMsg = infoRoot['div'][0]['table']['tbody']['tr'][0]['td'][1]['div'][1]['div']['div']['div'];
            var imgLink = detailMsg[0]['center']['a']['href'];
            var getAnimeName = detailMsg[0]['div']['h1'];
            var getDescription = detailMsg[0]['div']['span']['content'];
            var chapters = detailMsg[1]['table']['tbody']['tr']['td']['div']['div']['ul']['li'];

            for(index in chapters) {
                var content = chapters[index]['a']['content'];
                console.log(content);
            }

            console.log(imgLink);
            console.log(getAnimeName);
            console.log(getDescription);

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function createContentPage() {
    $.ajax({
        type: 'GET',
        async: true,
        url: '/search',
        success: function (response) {
            mainView.router.loadContent(response);
        },
        error: function (error) {
            console.log(error);
        }
    }).done(function () {
        console.log('success');
    }).fail(function () {
        console.log('fail');
    }).always(function () {
        console.log('complete');
    }).then(function () {
        initialList();
    });

	return;
}
