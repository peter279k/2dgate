<?php

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

$twig = new Twig_Environment($loader, [
    'cache' => __DIR__.'/compilation_cache',
]);

$app->get('/', function (Request $request, Response $response) {
    global $twig;
    $response->getBody()->write($twig->render('index.html', []));

    return $response;
});



$app->run();
