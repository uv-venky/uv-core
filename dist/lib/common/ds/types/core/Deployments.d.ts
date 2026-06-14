import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/DataSource';
export interface Deployments {
    appId: string;
    deploymentId: string;
    s3Uri: string;
    appVersion: string;
    createdAt: ISODateTimeString;
    githubCommitId?: string;
    commitMessages?: string;
    label?: string;
    branch: string;
}
//# sourceMappingURL=Deployments.d.ts.map