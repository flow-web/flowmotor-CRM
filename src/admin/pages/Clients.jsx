import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import {
  Users,
  Search,
  Plus,
  MapPin,
  Phone,
  Mail,
  Trash2,
  RefreshCw,
  X
} from 'lucide-react';
import TopHeader from '../components/layout/TopHeader';
import { useUI } from '../context/UIContext';

export default function Clients() {
  const { toast: uiToast, showConfirm } = useUI();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulaire (Etat local)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: ''
  });

  // 1. Chargement des clients (Lecture)
  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      if (error.name === 'AbortError' || error.message?.includes('aborted')) return;
      console.error('Erreur chargement clients:', error);
      uiToast.error("Impossible de charger les clients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Creation d'un client (Ecriture)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // MAPPING STRICT : React (camelCase) -> Supabase (snake_case)
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email || null,
      phone: formData.phone || null,
      address: formData.address || null,
      postal_code: formData.postalCode || null,
      city: formData.city || null,
      country: 'France'
    };

    try {
      const { error } = await supabase.from('clients').insert([payload]);
      if (error) throw error;

      uiToast.success('Client cree avec succes !');
      setSheetOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', postalCode: '', city: '' });
      fetchClients();
    } catch (error) {
      console.error('Erreur creation client:', error.message || error, '| code:', error.code, '| details:', error.details, '| hint:', error.hint);
      uiToast.error("Erreur lors de la creation : " + (error.message || 'Erreur inconnue'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Suppression
  const handleDelete = async (id) => {
    const confirmed = await showConfirm({
      title: 'Supprimer le client',
      message: 'Voulez-vous vraiment supprimer ce client ?',
      confirmLabel: 'Supprimer',
      variant: 'danger'
    });
    if (!confirmed) return;

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      uiToast.success("Client supprime");
      fetchClients();
    } catch (error) {
      uiToast.error("Erreur suppression");
    }
  };

  // Filtrage recherche
  const filteredClients = clients.filter(client => {
    const search = searchTerm.toLowerCase();
    const fullName = `${client.first_name || ''} ${client.last_name || ''}`.toLowerCase();
    return fullName.includes(search) ||
           (client.email && client.email.toLowerCase().includes(search)) ||
           (client.city && client.city.toLowerCase().includes(search));
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0F0808 0%, #1A0F0F 40%)' }}>
      <TopHeader
        title="Clients"
        subtitle={`${clients.length} client${clients.length > 1 ? 's' : ''} enregistre${clients.length > 1 ? 's' : ''}`}
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto" style={{ animation: 'admin-fade-up 0.4s ease-out' }}>
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" size={15} />
            <input
              type="text"
              placeholder="Rechercher un client (nom, email, ville...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 transition-all duration-300"
            />
          </div>

          <button
            onClick={() => setSheetOpen(true)}
            className="btn-admin rounded-xl flex items-center gap-2"
          >
            <Plus size={16} />
            Nouveau Client
          </button>
        </div>

        {/* Client List */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 w-full skeleton-gold" />
            ))}
          </div>
        ) : filteredClients.length === 0 ? (
          <div className="card-admin p-12 text-center">
            <Users size={40} className="mx-auto text-white/10 mb-4" />
            <p className="text-[11px] text-white/30 uppercase tracking-wider">Aucun client trouve</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filteredClients.map((client, index) => (
              <div
                key={client.id}
                className="group card-admin p-5 hover:border-[#D4AF37]/20 transition-all duration-300"
                style={{ animation: `admin-fade-up ${0.2 + Math.min(index, 8) * 0.04}s ease-out` }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

                  {/* Identity */}
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold" style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37' }}>
                      {(client.first_name?.[0] || '')}{(client.last_name?.[0] || '')}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white capitalize group-hover:text-[#D4AF37] transition-colors duration-200">
                        {client.first_name} {client.last_name}
                      </h3>
                      <div className="flex items-center gap-3 text-[11px] text-white/30 mt-0.5">
                        {client.city && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} /> {client.city}
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.06] text-[10px] text-white/40 uppercase tracking-wider font-medium">
                          {client.type || 'Particulier'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex flex-col gap-1 text-[12px] text-white/40">
                    {client.email && (
                      <a href={`mailto:${client.email}`} className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors duration-200">
                        <Mail size={12} className="text-[#D4AF37]/40" />
                        {client.email}
                      </a>
                    )}
                    {client.phone && (
                      <a href={`tel:${client.phone}`} className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors duration-200">
                        <Phone size={12} className="text-[#D4AF37]/40" />
                        <span className="font-mono tabular-nums">{client.phone}</span>
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="p-2 text-white/15 hover:text-red-400 hover:bg-white/[0.04] rounded-lg transition-all duration-200"
                    title="Supprimer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SIDE SHEET -- Create Client */}
        {isSheetOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSheetOpen(false)} />

            {/* Panel */}
            <div
              className="relative w-full max-w-md h-full shadow-2xl border-l border-white/[0.06] p-6 flex flex-col animate-in slide-in-from-right duration-300"
              style={{ background: 'linear-gradient(180deg, #0F0808, #1A0F0F)' }}
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-display text-xl font-semibold text-white tracking-wide">Nouveau Client</h2>
                <button onClick={() => setSheetOpen(false)} className="text-white/30 hover:text-white transition-colors">
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">Prenom *</label>
                    <input required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-white text-sm focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 focus:outline-none transition-all"
                      value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">Nom *</label>
                    <input required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-white text-sm focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 focus:outline-none transition-all"
                      value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">Email</label>
                  <input type="email" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-white text-sm focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 focus:outline-none transition-all"
                    value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">Telephone</label>
                  <input type="tel" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-white text-sm focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 focus:outline-none transition-all"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">Adresse</label>
                  <input className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-white text-sm focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 focus:outline-none transition-all"
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">Code Postal</label>
                    <input className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-white text-sm focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 focus:outline-none transition-all"
                      value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.15em]">Ville</label>
                    <input className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl p-3 text-white text-sm focus:border-[#D4AF37]/30 focus:ring-1 focus:ring-[#D4AF37]/10 focus:outline-none transition-all"
                      value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-admin rounded-xl py-3 mt-8 flex justify-center items-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="animate-spin" size={16} /> Creation...
                    </>
                  ) : (
                    'Creer le client'
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
