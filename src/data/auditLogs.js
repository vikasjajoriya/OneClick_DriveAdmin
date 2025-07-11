export const auditLogs = [];

export function logAction(admin, action, listingId) {
  auditLogs.push({
    admin,
    action,
    listingId,
    timestamp: new Date().toISOString(),
  });
}

export function getAuditLogs() {
  return auditLogs;
}
