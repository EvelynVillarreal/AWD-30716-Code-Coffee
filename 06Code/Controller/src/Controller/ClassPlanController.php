<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Branch;
use App\Model\ClassPlan;
use App\Service\BranchAccess;
use App\Support\ApiResponse;
use App\Support\Audit;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ClassPlanController
{
    public function store(Request $request, Response $response): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');
        $data = (array) $request->getParsedBody();
        $branchId = BranchAccess::writableBranchId($data, $authUser);

        if ($branchId === null) {
            return ApiResponse::json($response, ['message' => 'This user cannot write records for that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = ClassPlan::validatePlan($data);

        if ($errors !== []) {
            return ApiResponse::json($response, ['errors' => $errors], 422);
        }

        if (!Branch::query()->find($branchId)) {
            return ApiResponse::json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        $plan = ClassPlan::query()->create([
            'branch_id' => $branchId,
            'teacher_name' => trim((string) $data['teacher_name']),
            'month' => trim((string) $data['month']),
            'level' => strtoupper((string) $data['level']),
            'objective' => trim((string) $data['objective']),
            'activities' => trim((string) $data['activities']),
            'status' => 'submitted',
        ]);

        Audit::record($authUser, 'class_plan.created', 'class_plans', (int) $plan->id, [
            'branch_id' => $branchId,
            'month' => $plan->month,
            'level' => $plan->level,
        ]);

        return ApiResponse::json($response, [
            'message' => 'Class plan submitted.',
            'data' => $plan,
        ], 201);
    }
}
