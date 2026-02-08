import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer'

// ================================================================
// INFORMATIONS SOCIÉTÉ (source: cover.png)
// ================================================================
const CO = {
  name: 'FLOW MOTOR',
  legal: 'SASU AU CAPITAL DE 100 \u20AC',
  rcs: 'RCS Lyon',
  owner: 'Florian Meissel',
  address: '6 Rue du Bon Pasteur',
  zipCity: '69001 Lyon',
  phone: '06 22 85 26 22',
  email: 'florianmeissel.pro1@gmail.com',
  siren: '992 700 427',
  tvaIntra: 'FR XX 992700427',
  iban: 'FR76 XXXX XXXX XXXX XXXX XXXX XXX',
  bic: 'XXXXXXXXX',
}

// ================================================================
// PALETTE — Brand Board FLOW MOTOR
// ================================================================
const C = {
  pageBg: '#F4E8D8',   // Fond beige crème
  primary: '#3D1E1E',  // Marron Foncé / Aubergine
  accent: '#5C3A2E',   // Marron chaud
  gold: '#C4A484',     // Or
  text: '#3D1E1E',     // Texte = primary
  muted: '#7A6A5E',    // Gris chaud
  white: '#FFFFFF',
  tableBg: '#EDE0CE',  // Fond alternance tableau
  border: '#3D1E1E',   // Bordure tableau = primary
  lineSoft: '#C9B99A', // Lignes douces
}

// ================================================================
// ASSETS (public/)
// ================================================================
const LOGO = '/assets/LOGO_AUBERGINE.png'
const ROUTE = '/assets/ROUTE.png'
const ENGRENAGE = '/assets/ENGRENAGE.png'

// ================================================================
// HELPERS
// ================================================================
const sanitize = (s) => s.replace(/\u202F/g, ' ').replace(/\u00A0/g, ' ')

const fmtEUR = (n, d = 2) => {
  if (n == null) return '-'
  return sanitize(
    new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(n),
  )
}

const fmtKm = (km) => {
  if (!km) return '-'
  return sanitize(new Intl.NumberFormat('fr-FR').format(km) + ' km')
}

const dateNow = () =>
  sanitize(
    new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date()),
  )

const docNum = (prefix) => {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  const seq = String(Math.floor(Math.random() * 900) + 100)
  return `${prefix}-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${seq}`
}

