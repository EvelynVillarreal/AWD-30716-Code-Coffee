<?php
declare(strict_types=1);

namespace App\Support;

use App\Model\AuditLog;
use Throwable;

final class Audit
{
    /**
     * @param array<string, mixed> $authUser
     * @param array<string, mixed> $metadata
     */
    public static function record(
        array $authUser,
        string $action,
        string $entityType,
        ?int $entityId = null,
        array $metadata = []
    ): void {
        try {
            AuditLog::query()->create([
                'actor_user_id' => (int) ($authUser['sub'] ?? 0) ?: null,
                'actor_email' => (string) ($authUser['email'] ?? ''),
                'actor_role' => (string) ($authUser['role'] ?? ''),
                'branch_id' => (int) ($authUser['branch_id'] ?? 0) ?: null,
                'action' => $action,
                'entity_type' => $entityType,
                'entity_id' => $entityId,
                'metadata' => json_encode($metadata, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR),
            ]);
        } catch (Throwable) {
            // Audit logging must never block the academic workflow.
        }
    }
}
