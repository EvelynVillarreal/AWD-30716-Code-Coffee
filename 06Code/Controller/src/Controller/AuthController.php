<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\AttendanceRecord;
use App\Model\Student;
use App\Model\User;
use App\Service\AttendanceSummaryService;
use App\Service\AuthenticatedUser;
use App\Service\AuthService;
use App\Service\DateRangeService;
use App\Support\JsonResponder;
use InvalidArgumentException;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class AuthController
{
    public function __construct(
        private readonly JsonResponder $responder,
        private readonly AuthService $auth,
        private readonly DateRangeService $dateRanges,
        private readonly AttendanceSummaryService $attendanceSummary
    ) {
    }

    public function login(Request $request, Response $response): Response
    {
        $data = (array) $request->getParsedBody();
        $email = strtolower(trim((string) ($data['email'] ?? '')));
        $password = (string) ($data['password'] ?? '');

        if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
            return $this->responder->json($response, ['message' => 'Email and password are required.'], 422);
        }

        $user = $this->auth->attempt($email, $password);

        if (!$user) {
            return $this->responder->json($response, ['message' => 'Invalid credentials.'], 401);
        }

        $user->last_login_at = date('Y-m-d H:i:s');
        $user->save();

        return $this->responder->json($response, [
            'token' => $this->auth->issueToken($user),
            'user' => $this->auth->publicUser($user),
        ]);
    }

    public function me(Request $request, Response $response): Response
    {
        $authUser = $this->authenticatedUser($request);
        $user = User::query()->with('student')->find($authUser->id());
        $payload = ['user' => $user ? $this->auth->publicUser($user) : $authUser->toArray()];

        if ($authUser->isStudent()) {
            try {
                $range = $this->dateRanges->month((string) ($request->getQueryParams()['month'] ?? null));
            } catch (InvalidArgumentException $exception) {
                return $this->responder->json($response, ['message' => $exception->getMessage()], 422);
            }

            $student = Student::query()->with('branch')->find((int) $authUser->studentId());
            $records = AttendanceRecord::query()
                ->where('student_id', (int) $authUser->studentId())
                ->whereBetween('attendance_date', [$range->startDate(), $range->endDate()])
                ->orderByDesc('attendance_date')
                ->get();

            $payload['student'] = $student;
            $payload['attendance_month'] = $range->month();
            $payload['attendance_summary'] = $this->attendanceSummary->fromRecords($records);
            $payload['attendance'] = $records;
        }

        return $this->responder->json($response, $payload);
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
