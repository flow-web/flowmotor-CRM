import {
  Document,
  Page,
  Text,
  View,
} from '@react-pdf/renderer'
import { DEFAULT_COMPANY_INFO } from '../utils/constants'
import {
  C, s,
  fmtEUR, fmtKm, dateNow,
  Watermarks, DocHeader, PageFooter,
} from './pdfShared.jsx'

// ================================================================
// HELPERS CERFA
// ================================================================

function InfoField({ label, value, width }) {
  return (
    <View style={{ marginBottom: 4, width: width || '100%' }}>
      <Text style={{ fontSize: 7, fontFamily: 'Helvetica-Bold', color: C.accent, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 1 }}>
        {label}
      </Text>
      <Text style={{ fontSize: 9, fontFamily: 'Times-Roman', color: C.text, paddingBottom: 2, borderBottomWidth: 0.5, borderBottomColor: C.lineSoft }}>
        {value || '-'}
      </Text>
    </View>
  )
}

function SectionTitle({ children }) {
  return (
    <Text style={[s.secTitle, { marginTop: 10, marginBottom: 6 }]}>
      {children}
    </Text>
  )
}

function SignatureBoxes({ leftLabel, leftName, rightLabel, rightName }) {
  return (
    <View style={s.sigRow}>
      <View style={s.sigBox}>
        <Text style={s.sigLbl}>{leftLabel}</Text>
        <Text style={s.sigName}>{leftName}</Text>
        <View style={s.sigSpace} />
        <Text style={s.sigDate}>{`Fait \u00E0 Lyon, le ${dateNow()}`}</Text>
      </View>
      <View style={s.sigBox}>
        <Text style={s.sigLbl}>{rightLabel}</Text>
        <Text style={s.sigName}>{rightName}</Text>
        <View style={s.sigSpace} />
        <Text style={s.sigDate}>{`Pr\u00E9c\u00E9d\u00E9 de "Lu et approuv\u00E9"`}</Text>
      </View>
    </View>
  )
}

function VehicleInfoBlock({ vehicle }) {
  const vName = `${vehicle.brand || vehicle.make || ''} ${vehicle.model || ''}${vehicle.trim ? ` ${vehicle.trim}` : ''}`
  return (
    <View style={{ marginBottom: 6 }}>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <InfoField label="Marque / Modèle" value={vName} />
        </View>
        <View style={{ flex: 1 }}>
          <InfoField label="Immatriculation" value={vehicle.registrationPlate} />
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}>
          <InfoField label="VIN" value={vehicle.vin} />
        </View>
        <View style={{ flex: 0.5 }}>
          <InfoField label="Année" value={vehicle.year?.toString()} />
        </View>
        <View style={{ flex: 0.5 }}>
          <InfoField label="Kilométrage" value={fmtKm(vehicle.mileage)} />
        </View>
      </View>
      {vehicle.color && (
        <InfoField label="Couleur" value={vehicle.color} />
      )}
    </View>
  )
}

function PersonBlock({ label, person, isCompany, company }) {
  if (isCompany) {
    const CO = company || DEFAULT_COMPANY_INFO
    return (
      <View style={{ marginBottom: 8 }}>
        <Text style={s.label}>{label}</Text>
        <View style={{ padding: 8, borderWidth: 0.5, borderColor: C.border, borderRadius: 2 }}>
          <Text style={[s.clName, { fontSize: 10 }]}>{CO.name}</Text>
          <Text style={s.clDetail}>
            {CO.legal} {'\u2013'} {CO.rcs}{'\n'}
            SIREN : {CO.siren}{'\n'}
            {CO.address}{'\n'}
            {CO.zipCity}{'\n'}
            {`T\u00E9l : ${CO.phone}`}{'\n'}
            {CO.email}
          </Text>
        </View>
      </View>
    )
  }

  const lines = [
    person.address,
    [person.postalCode, person.city].filter(Boolean).join(' '),
    person.email,
    person.phone ? `T\u00E9l. ${person.phone}` : null,
  ].filter(Boolean).join('\n')

  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={s.label}>{label}</Text>
      <View style={{ padding: 8, borderWidth: 0.5, borderColor: C.border, borderRadius: 2 }}>
        <Text style={[s.clName, { fontSize: 10 }]}>
          {person.firstName} {person.lastName}
        </Text>
        {lines ? <Text style={s.clDetail}>{lines}</Text> : null}
      </View>
    </View>
  )
}

