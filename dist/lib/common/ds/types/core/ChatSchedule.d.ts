import type { ISODateTimeString } from '../../../../../lib/core/common/ds/types/DataSource';
export type RecurrenceType = 'once' | 'daily' | 'weekly' | 'monthly' | 'annually';
type ScheduleStatus = 'scheduled' | 'paused';
export interface ChatSchedule {
    appId: string;
    schedulerId: string;
    id: string;
    chatId: string;
    name: string;
    agent: string;
    instructions: string;
    recurrenceType: RecurrenceType;
    recurrenceDay?: string | null;
    recurrenceTime: string;
    status: ScheduleStatus;
    createdBy: string;
    updatedBy: string;
    createdAt: ISODateTimeString;
    updatedAt: ISODateTimeString;
    lastRunAt?: ISODateTimeString | null;
    nextRunAt?: ISODateTimeString | null;
}
export {};
//# sourceMappingURL=ChatSchedule.d.ts.map