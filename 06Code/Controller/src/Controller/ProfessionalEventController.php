<?php
declare(strict_types=1);

namespace App\Controller;

use App\Model\Branch;
use App\Model\DancerEventAssignment;
use App\Model\ProfessionalEvent;
use App\Model\Student;
use App\Service\BranchAccess;
use App\Support\ApiResponse;
use App\Support\Audit;
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

final class ProfessionalEventController
{
    public function index(Request $request, Response $response): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');
        $query = ProfessionalEvent::query()->with('assignments');

        BranchAccess::applyScope($query, $authUser);

        $events = $query
            ->orderByDesc('event_date')
            ->get();

        return ApiResponse::json($response, ['data' => $events]);
    }

    public function store(Request $request, Response $response): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');
        $data = (array) $request->getParsedBody();
        $branchId = BranchAccess::writableBranchId($data, $authUser);

        if ($branchId === null) {
            return ApiResponse::json($response, ['message' => 'This user cannot write records for that branch.'], 403);
        }

        $data['branch_id'] = $branchId;
        $errors = ProfessionalEvent::validateEvent($data);

        if ($errors !== []) {
            return ApiResponse::json($response, ['errors' => $errors], 422);
        }

        if (!Branch::query()->find($branchId)) {
            return ApiResponse::json($response, ['message' => 'Selected branch does not exist.'], 422);
        }

        $event = ProfessionalEvent::query()->create([
            'branch_id' => $branchId,
            'client_name' => trim((string) $data['client_name']),
            'event_type' => trim((string) $data['event_type']),
            'event_date' => trim((string) $data['event_date']),
            'total_amount' => (float) $data['total_amount'],
            'status' => strtolower((string) ($data['status'] ?? 'pending_payment')),
        ]);

        Audit::record($authUser, 'professional_event.created', 'professional_events', (int) $event->id, [
            'branch_id' => $branchId,
            'event_date' => $event->event_date,
            'status' => $event->status,
        ]);

        return ApiResponse::json($response, [
            'message' => 'Professional event registered.',
            'data' => $event,
        ], 201);
    }

    public function assignDancer(Request $request, Response $response, array $args): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');
        $event = $this->scopedEvent((int) $args['eventId'], $authUser);

        if (!$event) {
            return ApiResponse::json($response, ['message' => 'Professional event not found.'], 404);
        }

        $data = (array) $request->getParsedBody();
        $errors = DancerEventAssignment::validateAssignment($data);

        if ($errors !== []) {
            return ApiResponse::json($response, ['errors' => $errors], 422);
        }

        $student = Student::query()->find((int) $data['student_id']);
        if (!$student || $student->level !== 'B2') {
            return ApiResponse::json($response, ['message' => 'Only B2 dancers can be assigned to professional events.'], 422);
        }

        if (!BranchAccess::canAccessBranch($authUser, (int) $student->branch_id)) {
            return ApiResponse::json($response, ['message' => 'This user cannot assign dancers from that branch.'], 403);
        }

        $assignment = DancerEventAssignment::query()->create([
            'professional_event_id' => (int) $event->id,
            'student_id' => (int) $data['student_id'],
            'gross_amount' => (float) $data['gross_amount'],
            'deduction_amount' => (float) ($data['deduction_amount'] ?? 0),
            'deduction_reason' => trim((string) ($data['deduction_reason'] ?? '')),
            'payment_status' => strtolower((string) ($data['payment_status'] ?? 'pending')),
        ]);

        Audit::record($authUser, 'dancer_event_assignment.created', 'dancer_event_assignments', (int) $assignment->id, [
            'professional_event_id' => (int) $event->id,
            'student_id' => (int) $data['student_id'],
        ]);

        return ApiResponse::json($response, [
            'message' => 'B2 dancer event assignment registered.',
            'data' => $assignment,
        ], 201);
    }

    public function settlement(Request $request, Response $response, array $args): Response
    {
        $authUser = (array) $request->getAttribute('auth_user');
        $studentId = (int) $args['studentId'];
        $studentQuery = Student::query()->where('level', 'B2');

        BranchAccess::applyScope($studentQuery, $authUser);

        $student = $studentQuery->find($studentId);

        if (!$student) {
            return ApiResponse::json($response, ['message' => 'B2 dancer not found.'], 404);
        }

        $assignments = DancerEventAssignment::query()
            ->with('event')
            ->where('student_id', $studentId)
            ->get();

        $grossAmount = $assignments->sum('gross_amount');
        $deductions = $assignments->sum('deduction_amount');
        $netAmount = $grossAmount - $deductions;

        return ApiResponse::json($response, [
            'data' => [
                'student' => $student,
                'events_attended' => $assignments->count(),
                'paid_events' => $assignments->where('payment_status', 'paid')->count(),
                'gross_amount' => round($grossAmount, 2),
                'deductions' => round($deductions, 2),
                'net_amount' => round($netAmount, 2),
                'assignments' => $assignments,
            ],
        ]);
    }

    private function scopedEvent(int $eventId, array $authUser): ?ProfessionalEvent
    {
        $query = ProfessionalEvent::query();
        BranchAccess::applyScope($query, $authUser);

        return $query->find($eventId);
    }
}
