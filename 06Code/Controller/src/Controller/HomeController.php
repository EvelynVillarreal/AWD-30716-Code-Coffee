<?php
declare(strict_types=1);

namespace App\Controller;

use App\Support\ApiResponse;
use Illuminate\Database\Capsule\Manager as Capsule;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

final class HomeController
{
    public function index(Request $request, Response $response): Response
    {
        return ApiResponse::json($response, [
            'project' => 'American Latin Class Backend API',
            'framework' => 'Slim 4',
            'architecture' => 'MVC controllers with Eloquent models',
            'orm' => 'Eloquent ORM',
            'database' => 'Supabase PostgreSQL',
            'health' => '/api/health',
            'public_endpoints' => [
                '/api/health',
                '/api/branches',
                '/api/enrollments',
                '/api/auth/login',
                '/api/kiosk/attendance',
            ],
            'protected_endpoints' => [
                '/api/me',
                '/api/me/attendance',
                '/api/students',
                '/api/class-plans',
                '/api/attendance-records',
                '/api/professional-events',
                '/api/branch-finance-reports',
                '/api/dancer-settlements/{studentId}',
            ],
        ]);
    }

    public function health(Request $request, Response $response): Response
    {
        try {
            Capsule::connection()->select('select 1');

            return ApiResponse::json($response, [
                'status' => 'ok',
                'database' => 'connected',
                'project' => 'American Latin Class',
            ]);
        } catch (Throwable $exception) {
            return ApiResponse::json($response, [
                'status' => 'review',
                'database' => 'not connected',
                'message' => $exception->getMessage(),
            ], 503);
        }
    }
}
