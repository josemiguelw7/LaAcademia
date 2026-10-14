import { resolveIntake } from "@/lib/intake";
import { consentText } from "@/lib/consent";
import { DOC_KINDS } from "@/lib/documents";
import { QuestionnaireFields } from "@/components/questionnaire/Fields";
import { Uploader } from "@/components/upload/Uploader";
import { ConsentForm } from "./ConsentForm";
import { saveClientQuestionnaire } from "./actions";

export const metadata = { title: "Tus documentos", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const larga = (iso: string) => { const [y, m, d] = iso.split("-").map(Number); return `${d} de ${MESES[m - 1]} de ${y}`; };

export default async function Intake({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const intake = await resolveIntake(token);
  if (!intake) {
    return (
      <main className="mx-auto max-w-md px-5 pt-16">
        <h1 className="text-[26px] leading-tight">Este enlace ya no funciona</h1>
        <p className="mt-3 text-[16px] text-tinta-2">Pídele uno nuevo a quien prepara tu declaración.</p>
      </main>
    );
  }
  const docs = intake.docs.map((d) => ({ id: d.id, status: d.status, label: d.label ?? DOC_KINDS[d.kind as keyof typeof DOC_KINDS] ?? d.kind }));
  const missing = docs.filter((d) => d.status === "esperado").length;
  return (
    <main className="mx-auto max-w-xl px-5 pb-16 pt-8">
      <p className="text-[13px] font-bold text-gris-texto">{intake.business} · Declaración {intake.taxYear}</p>
      <h1 className="mt-1 text-[26px] leading-tight">Hola, {intake.clientFirstName}</h1>

      {!intake.consented ? (
        <section className="mt-4">
          <p className="text-[16px] text-tinta-2">Antes de empezar necesito tu permiso por escrito.</p>
          <ConsentForm token={token} paragraphs={consentText(intake.business, larga(intake.purgeOn))} />
        </section>
      ) : (
        <>
          <p className="mt-3 text-[16px] text-tinta-2">
            {!intake.complete ? "Primero contesta estas preguntas. Con eso sé qué documentos pedirte." : missing ? `Te faltan ${missing} documentos. Puedes tomarles foto con tu teléfono.` : "Ya tengo todo. Gracias."}
          </p>

          {intake.complete && docs.length > 0 && (
            <section className="mt-6">
              <h2 className="text-[20px]">Tus documentos</h2>
              <p className="mt-1 text-[14px] text-gris-texto">Toma la foto de frente, con buena luz y sin cortar las orillas.</p>
              <div className="mt-3"><Uploader endpoint={`/c/${token}/subir`} docs={docs} /></div>
            </section>
          )}

          <section className="mt-10">
            <h2 className="text-[20px]">{intake.complete ? "Tus respuestas" : "Preguntas"}</h2>
            {intake.complete && <p className="mt-1 text-[14px] text-gris-texto">Si algo cambió, corrígelo y la lista de documentos se ajusta.</p>}
            <form action={saveClientQuestionnaire.bind(null, token)} className="mt-4 space-y-5">
              <QuestionnaireFields answers={intake.answers} />
              <button className="h-[52px] w-full rounded-boton bg-tinta text-[16px] font-bold text-blanco">Guardar respuestas</button>
            </form>
          </section>
        </>
      )}
      <p className="mt-12 text-[13px] text-gris-texto">Tus documentos se guardan cifrados. Solo los ven tu preparadora y quien revisa su trabajo.</p>
    </main>
  );
}
