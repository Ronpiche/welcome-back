export class NoErrorThrownError extends Error {}

export async function getError<TError>(call: () => unknown): Promise<TError> {
  try {
    await call();

    throw new NoErrorThrownError();
  } catch (error: unknown) {
    return error as TError;
  }
}