<?php
declare(strict_types=1);

use App\Support\ApiResponse;
use App\Support\Database;
use Dotenv\Dotenv;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Factory\AppFactory;

require __DIR__ . '/../vendor/autoload.php';
require __DIR__ . '/../src/bootstrap.php';

if (is_file(__DIR__ . '/../.env')) {
    Dotenv::createImmutable(__DIR__ . '/..')->safeLoad();
}

date_default_timezone_set($_ENV['APP_TIMEZONE'] ?? 'America/Bogota');

Database::boot();

$app = AppFactory::create();
$app->addBodyParsingMiddleware();
$app->addRoutingMiddleware();
$app->addErrorMiddleware(($_ENV['APP_DEBUG'] ?? 'false') === 'true', true, true);

$app->options('/{routes:.*}', static function (Request $request, Response $response): Response {
    return ApiResponse::cors($response, $request->getHeaderLine('Origin'));
});

$app->add(static function (Request $request, RequestHandler $handler): Response {
    $response = $handler->handle($request);
    return ApiResponse::cors($response, $request->getHeaderLine('Origin'));
});

(require __DIR__ . '/../routes/api.php')($app);

$app->run();
