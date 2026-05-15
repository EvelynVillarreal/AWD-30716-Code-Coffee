<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validates public enrollment requests before they become student records.
 */
final class EnrollmentValidator
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

        $nationalId = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));
        if ($nationalId === '') {
            $errors['national_id'] = 'National ID is required.';
        } elseif (strlen($nationalId) < 6 || strlen($nationalId) > 20) {
            $errors['national_id'] = 'National ID length is not valid.';
        }

        if (!filter_var((string) ($data['email'] ?? ''), FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid email is required.';
        }

        $phone = preg_replace('/[^\d+]+/', '', (string) ($data['phone'] ?? ''));
        if ($phone === '') {
            $errors['phone'] = 'Phone is required.';
        } elseif (strlen($phone) < 7 || strlen($phone) > 20) {
            $errors['phone'] = 'Phone length is not valid.';
        }

        $level = strtoupper((string) ($data['level'] ?? 'B1'));
        if (!in_array($level, ['B1', 'B2'], true)) {
            $errors['level'] = 'Level must be B1 or B2.';
        }

        $scholarship = (int) ($data['scholarship_percent'] ?? 0);
        if (!in_array($scholarship, [0, 50, 75, 100], true)) {
            $errors['scholarship_percent'] = 'Scholarship must be 0, 50, 75, or 100.';
        }

        if (strlen(trim((string) ($data['comments'] ?? ''))) > 1000) {
            $errors['comments'] = 'Comments cannot be longer than 1000 characters.';
        }

        return $errors;
    }
}
