import type { AppSession } from './session';

export type EmailActionType = 'verified' | 'recovery';

export interface EmailActionResult {
  action: EmailActionType;
  session: AppSession;
}