// ================================================================
// STYLES
// ================================================================
const s = StyleSheet.create({
  /* ---- Page ---- */
  page: {
    fontFamily: 'Times-Roman',
    fontSize: 9,
    backgroundColor: C.pageBg,
    color: C.text,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 35,
  },
  pageCGV: {
    fontFamily: 'Times-Roman',
    fontSize: 8,
    backgroundColor: C.pageBg,
    color: C.text,
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 35,
  },

  /* ---- Watermarks ---- */
  wmRoute: {
    position: 'absolute',
    bottom: 80,
    right: 10,
    width: 300,
    opacity: 0.08,
  },
  wmGear: {
    position: 'absolute',
    top: 30,
    left: 25,
    width: 50,
    opacity: 0.04,
  },
  wmGearCGV: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    width: 80,
    opacity: 0.05,
  },

  /* ---- Header ---- */
  hdrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  logo: { width: 80, height: 80 },
  titleBlock: { alignItems: 'flex-end' },
  docTitle: {
    fontSize: 30,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  docMeta: {
    fontSize: 8.5,
    color: C.muted,
    textAlign: 'right',
    marginTop: 2,
  },
  hrThick: {
    borderBottomWidth: 2.5,
    borderBottomColor: C.primary,
    marginTop: 6,
    marginBottom: 14,
  },
  hrThin: {
    borderBottomWidth: 0.5,
    borderBottomColor: C.lineSoft,
    marginVertical: 8,
  },

  /* ---- Parties (Company / Client) ---- */
  partiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  colLeft: { width: '50%' },
  colRight: { width: '45%' },
  coName: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    marginBottom: 1,
  },
  coSub: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    marginBottom: 6,
  },
  coLines: {
    fontFamily: 'Times-Roman',
    fontSize: 8.5,
    color: C.text,
    lineHeight: 1.7,
  },
  coSiren: {
    fontFamily: 'Times-Roman',
    fontSize: 7.5,
    color: C.muted,
    lineHeight: 1.5,
    marginTop: 4,
  },
  label: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  clName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: C.text,
    marginBottom: 3,
  },
  clDetail: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text, lineHeight: 1.7 },

  /* ---- Section titles ---- */
  secTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: C.primary,
  },

  /* ---- Table ---- */
  tbl: { marginBottom: 6, borderWidth: 0.5, borderColor: C.border },
  tHead: {
    flexDirection: 'row',
    backgroundColor: C.primary,
    paddingVertical: 5,
    paddingHorizontal: 6,
  },
  th: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },
  tRowAlt: { backgroundColor: C.tableBg },
  td: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text },
  tdB: { fontFamily: 'Times-Bold', fontSize: 8.5, color: C.text },
  tdR: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text, textAlign: 'right' },
  tdRB: { fontFamily: 'Times-Bold', fontSize: 8.5, color: C.text, textAlign: 'right' },

  /* ---- Summary / Totals ---- */
  sumWrap: { marginLeft: 'auto', width: 220, marginTop: 4, marginBottom: 8 },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2.5,
    paddingHorizontal: 8,
  },
  sumLbl: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.muted },
  sumVal: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text },
  sumTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: C.primary,
    marginTop: 4,
  },
  sumTLbl: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.white },
  sumTVal: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.gold },

  /* ---- Bank + Payment ---- */
  bankTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    gap: 10,
  },
  bankBox: {
    flex: 1,
    padding: 7,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  bankLbl: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  bankVal: { fontFamily: 'Courier', fontSize: 7.5, color: C.text, lineHeight: 1.6 },
  totalBox: {
    padding: 7,
    borderWidth: 1,
    borderColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  totalLbl: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  totalVal: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.primary },

  /* ---- Payment mode (checkboxes) ---- */
  payModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 10,
  },
  payModeLeft: { flex: 1 },
  payModeLbl: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  payModeTxt: { fontFamily: 'Times-Roman', fontSize: 8, color: C.text, lineHeight: 1.6 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: C.primary,
  },
  checkLabel: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text },
  checkboxesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginTop: 4,
  },

  /* ---- Legal Banner ---- */
  legalBanner: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: C.primary,
    marginBottom: 6,
  },
  legalTxt: {
    fontSize: 7.5,
    fontFamily: 'Helvetica-Bold',
    color: C.gold,
    textAlign: 'center',
    letterSpacing: 0.3,
  },

  /* ---- Signatures ---- */
  sigRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  sigBox: {
    flex: 1,
    padding: 7,
    borderWidth: 0.5,
    borderColor: C.border,
  },
  sigLbl: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  sigName: { fontFamily: 'Times-Roman', fontSize: 8, color: C.text, marginBottom: 2 },
  sigSpace: { height: 30, borderBottomWidth: 0.5, borderBottomColor: C.lineSoft },
  sigDate: { fontFamily: 'Times-Roman', fontSize: 7, color: C.muted, marginTop: 3 },
  sigTotalBox: {
    width: 130,
    padding: 7,
    borderWidth: 1,
    borderColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigTotalLbl: {
    fontSize: 7,
    fontFamily: 'Helvetica-Bold',
    color: C.accent,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  sigTotalVal: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.primary },

  /* ---- Footer ---- */
  footer: {
    position: 'absolute',
    bottom: 14,
    left: 35,
    right: 35,
    paddingTop: 4,
    borderTopWidth: 0.5,
    borderTopColor: C.lineSoft,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  ftTxt: { fontFamily: 'Times-Roman', fontSize: 6, color: C.muted, lineHeight: 1.4 },
  ftPage: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: C.muted },

  /* ---- CGV Page 2 ---- */
  cgvTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 14,
    paddingBottom: 6,
    borderBottomWidth: 1.5,
    borderBottomColor: C.primary,
  },
  cgvCols: {
    flexDirection: 'row',
    gap: 18,
  },
  cgvCol: { flex: 1 },
  cgvArticle: { marginBottom: 10 },
  cgvArtTitle: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: C.primary,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  cgvArtText: {
    fontFamily: 'Times-Roman',
    fontSize: 7.5,
    color: C.text,
    lineHeight: 1.7,
  },
})

