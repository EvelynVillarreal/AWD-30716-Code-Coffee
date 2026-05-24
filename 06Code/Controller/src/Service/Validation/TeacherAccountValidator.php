<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validates teacher accounts managed by directors.
 */
final class TeacherAccountValidator
{
    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validate(array $data, bool $passwordRequired = false): array
    {
        $errors = [];

        if (trim((string) ($data['name'] ?? '')) === '') {
            $errors['name'] = 'Teacher name is required.';
        }

        if (!filter_var((string) ($data['email'] ?? ''), FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid teacher email is required.';
        }

        if (empty($data['branch_id'])) {
            $errors['branch_id'] = 'Branch is required.';
        }

        $password = (string) ($data['password'] ?? '');
        if ($passwordRequired && $password === '') {
            $errors['password'] = 'Password is required.';
        } elseif ($password !== '' && strlen($password) < 8) {
            $errors['password'] = 'Password must be at least 8 characters.';
        }

        return $errors;
    }
}
