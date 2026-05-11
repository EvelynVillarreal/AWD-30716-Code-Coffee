<?php
declare(strict_types=1);

namespace App\Service;

final class DateRange
{
    /**
     * @return array{0: string, 1: string, 2: string}
     */
    public static function month(?string $month): array
    {
        $value = preg_match('/^\d{4}-\d{2}$/', (string) $month) ? (string) $month : date('Y-m');
        $start = "{$value}-01";
        $end = date('Y-m-t', strtotime($start) ?: time());

        return [$value, $start, $end];
    }
}
