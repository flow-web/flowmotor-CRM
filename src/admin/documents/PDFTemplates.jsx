import {
  Document,
  Page,
  Text,
  View,
  Image,
} from '@react-pdf/renderer'
import { DEFAULT_COMPANY_INFO } from '../utils/constants'
import {
  C, ENGRENAGE, s,
  fmtEUR, fmtKm, dateNow,
  Watermarks, DocHeader, PageFooter,
} from './pdfShared.jsx'

// ================================================================
// BLOCS RÉUTILISABLES (locaux aux factures)
// ================================================================

function PartiesBlock({ client, company }) {
  const CO = company || DEFAULT_COMPANY_INFO
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

function BankAndTotal({ total, company }) {
  const CO = company || DEFAULT_COMPANY_INFO
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

function SignatureBlock({ client, total, company }) {
  const CO = company || DEFAULT_COMPANY_INFO
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

// ================================================================
// PAGE 2 : CONDITIONS GÉNÉRALES DE VENTE
// ================================================================
function CGVPage({ company }) {
  const CO = company || DEFAULT_COMPANY_INFO
  return (
    <Page size="A4" style={s.pageCGV}>
      <Image src={ENGRENAGE} style={s.wmGearCGV} />

      <Text style={s.cgvTitle}>{`CONDITIONS G\u00C9N\u00C9RALES DE VENTE`}</Text>

      <View style={s.cgvCols}>
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

      <PageFooter company={CO} />
    </Page>
  )
}

// ================================================================
// 1. BON DE COMMANDE
// ================================================================
export function OrderForm({ vehicle, client, invoiceNumber, company }) {
  const CO = company || DEFAULT_COMPANY_INFO
  const num = invoiceNumber || 'BROUILLON'
  const frais = 350
  const prix = vehicle.sellingPrice || 0
  const total = prix + frais

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Watermarks />
        <DocHeader title="BON DE COMMANDE" number={num} />
        <PartiesBlock client={client} company={CO} />
        <View style={s.hrThin} />
        <VehicleTable vehicle={vehicle} />

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

        <BankAndTotal total={total} company={CO} />
        <PaymentMode />

        <View style={s.legalBanner}>
          <Text style={s.legalTxt}>
            {`Acompte de 10% exigible \u00E0 la signature, soit ${fmtEUR(total * 0.1)} \u2014 Solde \u00E0 la livraison`}
          </Text>
        </View>

        <SignatureBlock client={client} total={total} company={CO} />
        <PageFooter company={CO} />
      </Page>
      <CGVPage company={CO} />
    </Document>
  )
}

// ================================================================
// 2. FACTURE — TVA SUR MARGE (Art. 297 A du CGI)
// ================================================================
export function InvoiceMarginTemplate({ vehicle, client, invoiceNumber, company, reprise }) {
  const CO = company || DEFAULT_COMPANY_INFO
  const num = invoiceNumber || 'BROUILLON'
  const frais = 350
  const prix = vehicle.sellingPrice || 0
  const repriseValue = reprise?.tradein_value || 0
  const total = prix + frais - repriseValue

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Watermarks />
        <DocHeader title="FACTURE" number={num} />
        <PartiesBlock client={client} company={CO} />
        <View style={s.hrThin} />

        <View style={s.legalBanner}>
          <Text style={s.legalTxt}>
            {`R\u00E9gime particulier \u2013 Biens d\u2019occasion \u2013 Article 297 A du CGI \u2013 TVA non r\u00E9cup\u00E9rable`}
          </Text>
        </View>

        <VehicleTable vehicle={vehicle} />

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
          {repriseValue > 0 && (
            <View style={s.tRow}>
              <Text style={[s.td, { flex: 3 }]}>
                {`Reprise \u2014 ${reprise.tradein_brand || ''} ${reprise.tradein_model || ''}`}
              </Text>
              <Text style={[s.tdR, { flex: 1, color: '#B91C1C' }]}>{`- ${fmtEUR(repriseValue)}`}</Text>
            </View>
          )}
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
          {repriseValue > 0 && (
            <View style={s.sumRow}>
              <Text style={s.sumLbl}>{`D\u00E9duction reprise`}</Text>
              <Text style={[s.sumVal, { color: '#B91C1C' }]}>{`- ${fmtEUR(repriseValue)}`}</Text>
            </View>
          )}
          <View style={s.sumTotal}>
            <Text style={s.sumTLbl}>{`TOTAL TTC \u00C0 R\u00C9GLER`}</Text>
            <Text style={s.sumTVal}>{fmtEUR(total)}</Text>
          </View>
        </View>

        <BankAndTotal total={total} company={CO} />
        <PaymentMode />
        <SignatureBlock client={client} total={total} company={CO} />
        <PageFooter company={CO} />
      </Page>
      <CGVPage company={CO} />
    </Document>
  )
}

// ================================================================
// 3. FACTURE — TVA APPARENTE (HT + TVA 20 % + TTC)
// ================================================================
export function InvoiceVatTemplate({ vehicle, client, invoiceNumber, company, reprise }) {
  const CO = company || DEFAULT_COMPANY_INFO
  const num = invoiceNumber || 'BROUILLON'
  const frais = 350
  const prixHT = Math.round(((vehicle.sellingPrice || 0) / 1.2) * 100) / 100
  const tvaVehicule = (vehicle.sellingPrice || 0) - prixHT
  const repriseValue = reprise?.tradein_value || 0
  const totalHT = prixHT + frais
  const totalTVA = tvaVehicule
  const totalTTC = totalHT + totalTVA - repriseValue

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Watermarks />
        <DocHeader title="FACTURE" number={num} />
        <PartiesBlock client={client} company={CO} />
        <View style={s.hrThin} />
        <VehicleTable vehicle={vehicle} />

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
          {repriseValue > 0 && (
            <View style={s.tRow}>
              <Text style={[s.td, { flex: 3 }]}>
                {`Reprise \u2014 ${reprise.tradein_brand || ''} ${reprise.tradein_model || ''}`}
              </Text>
              <Text style={[s.tdR, { flex: 1 }]}>-</Text>
              <Text style={[s.tdR, { flex: 1 }]}>-</Text>
              <Text style={[s.tdR, { flex: 1, color: '#B91C1C' }]}>{`- ${fmtEUR(repriseValue)}`}</Text>
            </View>
          )}
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
          {repriseValue > 0 && (
            <View style={s.sumRow}>
              <Text style={s.sumLbl}>{`D\u00E9duction reprise`}</Text>
              <Text style={[s.sumVal, { color: '#B91C1C' }]}>{`- ${fmtEUR(repriseValue)}`}</Text>
            </View>
          )}
          <View style={s.sumTotal}>
            <Text style={s.sumTLbl}>{`TOTAL TTC \u00C0 R\u00C9GLER`}</Text>
            <Text style={s.sumTVal}>{fmtEUR(totalTTC)}</Text>
          </View>
        </View>

        <BankAndTotal total={totalTTC} company={CO} />
        <PaymentMode />
        <SignatureBlock client={client} total={totalTTC} company={CO} />
        <PageFooter company={CO} />
      </Page>
      <CGVPage company={CO} />
    </Document>
  )
}

// ================================================================
// DISPATCHER (utilisé par VehicleCockpit)
// ================================================================
export function Invoice({ vehicle, client, billingType, invoiceNumber, company, reprise }) {
  if (billingType === 'margin') {
    return <InvoiceMarginTemplate vehicle={vehicle} client={client} invoiceNumber={invoiceNumber} company={company} reprise={reprise} />
  }
  return <InvoiceVatTemplate vehicle={vehicle} client={client} invoiceNumber={invoiceNumber} company={company} reprise={reprise} />
}
