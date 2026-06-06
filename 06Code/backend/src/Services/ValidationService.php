<?php
declare(strict_types=1);

namespace App\Services;

final class ValidationService
{
    public function validateEcuadorianId(string $id): bool
    {
        if (!preg_match('/^\d{10}$/', $id)) {
            return false;
        }

        $province = (int) substr($id, 0, 2);
        if ($province < 1 || $province > 24) {
            return false;
        }

        if ((int) $id[2] > 5) {
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

        return (10 - ($sum % 10)) % 10 === (int) $id[9];
    }

    public function validateEnrollment(array $data): array
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
        } elseif (!$this->validateEcuadorianId($nationalId)) {
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

        $level = strtoupper((string) ($data['level'] ?? 'B1'));
        if (!in_array($level, ['B1', 'B2'], true)) {
            $errors['level'] = 'Level must be B1 or B2.';
        }

        $scholarship = (int) ($data['scholarship_percent'] ?? 0);
        if (!in_array($scholarship, [0, 25, 50, 75, 100], true)) {
            $errors['scholarship_percent'] = 'Scholarship must be 0, 25, 50, 75, or 100.';
        }

        if (strlen(trim((string) ($data['comments'] ?? ''))) > 1000) {
            $errors['comments'] = 'Comments cannot be longer than 1000 characters.';
        }

        return $errors;
    }

