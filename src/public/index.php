<?php

require __DIR__.'/../vendor/autoload.php';

spl_autoload_register(function ($classname) {
    require (__DIR__."/../classes/" . $classname . ".php");
});

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

$loader = new Twig_Loader_Filesystem(__DIR__.'/templates');

$twig = new Twig_Environment($loader, []);

$app->get('/', function (Request $request, Response $response) {
    global $twig;
    $response->getBody()->write($twig->render('index.html', []));

    return $response;
});

$app->get('/search', function (Request $request, Response $response) {
    global $twig;
    $response->getBody()->write($twig->render('search.html', []));

    return $response;
});

$app->post('/search', function (Request $request, Response $response) {
    $animeName = htmlentities($request->getAttribute('anime_name'));
    $cacheFile = htmlentities($request->getAttribute('cache_file'));

    $response->getBody()->write();

    return $response;
});

$app->run();
