export interface DBUserActive {
  start_date: Date;
  end_date?: Date | null;
  locked: boolean;
}

export function isUserActiveSync(user: DBUserActive): boolean {
  if (user.locked) {
    return false;
  }
  const now = new Date();
  if (user.start_date > now) {
    return false;
  }
  if (user.end_date && user.end_date < now) {
    return false;
  }
  return true;
}
