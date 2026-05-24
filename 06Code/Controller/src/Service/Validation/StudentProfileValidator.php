<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validates director-managed student profiles.
 */
final class StudentProfileValidator
{
    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validate(array $data): array
    {
        $errors = [];

        if (empty($data['branch_id'])) {
            $errors['branch_id'] = 'Branch is required.';
        }

        if (trim((string) ($data['full_name'] ?? '')) === '') {
            $errors['full_name'] = 'Full name is required.';
        }

        if (!filter_var((string) ($data['email'] ?? ''), FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid email is required.';
        }

        if (trim((string) ($data['phone'] ?? '')) === '') {
            $errors['phone'] = 'Phone is required.';
        }

        $level = strtoupper((string) ($data['level'] ?? ''));
        if (!in_array($level, ['B1', 'B2'], true)) {
            $errors['level'] = 'Level must be B1 or B2.';
        }

        $scholarship = (int) ($data['scholarship_percent'] ?? 0);
        if (!in_array($scholarship, [0, 25, 50, 75, 100], true)) {
            $errors['scholarship_percent'] = 'Scholarship must be 0, 25, 50, 75, or 100.';
        }

        $status = strtolower((string) ($data['status'] ?? 'active'));
        if (!in_array($status, ['pending', 'active', 'inactive'], true)) {
            $errors['status'] = 'Status must be pending, active, or inactive.';
        }

        return $errors;
    }
}
