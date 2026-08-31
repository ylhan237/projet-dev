const features = [
  'Support client intelligent',
  'Agents IA spécialisés',
  'Base de connaissance RAG',
  'Actions métier automatisées',
];

const initialDocuments = [
  {
    id: 'doc-knowledge-1',
    title: 'Politique de remboursement',
    content:
      'Les clients peuvent demander un remboursement jusqu’à 30 jours après la commande. Le service client vérifie les preuves et traite la demande dans 48 heures.',
  },
  {
    id: 'doc-knowledge-2',
    title: 'Support VPN',
    content:
      'Si le VPN ne fonctionne pas, vérifiez le mot de passe, redémarrez le client et réessayez dans 5 minutes. Une réinitialisation du certificat peut aussi être nécessaire.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex max-w-6xl flex-col px-6 py-16">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 font-bold text-slate-950">
              A
            </div>
            <span className="text-lg font-semibold">AgentHub</span>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-300">
            Phase 2 - RAG
          </span>
        </header>

        <section className="mt-12 grid items-start gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/60">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Base de connaissances</h2>
              <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                En ligne
              </span>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Titre du document</span>
                <input
                  id="document-title"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none ring-0 placeholder:text-slate-500"
                  placeholder="Politique de remboursement"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm text-slate-300">Contenu</span>
                <textarea
                  id="document-content"
                  rows={6}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none placeholder:text-slate-500"
                  placeholder="Saisissez le texte à intégrer dans la base de connaissance..."
                />
              </label>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-sky-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-sky-400"
                  onClick={async () => {
                    const title = (document.getElementById('document-title') as HTMLInputElement)?.value || 'Document';
                    const content = (document.getElementById('document-content') as HTMLTextAreaElement)?.value || '';
                    if (!content.trim()) return;

                    await fetch('http://localhost:8002/api/documents/upload', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        documents: [{ id: `doc-${Date.now()}`, title, content }],
                      }),
                    });

                    (document.getElementById('document-content') as HTMLTextAreaElement).value = '';
                    (document.getElementById('document-title') as HTMLInputElement).value = '';
                    window.location.reload();
                  }}
                >
                  Ajouter au RAG
                </button>

                <button
                  type="button"
                  className="rounded-xl border border-slate-700 px-4 py-2 font-medium text-slate-100 transition hover:border-slate-500"
                  onClick={async () => {
                    const query = (document.getElementById('query') as HTMLInputElement)?.value || '';
                    const response = await fetch('http://localhost:8002/api/documents/search', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ query, limit: 5 }),
                    });
                    const data = await response.json();
                    const panel = document.getElementById('search-results');
                    if (!panel) return;
                    panel.innerHTML = (data.results || [])
                      .map(
                        (result: { title: string; content: string; score: number }) =>
                          `<div class="rounded-xl border border-slate-700 bg-slate-950 p-4"><p class="text-sm text-sky-300">${result.title}</p><p class="mt-2 text-sm text-slate-300">${result.content}</p><p class="mt-2 text-xs text-slate-500">score: ${result.score}</p></div>`,
                      )
                      .join('') || '<p class="text-sm text-slate-400">Aucun résultat.</p>';
                  }}
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold text-white">Recherche sémantique</h2>
            <input
              id="query"
              className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white outline-none placeholder:text-slate-500"
              placeholder="Ex: remboursement et support client"
            />
            <div id="search-results" className="mt-6 space-y-4 text-sm text-slate-300">
              {initialDocuments.map((document) => (
                <div key={document.id} className="rounded-xl border border-slate-700 bg-slate-950 p-4">
                  <p className="text-sky-300">{document.title}</p>
                  <p className="mt-2 text-slate-300">{document.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <div key={feature} className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
              <div className="mb-4 h-10 w-10 rounded-lg bg-sky-500/15" />
              <h2 className="text-lg font-semibold text-white">{feature}</h2>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
