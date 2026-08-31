const features = [
  'Support client intelligent',
  'Agents IA spécialisés',
  'Base de connaissance RAG',
  'Actions métier automatisées',
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
            Phase 1
          </span>
        </header>

        <section className="mt-20 grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Support client autonome</p>
            <h1 className="mt-4 text-5xl font-black leading-tight md:text-6xl">
              IA agentique pour un support plus rapide et plus pro.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300">
              AgentHub centralise les demandes clients, route automatiquement les bons agents,
              trouve la bonne réponse dans la connaissance de l’entreprise et escalade vers un humain
              quand c’est nécessaire.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="rounded-xl bg-sky-500 px-6 py-3 font-medium text-slate-950 shadow-lg shadow-sky-500/30 transition hover:bg-sky-400">
                Démarrer
              </button>
              <button className="rounded-xl border border-slate-700 px-6 py-3 font-medium text-slate-100 transition hover:border-slate-500">
                Voir le dashboard
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl shadow-slate-950/60">
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-5">
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-rose-400" />
              </div>

              <div className="space-y-4">
                <div className="rounded-xl bg-slate-800 p-4 text-sm text-slate-200">
                  <p className="text-slate-400">Client</p>
                  <p className="mt-2">Je veux un remboursement pour ma commande livrée en retard.</p>
                </div>

                <div className="rounded-xl bg-sky-500/10 p-4 text-sm text-sky-100 ring-1 ring-sky-500/30">
                  <p className="text-sky-300">AgentHub</p>
                  <p className="mt-2">J’identifie la demande, vérifie le dossier et déclenche l’action adaptée.</p>
                </div>
              </div>
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
