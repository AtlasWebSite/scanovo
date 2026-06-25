const formatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatDate(date: string): string {
  return formatter.format(new Date(date));
}

export function formatRelativeDate(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86_400_000);

  if (days <= 0) {
    return 'Hoje';
  }

  if (days === 1) {
    return 'Ontem';
  }

  if (days < 7) {
    return `${days} dias atras`;
  }

  return formatDate(date);
}
