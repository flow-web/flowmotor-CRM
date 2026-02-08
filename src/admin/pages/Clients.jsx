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
import { toast } from 'sonner';

export default function Clients() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSheetOpen, setSheetOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulaire (État local)
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
      console.error('Erreur chargement clients:', error);
      toast.error("Impossible de charger les clients");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. Création d'un client (Écriture)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // MAPPING STRICT : React (camelCase) -> Supabase (snake_case)
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      postal_code: formData.postalCode,
      city: formData.city,
      type: 'PARTICULIER', // Valeur par défaut
      country: 'France'
    };

    try {
      const { error } = await supabase.from('clients').insert([payload]);
      if (error) throw error;

      toast.success('Client créé avec succès !');
      setSheetOpen(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', postalCode: '', city: '' }); // Reset
      fetchClients(); // Rafraîchir la liste
    } catch (error) {
      console.error('Erreur création:', error);
      toast.error("Erreur lors de la création : " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Suppression
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce client ?")) return;

    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      toast.success("Client supprimé");
      fetchClients();
    } catch (error) {
      toast.error("Erreur suppression");
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
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#F4E8D8] mb-2">Clients</h1>
          <p className="text-white/60 text-sm">{clients.length} client(s) enregistré(s)</p>
        </div>
        
        <button 
          onClick={() => setSheetOpen(true)}
          className="bg-[#3D1E1E] hover:bg-[#4A2525] text-[#F4E8D8] px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-[#F4E8D8]/20"
        >
          <Plus size={20} />
          Nouveau Client
        </button>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
        <input 
          type="text" 
          placeholder="Rechercher un client (nom, email, ville...)" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-[#F4E8D8] placeholder-white/20 focus:outline-none focus:border-[#F4E8D8]/50 transition-colors"
        />
      </div>

      {/* Liste des clients */}
      {isLoading ? (
        <div className="text-center py-12 text-white/40 animate-pulse">Chargement...</div>
      ) : filteredClients.length === 0 ? (
        <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
          <Users size={48} className="mx-auto text-white/20 mb-4" />
          <p className="text-white/40">Aucun client trouvé</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredClients.map((client) => (
            <div key={client.id} className="group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-[#F4E8D8]/30 transition-all">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                {/* Identité */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#F4E8D8]/10 flex items-center justify-center text-[#F4E8D8] font-serif text-lg">
                    {(client.first_name?.[0] || '')}{(client.last_name?.[0] || '')}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-[#F4E8D8] capitalize">
                      {client.first_name} {client.last_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-white/40 mt-1">
                      {client.city && (
                        <span className="flex items-center gap-1">
                          <MapPin size={14} /> {client.city}
                        </span>
                      )}
                      <span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white/60">
                        {client.type || 'Particulier'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex flex-col gap-1 text-sm text-white/60">
                  {client.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-[#F4E8D8]/60" />
                      {client.email}
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-[#F4E8D8]/60" />
                      {client.phone}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <button 
                  onClick={() => handleDelete(client.id)}
                  className="p-2 text-white/20 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODALE (SHEET) CRÉATION */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSheetOpen(false)} />
          
          {/* Panel */}
          <div className="relative w-full max-w-md bg-[#1A0F0F] h-full shadow-2xl border-l border-white/10 p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-serif text-[#F4E8D8]">Nouveau Client</h2>
              <button onClick={() => setSheetOpen(false)} className="text-white/40 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/40 uppercase">Prénom *</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-[#F4E8D8] focus:border-[#F4E8D8]/50 focus:outline-none"
                    value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/40 uppercase">Nom *</label>
                  <input required className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-[#F4E8D8] focus:border-[#F4E8D8]/50 focus:outline-none"
                    value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/40 uppercase">Email</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-[#F4E8D8] focus:border-[#F4E8D8]/50 focus:outline-none"
                  value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/40 uppercase">Téléphone</label>
                <input type="tel" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-[#F4E8D8] focus:border-[#F4E8D8]/50 focus:outline-none"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-white/40 uppercase">Adresse</label>
                <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-[#F4E8D8] focus:border-[#F4E8D8]/50 focus:outline-none"
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/40 uppercase">Code Postal</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-[#F4E8D8] focus:border-[#F4E8D8]/50 focus:outline-none"
                    value={formData.postalCode} onChange={e => setFormData({...formData, postalCode: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-white/40 uppercase">Ville</label>
                  <input className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-[#F4E8D8] focus:border-[#F4E8D8]/50 focus:outline-none"
                    value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#3D1E1E] hover:bg-[#4A2525] text-[#F4E8D8] font-medium py-3 rounded-lg transition-colors mt-8 flex justify-center items-center gap-2 border border-[#F4E8D8]/20"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} /> Création...
                  </>
                ) : (
                  'Créer le client'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}