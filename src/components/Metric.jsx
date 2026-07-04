export function Metric({ icon, label, value, tone }) {
  return (
    <article className={tone === 'danger' ? 'metric metric-danger' : 'metric'}>
      <span>{icon}</span>
      <div>
        <strong>{value}</strong>
        <p>{label}</p>
      </div>
    </article>
  );
}