// ================================================================
// BLOCS RÉUTILISABLES
// ================================================================

function Watermarks() {
  return (
    <>
      <Image src={ROUTE} style={s.wmRoute} />
      <Image src={ENGRENAGE} style={s.wmGear} />
    </>
  )
}

function DocHeader({ title, number }) {
  return (
    <>
      <View style={s.hdrRow}>
        <Image src={LOGO} style={s.logo} />
        <View style={s.titleBlock}>
          <Text style={s.docTitle}>{title}</Text>
          <Text style={s.docMeta}>{`N\u00B0 ${number}`}</Text>
          <Text style={s.docMeta}>{dateNow()}</Text>
        </View>
      </View>
      <View style={s.hrThick} />
    </>
  )
}

function PartiesBlock({ client }) {
  const lines = [
    client.address,
    [client.postalCode, client.city].filter(Boolean).join(' '),
    client.email,
    client.phone ? `T\u00E9l. ${client.phone}` : null,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <View style={s.partiesRow}>
      {/* Colonne gauche : Société */}
      <View style={s.colLeft}>
        <Text style={s.coName}>{CO.name}</Text>
        <Text style={s.coSub}>
          {CO.name} {'\u2013'} {CO.legal} {'\u2013'} {CO.rcs}
        </Text>
        <Text style={s.coLines}>
          {CO.owner}{'\n'}
          {CO.address}{'\n'}
          {CO.zipCity}{'\n'}
          {'T\u00E9l : '}{CO.phone}{'\n'}
          {'Mail : '}{CO.email}
        </Text>
        <Text style={s.coSiren}>
          SIREN {CO.siren} {'\u2013'} TVA Intracommunautaire : {CO.tvaIntra}
        </Text>
      </View>
      {/* Colonne droite : Client */}
      <View style={s.colRight}>
        <Text style={s.label}>{'\u00C0 L\u2019ATTENTION DE'}</Text>
        <Text style={s.clName}>
          {client.firstName} {client.lastName}
        </Text>
        {lines ? <Text style={s.clDetail}>{lines}</Text> : null}
      </View>
    </View>
  )
}

function VehicleTable({ vehicle }) {
  const vName = `${vehicle.brand || vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`
  return (
    <>
      <Text style={s.secTitle}>{`D\u00E9signation`}</Text>
      <View style={s.tbl}>
        <View style={s.tHead}>
          <Text style={[s.th, { flex: 2.5 }]}>{`D\u00E9signation`}</Text>
          <Text style={[s.th, { flex: 1.2 }]}>VIN</Text>
          <Text style={[s.th, { flex: 0.5 }]}>{`Ann\u00E9e`}</Text>
          <Text style={[s.th, { flex: 0.8 }]}>{`Kilom\u00E9trage`}</Text>
          <Text style={[s.th, { flex: 0.6 }]}>Couleur</Text>
        </View>
        <View style={[s.tRow, s.tRowAlt]}>
          <Text style={[s.tdB, { flex: 2.5 }]}>{vName}</Text>
          <Text style={[s.td, { flex: 1.2, fontFamily: 'Courier', fontSize: 6.5 }]}>
            {vehicle.vin || '-'}
          </Text>
          <Text style={[s.td, { flex: 0.5 }]}>{vehicle.year || '-'}</Text>
          <Text style={[s.td, { flex: 0.8 }]}>{fmtKm(vehicle.mileage)}</Text>
          <Text style={[s.td, { flex: 0.6 }]}>{vehicle.color || '-'}</Text>
        </View>
      </View>
    </>
  )
}

