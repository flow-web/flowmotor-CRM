import {
  Gauge,
  Leaf,
  Ruler,
  FileText,
  Palette,
} from 'lucide-react'

/* ── Formatters ── */
const fmtNum = (v) => {
  if (v == null) return null
  return new Intl.NumberFormat('fr-FR').format(v)
}

const fmtCC = (v) => (v != null ? `${fmtNum(v)} cc` : null)
const fmtCO2 = (v) => (v != null ? `${fmtNum(v)} g/km` : null)
const fmtKg = (v) => (v != null ? `${fmtNum(v)} kg` : null)
const fmtMM = (v) => (v != null ? `${fmtNum(v)} mm` : null)
const fmtL = (v) => (v != null ? `${v} L/100km` : null)
const fmtLiters = (v) => (v != null ? `${fmtNum(v)} L` : null)
const fmtPower = (ch, kw) => {
  if (ch != null && kw != null) return `${fmtNum(ch)} ch / ${fmtNum(kw)} kW`
  if (ch != null) return `${fmtNum(ch)} ch`
  if (kw != null) return `${fmtNum(kw)} kW`
  return null
}
const fmtKm = (v) => (v != null ? `${fmtNum(v)} km` : null)
const fmtDate = (v) => {
  if (!v) return null
  try {
    return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(v))
  } catch {
    return v
  }
}
const fmtWarranty = (v) => {
  if (v == null) return null
  return v === 1 ? '1 mois' : `${v} mois`
}

const EM_DASH = '\u2014'

/* ── Single spec row ── */
function SpecRow({ label, value, isOdd }) {
  return (
    <div className={`flex items-center justify-between px-4 py-2.5 ${isOdd ? 'bg-white/[0.03]' : ''}`}>
      <span className="text-[#F4E8D8]/50 text-sm font-medium font-sans">{label}</span>
      <span className={`text-sm font-semibold font-sans tabular-nums text-right ${value != null ? 'text-[#F4E8D8]' : 'text-white/20'}`}>
        {value ?? EM_DASH}
      </span>
    </div>
  )
}

/* ── Spec group card ── */
function SpecGroupCard({ icon: Icon, title, rows, delay = 0 }) {
  return (
    <div
      className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] overflow-hidden transition-all duration-300 hover:border-[#C4A484]/20 hover:shadow-lg hover:shadow-[#C4A484]/5"
      style={{ animation: `fadeSlideUp 0.5s ease-out ${delay}s both` }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C4A484]/10 flex-shrink-0 transition-colors duration-300 group-hover:bg-[#C4A484]/15">
          <Icon size={16} className="text-[#C4A484]" />
        </div>
        <h3 className="text-xs uppercase tracking-[0.15em] text-[#C4A484] font-sans font-semibold">
          {title}
        </h3>
      </div>

      {/* Rows */}
      <div className="divide-y divide-white/[0.04]">
        {rows.map((row, i) => (
          <SpecRow key={row.label} label={row.label} value={row.value} isOdd={i % 2 === 1} />
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════ */
export default function TechSpecsGrid({ vehicle }) {
  if (!vehicle) return null

  const v = vehicle

  /* ── Group definitions ── */
  const groups = [
    {
      icon: Gauge,
      title: 'Moteur & Performance',
      rows: [
        { label: 'Puissance', value: fmtPower(v.power_ch ?? v.din_power, v.power_kw) },
        { label: 'Cylindree', value: fmtCC(v.displacement_cc) },
        { label: 'Cylindres', value: v.cylinders != null ? `${v.cylinders}` : null },
        { label: 'Code moteur', value: v.engine_code ?? null },
        { label: 'Carburant', value: v.fuel_type ?? v.fuel ?? null },
        { label: 'Transmission', value: v.transmission ?? null },
        { label: 'Type de transmission', value: v.drive_type ?? null },
        { label: 'Rapports', value: v.gears_count != null ? `${v.gears_count}` : null },
      ],
    },
    {
      icon: Leaf,
      title: 'Environnement',
      rows: [
        { label: 'CO2', value: fmtCO2(v.co2_emissions ?? v.co2) },
        { label: 'Norme Euro', value: v.euro_standard ?? null },
        { label: "Crit'Air", value: v.critair ?? null },
        { label: 'Conso. mixte', value: fmtL(v.consumption_mixed) },
        { label: 'Conso. ville', value: fmtL(v.consumption_city) },
        { label: 'Conso. autoroute', value: fmtL(v.consumption_highway) },
      ],
    },
    {
      icon: Ruler,
      title: 'Dimensions & Poids',
      rows: [
        { label: 'Longueur', value: fmtMM(v.length_mm) },
        { label: 'Largeur', value: fmtMM(v.width_mm) },
        { label: 'Hauteur', value: fmtMM(v.height_mm) },
        { label: 'Poids a vide', value: fmtKg(v.weight_empty_kg) },
        { label: 'Charge utile', value: fmtKg(v.payload_kg) },
        { label: 'Volume coffre', value: fmtLiters(v.trunk_volume_l) },
        { label: 'Places', value: v.seats != null ? `${v.seats}` : null },
        { label: 'Portes', value: v.doors != null ? `${v.doors}` : null },
      ],
    },
    {
      icon: FileText,
      title: 'Historique & Etat',
      rows: [
        { label: 'Annee', value: v.year != null ? `${v.year}` : null },
        { label: 'Kilometrage', value: fmtKm(v.mileage) },
        { label: 'Proprietaires', value: v.owners_count != null ? `${v.owners_count}` : null },
        { label: 'Pays d\'origine', value: v.country_origin ?? v.import_country ?? null },
        { label: 'Vehicule importe', value: v.is_import != null ? (v.is_import ? 'Oui' : 'Non') : null },
        { label: 'Dernier entretien', value: fmtDate(v.last_service_date) },
        { label: 'Garantie', value: fmtWarranty(v.warranty_months) },
      ],
    },
    {
      icon: Palette,
      title: 'Esthetique',
      rows: [
        { label: 'Couleur exterieure', value: v.exterior_color_detailed ?? v.color ?? null },
        { label: 'Couleur interieure', value: v.interior_color ?? null },
        { label: 'Sellerie', value: v.interior_material ?? null },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {groups.map((group, i) => (
        <SpecGroupCard
          key={group.title}
          icon={group.icon}
          title={group.title}
          rows={group.rows}
          delay={0.05 * i}
        />
      ))}
    </div>
  )
}
