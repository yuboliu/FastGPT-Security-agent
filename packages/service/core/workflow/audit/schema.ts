import { getMongoModel, Schema } from '../../../common/mongo';
import type { SecurityAuditRecordType } from './type';

export const SecurityAuditCollectionName = 'security_audit_logs';

const SecurityAuditSchema = new Schema<SecurityAuditRecordType>(
  {
    workflowRunId: {
      type: String,
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: () => new Date()
    },
    userId: {
      type: String,
      required: true
    },
    teamId: {
      type: String
    },
    alertInput: {
      type: Schema.Types.Mixed
    },
    steps: {
      type: [Schema.Types.Mixed]
    },
    finalRiskRating: {
      type: Schema.Types.Mixed
    },
    ticketId: {
      type: String
    },
    approvalStatus: {
      type: String
    },
    metadata: {
      type: Schema.Types.Mixed
    }
  },
  {
    timestamps: false
  }
);

SecurityAuditSchema.index({ userId: 1, timestamp: -1 });
SecurityAuditSchema.index({ workflowRunId: 1 });

export const MongoSecurityAudit = getMongoModel<SecurityAuditRecordType>(
  SecurityAuditCollectionName,
  SecurityAuditSchema
);
