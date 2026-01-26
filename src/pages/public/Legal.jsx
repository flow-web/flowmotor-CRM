function Legal() {
  return (
    <main className="bg-base-100">
      <section className="section-spacing">
        <div className="max-w-3xl mx-auto px-6">
          <h1 className="text-4xl font-semibold font-display text-primary md:text-5xl">
            Mentions Légales
          </h1>
          <p className="mt-4 text-base-content/50 text-sm">
            Dernière mise à jour : Janvier 2026
          </p>

          <div className="mt-12 space-y-12">
            {/* Éditeur */}
            <section>
              <h2 className="text-2xl font-semibold font-display text-primary mb-4">
                1. Éditeur du site
              </h2>
              <div className="prose prose-sm text-base-content/70 leading-relaxed space-y-3">
                <p>
                  Le site <strong>flowmotor.fr</strong> est édité par la société FLOW MOTOR SAS,
                  au capital de 50 000 euros, immatriculée au Registre du Commerce et des Sociétés
                  de Lyon sous le numéro RCS 123 456 789.
                </p>
                <p>
                  <strong>Siège social :</strong> 123 Avenue de l'Automobile, 69003 Lyon, France<br />
                  <strong>Téléphone :</strong> +33 4 12 34 56 78<br />
                  <strong>Email :</strong> contact@flowmotor.fr<br />
                  <strong>Directeur de la publication :</strong> M. Jean Dupont, Gérant
                </p>
              </div>
            </section>

            {/* Hébergement */}
            <section>
              <h2 className="text-2xl font-semibold font-display text-primary mb-4">
                2. Hébergement
              </h2>
              <div className="prose prose-sm text-base-content/70 leading-relaxed space-y-3">
                <p>
                  Le site est hébergé par la société Vercel Inc., située au 340 S Lemon Ave #4133,
                  Walnut, CA 91789, États-Unis.
                </p>
                <p>
                  <strong>Site web :</strong> vercel.com<br />
                  <strong>Contact :</strong> privacy@vercel.com
                </p>
              </div>
            </section>

            {/* Propriété intellectuelle */}
            <section>
              <h2 className="text-2xl font-semibold font-display text-primary mb-4">
                3. Propriété intellectuelle
              </h2>
              <div className="prose prose-sm text-base-content/70 leading-relaxed space-y-3">
                <p>
                  L'ensemble des contenus présents sur le site flowmotor.fr (textes, images, vidéos,
                  logos, graphismes, icônes, sons, logiciels, etc.) sont la propriété exclusive de
                  FLOW MOTOR SAS ou de ses partenaires et sont protégés par les lois françaises et
                  internationales relatives à la propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction, représentation, modification, publication, adaptation de tout
                  ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est
                  interdite, sauf autorisation écrite préalable de FLOW MOTOR SAS.
                </p>
              </div>
            </section>

            {/* RGPD */}
            <section>
              <h2 className="text-2xl font-semibold font-display text-primary mb-4">
                4. Protection des données personnelles (RGPD)
              </h2>
              <div className="prose prose-sm text-base-content/70 leading-relaxed space-y-3">
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la
                  loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d'un droit
                  d'accès, de rectification, de suppression et d'opposition aux données personnelles
                  vous concernant.
                </p>
                <p>
                  <strong>Données collectées :</strong> Lors de votre navigation ou de vos demandes
                  de contact, nous collectons les informations suivantes : nom, prénom, adresse email,
                  numéro de téléphone, informations relatives à votre véhicule (dans le cadre d'une
                  estimation).
                </p>
                <p>
                  <strong>Finalités :</strong> Ces données sont utilisées pour répondre à vos demandes,
                  vous proposer nos services et améliorer votre expérience utilisateur. Elles ne sont
                  jamais cédées à des tiers à des fins commerciales.
                </p>
                <p>
                  <strong>Conservation :</strong> Vos données sont conservées pendant une durée de
                  3 ans à compter de votre dernier contact avec notre société.
                </p>
                <p>
                  Pour exercer vos droits, contactez-nous à : <strong>rgpd@flowmotor.fr</strong>
                </p>
              </div>
            </section>

            {/* Cookies */}
            <section>
              <h2 className="text-2xl font-semibold font-display text-primary mb-4">
                5. Cookies
              </h2>
              <div className="prose prose-sm text-base-content/70 leading-relaxed space-y-3">
                <p>
                  Le site flowmotor.fr utilise des cookies pour améliorer l'expérience utilisateur,
                  analyser le trafic et personnaliser les contenus. Vous pouvez à tout moment
                  modifier vos préférences en matière de cookies via les paramètres de votre
                  navigateur.
                </p>
                <p>
                  <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site
                  (session, authentification).<br />
                  <strong>Cookies analytiques :</strong> Permettent de mesurer l'audience et
                  d'améliorer nos services (Google Analytics).<br />
                  <strong>Cookies marketing :</strong> Utilisés pour afficher des publicités
                  pertinentes (désactivés par défaut).
                </p>
              </div>
            </section>

            {/* Responsabilité */}
            <section>
              <h2 className="text-2xl font-semibold font-display text-primary mb-4">
                6. Limitation de responsabilité
              </h2>
              <div className="prose prose-sm text-base-content/70 leading-relaxed space-y-3">
                <p>
                  FLOW MOTOR SAS s'efforce d'assurer l'exactitude et la mise à jour des informations
                  diffusées sur ce site, dont elle se réserve le droit de corriger le contenu à tout
                  moment et sans préavis.
                </p>
                <p>
                  Toutefois, FLOW MOTOR SAS ne peut garantir l'exactitude, la précision ou
                  l'exhaustivité des informations mises à disposition sur ce site. En conséquence,
                  FLOW MOTOR SAS décline toute responsabilité pour toute imprécision, inexactitude
                  ou omission portant sur des informations disponibles sur ce site.
                </p>
              </div>
            </section>

            {/* Droit applicable */}
            <section>
              <h2 className="text-2xl font-semibold font-display text-primary mb-4">
                7. Droit applicable
              </h2>
              <div className="prose prose-sm text-base-content/70 leading-relaxed">
                <p>
                  Les présentes mentions légales sont régies par le droit français. En cas de litige,
                  et après échec de toute tentative de recherche d'une solution amiable, les tribunaux
                  français seront seuls compétents pour connaître de ce litige.
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Legal
