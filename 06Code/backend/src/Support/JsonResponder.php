<?php
declare(strict_types=1);

namespace App\Support;

use Psr\Http\Message\ResponseInterface as Response;

final class JsonResponder
{
    public function json(Response $response, array $payload, int $status = 200): Response
    {
        $response->getBody()->write((string) json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));

        return $this->cors($response)
            ->withHeader('Content-Type', 'application/json')
            ->withStatus($status);
    }

    public function cors(Response $response, ?string $origin = null): Response
    {
        $raw = $_ENV['FRONTEND_ORIGINS'] ?? getenv('FRONTEND_ORIGINS') ?: '';
        $allowedOrigins = array_filter(array_map('trim', explode(',', $raw)));
        $defaultOrigins = [
            'https://alc-frontend.onrender.com',
            'http://127.0.0.1:5173',
            'http://localhost:5173',
        ];
        $allowedOrigins = $allowedOrigins === [] ? $defaultOrigins : $allowedOrigins;
        $allowedOrigin = in_array($origin, $allowedOrigins, true) ? $origin : $allowedOrigins[0];

        return $response
            ->withHeader('Access-Control-Allow-Origin', $allowedOrigin)
            ->withHeader('Vary', 'Origin')
            ->withHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            ->withHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    }
}