function BankAndTotal({ total }) {
  return (
    <View style={s.bankTotalRow}>
      <View style={s.bankBox}>
        <Text style={s.bankLbl}>{'Coordonn\u00E9es bancaires'}</Text>
        <Text style={s.bankVal}>
          IBAN : {CO.iban}{'\n'}
          BIC / SWIFT : {CO.bic}{'\n'}
          Titulaire : {CO.name}
        </Text>
      </View>
      <View style={s.totalBox}>
        <Text style={s.totalLbl}>{`TOTAL TTC \u00C0 R\u00C9GLER`}</Text>
        <Text style={s.totalVal}>{fmtEUR(total)}</Text>
      </View>
    </View>
  )
}

function PaymentMode() {
  return (
    <View style={s.payModeRow}>
      <View style={s.payModeLeft}>
        <Text style={s.payModeLbl}>{`MODE DE R\u00C8GLEMENT ACCEPT\u00C9 :`}</Text>
        <Text style={s.payModeTxt}>
          {'Virement bancaire\nCh\u00E8que de banque\nEsp\u00E8ces (limite l\u00E9gale)'}
        </Text>
      </View>
      <View>
        <Text style={[s.payModeLbl, { marginBottom: 6 }]}>{''}</Text>
        <View style={s.checkboxesRow}>
          <View style={s.checkRow}>
            <View style={s.checkbox} />
            <Text style={s.checkLabel}>{'\u00C0 cr\u00E9dit'}</Text>
          </View>
          <View style={s.checkRow}>
            <View style={s.checkbox} />
            <Text style={s.checkLabel}>Au comptant</Text>
          </View>
        </View>
        <View style={{ marginTop: 6 }}>
          <Text style={[s.payModeTxt, { fontFamily: 'Helvetica-Bold', fontSize: 7 }]}>
            {`\u00C9CH\u00C9ANCE DE R\u00C8GLEMENT : ____________________`}
          </Text>
          <Text style={[s.payModeTxt, { fontFamily: 'Helvetica-Bold', fontSize: 7, marginTop: 3 }]}>
            {'DATE LIMITE DE LIVRAISON : ________________'}
          </Text>
        </View>
      </View>
    </View>
  )
}

function SignatureBlock({ client, total }) {
  return (
    <View style={s.sigRow}>
      <View style={s.sigBox}>
        <Text style={s.sigLbl}>Signature ou tampon</Text>
        <Text style={s.sigName}>{CO.name}</Text>
        <View style={s.sigSpace} />
        <Text style={s.sigDate}>{`Fait \u00E0 Lyon, le ${dateNow()}`}</Text>
      </View>
      <View style={s.sigBox}>
        <Text style={s.sigLbl}>Signature ou tampon</Text>
        <Text style={s.sigName}>
          {client.firstName} {client.lastName}
        </Text>
        <View style={s.sigSpace} />
        <Text style={s.sigDate}>
          {`Pr\u00E9c\u00E9d\u00E9 de la mention "Lu et approuv\u00E9"`}
        </Text>
      </View>
      <View style={s.sigTotalBox}>
        <Text style={s.sigTotalLbl}>Total TTC</Text>
        <Text style={s.sigTotalVal}>{fmtEUR(total)}</Text>
      </View>
    </View>
  )
}

