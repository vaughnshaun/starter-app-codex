import type { EmailActionResult } from '../../domain/auth/email-action';
import type { SessionController } from './session-controller';

export async function handleEmailAction(
  sessionController: SessionController,
  url: string,
): Promise<EmailActionResult> {
  return sessionController.handleEmailLink(url);
}

