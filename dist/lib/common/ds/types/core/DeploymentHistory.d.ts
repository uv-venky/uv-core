import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/DataSource';
export interface DeploymentHistory {
    appId: string;
    deploymentHistoryId: string;
    environment: string;
    s3Uri: string;
    appVersion: string;
    taskDefinitionArn: string;
    createdBy: string;
    createdAt: ISODateTimeString;
    branch: string;
}
//# sourceMappingURL=DeploymentHistory.d.ts.map