function PageFooter() {
  return (
    <View style={s.footer} fixed>
      <Text style={s.ftTxt}>
        {CO.name} {'\u2013'} {CO.legal} {'\u2013'} {CO.rcs}{'\n'}
        SIREN {CO.siren} {'\u2013'} TVA Intra : {CO.tvaIntra}{'\n'}
        {CO.address}, {CO.zipCity} {'\u2013'} {CO.email}
      </Text>
      <Text
        style={s.ftPage}
        render={({ pageNumber, totalPages }) => `PAGE ${pageNumber}/${totalPages}`}
      />
    </View>
  )
}

// ================================================================
// PAGE 2 : CONDITIONS GÉNÉRALES DE VENTE
// ================================================================
function CGVPage() {
  return (
    <Page size="A4" style={s.pageCGV}>
      <Image src={ENGRENAGE} style={s.wmGearCGV} />

      <Text style={s.cgvTitle}>{`CONDITIONS G\u00C9N\u00C9RALES DE VENTE`}</Text>

      <View style={s.cgvCols}>
        {/* Colonne gauche */}
        <View style={s.cgvCol}>
          <View style={s.cgvArticle}>
            <Text style={s.cgvArtTitle}>1. Objet</Text>
            <Text style={s.cgvArtText}>
              {`Les pr\u00E9sentes conditions g\u00E9n\u00E9rales de vente r\u00E9gissent l'ensemble des transactions de v\u00E9hicules d'occasion r\u00E9alis\u00E9es par la soci\u00E9t\u00E9 ${CO.name}, ${CO.legal}, immatricul\u00E9e au ${CO.rcs} sous le num\u00E9ro SIREN ${CO.siren}.\n\nSi\u00E8ge social : ${CO.address}, ${CO.zipCity}.`}
            </Text>
          </View>

          <View style={s.cgvArticle}>
            <Text style={s.cgvArtTitle}>{`2. \u00C9tat du v\u00E9hicule & Contr\u00F4le Technique`}</Text>
            <Text style={s.cgvArtText}>
              {`Les v\u00E9hicules sont vendus en l'\u00E9tat, avec le carnet d'entretien et les factures d'intervention lorsqu'ils sont disponibles. Un contr\u00F4le technique de moins de 6 mois est fourni pour les v\u00E9hicules de plus de 4 ans, conform\u00E9ment \u00E0 la r\u00E9glementation en vigueur.\n\nTout d\u00E9faut connu est signal\u00E9 pr\u00E9alablement \u00E0 la vente.`}
            </Text>
          </View>

          <View style={s.cgvArticle}>
            <Text style={s.cgvArtTitle}>3. Paiement</Text>
            <Text style={s.cgvArtText}>
              {`Le r\u00E8glement s'effectue par virement bancaire avant la livraison du v\u00E9hicule ou par ch\u00E8que de banque v\u00E9rifi\u00E9. Les prix sont exprim\u00E9s en Euros TTC.\n\nUn acompte peut \u00EAtre demand\u00E9 \u00E0 la commande. En cas de retard de paiement, des p\u00E9nalit\u00E9s de 3 fois le taux d'int\u00E9r\u00EAt l\u00E9gal seront appliqu\u00E9es, ainsi qu'une indemnit\u00E9 forfaitaire de recouvrement de 40 \u20AC.`}
            </Text>
          </View>

          <View style={s.cgvArticle}>
            <Text style={s.cgvArtTitle}>4. Garanties</Text>
            <Text style={s.cgvArtText}>
              {`Garantie l\u00E9gale de conformit\u00E9 : Le vendeur est tenu de livrer un bien conforme au contrat et r\u00E9pond des d\u00E9fauts de conformit\u00E9 existant au moment de la d\u00E9livrance (articles L217-4 \u00E0 L217-14 du Code de la consommation). D\u00E9lai : 12 mois \u00E0 compter de la livraison.\n\nGarantie des vices cach\u00E9s : L'acheteur peut demander la r\u00E9solution de la vente ou une r\u00E9duction du prix en cas de vice cach\u00E9 rendant le v\u00E9hicule impropre \u00E0 l'usage (articles 1641 \u00E0 1649 du Code civil). D\u00E9lai : 2 ans \u00E0 compter de la d\u00E9couverte du vice.\n\nGarantie commerciale : Une garantie commerciale compl\u00E9mentaire peut \u00EAtre propos\u00E9e et sera d\u00E9taill\u00E9e par avenant.`}
            </Text>
          </View>
        </View>

        {/* Colonne droite */}
        <View style={s.cgvCol}>
          <View style={s.cgvArticle}>
            <Text style={s.cgvArtTitle}>{`5. Livraison & Transfert de propri\u00E9t\u00E9`}</Text>
            <Text style={s.cgvArtText}>
              {`Le transfert de propri\u00E9t\u00E9 du v\u00E9hicule s'op\u00E8re au paiement complet du prix. Le v\u00E9hicule est livr\u00E9 au si\u00E8ge de la soci\u00E9t\u00E9 sauf accord contraire.\n\nLes risques sont transf\u00E9r\u00E9s \u00E0 l'acheteur d\u00E8s la prise de possession effective du v\u00E9hicule. Le vendeur d\u00E9cline toute responsabilit\u00E9 en cas de dommage survenant apr\u00E8s la remise des cl\u00E9s.`}
            </Text>
          </View>

          <View style={s.cgvArticle}>
            <Text style={s.cgvArtTitle}>{`6. D\u00E9marches administratives`}</Text>
            <Text style={s.cgvArtText}>
              {`Les frais de dossier de 350 \u20AC couvrent les d\u00E9marches d'immatriculation (Cerfa 13757*03), la demande de certificat d'immatriculation, et la mise en conformit\u00E9 administrative du v\u00E9hicule.\n\nCes frais sont factur\u00E9s en sus du prix du v\u00E9hicule et apparaissent distinctement sur la facture.`}
            </Text>
          </View>

          <View style={s.cgvArticle}>
            <Text style={s.cgvArtTitle}>{`7. Droit de r\u00E9tractation`}</Text>
            <Text style={s.cgvArtText}>
              {`Conform\u00E9ment \u00E0 l'article L221-1 du Code de la consommation, les ventes conclues dans les locaux de l'entreprise ne b\u00E9n\u00E9ficient pas du droit de r\u00E9tractation.\n\nPour les ventes \u00E0 distance, un d\u00E9lai de r\u00E9tractation de 14 jours s'applique \u00E0 compter de la livraison du v\u00E9hicule, conform\u00E9ment aux articles L221-18 et suivants.`}
            </Text>
          </View>

          <View style={s.cgvArticle}>
            <Text style={s.cgvArtTitle}>{`8. Litiges & M\u00E9diation`}</Text>
            <Text style={s.cgvArtText}>
              {`En cas de litige, les parties s'engagent \u00E0 rechercher une solution amiable pr\u00E9alablement \u00E0 toute action judiciaire.\n\nConform\u00E9ment aux articles L611-1 et R612-1 du Code de la consommation, le consommateur peut recourir gratuitement au service du m\u00E9diateur de la consommation comp\u00E9tent.\n\nLe tribunal comp\u00E9tent est celui du si\u00E8ge social de la soci\u00E9t\u00E9, soit Lyon (69).`}
            </Text>
          </View>
        </View>
      </View>

      <PageFooter />
    </Page>
  )
}

