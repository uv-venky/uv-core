/* Copyright (c) 2024-present Wayvo Corp. */

import type { ISODateTimeString } from '@/lib/core/common/ds/types/Base';

/**
 * Read-only segregation-of-duties projection (AC-04). One row per decision in
 * `wv_workflow_approval_decisions`, joined to its request so the requester
 * (`request.created_by`) and approver (`decision.created_by`) appear side by
 * side. Surfaces who-requested-vs-who-approved for compliance review.
 */
export interface WorkflowApprovalDecision {
  appId: string;
  id: string;
  approvalRequestId: string;
  decision: string;
  comment?: string | null;
  decidedAt: ISODateTimeString;
  createdAt: ISODateTimeString;
  /** decision.created_by — the approver who made this decision. */
  approver: string;
  /** request.created_by — who raised the approval request. */
  requester?: string | null;
  title?: string | null;
  status?: string | null;
}
