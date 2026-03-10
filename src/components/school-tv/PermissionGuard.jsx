import React from 'react';
import { Lock } from 'lucide-react';

/**
 * Renders children if the user has the required permission.
 * Otherwise renders a lock badge (inline) or a full block message.
 *
 * Usage:
 *   <PermissionGuard can={can} permission="publish_video">
 *     <button>Publish</button>
 *   </PermissionGuard>
 *
 *   <PermissionGuard can={can} permission="edit_branding" block>
 *     <form>...</form>
 *   </PermissionGuard>
 */
export default function PermissionGuard({ can, permission, children, block = false }) {
  const allowed = can(permission);

  if (allowed) return <>{children}</>;

  if (block) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
        <Lock className="h-10 w-10 mb-3 text-gray-300" />
        <p className="font-semibold text-gray-700">Access Restricted</p>
        <p className="text-sm mt-1">Your role does not have <code className="bg-gray-100 px-1 rounded">{permission}</code> permission for this school.</p>
      </div>
    );
  }

  // Inline: render children but disabled + locked
  return (
    <span className="relative inline-flex cursor-not-allowed" title={`Requires "${permission}" permission`}>
      <span className="pointer-events-none opacity-40 select-none">
        {children}
      </span>
      <Lock className="h-3 w-3 text-gray-500 absolute -top-1 -right-1" />
    </span>
  );
}