// ================================================================
// 1. BON DE COMMANDE
// ================================================================
export function OrderForm({ vehicle, client }) {
  const num = docNum('BC')
  const frais = 350
  const prix = vehicle.sellingPrice || 0
  const total = prix + frais

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Watermarks />
        <DocHeader title="BON DE COMMANDE" number={num} />
        <PartiesBlock client={client} />
        <View style={s.hrThin} />
        <VehicleTable vehicle={vehicle} />

        {/* Détail financier */}
        <Text style={s.secTitle}>{`D\u00E9tail financier`}</Text>
        <View style={s.tbl}>
          <View style={s.tHead}>
            <Text style={[s.th, { flex: 3 }]}>{`D\u00E9signation`}</Text>
            <Text style={[s.th, { flex: 1, textAlign: 'right' }]}>Montant TTC</Text>
          </View>
          <View style={[s.tRow, s.tRowAlt]}>
            <Text style={[s.td, { flex: 3 }]}>
              {`V\u00E9hicule \u2014 ${vehicle.brand || vehicle.make} ${vehicle.model}`}
            </Text>
            <Text style={[s.tdRB, { flex: 1 }]}>{fmtEUR(prix)}</Text>
          </View>
          <View style={s.tRow}>
            <Text style={[s.td, { flex: 3 }]}>Frais de dossier et mise en service</Text>
            <Text style={[s.tdR, { flex: 1 }]}>{fmtEUR(frais)}</Text>
          </View>
        </View>

        <BankAndTotal total={total} />
        <PaymentMode />

        <View style={s.legalBanner}>
          <Text style={s.legalTxt}>
            {`Acompte de 10% exigible \u00E0 la signature, soit ${fmtEUR(total * 0.1)} \u2014 Solde \u00E0 la livraison`}
          </Text>
        </View>

        <SignatureBlock client={client} total={total} />
        <PageFooter />
      </Page>
      <CGVPage />
    </Document>
  )
}

