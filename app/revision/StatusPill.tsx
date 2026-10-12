const MAP = {
  approved: { label: "Aprobada", cls: "bg-tinta text-blanco" },
  recorded: { label: "Grabada", cls: "bg-tinta text-blanco" },
  review: { label: "Para tu revisión", cls: "bg-bronce-suave text-bronce-oscuro border border-bronce" },
  draft: { label: "Borrador", cls: "bg-blanco text-gris-texto border border-linea" },
} as const;
export function StatusPill({ status }: { status: keyof typeof MAP }) {
  const s = MAP[status] ?? MAP.draft;
  return <span className={`inline-block shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${s.cls}`}>{s.label}</span>;
}