// ================================================================
// 1. CERTIFICAT DE CESSION
// ================================================================
export function CertificatCession({ vehicle, client, company, cerfaNumber, direction, salePrice }) {
  const CO = company || DEFAULT_COMPANY_INFO
  const isSale = direction === 'sale'

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Watermarks />
        <DocHeader
          title="CERTIFICAT DE CESSION"
          number={cerfaNumber || 'BROUILLON'}
        />

        {/* Parties */}
        <View style={s.partiesRow}>
          <View style={s.colLeft}>
            <PersonBlock
              label="ANCIEN PROPRIÉTAIRE (VENDEUR)"
              person={isSale ? null : client}
              isCompany={isSale}
              company={CO}
            />
          </View>
          <View style={s.colRight}>
            <PersonBlock
              label="NOUVEAU PROPRIÉTAIRE (ACQUÉREUR)"
              person={isSale ? client : null}
              isCompany={!isSale}
              company={CO}
            />
          </View>
        </View>

        <View style={s.hrThin} />

        {/* Véhicule */}
        <SectionTitle>{`V\u00E9hicule c\u00E9d\u00E9`}</SectionTitle>
        <VehicleInfoBlock vehicle={vehicle} />

        <View style={s.hrThin} />

        {/* Conditions de vente */}
        <SectionTitle>Conditions de la cession</SectionTitle>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 6 }}>
          <View style={{ flex: 1 }}>
            <InfoField label="Date de la cession" value={dateNow()} />
          </View>
          <View style={{ flex: 1 }}>
            <InfoField label="Prix de vente TTC" value={fmtEUR(salePrice)} />
          </View>
        </View>

        <View style={{ padding: 8, borderWidth: 0.5, borderColor: C.border, marginBottom: 6 }}>
          <Text style={{ fontSize: 7.5, fontFamily: 'Times-Roman', color: C.text, lineHeight: 1.6 }}>
            {`Je soussign\u00E9(e), vendeur d\u00E9sign\u00E9 ci-dessus, certifie c\u00E9der le v\u00E9hicule d\u00E9crit ci-dessus \u00E0 l'acqu\u00E9reur d\u00E9sign\u00E9. Je certifie que ce v\u00E9hicule n'a pas subi de transformation notable depuis sa mise en circulation, qu'il n'est pas gagé et que la situation administrative est régulière.`}
          </Text>
        </View>

        {/* Signatures */}
        <SignatureBoxes
          leftLabel="Signature du vendeur"
          leftName={isSale ? CO.name : `${client.firstName} ${client.lastName}`}
          rightLabel="Signature de l'acquéreur"
          rightName={isSale ? `${client.firstName} ${client.lastName}` : CO.name}
        />

        <PageFooter company={CO} />
      </Page>
    </Document>
  )
}

