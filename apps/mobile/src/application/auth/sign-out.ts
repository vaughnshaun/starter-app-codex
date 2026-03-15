import type { SessionController } from './session-controller';

export async function signOutCurrentUser(
  sessionController: SessionController,
): Promise<void> {
  await sessionController.signOut();
}

