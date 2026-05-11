<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\AttendanceRecord;
use App\Model\Student;
use App\Support\ApiResponse;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class KioskController
{
    public function store(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();
        $data['national_id'] = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));
        $errors = AttendanceRecord::validateKioskCheckIn($data);

        if ($errors !== []) {
            return ApiResponse::json($response, ['errors' => $errors], 422);
        }

        $student = Student::query()
            ->where('national_id', $data['national_id'])
            ->where('status', 'active')
            ->first();

        if (!$student) {
            return ApiResponse::json($response, ['message' => 'No active student was found with that national ID.'], 404);
        }

        $today = date('Y-m-d');
        $existing = AttendanceRecord::query()
            ->where('student_id', $student->id)
            ->where('attendance_date', $today)
            ->where('source', 'kiosk')
            ->first();

        if ($existing) {
            return ApiResponse::json($response, [
                'message' => 'Attendance was already registered today.',
                'data' => $existing,
            ]);
        }

        $attendance = AttendanceRecord::query()->create([
            'branch_id' => $student->branch_id,
            'student_id' => $student->id,
            'national_id' => $student->national_id,
            'person_type' => 'student',
            'person_name' => $student->full_name,
            'level' => $student->level,
            'attendance_date' => $today,
            'check_in_at' => date('Y-m-d H:i:s'),
            'status' => 'present',
            'source' => 'kiosk',
            'evidence_code' => AttendanceRecord::makeEvidenceCode(),
            'notes' => 'Student check-in from attendance kiosk.',
        ]);

        return ApiResponse::json($response, [
            'message' => 'Attendance registered.',
            'student' => [
                'name' => $student->full_name,
                'level' => $student->level,
            ],
            'data' => $attendance,
        ], 201);
    }
}