// ================================================================
// 2. FACTURE — TVA SUR MARGE (Art. 297 A du CGI)
// ================================================================
export function InvoiceMarginTemplate({ vehicle, client }) {
  const num = docNum('FM')
  const frais = 350
  const prix = vehicle.sellingPrice || 0
  const total = prix + frais

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Watermarks />
        <DocHeader title="FACTURE" number={num} />
        <PartiesBlock client={client} />
        <View style={s.hrThin} />

        {/* Bandeau légal TVA Marge */}
        <View style={s.legalBanner}>
          <Text style={s.legalTxt}>
            {`R\u00E9gime particulier \u2013 Biens d\u2019occasion \u2013 Article 297 A du CGI \u2013 TVA non r\u00E9cup\u00E9rable`}
          </Text>
        </View>

        <VehicleTable vehicle={vehicle} />

        {/* Détail financier — TTC uniquement */}
        <Text style={s.secTitle}>{`D\u00E9tail financier`}</Text>
        <View style={s.tbl}>
          <View style={s.tHead}>
            <Text style={[s.th, { flex: 3 }]}>{`D\u00E9signation`}</Text>
            <Text style={[s.th, { flex: 1, textAlign: 'right' }]}>Montant TTC</Text>
          </View>
          <View style={[s.tRow, s.tRowAlt]}>
            <Text style={[s.td, { flex: 3 }]}>
              {`V\u00E9hicule \u2014 ${vehicle.brand || vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`}
            </Text>
            <Text style={[s.tdRB, { flex: 1 }]}>{fmtEUR(prix)}</Text>
          </View>
          <View style={s.tRow}>
            <Text style={[s.td, { flex: 3 }]}>Frais de dossier et mise en service</Text>
            <Text style={[s.tdR, { flex: 1 }]}>{fmtEUR(frais)}</Text>
          </View>
        </View>

        <View style={s.sumWrap}>
          <View style={s.sumRow}>
            <Text style={s.sumLbl}>{`Sous-total v\u00E9hicule`}</Text>
            <Text style={s.sumVal}>{fmtEUR(prix)}</Text>
          </View>
          <View style={s.sumRow}>
            <Text style={s.sumLbl}>Frais de dossier</Text>
            <Text style={s.sumVal}>{fmtEUR(frais)}</Text>
          </View>
          <View style={s.sumTotal}>
            <Text style={s.sumTLbl}>{`TOTAL TTC \u00C0 R\u00C9GLER`}</Text>
            <Text style={s.sumTVal}>{fmtEUR(total)}</Text>
          </View>
        </View>

        <BankAndTotal total={total} />
        <PaymentMode />
        <SignatureBlock client={client} total={total} />
        <PageFooter />
      </Page>
      <CGVPage />
    </Document>
  )
}

