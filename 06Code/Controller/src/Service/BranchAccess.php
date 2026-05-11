<?php
declare(strict_types=1);

namespace App\Service;

use Illuminate\Database\Eloquent\Builder;

final class BranchAccess
{
    public static function isMatrixDirector(array $authUser): bool
    {
        return ($authUser['role'] ?? '') === 'director' && (int) ($authUser['branch_id'] ?? 0) === 1;
    }

    public static function userBranchId(array $authUser): ?int
    {
        $branchId = (int) ($authUser['branch_id'] ?? 0);

        return $branchId > 0 ? $branchId : null;
    }

    public static function canAccessBranch(array $authUser, int $branchId): bool
    {
        if ($branchId <= 0) {
            return false;
        }

        if (self::isMatrixDirector($authUser)) {
            return true;
        }

        return self::userBranchId($authUser) === $branchId;
    }

    public static function applyScope(Builder $query, array $authUser): Builder
    {
        if (!self::isMatrixDirector($authUser)) {
            $branchId = self::userBranchId($authUser);
            $query->where('branch_id', $branchId ?? 0);
        }

        return $query;
    }

    /**
     * Resolves the branch that the authenticated user is allowed to write to.
     *
     * @param array<string, mixed> $data
     */
    public static function writableBranchId(array $data, array $authUser): ?int
    {
        $requestedBranchId = (int) ($data['branch_id'] ?? 0);
        $userBranchId = self::userBranchId($authUser);

        if (self::isMatrixDirector($authUser)) {
            return $requestedBranchId > 0 ? $requestedBranchId : $userBranchId;
        }

        if ($userBranchId === null) {
            return null;
        }

        if ($requestedBranchId > 0 && $requestedBranchId !== $userBranchId) {
            return null;
        }

        return $userBranchId;
    }
}
