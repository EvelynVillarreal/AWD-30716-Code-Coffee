<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\AttendanceRecord;
use App\Model\Student;
use App\Service\AttendanceSummaryService;
use App\Service\AuthenticatedUser;
use App\Service\BranchAccessService;
use App\Service\DateRangeService;
use App\Support\JsonResponder;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class StudentController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly BranchAccessService $branchAccess,
        private readonly DateRangeService $dateRanges,
        private readonly AttendanceSummaryService $attendanceSummary
    ) {
    }

    public function index(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $filters = $request->getQueryParams();
        $query = Student::query()->with('branch');

        $this->branchAccess->applyScope($query, $authUser);

        if (!empty($filters['branch_id'])) {
            $branchId = (int) $filters['branch_id'];

            if (!$this->branchAccess->canAccessBranch($authUser, $branchId)) {
                return $this->responder->json($response, ['data' => []]);
            }

            $query->where('branch_id', $branchId);
        }

        $students = $query
            ->when($filters['level'] ?? null, fn($query, $value) => $query->where('level', strtoupper((string) $value)))
            ->when($filters['scholarship'] ?? null, fn($query, $value) => $query->where('scholarship_percent', (int) $value))
            ->orderBy('full_name')
            ->get();

        return $this->responder->json($response, ['data' => $students]);
    }

    public function attendance(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);

        if (!$authUser->isStudent()) {
            return $this->responder->json($response, ['message' => 'Only student accounts can view their own monthly attendance here.'], 403);
        }

        try {
            $range = $this->dateRanges->month((string) ($request->getQueryParams()['month'] ?? null));
        } catch (InvalidArgumentException $exception) {
            return $this->responder->json($response, ['message' => $exception->getMessage()], 422);
        }

        $records = AttendanceRecord::query()
            ->where('student_id', (int) $authUser->studentId())
            ->whereBetween('attendance_date', [$range->startDate(), $range->endDate()])
            ->orderByDesc('attendance_date')
            ->get();

        return $this->responder->json($response, [
            'month' => $range->month(),
            'summary' => $this->attendanceSummary->fromRecords($records),
            'data' => $records,
        ]);
    }

    private function authenticatedUser(Request $request): AuthenticatedUser
    {
        $user = $request->getAttribute('auth_user');

        if (!$user instanceof AuthenticatedUser) {
            throw new \RuntimeException('Authenticated user was not attached to the request.');
        }

        return $user;
    }
}
