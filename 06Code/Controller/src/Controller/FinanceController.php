<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Branch;
use App\Model\BranchFinanceReport;
use App\Service\BranchAccess;
use App\Support\ApiResponse;
use App\Support\Audit;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class FinanceController
{
    public function index(Request $request, Response $response): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');
        $query = BranchFinanceReport::query();

        BranchAccess::applyScope($query, $authUser);

        $reports = $query
            ->orderByDesc('month')
            ->orderBy('branch_id')
            ->get();

        return ApiResponse::json($response, ['data' => $reports]);
    }

    public function store(Request $request, Response $response): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');
        $data = (array) $request->getParsedBody();
        $branchId = BranchAccess::writableBranchId($data, $authUser);

        if ($branchId === null) {
            return ApiResponse::json($response, ['message' => 'This user cannot write records for that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = BranchFinanceReport::validateReport($data);

        if ($errors !== []) {
            return ApiResponse::json($response, ['errors' => $errors], 422);
        }

        if (!Branch::query()->find($branchId)) {
            return ApiResponse::json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        $income = (float) $data['income'];
        $expenses = (float) $data['expenses'];
        $matrixSharePercent = (float) $data['matrix_share_percent'];
        $matrixShare = $income * ($matrixSharePercent / 100);

        $report = BranchFinanceReport::query()->create([
            'branch_id' => $branchId,
            'month' => trim((string) $data['month']),
            'income' => $income,
            'expenses' => $expenses,
            'matrix_share_percent' => $matrixSharePercent,
            'matrix_share_amount' => $matrixShare,
            'net_result' => $income - $expenses - $matrixShare,
        ]);

        Audit::record($authUser, 'branch_finance_report.created', 'branch_finance_reports', (int) $report->id, [
            'branch_id' => $branchId,
            'month' => $report->month,
            'net_result' => $report->net_result,
        ]);

        return ApiResponse::json($response, [
            'message' => 'Branch finance report registered.',
            'data' => $report,
        ], 201);
    }
}