// ================================================================
// 2. DEMANDE D'IMMATRICULATION
// ================================================================
export function DemandeImmatriculation({ vehicle, client, company, cerfaNumber }) {
  const CO = company || DEFAULT_COMPANY_INFO

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Watermarks />
        <DocHeader
          title="DEMANDE D'IMMATRICULATION"
          number={cerfaNumber || 'BROUILLON'}
        />

        {/* Demandeur */}
        <SectionTitle>Demandeur</SectionTitle>
        <PersonBlock
          label="TITULAIRE DU CERTIFICAT D'IMMATRICULATION"
          person={client}
          isCompany={false}
        />

        <View style={s.hrThin} />

        {/* Véhicule */}
        <SectionTitle>{`V\u00E9hicule concern\u00E9`}</SectionTitle>
        <VehicleInfoBlock vehicle={vehicle} />

        <View style={s.hrThin} />

        {/* Ancien titulaire */}
        <SectionTitle>Ancien titulaire</SectionTitle>
        <PersonBlock
          label="CÉDANT"
          person={null}
          isCompany={true}
          company={CO}
        />

        <View style={s.hrThin} />

        {/* Nature de l'opération */}
        <SectionTitle>{`Nature de l'op\u00E9ration`}</SectionTitle>
        <View style={{ padding: 8, borderWidth: 0.5, borderColor: C.border, marginBottom: 6 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <InfoField label="Type" value="Changement de titulaire" />
            </View>
            <View style={{ flex: 1 }}>
              <InfoField label="Date" value={dateNow()} />
            </View>
          </View>
          <Text style={{ fontSize: 7.5, fontFamily: 'Times-Roman', color: C.muted, marginTop: 4, lineHeight: 1.5 }}>
            {`Demande de certificat d'immatriculation suite \u00E0 l'acquisition du v\u00E9hicule aupr\u00E8s de ${CO.name}. Les frais de dossier incluent les d\u00E9marches d'immatriculation.`}
          </Text>
        </View>

        {/* Signatures */}
        <SignatureBoxes
          leftLabel="Signature du demandeur"
          leftName={`${client.firstName} ${client.lastName}`}
          rightLabel={`Cachet du professionnel`}
          rightName={CO.name}
        />

        <PageFooter company={CO} />
      </Page>
    </Document>
  )
}

// ================================================================
// 3. MANDAT D'IMMATRICULATION
// ================================================================
export function MandatImmatriculation({ vehicle, client, company, cerfaNumber }) {
  const CO = company || DEFAULT_COMPANY_INFO

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <Watermarks />
        <DocHeader
          title="MANDAT D'IMMATRICULATION"
          number={cerfaNumber || 'BROUILLON'}
        />

        {/* Le mandant */}
        <SectionTitle>Le mandant</SectionTitle>
        <PersonBlock
          label="PROPRIÉTAIRE DU VÉHICULE"
          person={client}
          isCompany={false}
        />

        <View style={s.hrThin} />

        {/* Le mandataire */}
        <SectionTitle>Le mandataire</SectionTitle>
        <PersonBlock
          label="PROFESSIONNEL MANDATÉ"
          person={null}
          isCompany={true}
          company={CO}
        />

        <View style={s.hrThin} />

        {/* Véhicule */}
        <SectionTitle>{`V\u00E9hicule concern\u00E9`}</SectionTitle>
        <VehicleInfoBlock vehicle={vehicle} />

        <View style={s.hrThin} />

        {/* Objet du mandat */}
        <SectionTitle>Objet du mandat</SectionTitle>
        <View style={{ padding: 10, borderWidth: 0.5, borderColor: C.border, marginBottom: 6 }}>
          <Text style={{ fontSize: 8, fontFamily: 'Times-Roman', color: C.text, lineHeight: 1.7 }}>
            {`Par le pr\u00E9sent mandat, le mandant autorise le mandataire \u00E0 effectuer en son nom et pour son compte les d\u00E9marches administratives suivantes :\n\n\u2022 D\u00E9p\u00F4t de la demande de certificat d'immatriculation\n\u2022 R\u00E9ception du certificat d'immatriculation\n\u2022 Toute d\u00E9marche compl\u00E9mentaire n\u00E9cessaire \u00E0 l'immatriculation du v\u00E9hicule\n\nCe mandat est donn\u00E9 pour une dur\u00E9e de 3 mois \u00E0 compter de sa date de signature.`}
          </Text>
        </View>

        <View style={s.legalBanner}>
          <Text style={s.legalTxt}>
            {`Mandat non transmissible \u2014 Pi\u00E8ce d'identit\u00E9 du mandant \u00E0 joindre obligatoirement`}
          </Text>
        </View>

        {/* Signatures */}
        <SignatureBoxes
          leftLabel="Signature du mandant"
          leftName={`${client.firstName} ${client.lastName}`}
          rightLabel="Signature du mandataire"
          rightName={CO.name}
        />

        <PageFooter company={CO} />
      </Page>
    </Document>
  )
}

// ================================================================
// DISPATCHER
// ================================================================
export function CerfaDocument({ type, ...props }) {
  switch (type) {
    case 'cession':
      return <CertificatCession {...props} />
    case 'demande_immatriculation':
      return <DemandeImmatriculation {...props} />
    case 'mandat_immatriculation':
      return <MandatImmatriculation {...props} />
    default:
      return <CertificatCession {...props} />
  }
}
