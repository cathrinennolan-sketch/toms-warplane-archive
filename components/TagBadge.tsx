interface TagBadgeProps {
  tag: string;
  onRemove?: () => void;
  small?: boolean;
}

export default function TagBadge({ tag, onRemove, small = false }: TagBadgeProps) {
  if (onRemove) {
    return (
      <div className="tag-chip">
        <span>{tag}</span>
        <button onClick={onRemove} aria-label={`Remove tag ${tag}`}>
          &times;
        </button>
      </div>
    );
  }

  return (
    <span className="badge">
      {tag}
      <style jsx>{`
        .badge {
          background-color: var(--bg-alt);
          color: var(--text-muted);
          font-weight: 500;
          ${small ? 'padding: 2px 6px; font-size: 0.7rem;' : ''}
        }
      `}</style>
    </span>
  );
}
