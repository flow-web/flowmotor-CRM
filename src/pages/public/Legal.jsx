import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Shield, Server, FileText, Database, Cookie } from 'lucide-react';

export default function LegalMentions() {
  return (
    <div className="min-h-screen bg-[#1A0F0F] text-[#F4E8D8] font-sans selection:bg-orange-500/30">
      
      {/* En-tête */}
      <div className="border-b border-white/5 bg-[#1A0F0F] sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm uppercase tracking-wider">
            <ArrowLeft size={16} /> Retour au site
          </Link>
          <span className="text-xs text-white/30 font-mono">Mise à jour : Fevrier 2026</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">
        
        {/* Titre */}
        <div className="space-y-4 text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif text-[#F4E8D8]">Mentions Légales</h1>
          <p className="text-white/40 max-w-lg mx-auto">
            Conformément aux dispositions des Articles 6-III et 19 de la Loi n°2004-575 du 21 juin 2004 pour la Confiance dans l’économie numérique, dite L.C.E.N.
          </p>
          <div className="inline-block bg-orange-500/10 border border-orange-500/20 rounded px-3 py-1 text-xs text-orange-300 mt-4">
            CGV et Politique de Confidentialité actuellement indisponibles
          </div>
        </div>

        {/* 1. ÉDITEUR */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Shield className="text-orange-400" size={24} />
            <h2 className="text-2xl font-serif">1. Éditeur du site</h2>
          </div>
          <div className="bg-white/5 p-6 rounded-xl border border-white/5 space-y-4 text-white/80 leading-relaxed">
            <p>
              Le site <strong>flowmotor.fr</strong> est édité par la société <strong>FLOW MOTOR SASU</strong>, 
              au capital de 100 euros.
            </p>
            <ul className="space-y-3 mt-4 text-sm">
              <li className="flex gap-3">
                <FileText size={18} className="text-white/40 shrink-0" />
                <span>Immatriculée au RCS de Lyon sous le numéro <strong>992 700 427</strong> {/* ⚠️ À CHANGER */}</span>
              </li>
              <li className="flex gap-3">
                <MapPin size={18} className="text-white/40 shrink-0" />
                <span>Siège social : 6 rue du bon pasteur, 69001 Lyon, France {/* ⚠️ À CHANGER */}</span>
              </li>
              <li className="flex gap-3">
                <Phone size={18} className="text-white/40 shrink-0" />
                <span>+33 6 22 85 26 22{/* ⚠️ À CHANGER */}</span>
              </li>
              <li className="flex gap-3">
                <Mail size={18} className="text-white/40 shrink-0" />
                <span>contact@flowmotor.fr</span>
              </li>
              <li className="pt-2 border-t border-white/5 mt-2">
                <strong>Directeur de la publication :</strong> M. Florian Meissel, Président {/* ⚠️ À CHANGER */}
              </li>
            </ul>
          </div>
        </section>

        {/* 2. HÉBERGEMENT */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Server className="text-orange-400" size={24} />
            <h2 className="text-2xl font-serif">2. Hébergement</h2>
          </div>
          <div className="bg-white/5 p-6 rounded-xl border border-white/5 text-white/80 leading-relaxed">
            <p className="mb-2">Le site est hébergé par la société :</p>
            <p className="font-bold text-lg text-[#F4E8D8]">OVH SAS</p>
            <p className="text-sm text-white/60 mt-1">
              2 rue Kellermann - 59100 Roubaix - France<br/>
              Site web : www.ovhcloud.com
            </p>
          </div>
        </section>

        {/* 3. PROPRIÉTÉ INTELLECTUELLE */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <FileText className="text-orange-400" size={24} />
            <h2 className="text-2xl font-serif">3. Propriété intellectuelle</h2>
          </div>
          <div className="text-white/70 leading-relaxed text-justify">
            <p>
              L'ensemble des contenus présents sur le site flowmotor.fr (textes, images, vidéos, logos, graphismes, icônes, sons, logiciels, etc.) sont la propriété exclusive de <strong>FLOW MOTOR SAS</strong> ou de ses partenaires et sont protégés par les lois françaises et internationales relatives à la propriété intellectuelle.
            </p>
            <p className="mt-4">
              Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable de FLOW MOTOR SAS.
            </p>
          </div>
        </section>

        {/* 4. DONNÉES PERSONNELLES */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Database className="text-orange-400" size={24} />
            <h2 className="text-2xl font-serif">4. Protection des données (RGPD)</h2>
          </div>
          <div className="text-white/70 leading-relaxed space-y-4">
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 modifiée, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
            </p>
            <ul className="list-disc pl-5 space-y-2 marker:text-orange-500">
              <li><strong>Données collectées :</strong> Nom, prénom, email, téléphone, infos véhicule (estimation).</li>
              <li><strong>Finalités :</strong> Répondre aux demandes, services, expérience utilisateur. Jamais cédées à des tiers.</li>
              <li><strong>Conservation :</strong> 3 ans à compter du dernier contact.</li>
            </ul>
            <p className="bg-orange-500/5 p-4 rounded-lg border border-orange-500/10 text-orange-200/80 text-sm">
              Pour exercer vos droits, contactez-nous à : <a href="mailto:rgpd@flowmotor.fr" className="text-orange-400 hover:underline">rgpd@flowmotor.fr</a>
            </p>
          </div>
        </section>

        {/* 5. COOKIES */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Cookie className="text-orange-400" size={24} />
            <h2 className="text-2xl font-serif">5. Cookies</h2>
          </div>
          <div className="text-white/70 leading-relaxed">
            <p>
              Le site flowmotor.fr utilise des cookies pour améliorer l'expérience utilisateur.
            </p>
            <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="bg-white/5 p-3 rounded border border-white/5">
                <strong className="block text-[#F4E8D8] text-sm mb-1">Essentiels</strong>
                <span className="text-xs">Fonctionnement du site (session).</span>
              </li>
              <li className="bg-white/5 p-3 rounded border border-white/5">
                <strong className="block text-[#F4E8D8] text-sm mb-1">Analytiques</strong>
                <span className="text-xs">Mesure d'audience (Google Analytics).</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 6 & 7 RESPONSABILITÉ ET DROIT */}
        <section className="space-y-6 pt-8 border-t border-white/10">
          <h3 className="text-lg font-serif text-[#F4E8D8]">6. Limitation de responsabilité</h3>
          <p className="text-sm text-white/50 text-justify">
            FLOW MOTOR SAS ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site. En conséquence, FLOW MOTOR SAS décline toute responsabilité pour toute imprécision, inexactitude ou omission.
          </p>

          <h3 className="text-lg font-serif text-[#F4E8D8] mt-8">7. Droit applicable</h3>
          <p className="text-sm text-white/50 text-justify">
            Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux français seront seuls compétents.
          </p>
        </section>

      </div>
    </div>
  );
}