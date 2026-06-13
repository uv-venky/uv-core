export interface DBUserActive {
    start_date: Date;
    end_date?: Date | null;
    locked: boolean;
}
export declare function isUserActiveSync(user: DBUserActive): boolean;
//# sourceMappingURL=user-utils.d.ts.map