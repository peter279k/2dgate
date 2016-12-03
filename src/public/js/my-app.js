// Initialize your app
var myApp = new Framework7({
    onPageInit: function (page) {
        console.log('index page loading...');
        $.ajax({
            type: 'GET',
            url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20html%20where%20url%3D'http%3A%2F%2F2d-gate.org%2Fforum-78-1.html'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
            dataType: 'json',
            success: function (res) {
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
                        continue;
                    }

                    //console.log(animes);

                    for (animeIndex in animes) {
                        
                        var animeNameLink = animes[animeIndex]['a']['href'];

                        console.log(animeNameLink);

                        renderStr += '<li><div name="anime-link" target="_blank" class="item-link item-content">';
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

                        renderStr += '<div class="item-title" data-link="' + 'http://2d-gate.org/' + animeNameLink + '">' + animeName + '</div>';

                        if (animeFont !== animeChapter) {
                            renderStr += '<div class="item-after">' + '<span class="badge">' + animeFont + '</span>'  + '<span class="badge">' + animeChapter + '</span>' + '</div>';
                        } else {
                            renderStr += '<div class="item-after">' + '<span class="badge">' + animeChapter + '</span>' + '</div>';
                        }
                    }

                    renderStr += '</li></div>';
                }

                $('#new-anime-lists').html(renderStr);
                //console.log();
            },
            error: function (err) {
                console.log(err);
            }
        });
    }
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we use fixed-through navbar we can enable dynamic navbar

    dynamicNavbar: true
});

// Callbacks to run specific code for specific pages, for example for search page:

$$(document).on('click', '#search-anime', function (page) {
    // run createContentPage func after link was clicked
    myApp.closePanel();
    createContentPage();
});

$$(document).on('click', 'div[name="anime-link"]', function (e) {
    var animeLink = e.target.getAttribute('data-link');
    
    requestPage(animeLink);
});

$$(document).on('input propertychange', '#search-anime-input', function (e) {
    searchRequest($$('#search-anime-input').val());
});

$$(document).on('click', '#android-app', function (e) {
    myApp.closePanel();
});

function searchRequest (searchAnime) {

    var reqUrl = "http://anime.2d-gate.org";
    var cacheFile = '';

    $.ajax({
        type: "GET",
        url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url= '" + reqUrl + "'") + "&format=json&env=" + encodeURIComponent('store://datatables.org/alltableswithkeys'),
        dataType: "json",
        success: function (response) {
            cacheFile = response['query']['results']['body']['iframe']['src'];
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
        $.post('/search', {'anime_name': searchAnime, 'cache_file': cacheFile}, function(response) {
            console.log(response);
        });
    });
}

function requestPage (link) {
    $.ajax({
        type: "GET",
        url: 'https://query.yahooapis.com/v1/public/yql?q=' + encodeURIComponent("select * from html where url= '" + link + "'") + "&format=json&env=" + encodeURIComponent('store://datatables.org/alltableswithkeys'),
        dataType: "json",
        success: function (response) {
            var infoRoot = response['query']['results']['body']['div'][4]['div']['div']['div']['div']['div'][3]['div'][1];

            //get DISQUS embeded JS and contents

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

// Generate dynamic page
var dynamicPageIndex = 0;
function createContentPage() {
    $.get('/search', function(response) {
        mainView.router.loadContent(response);
    });

	return;
}