    public function validateStudentProfile(array $data): array
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
        } elseif (!$this->validateEcuadorianId($nationalId)) {
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

    public function validateTeacherAccount(array $data, bool $passwordRequired = false): array
    {
        $errors = [];

        $name = trim((string) ($data['name'] ?? ''));
        if ($name === '') {
            $errors['name'] = 'Teacher name is required.';
        } elseif (!preg_match("/^[\p{L}\s'-]+$/u", $name)) {
            $errors['name'] = 'Teacher name must contain only letters.';
        } elseif (strlen($name) > 120) {
            $errors['name'] = 'Teacher name must not exceed 120 characters.';
        }

        $email = (string) ($data['email'] ?? '');
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'A valid teacher email is required.';
        } elseif (strlen($email) > 254) {
            $errors['email'] = 'Email must not exceed 254 characters.';
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

    public function validateAttendanceManual(array $data): array
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

        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', (string) ($data['attendance_date'] ?? ''))) {
            $errors['attendance_date'] = 'Attendance date must use YYYY-MM-DD format.';
        }

        $expectedTime = trim((string) ($data['expected_start_time'] ?? ''));
        if ($expectedTime !== '' && !preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $expectedTime)) {
            $errors['expected_start_time'] = 'Expected start time must use HH:MM format.';
        }

        $duration = (float) ($data['duration_hours'] ?? 1);
        if ($duration < 0.25 || $duration > 8) {
            $errors['duration_hours'] = 'Duration must be between 0.25 and 8 hours.';
        }

        return $errors;
    }

    public function validateAttendanceTeacherKiosk(array $data): array
    {
        $errors = [];

        if (!filter_var((string) ($data['email'] ?? ''), FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Teacher email is required.';
        }

        if (empty($data['branch_id'])) {
            $errors['branch_id'] = 'Branch is required.';
        }

        $expectedTime = trim((string) ($data['expected_start_time'] ?? ''));
        if ($expectedTime === '') {
            $errors['expected_start_time'] = 'Expected start time is required.';
        } elseif (!preg_match('/^(?:[01]\d|2[0-3]):[0-5]\d$/', $expectedTime)) {
            $errors['expected_start_time'] = 'Expected start time must use HH:MM format.';
        }

        $duration = (float) ($data['duration_hours'] ?? 1);
        if ($duration < 0.25 || $duration > 8) {
            $errors['duration_hours'] = 'Duration must be between 0.25 and 8 hours.';
        }

        return $errors;
    }

    public function validateAttendanceKiosk(array $data): array
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

    public function validateClassPlan(array $data): array
    {
        $errors = [];

        foreach (['branch_id', 'teacher_name', 'month', 'level', 'objective', 'activities'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        $teacherName = trim((string) ($data['teacher_name'] ?? ''));
        if ($teacherName !== '' && !preg_match("/^[\p{L}\s'-]+$/u", $teacherName)) {
            $errors['teacher_name'] = 'Teacher name must contain only letters.';
        }

        if (!preg_match('/^\d{4}-\d{2}$/', (string) ($data['month'] ?? ''))) {
            $errors['month'] = 'Month must use YYYY-MM format.';
        }

        if (!in_array(strtoupper((string) ($data['level'] ?? '')), ['B1', 'B2'], true)) {
            $errors['level'] = 'Level must be B1 or B2.';
        }

        $documentUrl = trim((string) ($data['document_url'] ?? ''));
        if ($documentUrl !== '' && !filter_var($documentUrl, FILTER_VALIDATE_URL)) {
            $errors['document_url'] = 'Planning document must be a valid URL.';
        }

        return $errors;
    }

    public function validateFinanceReport(array $data): array
    {
        $errors = [];

        foreach (['branch_id', 'month', 'income', 'expenses', 'matrix_share_percent'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        foreach (['income', 'expenses', 'matrix_share_percent'] as $field) {
            if ((float) ($data[$field] ?? 0) < 0) {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' cannot be negative.';
            }
        }

        if ((float) ($data['matrix_share_percent'] ?? 0) > 100) {
            $errors['matrix_share_percent'] = 'Matrix share percent cannot be greater than 100.';
        }

        return $errors;
    }

    public function validateProfessionalEvent(array $data): array
    {
        $errors = [];

        foreach (['branch_id', 'client_name', 'event_type', 'event_date', 'total_amount'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        if ((float) ($data['total_amount'] ?? 0) < 0) {
            $errors['total_amount'] = 'Total amount cannot be negative.';
        }

        return $errors;
    }

    public function validateDancerAssignment(array $data): array
    {
        $errors = [];

        foreach (['student_id', 'gross_amount'] as $field) {
            if (trim((string) ($data[$field] ?? '')) === '') {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
            }
        }

        foreach (['gross_amount', 'deduction_amount'] as $field) {
            if ((float) ($data[$field] ?? 0) < 0) {
                $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' cannot be negative.';
            }
        }

        if ((float) ($data['deduction_amount'] ?? 0) > (float) ($data['gross_amount'] ?? 0)) {
            $errors['deduction_amount'] = 'Deduction cannot be greater than gross amount.';
        }

        $paymentStatus = strtolower((string) ($data['payment_status'] ?? 'pending'));
        if (!in_array($paymentStatus, ['pending', 'paid'], true)) {
            $errors['payment_status'] = 'Payment status must be pending or paid.';
        }

        return $errors;
    }

    public function validateProfilePhoto(array $data): array
    {
        $errors = [];
        $photoUrl = trim((string) ($data['photo_url'] ?? ''));

        if ($photoUrl === '') {
            $errors['photo_url'] = 'Profile photo is required.';
            return $errors;
        }

        if ($this->isAllowedDataUri($photoUrl) || $this->isAllowedRemoteUrl($photoUrl)) {
            return $errors;
        }

        $errors['photo_url'] = 'Profile photo must be a PNG, JPEG, WEBP data image, or a valid image URL.';
        return $errors;
    }

    private function isAllowedDataUri(string $photoUrl): bool
    {
        if (!preg_match('/^data:image\/(?:png|jpeg|jpg|webp);base64,([A-Za-z0-9+\/=]+)$/', $photoUrl, $matches)) {
            return false;
        }

        $decoded = base64_decode($matches[1], true);
        if ($decoded === false || strlen($decoded) > 900000) {
            return false;
        }

        return true;
    }

    private function isAllowedRemoteUrl(string $photoUrl): bool
    {
        if (!filter_var($photoUrl, FILTER_VALIDATE_URL)) {
            return false;
        }

        $scheme = strtolower((string) parse_url($photoUrl, PHP_URL_SCHEME));
        $path = strtolower((string) parse_url($photoUrl, PHP_URL_PATH));

        return in_array($scheme, ['http', 'https'], true)
            && (bool) preg_match('/\.(?:png|jpe?g|webp)$/', $path);
    }
}
