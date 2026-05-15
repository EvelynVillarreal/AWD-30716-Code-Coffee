<?php
declare(strict_types=1);

namespace App\Service\Validation;

/**
 * Validates monthly class planning submitted by teachers and directors.
 */
final class ClassPlanValidator
{
    /**
     * @param array<string, mixed> $data
     * @return array<string, string>
     */
    public function validate(array $data): array
    {
        $errors = [];

        foreach (['branch_id', 'teacher_name', 'month', 'level', 'objective', 'activities'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        return $errors;
    }
}
