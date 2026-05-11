<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\AttendanceRecord;
use App\Model\Student;
use App\Service\AttendanceSummary;
use App\Service\BranchAccess;
use App\Service\DateRange;
use App\Support\ApiResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class StudentController
{
    public function index(Request $request, Response $response): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');
        $filters = $request->getQueryParams();
        $query = Student::query()->with('branch');

        BranchAccess::applyScope($query, $authUser);

        if (!empty($filters['branch_id'])) {
            $branchId = (int) $filters['branch_id'];

            if (!BranchAccess::canAccessBranch($authUser, $branchId)) {
                return ApiResponse::json($response, ['data' => []]);
            }

            $query->where('branch_id', $branchId);
        }

        $students = $query
            ->when($filters['level'] ?? null, fn($query, $value) => $query->where('level', strtoupper((string) $value)))
            ->when($filters['scholarship'] ?? null, fn($query, $value) => $query->where('scholarship_percent', (int) $value))
            ->orderBy('full_name')
            ->get();

        return ApiResponse::json($response, ['data' => $students]);
    }

    public function attendance(Request $request, Response $response): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');

        if (($authUser['role'] ?? '') !== 'student' || empty($authUser['student_id'])) {
            return ApiResponse::json($response, ['message' => 'Only student accounts can view their own monthly attendance here.'], 403);
        }

        [$month, $start, $end] = DateRange::month((string) ($request->getQueryParams()['month'] ?? null));
        $records = AttendanceRecord::query()
            ->where('student_id', (int) $authUser['student_id'])
            ->whereBetween('attendance_date', [$start, $end])
            ->orderByDesc('attendance_date')
            ->get();

        return ApiResponse::json($response, [
            'month' => $month,
            'summary' => AttendanceSummary::fromRecords($records),
            'data' => $records,
        ]);
    }
}
