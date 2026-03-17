const ABSOLUTE_URL_PROTOCOL = /^[a-zA-Z][a-zA-Z\d+\-.]*:/;

export function normalizeExternalUrl(value: string): string | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const candidateUrl = trimmedValue.startsWith("//")
    ? `https:${trimmedValue}`
    : ABSOLUTE_URL_PROTOCOL.test(trimmedValue)
      ? trimmedValue
      : `https://${trimmedValue}`;

  try {
    return new URL(candidateUrl).toString();
  } catch {
    return null;
  }
}
