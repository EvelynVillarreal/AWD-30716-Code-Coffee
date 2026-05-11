<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\AttendanceRecord;
use App\Model\Student;
use App\Service\AttendanceSummary;
use App\Service\DateRange;
use App\Support\ApiResponse;
use App\Support\Auth;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AuthController
{
    public function login(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
            return ApiResponse::json($response, ['message' => 'Email and password are required.'], 422);
        }

        $user = Auth::attempt($email, $password);

        if (!$user) {
            return ApiResponse::json($response, ['message' => 'Invalid credentials.'], 401);
        }

        $user->last_login_at = date('Y-m-d H:i:s');
        $user->save();

        return ApiResponse::json($response, [
            'token' => Auth::issueToken($user),
            'user' => Auth::publicUser($user),
        ]);
    }

    public function me(Request $request, Response $response): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');
        $payload = ['user' => $authUser];

        if (($authUser['role'] ?? '') === 'student' && !empty($authUser['student_id'])) {
            [$month, $start, $end] = DateRange::month((string) ($request->getQueryParams()['month'] ?? null));
            $student = Student::query()->with('branch')->find((int) $authUser['student_id']);
            $records = AttendanceRecord::query()
                ->where('student_id', (int) $authUser['student_id'])
                ->whereBetween('attendance_date', [$start, $end])
                ->orderByDesc('attendance_date')
                ->get();

            $payload['student'] = $student;
            $payload['attendance_month'] = $month;
            $payload['attendance_summary'] = AttendanceSummary::fromRecords($records);
            $payload['attendance'] = $records;
        }

        return ApiResponse::json($response, $payload);
    }
}
