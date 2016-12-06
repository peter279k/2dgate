<?php

spl_autoload_register(function ($classname) {
    require (__DIR__."/../classes/".$classname.".php");
});

require __DIR__.'/../vendor/autoload.php';

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\App;
use \Slim\Container;

$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];
$container = new Container($configuration);

//add HTTP cache helper for Slim

$container['cache'] = function () {
    return new \Slim\HttpCache\CacheProvider();
};

//Override the default Not Found Handler

$container['notFoundHandler'] = function ($container) {
    return function ($request, $response) use ($container) {
        return $container['response']
            ->withStatus(404)
            ->withHeader('Content-Type', 'text/html')
            ->write('Page not found');
    };
};

$app = new App($container);
$app->add(new \Slim\HttpCache\Cache(__DIR__, 86400));

$loader = new Twig_Loader_Filesystem(__DIR__.'/templates');

$twig = new Twig_Environment($loader, []);

$app->get('/', function (Request $request, Response $response) {
    global $twig;
    $response->getBody()->write($twig->render('index.html', []));

    return $response;
});

$app->get('/search', function (Request $request, Response $response) {
    global $twig;
    $resWithLastMod = $this->cache->withLastModified($response, time() - 3600);
    $response->getBody()->write($twig->render('search.html', []));

    return $response;
});

$app->get('/search-news', function (Request $request, Response $response) {
    global $twig;
    $resWithLastMod = $this->cache->withLastModified($response, time() - 3600);
    $response->getBody()->write($twig->render('search-news.html', []));

    return $response;
});

$app->post('/video', function (Request $request, Response $response) {
    $parsedBody = $request->getParsedBody();

    $search = new HandleSearch('http://2d-gate.org/forum.php?mod=forumdisplay&fid=78&sortid=2&sortid=2&filter=sortid&page='.$parsedBody['page'].'#.WEPrzdV96Ul');
    $result = $search->searchAnime();

    $newResponse = $response->withHeader('Content-type', 'application/json');

    if ($result !== false) {
        $newResponse->getBody()->write(json_encode($result));
    } else {
        $newResponse->getBody()->write(json_encode([
            'error' => 'request error happened.'
        ]));
    }

    return $response;
});

$app->run();
