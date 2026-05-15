<?php
declare(strict_types=1);

use App\Controller\AttendanceRecordController;
use App\Controller\AuthController;
use App\Controller\BranchController;
use App\Controller\ClassPlanController;
use App\Controller\EnrollmentController;
use App\Controller\FinanceController;
use App\Controller\HomeController;
use App\Controller\KioskController;
use App\Controller\ProfessionalEventController;
use App\Controller\StudentController;
use App\Middleware\RoleMiddleware;
use App\Service\AttendanceSummaryService;
use App\Service\AuditLogger;
use App\Service\AuthService;
use App\Service\BranchAccessService;
use App\Service\DateRangeService;
use App\Service\EvidenceCodeGenerator;
use App\Service\JwtTokenService;
use App\Service\PasswordVerifier;
use App\Service\Validation\AttendanceValidator;
use App\Service\Validation\ClassPlanValidator;
use App\Service\Validation\DancerEventAssignmentValidator;
use App\Service\Validation\EnrollmentValidator;
use App\Service\Validation\FinanceReportValidator;
use App\Service\Validation\ProfessionalEventValidator;
use App\Support\JsonResponder;
use Slim\App;

return static function (App $app, JsonResponder $responder): void {
    /*
     * Lightweight manual composition root.
     *
     * Slim receives ready-made controller objects, and each controller receives
     * only the services it needs. This keeps dependencies visible without adding
     * a framework-specific container.
     */
    $passwordVerifier = new PasswordVerifier();
    $tokenService = new JwtTokenService();
    $authService = new AuthService($passwordVerifier, $tokenService);
    $branchAccess = new BranchAccessService();
    $dateRanges = new DateRangeService();
    $attendanceSummary = new AttendanceSummaryService();
    $evidenceCodes = new EvidenceCodeGenerator();
    $audit = new AuditLogger();

    $attendanceValidator = new AttendanceValidator();
    $classPlanValidator = new ClassPlanValidator();
    $enrollmentValidator = new EnrollmentValidator();
    $financeValidator = new FinanceReportValidator();
    $eventValidator = new ProfessionalEventValidator();
    $assignmentValidator = new DancerEventAssignmentValidator();

    $homeController = new HomeController($responder);
    $authController = new AuthController($responder, $authService, $dateRanges, $attendanceSummary);
    $branchController = new BranchController($responder);
    $enrollmentController = new EnrollmentController($responder, $enrollmentValidator);
    $kioskController = new KioskController($responder, $attendanceValidator, $evidenceCodes);
    $studentController = new StudentController($responder, $branchAccess, $dateRanges, $attendanceSummary);
    $classPlanController = new ClassPlanController($responder, $branchAccess, $classPlanValidator, $audit);
    $attendanceController = new AttendanceRecordController($responder, $branchAccess, $attendanceValidator, $evidenceCodes, $audit);
    $financeController = new FinanceController($responder, $branchAccess, $financeValidator, $audit);
    $eventController = new ProfessionalEventController($responder, $branchAccess, $eventValidator, $assignmentValidator, $audit);

    $app->get('/', [$homeController, 'index']);
    $app->get('/api/health', [$homeController, 'health']);
    $app->get('/api/branches', [$branchController, 'index']);
    $app->post('/api/enrollments', [$enrollmentController, 'store']);
    $app->post('/api/auth/login', [$authController, 'login']);
    $app->post('/api/kiosk/attendance', [$kioskController, 'store']);

    $app->get('/api/me', [$authController, 'me'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'student', 'director']));

    $app->get('/api/me/attendance', [$studentController, 'attendance'])
        ->add(new RoleMiddleware($responder, $authService, ['student']));

    $app->get('/api/students', [$studentController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/class-plans', [$classPlanController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    $app->post('/api/attendance-records', [$attendanceController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    $app->get('/api/branch-finance-reports', [$financeController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/branch-finance-reports', [$financeController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->get('/api/professional-events', [$eventController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/professional-events', [$eventController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/professional-events/{eventId}/assignments', [$eventController, 'assignDancer'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->get('/api/dancer-settlements/{studentId}', [$eventController, 'settlement'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));
};
