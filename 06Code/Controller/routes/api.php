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
use App\Controller\ProfilePhotoController;
use App\Controller\StudentController;
use App\Controller\TeacherAttendanceController;
use App\Controller\TeacherController;
use App\Middleware\RoleMiddleware;
use App\Service\AttendanceSummaryService;
use App\Service\AuditLogger;
use App\Service\AuthService;
use App\Service\BranchAccessService;
use App\Service\DateRangeService;
use App\Service\EvidenceCodeGenerator;
use App\Service\JwtTokenService;
use App\Service\PasswordVerifier;
use App\Service\TeacherPayrollService;
use App\Service\Validation\AttendanceValidator;
use App\Service\Validation\ClassPlanValidator;
use App\Service\Validation\DancerEventAssignmentValidator;
use App\Service\Validation\EnrollmentValidator;
use App\Service\Validation\FinanceReportValidator;
use App\Service\Validation\ProfessionalEventValidator;
use App\Service\Validation\ProfilePhotoValidator;
use App\Service\Validation\StudentProfileValidator;
use App\Service\Validation\TeacherAccountValidator;
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
    $teacherPayroll = new TeacherPayrollService();

    $attendanceValidator = new AttendanceValidator();
    $classPlanValidator = new ClassPlanValidator();
    $enrollmentValidator = new EnrollmentValidator();
    $financeValidator = new FinanceReportValidator();
    $eventValidator = new ProfessionalEventValidator();
    $profilePhotoValidator = new ProfilePhotoValidator();
    $assignmentValidator = new DancerEventAssignmentValidator();
    $studentProfileValidator = new StudentProfileValidator();
    $teacherAccountValidator = new TeacherAccountValidator();

    $homeController = new HomeController($responder);
    $authController = new AuthController($responder, $authService, $dateRanges, $attendanceSummary);
    $branchController = new BranchController($responder);
    $enrollmentController = new EnrollmentController($responder, $enrollmentValidator);
    $kioskController = new KioskController($responder, $attendanceValidator, $evidenceCodes);
    $teacherAttendanceController = new TeacherAttendanceController($responder, $attendanceValidator, $evidenceCodes, $teacherPayroll);
    $studentController = new StudentController($responder, $branchAccess, $dateRanges, $attendanceSummary, $studentProfileValidator, $audit);
    $teacherController = new TeacherController($responder, $branchAccess, $teacherAccountValidator, $audit);
    $classPlanController = new ClassPlanController($responder, $branchAccess, $classPlanValidator, $audit);
    $attendanceController = new AttendanceRecordController($responder, $branchAccess, $attendanceValidator, $evidenceCodes, $audit, $dateRanges, $teacherPayroll);
    $financeController = new FinanceController($responder, $branchAccess, $financeValidator, $audit);
    $eventController = new ProfessionalEventController($responder, $branchAccess, $eventValidator, $assignmentValidator, $audit);
    $profilePhotoController = new ProfilePhotoController($responder, $profilePhotoValidator);

    $app->get('/', [$homeController, 'index']);
    $app->get('/api/health', [$homeController, 'health']);
    $app->get('/api/branches', [$branchController, 'index']);
    $app->get('/api/branches/{branchId}', [$branchController, 'show']);
    $app->post('/api/enrollments', [$enrollmentController, 'store']);
    $app->post('/api/auth/login', [$authController, 'login']);
    $app->post('/api/kiosk/attendance', [$kioskController, 'store']);
    $app->post('/api/teacher-attendance/check-in', [$teacherAttendanceController, 'store']);

    $app->get('/api/me', [$authController, 'me'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'student', 'director']));

    $app->get('/api/me/attendance', [$studentController, 'attendance'])
        ->add(new RoleMiddleware($responder, $authService, ['student']));

    $app->patch('/api/me/photo', [$profilePhotoController, 'update'])
        ->add(new RoleMiddleware($responder, $authService, ['student']));

    $app->get('/api/students', [$studentController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/students', [$studentController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    /*
     * Paso a paso para crear URIs con parametro:
     * 1. Usamos el nombre plural del recurso: /api/students.
     * 2. Agregamos el identificador entre llaves: /api/students/{studentId}.
     * 3. Slim captura ese valor y lo entrega al controlador dentro de $args['studentId'].
     * 4. El controlador busca el registro por ID, valida permisos y responde JSON.
     * Ejemplos reales: GET /api/students/1, GET /api/students/2.
     */
    $app->get('/api/students/{studentId}', [$studentController, 'show'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->patch('/api/students/{studentId}', [$studentController, 'update'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->delete('/api/students/{studentId}', [$studentController, 'destroy'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->get('/api/teachers', [$teacherController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/teachers', [$teacherController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    /*
     * URI parametrizada para profesores:
     * /api/teachers/{teacherId} permite consultar un profesor concreto.
     * El parametro {teacherId} mantiene la ruta RESTful y evita rutas como
     * /api/getTeacherById?id=1, que son menos limpias y mas dificiles de leer.
     */
    $app->get('/api/teachers/{teacherId}', [$teacherController, 'show'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->patch('/api/teachers/{teacherId}', [$teacherController, 'update'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->delete('/api/teachers/{teacherId}', [$teacherController, 'destroy'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->get('/api/class-plans', [$classPlanController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    $app->post('/api/class-plans', [$classPlanController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    /*
     * URI parametrizada para planes de clase:
     * /api/class-plans/{classPlanId} consulta un plan especifico.
     * El controlador verifica que el usuario autenticado pueda acceder a la
     * sucursal del plan antes de devolver la informacion.
     */
    $app->get('/api/class-plans/{classPlanId}', [$classPlanController, 'show'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    $app->get('/api/attendance-records', [$attendanceController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    $app->post('/api/attendance-records', [$attendanceController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    /*
     * URI parametrizada para asistencias:
     * /api/attendance-records/{attendanceRecordId} devuelve una asistencia.
     * Esta forma permite ejemplos como /api/attendance-records/1 y mantiene
     * la misma coleccion usada por GET /api/attendance-records.
     */
    $app->get('/api/attendance-records/{attendanceRecordId}', [$attendanceController, 'show'])
        ->add(new RoleMiddleware($responder, $authService, ['teacher', 'director']));

    $app->get('/api/branch-finance-reports', [$financeController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/branch-finance-reports', [$financeController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    /*
     * URI parametrizada para reportes financieros:
     * /api/branch-finance-reports/{financeReportId} consulta un reporte.
     * El ID viaja en la ruta y no en el body porque GET no debe depender de
     * datos enviados en el cuerpo de la peticion.
     */
    $app->get('/api/branch-finance-reports/{financeReportId}', [$financeController, 'show'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->get('/api/professional-events', [$eventController, 'index'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/professional-events', [$eventController, 'store'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    /*
     * URI parametrizada para eventos profesionales:
     * /api/professional-events/{eventId} consulta un evento por ID.
     * Si el evento tiene bailarines asignados, el controlador lo devuelve con
     * sus assignments para que la respuesta sea util sin llamadas extra.
     */
    $app->get('/api/professional-events/{eventId}', [$eventController, 'show'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->post('/api/professional-events/{eventId}/assignments', [$eventController, 'assignDancer'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));

    $app->get('/api/dancer-settlements/{studentId}', [$eventController, 'settlement'])
        ->add(new RoleMiddleware($responder, $authService, ['director']));
};
