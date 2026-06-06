<?php
declare(strict_types=1);

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;

final class BranchAccessService
{
    public function isMatrixDirector(AuthenticatedUser $user): bool
    {
        return $user->role() === 'director' && $user->branchId() === 1;
    }

    public function canAccessBranch(AuthenticatedUser $user, int $branchId): bool
    {
        if ($branchId <= 0) {
            return false;
        }
        if ($this->isMatrixDirector($user)) {
            return true;
        }
        return $user->branchId() === $branchId;
    }

    public function applyScope(Builder $query, AuthenticatedUser $user): Builder
    {
        if (!$this->isMatrixDirector($user)) {
            $query->where('branch_id', $user->branchId() ?? 0);
        }
        return $query;
    }

    public function writableBranchId(array $data, AuthenticatedUser $user): ?int
    {
        $requestedBranchId = (int) ($data['branch_id'] ?? 0);
        $userBranchId = $user->branchId();

        if ($this->isMatrixDirector($user)) {
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
