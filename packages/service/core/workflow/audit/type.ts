export type SecurityAuditRecordType = {
  workflowRunId: string;
  timestamp: Date;
  userId: string;
  teamId?: string;
  alertInput?: Record<string, any>;
  steps?: Array<{
    stepName: string;
    stepNumber?: number;
    input?: Record<string, any>;
    modelOutput?: Record<string, any>;
    humanConfirmation?: boolean;
    actionResult?: string;
    durationMs?: number;
  }>;
  finalRiskRating?: Record<string, any>;
  ticketId?: string;
  approvalStatus?: string;
  metadata?: Record<string, any>;
};
