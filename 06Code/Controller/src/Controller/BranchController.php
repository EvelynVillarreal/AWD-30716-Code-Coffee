<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Branch;
use App\Support\ApiResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Throwable;

final class BranchController
{
    public function index(Request $request, Response $response): Response
    {
        try {
            $branches = Branch::query()->orderBy('name')->get();
        } catch (Throwable $exception) {
            return ApiResponse::json($response, [
                'status' => 'review',
                'message' => 'Branches are not available until the database credentials are configured.',
                'detail' => $exception->getMessage(),
            ], 503);
        }

        return ApiResponse::json($response, ['data' => $branches]);
    }
}
