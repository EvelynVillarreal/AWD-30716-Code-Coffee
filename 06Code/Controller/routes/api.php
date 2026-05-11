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
use Slim\App;

return static function (App $app): void {
    $homeController = new HomeController();
    $authController = new AuthController();
    $branchController = new BranchController();
    $enrollmentController = new EnrollmentController();
    $kioskController = new KioskController();
    $studentController = new StudentController();
    $classPlanController = new ClassPlanController();
    $attendanceController = new AttendanceRecordController();
    $financeController = new FinanceController();
    $eventController = new ProfessionalEventController();

    $app->get('/', [$homeController, 'index']);
    $app->get('/api/health', [$homeController, 'health']);
    $app->get('/api/branches', [$branchController, 'index']);
    $app->post('/api/enrollments', [$enrollmentController, 'store']);
    $app->post('/api/auth/login', [$authController, 'login']);
    $app->post('/api/kiosk/attendance', [$kioskController, 'store']);

    $app->get('/api/me', [$authController, 'me'])
        ->add(new RoleMiddleware(['teacher', 'student', 'director']));

    $app->get('/api/me/attendance', [$studentController, 'attendance'])
        ->add(new RoleMiddleware(['student']));

    $app->get('/api/students', [$studentController, 'index'])
        ->add(new RoleMiddleware(['director']));

    $app->post('/api/class-plans', [$classPlanController, 'store'])
        ->add(new RoleMiddleware(['teacher', 'director']));

    $app->post('/api/attendance-records', [$attendanceController, 'store'])
        ->add(new RoleMiddleware(['teacher', 'director']));

    $app->get('/api/branch-finance-reports', [$financeController, 'index'])
        ->add(new RoleMiddleware(['director']));

    $app->post('/api/branch-finance-reports', [$financeController, 'store'])
        ->add(new RoleMiddleware(['director']));

    $app->get('/api/professional-events', [$eventController, 'index'])
        ->add(new RoleMiddleware(['director']));

    $app->post('/api/professional-events', [$eventController, 'store'])
        ->add(new RoleMiddleware(['director']));

    $app->post('/api/professional-events/{eventId}/assignments', [$eventController, 'assignDancer'])
        ->add(new RoleMiddleware(['director']));

    $app->get('/api/dancer-settlements/{studentId}', [$eventController, 'settlement'])
        ->add(new RoleMiddleware(['director']));
};
