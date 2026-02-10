import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Printer, ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Note: On n'utilise pas TopHeader ici pour éviter les erreurs d'import, on fait simple et robuste.

export default function PoliceRegister() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRegister();
  }, []);

  async function fetchRegister() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('police_register_view').select('*');
      if (error) throw error;
      // Sécurité : si data est null, on met un tableau vide
      setEntries(data || []);
    } catch (err) {
      if (err.name === 'AbortError' || err.message?.includes('aborted')) return;
      console.error("Erreur police:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-[#1A0F0F] min-h-screen text-[#F4E8D8]">
      <div className="max-w-7xl mx-auto">
        
        {/* En-tête Simple */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <Link to="/admin/dashboard" className="text-white/40 hover:text-white flex items-center gap-2 mb-2 text-sm transition-colors">
              <ArrowLeft size={16} /> Retour Dashboard
            </Link>
            <h1 className="text-3xl font-serif text-[#F4E8D8]">Livre de Police</h1>
            <p className="text-white/40 text-sm mt-1">Registre officiel des mouvements</p>
          </div>
          <button 
            onClick={() => window.print()} 
            className="bg-orange-600 text-white px-5 py-2.5 rounded hover:bg-orange-700 flex gap-2 items-center"
          >
            <Printer size={18} /> Imprimer
          </button>
        </div>

        {/* Gestion des Erreurs */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded text-red-400 mb-6 flex items-center gap-3">
            <AlertCircle size={20} />
            Erreur de chargement : {error}
          </div>
        )}

        {/* Tableau */}
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-black/20 text-orange-400/80 uppercase text-xs font-medium">
                <tr>
                  <th className="px-6 py-4">N° Police</th>
                  <th className="px-6 py-4">Date Achat</th>
                  <th className="px-6 py-4">Véhicule</th>
                  <th className="px-6 py-4">Immat.</th>
                  <th className="px-6 py-4 text-right">Prix Achat</th>
                  <th className="px-6 py-4">Vente</th>
                  <th className="px-6 py-4">Acquéreur</th>
                  <th className="px-6 py-4 text-right">Prix Vente</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan="8" className="px-6 py-8 text-center text-white/30">Chargement...</td></tr>
                ) : entries.length === 0 ? (
                  <tr><td colSpan="8" className="px-6 py-12 text-center text-white/30 italic">Aucun véhicule inscrit au registre.</td></tr>
                ) : (
                  entries.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-white/50">{row["Numéro Police"]}</td>
                      <td className="px-6 py-4">{row["Date Achat"]}</td>
                      <td className="px-6 py-4 font-bold text-[#F4E8D8]">{row["Désignation"]}</td>
                      <td className="px-6 py-4 text-orange-400/80">{row["Immatriculation"]}</td>
                      <td className="px-6 py-4 text-right font-mono text-white/60">{row["Prix Achat"]} €</td>
                      <td className="px-6 py-4">{row["Date Vente"] || '-'}</td>
                      <td className="px-6 py-4 text-white/80">{row["Acquéreur"] || '-'}</td>
                      <td className="px-6 py-4 text-right font-bold text-green-400 font-mono">
                        {row["Prix Vente"] ? row["Prix Vente"] + ' €' : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Styles pour l'impression propre sur fond blanc */}
      <style>{`
        @media print {
          body, .bg-\\[\\#1A0F0F\\] { background: white !important; color: black !important; }
          .text-\\[\\#F4E8D8\\], .text-white\\/40 { color: black !important; }
          table { width: 100%; border-collapse: collapse; font-size: 10pt; }
          th, td { border: 1px solid #000; padding: 5px; color: black !important; }
          thead { background: #eee !important; -webkit-print-color-adjust: exact; }
          button, a { display: none !important; }
        }
      `}</style>
    </div>
  );
}