<?php

date_default_timezone_set('Asia/Taipei');

spl_autoload_register(function ($classname) {
    require (__DIR__."/../classes/".$classname.".php");
});

require __DIR__.'/../vendor/autoload.php';

use \Psr\Http\Message\ServerRequestInterface as Request;
use \Psr\Http\Message\ResponseInterface as Response;
use \Slim\App;
use \Slim\Container;
use \Slim\HttpCache\CacheProvider;
use  \Slim\HttpCache\Cache;

$configuration = [
    'settings' => [
        'displayErrorDetails' => true,
    ],
];
$container = new Container($configuration);

//add HTTP cache helper for Slim

$container['cache'] = function () {
    return new CacheProvider();
};

//Override the default Not Found Handler

$container['notFoundHandler'] = function ($container) {
    return function ($request, $response) use ($container) {
        return $container['response']->withStatus(404)->withHeader('Content-Type', 'text/html')->write('Page not found');
    };
};

$app = new App($container);
$app->add(new Cache('./', 86400));

$loader = new Twig_Loader_Filesystem(__DIR__.'/templates');

$twig = new Twig_Environment($loader, []);

$app->get('/', function (Request $request, Response $response) {
    global $twig;
    $response->getBody()->write($twig->render('index.html', []));
    $resWithLastMod = $this->cache->withLastModified($response, time() - 3600);

    return $resWithLastMod;
});

$app->post('/video', function (Request $request, Response $response) {
    $parsedBody = $request->getParsedBody();

    $video = new HandleVideo(htmlentities($parsedBody['videoLink']));
    $videoRes = $video->getVideoInfo();

    global $twig;

    if ($videoRes !== false) {
        $videoRes = json_encode($videoRes);
        srand();
        $token = date('Y-m-d-').(rand(1, 100000000));
        file_put_contents(__DIR__.'./videos/'.$token.'.json', $videoRes);
        $response->getBody()->write($token);
    } else {
         $response->getBody()->write(json_encode('the video cannot get the source'));
    }

    return $response;
});

$app->get('/video/{token}', function (Request $request, Response $response) {
    global $twig;
    $fileName = realpath(htmlentities('videos/'.$request->getAttribute('token').'.json'));

    if (file_exists($fileName) === false) {
        $response->getBody()->write($twig->render('error-msg.html', [
            'errorMsg' => 'File Not Found'
        ]));
    } else {
        $renderJson = json_decode(file_get_contents($fileName), true);
        @unlink($fileName);
    
        $response->getBody()->write($twig->render('video.html', $renderJson));
    }

    return $response;
});

$app->run();
