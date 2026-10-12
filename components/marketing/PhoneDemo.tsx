/**
 * Réplica estática del reproductor de lecciones, en un marco de teléfono.
 * Es HTML puro con los tokens de la marca: pesa nada y siempre se ve nítida.
 */
export default function PhoneDemo() {
  return (
    <div className="relative mx-auto w-[300px] sm:w-[320px]" data-parallax="-0.06">
      <div className="rounded-[40px] border-[6px] border-tinta bg-tinta shadow-[0_24px_60px_rgba(28,27,25,.18)]">
        <div className="rounded-[34px] bg-marfil p-4">
          {/* Encabezado de la lección */}
          <p className="text-[10px] font-bold uppercase tracking-[.14em] text-gris-texto">Módulo 3 · Lección 1</p>
          <p className="mt-1 font-titulo text-[17px] leading-snug">¿Soltera o cabeza de familia?</p>

          {/* Progreso por segmentos */}
          <div className="mt-3 flex gap-1" aria-hidden>
            {[1, 1, 1, 1, 0, 0, 0].map((on, i) => (
              <span key={i} className={`h-1 flex-1 rounded-full ${on ? "bg-bronce" : "bg-linea"}`} />
            ))}
          </div>

          {/* Pregunta */}
          <div className="mt-4 rounded-[14px] border border-linea bg-blanco p-4">
            <p className="text-[13px] font-semibold leading-snug">
              María vive sola con su hija y paga más de la mitad de los gastos de la casa. ¿Qué estado civil le conviene?
            </p>
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2.5 rounded-[12px] border border-linea bg-blanco px-3 py-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-linea text-[11px] font-bold">A</span>
                <span className="text-[12.5px]">Soltera</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-[12px] border border-correcto bg-correcto-suave px-3 py-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-correcto text-[11px] font-bold text-blanco">B</span>
                <span className="text-[12.5px] font-semibold">Cabeza de familia</span>
              </div>
              <div className="flex items-center gap-2.5 rounded-[12px] border border-linea bg-blanco px-3 py-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-full border border-linea text-[11px] font-bold">C</span>
                <span className="text-[12.5px]">Casada por separado</span>
              </div>
            </div>
            <p className="mt-3 rounded-[10px] bg-bronce-suave px-3 py-2 text-[12px] leading-snug text-tinta">
              <strong>Exacto.</strong> Mantiene el hogar de su hija: eso es cabeza de familia, y le da una deducción mayor.
            </p>
          </div>

          {/* Acción */}
          <div className="mt-4 rounded-[12px] bg-tinta py-3 text-center text-[13px] font-bold text-blanco">Continuar</div>
          <p className="mt-2 text-center text-[11px] text-gris-texto">7 de 10 respondidas</p>
        </div>
      </div>
    </div>
  );
}
