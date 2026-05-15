<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validation rules shared by manual attendance and the public kiosk.
 */
final class AttendanceValidator
{
    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validateManual(array $data): array
    {
        $errors = [];

        foreach (['branch_id', 'person_type', 'person_name', 'attendance_date', 'status'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        if (!in_array(strtolower((string) ($data['person_type'] ?? '')), ['student', 'teacher'], true)) {
            $errors['person_type'] = 'Person type must be student or teacher.';
        }

        if (!in_array(strtolower((string) ($data['status'] ?? '')), ['present', 'absent', 'late', 'excused'], true)) {
            $errors['status'] = 'Status must be present, absent, late, or excused.';
        }

        return $errors;
    }

    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validateKiosk(array $data): array
    {
        $errors = [];
        $nationalId = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));

        if ($nationalId === '') {
            $errors['national_id'] = 'National ID is required.';
        } elseif (strlen($nationalId) < 6 || strlen($nationalId) > 20) {
            $errors['national_id'] = 'National ID length is not valid.';
        }

        return $errors;
    }
}