// ================================================================
// 3. FACTURE — TVA APPARENTE (HT + TVA 20 % + TTC)
// ================================================================
export function InvoiceVatTemplate({ vehicle, client }) {
  const num = docNum('FV')
  const frais = 350
  const prixHT = Math.round(((vehicle.sellingPrice || 0) / 1.2) * 100) / 100
  const tvaVehicule = (vehicle.sellingPrice || 0) - prixHT
  const totalHT = prixHT + frais
  const totalTVA = tvaVehicule
  const totalTTC = totalHT + totalTVA

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Watermarks />
        <DocHeader title="FACTURE" number={num} />
        <PartiesBlock client={client} />
        <View style={s.hrThin} />
        <VehicleTable vehicle={vehicle} />

        {/* Détail financier — HT / TVA / TTC */}
        <Text style={s.secTitle}>{`D\u00E9tail financier`}</Text>
        <View style={s.tbl}>
          <View style={s.tHead}>
            <Text style={[s.th, { flex: 3 }]}>{`D\u00E9signation`}</Text>
            <Text style={[s.th, { flex: 1, textAlign: 'right' }]}>Prix HT</Text>
            <Text style={[s.th, { flex: 1, textAlign: 'right' }]}>TVA 20 %</Text>
            <Text style={[s.th, { flex: 1, textAlign: 'right' }]}>TTC</Text>
          </View>
          <View style={[s.tRow, s.tRowAlt]}>
            <Text style={[s.td, { flex: 3 }]}>
              {`V\u00E9hicule \u2014 ${vehicle.brand || vehicle.make} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ''}`}
            </Text>
            <Text style={[s.tdR, { flex: 1 }]}>{fmtEUR(prixHT)}</Text>
            <Text style={[s.tdR, { flex: 1 }]}>{fmtEUR(tvaVehicule)}</Text>
            <Text style={[s.tdRB, { flex: 1 }]}>{fmtEUR(vehicle.sellingPrice)}</Text>
          </View>
          <View style={s.tRow}>
            <Text style={[s.td, { flex: 3 }]}>Frais de dossier et mise en service</Text>
            <Text style={[s.tdR, { flex: 1 }]}>{fmtEUR(frais)}</Text>
            <Text style={[s.tdR, { flex: 1 }]}>-</Text>
            <Text style={[s.tdR, { flex: 1 }]}>{fmtEUR(frais)}</Text>
          </View>
        </View>

        <View style={s.sumWrap}>
          <View style={s.sumRow}>
            <Text style={s.sumLbl}>Total HT</Text>
            <Text style={s.sumVal}>{fmtEUR(totalHT)}</Text>
          </View>
          <View style={s.sumRow}>
            <Text style={s.sumLbl}>TVA (20 %)</Text>
            <Text style={s.sumVal}>{fmtEUR(totalTVA)}</Text>
          </View>
          <View style={s.sumTotal}>
            <Text style={s.sumTLbl}>{`TOTAL TTC \u00C0 R\u00C9GLER`}</Text>
            <Text style={s.sumTVal}>{fmtEUR(totalTTC)}</Text>
          </View>
        </View>

        <BankAndTotal total={totalTTC} />
        <PaymentMode />
        <SignatureBlock client={client} total={totalTTC} />
        <PageFooter />
      </Page>
      <CGVPage />
    </Document>
  )
}

// ================================================================
// DISPATCHER (utilisé par VehicleCockpit)
// ================================================================
export function Invoice({ vehicle, client, billingType }) {
  if (billingType === 'margin') {
    return <InvoiceMarginTemplate vehicle={vehicle} client={client} />
  }
  return <InvoiceVatTemplate vehicle={vehicle} client={client} />
}
