import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Wrench, Trash2, Plus, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function Workshop({ vehicleId, purchasePrice }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // On commence à false pour éviter le bug visuel
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formulaire
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'MECANIQUE',
    date: new Date().toISOString().split('T')[0]
  });

  // 1. Chargement des dépenses
  useEffect(() => {
    let isMounted = true;

    const fetchExpenses = async () => {
      if (!vehicleId) return; // Si pas d'ID, on attend
      
      setIsLoading(true);
      console.log("Chargement atelier pour véhicule:", vehicleId);

      try {
        // Timeout de sécurité : si Supabase ne répond pas en 5s, on coupe
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout Supabase')), 5000)
        );

        const apiPromise = supabase
          .from('expenses')
          .select('*')
          .eq('vehicle_id', vehicleId)
          .order('date', { ascending: false });

        const { data, error } = await Promise.race([apiPromise, timeoutPromise]);

        if (error) throw error;
        if (isMounted) setExpenses(data || []);

      } catch (error) {
        console.error('Erreur Atelier:', error);
        toast.error('Erreur chargement: ' + error.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchExpenses();

    return () => { isMounted = false; };
  }, [vehicleId]);

  // 2. Ajout
  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!vehicleId) return toast.error("Véhicule non identifié");
    
    setIsSubmitting(true);
    try {
      const payload = {
        vehicle_id: vehicleId,
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date
      };

      console.log("Envoi dépense:", payload);

      const { error } = await supabase.from('expenses').insert([payload]);
      if (error) throw error;

      toast.success('Frais ajouté !');
      setFormData({ ...formData, description: '', amount: '' });
      
      // Rechargement manuel rapide
      const { data } = await supabase.from('expenses').select('*').eq('vehicle_id', vehicleId).order('date', { ascending: false });
      setExpenses(data || []);

    } catch (error) {
      console.error('Erreur Ajout:', error);
      toast.error("Erreur ajout: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Suppression
  const handleDelete = async (id) => {
    if(!window.confirm("Supprimer ?")) return;
    try {
      await supabase.from('expenses').delete().eq('id', id);
      setExpenses(prev => prev.filter(e => e.id !== id)); // Optimistic UI
      toast.success("Supprimé");
    } catch (error) {
      toast.error("Erreur suppression");
    }
  };

  // Calculs
  const totalExpenses = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalCost = (Number(purchasePrice) || 0) + totalExpenses;

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1A0F0F] p-4 rounded-xl border border-white/10">
          <p className="text-white/40 text-xs uppercase mb-1">Total Achat</p>
          <p className="text-2xl font-serif text-[#F4E8D8]">{purchasePrice} €</p>
        </div>
        <div className="bg-[#1A0F0F] p-4 rounded-xl border border-orange-500/30">
          <p className="text-orange-400/60 text-xs uppercase mb-1">Frais Atelier (FRE)</p>
          <p className="text-2xl font-serif text-orange-400">{totalExpenses.toFixed(2)} €</p>
        </div>
        <div className="bg-[#1A0F0F] p-4 rounded-xl border border-green-500/30">
          <p className="text-green-400/60 text-xs uppercase mb-1">Coût Revient (PRU)</p>
          <p className="text-2xl font-serif text-green-400">{totalCost.toFixed(2)} €</p>
        </div>
      </div>

      {/* Formulaire */}
      <div className="bg-[#1A0F0F] border border-white/10 rounded-xl p-5">
        <h3 className="text-[#F4E8D8] font-medium mb-4 flex items-center gap-2">
          <Wrench size={18} /> Ajouter une dépense
        </h3>
        <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1">
            <label className="text-xs text-white/40">Description</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-[#F4E8D8] focus:border-orange-500/50 outline-none"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ex: Vidange..." />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs text-white/40">Montant (€)</label>
            <input required type="number" step="0.01" className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-[#F4E8D8] outline-none"
              value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} placeholder="0.00" />
          </div>
          <div className="md:col-span-3 space-y-1">
             <label className="text-xs text-white/40">Catégorie</label>
             <select className="w-full bg-white/5 border border-white/10 rounded-lg p-2.5 text-[#F4E8D8] outline-none"
               value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
               <option value="MECANIQUE">Mécanique</option>
               <option value="CARROSSERIE">Carrosserie</option>
               <option value="PREPARATION">Préparation</option>
               <option value="ADMIN">Administratif</option>
             </select>
          </div>
          <div className="md:col-span-2">
            <button type="submit" disabled={isSubmitting} className="w-full bg-orange-600 hover:bg-orange-700 text-white p-2.5 rounded-lg flex justify-center transition-colors">
              {isSubmitting ? '...' : <Plus size={20} />}
            </button>
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="space-y-2">
        {isLoading ? (
           <div className="text-center py-4 text-white/20">Chargement des données...</div>
        ) : expenses.length === 0 ? (
           <div className="text-center py-8 bg-white/5 rounded-xl border border-dashed border-white/10">
             <p className="text-white/30 text-sm">Aucun frais pour ce véhicule.</p>
           </div>
        ) : (
          expenses.map(item => (
            <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <Wrench size={14} />
                </div>
                <div>
                  <p className="text-[#F4E8D8] text-sm font-medium">{item.description}</p>
                  <p className="text-xs text-white/40">{item.category} • {new Date(item.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-orange-200 font-mono">- {parseFloat(item.amount).toFixed(2)} €</span>
                <button onClick={() => handleDelete(item.id)} className="text-white/20 hover:text-red-400"><Trash2 size={16}/></button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}