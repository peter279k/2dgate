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
        }).then(function() {
        });
    }

});

// Export selectors engine
var $$ = Dom7;

$$('#disqus_thread').hide();

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar

    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for search page:

$$(document).on('click', '#search-anime', function (e) {
    // run createContentPage func after link was clicked
    e.preventDefault =false;
    myApp.closePanel();
    myApp.showIndicator();
    createContentPage('search', null);
});

$$(document).on('click', '#search-anime-news', function (e) {
    // run createContentPage func after link was clicked
    e.preventDefault = false;
    myApp.closePanel();
    myApp.showIndicator();
    createContentPage('search-news', null);
});

$$(document).on('click', 'a[name="anime-link"]', function (e) {
    e.preventDefault = false;
    var animeLink = $$(this).attr('data-link');
    createContentPage('anime-intro', animeLink);
});

$$(document).on('click', '#android-app', function (e) {
    myApp.closePanel();
});


$$(document).on('click', 'a[name="anime-lists-link"]', function (e) {
    e.preventDefault = false;
    var animeLink = $$(this).attr('data-link');
    console.log(animeLink);
});

$$(document).on('click', 'a[name="more-anime-infos"]', function (e) {
    e.preventDefault = false;
    var animeLink = $$(this).attr('data-link');
    console.log(animeLink);
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
    var currPage = null;
    var renderStr = '';

    $.ajax({
        type: 'GET',
        url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url= '" + link + "'") + "&format=json&env=" + encodeURIComponent('store://datatables.org/alltableswithkeys'),
        dataType: "json",
        success: function (response) {
            var totalPage = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div']['div']['div'][2]['div']['label']['span']['title'];
            var pageAnimeLists = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div']['div']['div'][3]['div'][1]['form']['ul']['li'];

            for(index in pageAnimeLists) {

                var aTag = pageAnimeLists[index]['div']['a'];
                var postLink = aTag['href'];
                var animeName = aTag['title'];
                var imgLink = aTag['img']['src'];

                renderStr += '<li><a href="#" data-link="' + postLink + '" name="anime-lists-link" class="item-link item-content"><div class="item-media">';
                renderStr += '<img data-src="' + imgLink + '" width="40" class="lazy"></div><div class="item-inner"><div class="item-title-row">';
                renderStr += ' <div class="item-title">' + animeName + '</div>';
                renderStr += '</div></div></a>';

                renderStr += '</li>';
            }

            $('#search-result-anime').append(renderStr);

            currPage = totalPage.replace(' ', '');
            currPage = currPage.replace(' ', '');

            currPage = currPage.replace('頁', '');
            currPage = currPage.replace('共', '');
        },
        error: function (error) {
            console.log(error);
        }
    }).done (function () {
        console.log('success');
    }).fail (function () {
        console.log('fail');
    }).always (function () {
        console.log('complete');
    }).then (function  () {
            //renderStr += otherPageLists(index, currPage);
            otherPageLists(currPage, renderStr);
    });
}

function initialNewsList() {
    var link = 'http://2d-gate.org/forum-61-1.html';
    var currPage = null;
    var renderStr = '';
    var appendStr = null;
    myApp.showIndicator();

    $.ajax({
        type: 'GET',
        url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url= '" + link + "'") + "&format=json&env=" + encodeURIComponent('store://datatables.org/alltableswithkeys'),
        dataType: "json",
        success: function (response) {
            var totalPage = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div']['div']['div'][2]['div']['label']['span']['title'];
            var pageAnimeLists = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div']['div']['div'][3]['div'][1]['form']['ul']['li'];

            currPage = totalPage.replace(' ', '');
            currPage = currPage.replace(' ', '');

            currPage = currPage.replace('頁', '');
            currPage = currPage.replace('共', '');

            for(index in pageAnimeLists) {

                var aTag = pageAnimeLists[index]['div']['a'];
                var postLink = aTag['href'];
                var postName = aTag['title'];
                var imgLink = aTag['img']['src'];

                renderStr += '<div class="content-block-title">動漫情報：取目前最新的前 20 筆</div>';
                renderStr += '<div class="card demo-card-header-pic">';
                renderStr += '<div style="background-image:url(' + imgLink + ')" valign="bottom" class="card-header color-white no-border"></div>';
                renderStr += '<div class="card-content"><div class="card-content-inner">';
                renderStr += '<p>' + postName + '</p></div></div>';
                renderStr += '<div class="card-footer"><a name="have-page-number" data-total-page-number="2" href="#" class="link"></a><a name="more-anime-infos" data-link="' + postLink + '" href="#" class="link">更多...</a></div>';
                renderStr += '</div>';
            }

            $('#search-anime-news-content').append(renderStr);
        },
        error: function (error) {
            console.log(error);
        }
    }).done (function () {
        console.log('success');
    }).fail (function () {
        console.log('fail');
    }).always (function () {
        console.log('complete');
    }).then (function  () {
        myApp.hideIndicator();
    });

}

function otherNewsPage(page) {
    var link = '';
}

function animeNews () {
    var link = 'http://2d-gate.org/forum-61-1.html#.WESSjdV96Uk';
    
    $.ajax({
        type: 'GET',
        url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url= '" + link + "'") + "&format=json&env=" + encodeURIComponent('store://datatables.org/alltableswithkeys'),
        dataType: "json",
        success: function (success) {
            var totalPage = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div']['div']['div'][2]['div']['label']['span']['title'];
            var pageAnimeLists = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div']['div']['div'][3]['div'][1]['form']['ul']['li'];

            var currPage = totalPage.replace(' ', '');
            currPage = currPage.replace(' ', '');

            currPage = currPage.replace('頁', '');
            currPage = currPage.replace('共', '');

            console.log(parseInt(currPage));
            console.log(JSON.stringify(pageAnimeLists));
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function scrollNews(page) {
}

function otherPageLists (totalPage, initialStr) {
    var pageArr = [];

    for (var index=2;index<=totalPage;index++) {
        pageArr[index-2] = index;
    }

    async_forin (pageArr, function (_, currPage, value) {
        var link = 'http://2d-gate.org/forum.php?mod=forumdisplay&fid=78&sortid=2&sortid=2&filter=sortid&page=' + pageArr[currPage] + '#.WEWrpNV96Uk';
        var renderStr = '';

        $.ajax({
            type: 'GET',
            url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url= '" + link + "'") + "&format=json&env=" + encodeURIComponent('store://datatables.org/alltableswithkeys'),
            dataType: "json",
            success: function (response) {
                var pageAnimeLists = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div']['div']['div'][3]['div'][1]['form']['ul']['li'];

                for(index in pageAnimeLists) {
                    renderStr += '<li><a name="anime-lists-link" href="#" class="item-link item-content"><div class="item-media">';

                    var aTag = pageAnimeLists[index]['div']['a'];
                    var postLink = aTag['href'];
                    var animeName = aTag['title'];
                    //console.log(animeName);
                    var imgLink = aTag['img']['src'];

                    renderStr += '<img data-src="' + imgLink + '" width="40" class="lazy"></div><div class="item-inner"><div class="item-title-row">';
                    renderStr += ' <div class="item-title">' + animeName + '</div>';
                    renderStr += '</div></div></a>';

                    renderStr += '</li>';
                }

                $('#search-result-anime').append(renderStr);

                if (pageArr[pageArr.length-1] === pageArr[currPage]) {
                    myApp.initImagesLazyLoad('img.lazy');
                    myApp.hideIndicator();
                } else {
                    _._next();
                }
            },
            error: function (error) {
                console.log(error);
            }
        }).fail (function () {
            console.log('fail-' + currPage);
            _._next();
        });

    });
}

function requestAnimePage (link) {

    myApp.showIndicator();
    var renderOneAnime = '<div class="content-block"><div class="content-block-inner">';

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
            var chapters = detailMsg[1]['table']['tbody']['tr']['td']['div']['ul']['li'];
            var chaptersVideo = detailMsg[1]['table']['tbody']['tr']['td']['div']['div'];

            renderOneAnime += '<p><img data-src="' + imgLink + '" width="100%" class="lazy lazy-fadeIn"></p><p>' + getDescription + '</p>';

            var btnCount = 0;

            for(index in chapters) {
                renderOneAnime += '<p>';

                if (isNaN(chapters[index]['a']['content'])) {
                    renderOneAnime += '<p>';
                    renderOneAnime += '<a data-link="no-link" href="#" class="button">' + chapters[index]['a']['content'] + '</a>';
                    renderOneAnime += '</p>';
                    continue;
                } else {
                    if (btnCount === 2) {
                        renderOneAnime += '<p class="buttons-row">';
                    renderOneAnime += '<a data-link="' + chaptersVideo[index]['span']['href'] + '" href="#" class="button">' + chapters[index]['a']['content'] + '</a>';
                    renderOneAnime += '</p>';
                }

                renderOneAnime += '</p>';
            }

            renderOneAnime += '</p>';

            renderOneAnime += '</div></div>';

            $('#anime-intro-content').append(renderOneAnime);

             myApp.initImagesLazyLoad('img.lazy');
             myApp.hideIndicator();

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function createContentPage(link, animeLink) {
    if (link === 'search') {
        mainView.router.loadPage('templates/search.html');
        initialList();
    } else if (link === 'search-news') {
        mainView.router.loadPage('templates/search-news.html');
        initialNewsList();
    } else if (link === 'anime-intro') {
        mainView.router.loadPage('templates/anime-intro.html');
        requestAnimePage(animeLink);
    }

	return;
}

function async_forin (list, main) {
    var deferred = $.Deferred();
    
    if( Object.prototype.toString.call( list ) !== '[object Array]' ) {
        //如果 list 是 object 的話，就把每個 key 抓出來再 call 一次 async_forin

        var keys = [];
        for(k in list) {
            keys.push(k);
        }
        
        async_forin(keys, function() {
            main.call(this, this, keys[this.i], list[keys[this.i]]);
        }).then(function() {
            deferred.resolve(list);
        });
    } else {
        //如果 list 是 array 的話，就直接走訪每個元素

        var deferred = $.Deferred();
        var n = list.length;
        async_for({i: 0}, function () {
            return this.i < n;
        }, function () {
            this.i++;
        }, function () {
            main.call(this, this, this.i, list[this.i]);
        }).then(function () {
            deferred.resolve(list);
        });
    }
    
    return deferred.promise();
}

function async_for (initObj, cond, step, main) {
    var deferred = $.Deferred();

    initObj._next = function () {
        initObj._defer.resolve();
    };

    initObj._break = function () {
        initObj._defer.reject();
        deferred.resolve(initObj);
    };

    var wrapped_main = function () {
        initObj._defer = $.Deferred();
        main.call(this, this);
        return this._defer.promise();
    };

    var async_start = function () {
        if (cond.call(initObj, initObj)) {
            wrapped_main.call(initObj).then(function () {
                step.call(initObj, initObj);
            }).then(async_start);
        } else {
            deferred.resolve(initObj);
        }
    };

    async_start();

    return deferred.promise();
}

function resetDisqus(tId) {
    //"tid-13535"
    DISQUS.reset({
        reload: true,
        config: function () {
            this.page.identifier = tId;
        }
    });
}

