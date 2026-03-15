import type { AuthRepository } from '../../domain/auth/auth-repository';
import type { EmailActionResult } from '../../domain/auth/email-action';
import type { AppSession } from '../../domain/auth/session';
import { appSessionStorage } from '../../infrastructure/storage/session-storage';

export interface SessionControllerDependencies {
  authRepository: AuthRepository;
  ensureProfile: (session: AppSession) => Promise<void>;
}

export class SessionController {
  constructor(private readonly dependencies: SessionControllerDependencies) {}

  async handleEmailLink(url: string): Promise<EmailActionResult> {
    const result = await this.dependencies.authRepository.handleEmailLink(url);
    const session = await this.syncSession(result.session);

    return {
      ...result,
      session: session ?? result.session,
    };
  }

  async hydrate(): Promise<AppSession | null> {
    const [persistedSession, hydratedSession] = await Promise.all([
      appSessionStorage.read(),
      this.dependencies.authRepository.hydrateSession(),
    ]);

    if (!hydratedSession) {
      await appSessionStorage.clear();
      return null;
    }

    const resolvedSession =
      persistedSession &&
      persistedSession.userId === hydratedSession.userId &&
      persistedSession.accessToken === hydratedSession.accessToken
        ? { ...hydratedSession, state: persistedSession.state }
        : hydratedSession;

    return this.syncSession(resolvedSession);
  }

  async signOut(): Promise<void> {
    await this.dependencies.authRepository.signOut();
    await appSessionStorage.clear();
  }

  async syncSession(session: AppSession | null): Promise<AppSession | null> {
    if (!session) {
      await appSessionStorage.clear();
      return null;
    }

    if (session.state === 'authenticated') {
      await this.dependencies.ensureProfile(session);
    }

    await appSessionStorage.write(session);
    return session;
  }
}

