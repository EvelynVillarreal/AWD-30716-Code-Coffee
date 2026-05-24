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

        $name = trim((string) ($data['full_name'] ?? ''));
        if ($name === '') {
            $errors['full_name'] = 'Full name is required.';
        } elseif (!preg_match("/^[\p{L}\s'-]+$/u", $name)) {
            $errors['full_name'] = 'Full name must contain only letters.';
        } elseif (strlen($name) > 120) {
            $errors['full_name'] = 'Full name must not exceed 120 characters.';
        }

        $nationalId = preg_replace('/\D+/', '', (string) ($data['national_id'] ?? ''));
        if ($nationalId === '') {
            $errors['national_id'] = 'National ID is required.';
        } elseif (!preg_match('/^\d{10}$/', $nationalId)) {
            $errors['national_id'] = 'National ID must be exactly 10 digits.';
        } elseif (!$this->isValidEcuadorianId($nationalId)) {
            $errors['national_id'] = 'National ID is not a valid Ecuadorian ID.';
        }

        $email = (string) ($data['email'] ?? '');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid email is required.';
        } elseif (strlen($email) > 254) {
            $errors['email'] = 'Email must not exceed 254 characters.';
        }

        $phone = preg_replace('/[^\d+]+/', '', (string) ($data['phone'] ?? ''));
        if ($phone === '') {
            $errors['phone'] = 'Phone is required.';
        } elseif (strlen($phone) < 7 || strlen($phone) > 20) {
            $errors['phone'] = 'Phone length is not valid.';
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

    private function isValidEcuadorianId(string $id): bool
    {
        $province = (int) substr($id, 0, 2);
        if ($province < 1 || $province > 24) {
            return false;
        }

        $thirdDigit = (int) $id[2];
        if ($thirdDigit > 5) {
            return false;
        }

        $coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2];
        $sum = 0;

        for ($i = 0; $i < 9; $i++) {
            $product = (int) $id[$i] * $coefficients[$i];
            if ($product >= 10) {
                $product -= 9;
            }
            $sum += $product;
        }

        $checkDigit = (int) $id[9];
        $calculated = (10 - ($sum % 10)) % 10;

        return $calculated === $checkDigit;
    }
}
