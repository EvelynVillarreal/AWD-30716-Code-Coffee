<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\AttendanceRecord;
use App\Model\Branch;
use App\Model\Student;
use App\Service\BranchAccess;
use App\Support\ApiResponse;
use App\Support\Audit;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AttendanceRecordController
{
    public function store(Request $request, Response $response): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');
        $data = (array) $request->getParsedBody();
        $student = null;

        if (!empty($data['student_id'])) {
            $student = Student::query()->find((int) $data['student_id']);

            if (!$student) {
                return ApiResponse::json($response, ['message' => 'Selected student does not exist.'], 422);
            }

            if (!BranchAccess::canAccessBranch($authUser, (int) $student->branch_id)) {
                return ApiResponse::json($response, ['message' => 'This user cannot write records for that branch.'], 403);
            }

            $data['branch_id'] = (int) $student->branch_id;
            $data['person_name'] = $student->full_name;
        } else {
            $branchId = BranchAccess::writableBranchId($data, $authUser);

            if ($branchId === null) {
                return ApiResponse::json($response, ['message' => 'This user cannot write records for that branch.'], 403);
            }

            $data['branch_id'] = $branchId;
        }

        $errors = AttendanceRecord::validateAttendance($data);

        if ($errors !== []) {
            return ApiResponse::json($response, ['errors' => $errors], 422);
        }

        if (!Branch::query()->find((int) $data['branch_id'])) {
            return ApiResponse::json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        $attendance = AttendanceRecord::query()->create([
            'branch_id' => (int) $data['branch_id'],
            'student_id' => $student?->id,
            'national_id' => $student?->national_id,
            'person_type' => strtolower((string) $data['person_type']),
            'person_name' => $student?->full_name ?? trim((string) $data['person_name']),
            'level' => $student?->level ?? strtoupper((string) ($data['level'] ?? '')),
            'attendance_date' => trim((string) $data['attendance_date']),
            'check_in_at' => $data['check_in_at'] ?? null,
            'status' => strtolower((string) $data['status']),
            'source' => 'manual',
            'evidence_code' => AttendanceRecord::makeEvidenceCode(),
            'notes' => trim((string) ($data['notes'] ?? '')),
        ]);

        Audit::record($authUser, 'attendance_record.created', 'attendance_records', (int) $attendance->id, [
            'branch_id' => (int) $data['branch_id'],
            'status' => $attendance->status,
            'source' => $attendance->source,
        ]);

        return ApiResponse::json($response, [
            'message' => 'Attendance registered.',
            'data' => $attendance,
        ], 201);
    }
}
