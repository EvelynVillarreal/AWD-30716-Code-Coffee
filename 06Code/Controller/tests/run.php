<?php
declare(strict_types=1);

use App\Model\Student;
use App\Model\User;
use App\Service\AttendanceSummary;
use App\Service\BranchAccess;
use App\Service\DateRange;
use App\Support\Auth;

require dirname(__DIR__) . '/vendor/autoload.php';
require dirname(__DIR__) . '/src/bootstrap.php';

final class TestRunner
{
    private int $assertions = 0;

    public function assertTrue(bool $condition, string $message): void
    {
        $this->assertions++;

        if (!$condition) {
            throw new RuntimeException($message);
        }
    }

    public function assertSame(mixed $expected, mixed $actual, string $message): void
    {
        $this->assertions++;

        if ($expected !== $actual) {
            throw new RuntimeException($message . ' Expected ' . var_export($expected, true) . ', got ' . var_export($actual, true));
        }
    }

    public function count(): int
    {
        return $this->assertions;
    }
}

$test = new TestRunner();

[$month, $start, $end] = DateRange::month('2026-05');
$test->assertSame('2026-05', $month, 'DateRange should keep a valid month.');
$test->assertSame('2026-05-01', $start, 'DateRange should calculate the first day.');
$test->assertSame('2026-05-31', $end, 'DateRange should calculate the last day.');

$summary = AttendanceSummary::fromRecords([
    (object) ['status' => 'present'],
    (object) ['status' => 'present'],
    (object) ['status' => 'late'],
    (object) ['status' => 'absent'],
]);
$test->assertSame(4, $summary['total'], 'AttendanceSummary should count total records.');
$test->assertSame(2, $summary['present'], 'AttendanceSummary should count present records.');
$test->assertSame(1, $summary['late'], 'AttendanceSummary should count late records.');

$matrixDirector = ['role' => 'director', 'branch_id' => 1];
$branchDirector = ['role' => 'director', 'branch_id' => 3];
$teacher = ['role' => 'teacher', 'branch_id' => 2];
$test->assertTrue(BranchAccess::canAccessBranch($matrixDirector, 5), 'Matrix director should access every branch.');
$test->assertTrue(BranchAccess::canAccessBranch($branchDirector, 3), 'Branch director should access own branch.');
$test->assertTrue(!BranchAccess::canAccessBranch($branchDirector, 2), 'Branch director should not access other branches.');
$test->assertSame(2, BranchAccess::writableBranchId(['branch_id' => 2], $teacher), 'Teacher should write to own branch.');
$test->assertSame(null, BranchAccess::writableBranchId(['branch_id' => 1], $teacher), 'Teacher should not write to another branch.');

$validEnrollment = [
    'branch_id' => 1,
    'national_id' => '1723456789',
    'full_name' => 'Valeria Paz',
    'email' => 'valeria@example.com',
    'phone' => '0990000000',
    'level' => 'B2',
    'scholarship_percent' => 50,
    'comments' => 'Prefiere horario nocturno.',
];
$test->assertSame([], Student::validateEnrollment($validEnrollment), 'Valid enrollment data should pass validation.');

$invalidEnrollment = $validEnrollment;
$invalidEnrollment['email'] = 'not-an-email';
$invalidEnrollment['scholarship_percent'] = 25;
$errors = Student::validateEnrollment($invalidEnrollment);
$test->assertTrue(isset($errors['email']), 'Invalid email should fail validation.');
$test->assertTrue(isset($errors['scholarship_percent']), 'Invalid scholarship should fail validation.');

$_ENV['APP_KEY'] = str_repeat('a', 64);
$user = new User();
$user->id = 10;
$user->email = 'director@americanlatinclass.com';
$user->name = 'Director';
$user->role = 'director';
$user->branch_id = 1;
$user->student_id = null;

$token = Auth::issueToken($user);
$payload = Auth::verifyToken($token);
$test->assertSame('director', $payload['role'] ?? null, 'JWT should keep the user role.');
$test->assertSame(10, $payload['sub'] ?? null, 'JWT should keep the subject id.');

$_ENV['APP_KEY'] = '';
$threw = false;
try {
    Auth::issueToken($user);
} catch (RuntimeException) {
    $threw = true;
}
$test->assertTrue($threw, 'Auth should reject missing APP_KEY.');

echo 'Tests passed: ' . $test->count() . ' assertions.' . PHP_EOL;
