const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;
const RELATIVE_TIME_FORMATTER = new Intl.RelativeTimeFormat('en-US', {
  numeric: 'auto',
});
const SHORT_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
});
const LONG_DATE_FORMATTER = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const formatFileSize = (bytes: number | null | undefined) => {
  if (bytes == null || Number.isNaN(bytes) || bytes < 0) {
    return '—';
  }

  if (bytes === 0) {
    return '0 B';
  }

  const unitIndex = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    FILE_SIZE_UNITS.length - 1,
  );
  const unit = FILE_SIZE_UNITS[unitIndex];
  const value = bytes / 1024 ** unitIndex;

  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${unit}`;
};

export const formatRelativeTime = (isoDate: string | null | undefined) => {
  if (!isoDate) {
    return 'Unknown';
  }

  const timestamp = new Date(isoDate);

  if (Number.isNaN(timestamp.getTime())) {
    return 'Unknown';
  }

  const now = new Date();
  const diffMs = timestamp.getTime() - now.getTime();
  const absDiffMs = Math.abs(diffMs);
  const minuteMs = 60_000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (absDiffMs < minuteMs) {
    return 'Just now';
  }

  if (absDiffMs < hourMs) {
    return RELATIVE_TIME_FORMATTER.format(
      Math.round(diffMs / minuteMs),
      'minute',
    );
  }

  if (absDiffMs < dayMs) {
    return RELATIVE_TIME_FORMATTER.format(Math.round(diffMs / hourMs), 'hour');
  }

  if (diffMs < 0 && absDiffMs < 2 * dayMs) {
    return 'Yesterday';
  }

  if (timestamp.getFullYear() === now.getFullYear()) {
    return SHORT_DATE_FORMATTER.format(timestamp);
  }

  return LONG_DATE_FORMATTER.format(timestamp);
};
