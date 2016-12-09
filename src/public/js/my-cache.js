function isEnableCache () {
    if (store.enabled === false) {
        console.warn('The localstorage is not supported on your web browser.');
        console.warn('To enable the data cache and optimize user experience, you need to use the web browser which is suuported the localstorage.');

        return false;
    }

    return true;
}

function isCache (link) {
    if (link === 'search') {
        if (store.get('search-animes-list')) {
            return true;
        } else {
            return false;
        }
    }
}

function setCache (link, dataString) {
    if (link === 'search') {
        store.set('search-animes-list', {
            'render-string': dataString,
            'create-date': new Date().getTime()
        });
    }
}

function getCache (link) {
    if (link === 'search') {
        return store.get('search-animes-list');
    }
}

function isExpiredCache (link) {
    if (link === 'search' && isCache(link)) {
        var cacheData = getCache(link);
        if (new Date().getTime() - cacheData['create-date'] >= 86400000) {
            store.remove('search-animes-list');
            return true;
        }
    }

    return false;
}
