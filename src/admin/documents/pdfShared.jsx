import { Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { DEFAULT_COMPANY_INFO } from '../utils/constants'

// ================================================================
// PALETTE — Brand Board FLOW MOTOR
// ================================================================
export const C = {
  pageBg: '#F4E8D8',
  primary: '#3D1E1E',
  accent: '#5C3A2E',
  gold: '#C4A484',
  text: '#3D1E1E',
  muted: '#7A6A5E',
  white: '#FFFFFF',
  tableBg: '#EDE0CE',
  border: '#3D1E1E',
  lineSoft: '#C9B99A',
}

// ================================================================
// ASSETS (public/)
// ================================================================
export const LOGO = '/assets/LOGO_AUBERGINE.png'
export const ROUTE = '/assets/ROUTE.png'
export const ENGRENAGE = '/assets/ENGRENAGE.png'

// ================================================================
// HELPERS
// ================================================================
export const sanitize = (s) => s.replace(/\u202F/g, ' ').replace(/\u00A0/g, ' ')

export const fmtEUR = (n, d = 2) => {
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

export const fmtKm = (km) => {
  if (!km) return '-'
  return sanitize(new Intl.NumberFormat('fr-FR').format(km) + ' km')
}

export const dateNow = () =>
  sanitize(
    new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date()),
  )

// ================================================================
// STYLES
// ================================================================
export const s = StyleSheet.create({
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
  wmRoute: { position: 'absolute', bottom: 80, right: 10, width: 300, opacity: 0.08 },
  wmGear: { position: 'absolute', top: 30, left: 25, width: 50, opacity: 0.04 },
  wmGearCGV: { position: 'absolute', bottom: 40, right: 20, width: 80, opacity: 0.05 },
  hdrRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  logo: { width: 80, height: 80 },
  titleBlock: { alignItems: 'flex-end' },
  docTitle: { fontSize: 30, fontFamily: 'Helvetica-Bold', color: C.primary, letterSpacing: 4, textTransform: 'uppercase' },
  docMeta: { fontSize: 8.5, color: C.muted, textAlign: 'right', marginTop: 2 },
  hrThick: { borderBottomWidth: 2.5, borderBottomColor: C.primary, marginTop: 6, marginBottom: 14 },
  hrThin: { borderBottomWidth: 0.5, borderBottomColor: C.lineSoft, marginVertical: 8 },
  partiesRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  colLeft: { width: '50%' },
  colRight: { width: '45%' },
  coName: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.primary, marginBottom: 1 },
  coSub: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.accent, marginBottom: 6 },
  coLines: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text, lineHeight: 1.7 },
  coSiren: { fontFamily: 'Times-Roman', fontSize: 7.5, color: C.muted, lineHeight: 1.5, marginTop: 4 },
  label: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.accent, textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6 },
  clName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.text, marginBottom: 3 },
  clDetail: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text, lineHeight: 1.7 },
  secTitle: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.primary, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4, paddingBottom: 3, borderBottomWidth: 0.5, borderBottomColor: C.primary },
  tbl: { marginBottom: 6, borderWidth: 0.5, borderColor: C.border },
  tHead: { flexDirection: 'row', backgroundColor: C.primary, paddingVertical: 5, paddingHorizontal: 6 },
  th: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.white, textTransform: 'uppercase', letterSpacing: 0.5 },
  tRow: { flexDirection: 'row', paddingVertical: 6, paddingHorizontal: 6, borderTopWidth: 0.5, borderTopColor: C.border },
  tRowAlt: { backgroundColor: C.tableBg },
  td: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text },
  tdB: { fontFamily: 'Times-Bold', fontSize: 8.5, color: C.text },
  tdR: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text, textAlign: 'right' },
  tdRB: { fontFamily: 'Times-Bold', fontSize: 8.5, color: C.text, textAlign: 'right' },
  sumWrap: { marginLeft: 'auto', width: 220, marginTop: 4, marginBottom: 8 },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2.5, paddingHorizontal: 8 },
  sumLbl: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.muted },
  sumVal: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text },
  sumTotal: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, backgroundColor: C.primary, marginTop: 4 },
  sumTLbl: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.white },
  sumTVal: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.gold },
  bankTotalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6, gap: 10 },
  bankBox: { flex: 1, padding: 7, borderWidth: 0.5, borderColor: C.border },
  bankLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.accent, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  bankVal: { fontFamily: 'Courier', fontSize: 7.5, color: C.text, lineHeight: 1.6 },
  totalBox: { padding: 7, borderWidth: 1, borderColor: C.primary, alignItems: 'center', justifyContent: 'center', minWidth: 140 },
  totalLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.accent, textTransform: 'uppercase', marginBottom: 2 },
  totalVal: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.primary },
  payModeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6, gap: 10 },
  payModeLeft: { flex: 1 },
  payModeLbl: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.primary, textTransform: 'uppercase', marginBottom: 4 },
  payModeTxt: { fontFamily: 'Times-Roman', fontSize: 8, color: C.text, lineHeight: 1.6 },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  checkbox: { width: 10, height: 10, borderWidth: 1, borderColor: C.primary },
  checkLabel: { fontFamily: 'Times-Roman', fontSize: 8.5, color: C.text },
  checkboxesRow: { flexDirection: 'row', alignItems: 'center', gap: 20, marginTop: 4 },
  legalBanner: { paddingVertical: 5, paddingHorizontal: 10, backgroundColor: C.primary, marginBottom: 6 },
  legalTxt: { fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: C.gold, textAlign: 'center', letterSpacing: 0.3 },
  sigRow: { flexDirection: 'row', gap: 10, marginTop: 6 },
  sigBox: { flex: 1, padding: 7, borderWidth: 0.5, borderColor: C.border },
  sigLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.accent, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  sigName: { fontFamily: 'Times-Roman', fontSize: 8, color: C.text, marginBottom: 2 },
  sigSpace: { height: 30, borderBottomWidth: 0.5, borderBottomColor: C.lineSoft },
  sigDate: { fontFamily: 'Times-Roman', fontSize: 7, color: C.muted, marginTop: 3 },
  sigTotalBox: { width: 130, padding: 7, borderWidth: 1, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  sigTotalLbl: { fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.accent, textTransform: 'uppercase', marginBottom: 2 },
  sigTotalVal: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.primary },
  footer: { position: 'absolute', bottom: 14, left: 35, right: 35, paddingTop: 4, borderTopWidth: 0.5, borderTopColor: C.lineSoft, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  ftTxt: { fontFamily: 'Times-Roman', fontSize: 6, color: C.muted, lineHeight: 1.4 },
  ftPage: { fontFamily: 'Helvetica-Bold', fontSize: 7.5, color: C.muted },
  cgvTitle: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.primary, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14, paddingBottom: 6, borderBottomWidth: 1.5, borderBottomColor: C.primary },
  cgvCols: { flexDirection: 'row', gap: 18 },
  cgvCol: { flex: 1 },
  cgvArticle: { marginBottom: 10 },
  cgvArtTitle: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: C.primary, textTransform: 'uppercase', marginBottom: 3 },
  cgvArtText: { fontFamily: 'Times-Roman', fontSize: 7.5, color: C.text, lineHeight: 1.7 },
})

// ================================================================
// COMPOSANTS RÉUTILISABLES
// ================================================================

export function Watermarks() {
  return (
    <>
      <Image src={ROUTE} style={s.wmRoute} />
      <Image src={ENGRENAGE} style={s.wmGear} />
    </>
  )
}

export function DocHeader({ title, number }) {
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

export function PageFooter({ company }) {
  const CO = company || DEFAULT_COMPANY_INFO
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
