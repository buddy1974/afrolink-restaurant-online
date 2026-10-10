/**
 * Privacy policy (Art. 13 DSGVO) — German is binding; EN/FR are courtesy translations.
 * Describes ONLY what this website technically does (verified in code and browser, 2026-10-10):
 * - storage: see src/data/storage-inventory.ts (consent record; optional language cookie,
 *   optional rating memory, staff cookie) — nothing without a visitor action.
 * - language redirect server-side from the Accept-Language header (vercel.json).
 * - external videos only after an informed two-click consent (src/components/VideoCard.astro).
 * - no analytics, no ads, fonts self-hosted, enquiry assistant sends nothing by itself.
 * Operator identity comes from src/data/legal.ts and is never guessed.
 * Sections depending on configuration are included only when that configuration is active.
 */
import type { Lang } from './config';
import type { PrivacySection } from './legal-content';

export interface PrivacyOptions {
  /** Ratings collection is switched on in this build (RATINGS_ENABLED). */
  ratingsOn: boolean;
  /** Processor agreements confirmed (src/data/legal.ts → processors). */
  vercelDpa: boolean;
  neonDpa: boolean;
}

interface Copy {
  title: string;
  lede: string;
  controller: string;
  controllerText: string;
  operator: string;
  address: string;
  phone: string;
  email: string;
  updated: string;
  sections: (o: PrivacyOptions) => PrivacySection[];
}

const de: Copy = {
  title: 'Datenschutzerklärung',
  lede: 'Informationen nach Art. 13 DSGVO zur Nutzung dieser Website.',
  controller: 'Verantwortlicher',
  controllerText: 'Verantwortlich für die Datenverarbeitung auf dieser Website ist:',
  operator: 'Betreiber',
  address: 'Anschrift',
  phone: 'Telefon',
  email: 'E-Mail',
  updated: 'Stand: Oktober 2026',
  sections: (o) => [
    {
      h: 'Hosting und Auslieferung der Website',
      p: [
        'Diese Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA, betrieben. Die Seiten werden über das weltweite Servernetz von Vercel ausgeliefert; serverseitige Funktionen laufen in einem Rechenzentrum in Frankfurt am Main. Beim Aufruf verarbeitet Vercel technisch notwendige Daten – insbesondere IP-Adresse, Datum und Uhrzeit, aufgerufene Seite sowie Browser- und Geräteinformationen – und speichert sie kurzzeitig in Protokolldateien, um die Website sicher und stabil bereitzustellen und Angriffe abzuwehren. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.',
        `Vercel ist unter dem EU-US Data Privacy Framework zertifiziert; Übermittlungen in die USA erfolgen auf Grundlage des Angemessenheitsbeschlusses der EU-Kommission (Art. 45 DSGVO).${o.vercelDpa ? ' Mit Vercel besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO).' : ''}`,
      ],
    },
    {
      h: 'Cookies und Speicherung auf Ihrem Gerät',
      p: [
        'Beim normalen Besuch setzt diese Website keine Cookies, nutzt keinen lokalen Speicher und lädt nichts von Drittanbietern. Wir verwenden keine Analyse-, Tracking- oder Werbedienste; Schriftarten werden von unserem eigenen Server geladen. Eine vollständige Übersicht mit Speicherdauern finden Sie in der Cookie-Richtlinie.',
        'Sprache: Beim Aufruf der Startseite leiten wir Sie anhand der Spracheinstellung, die Ihr Browser mit jeder Anfrage ohnehin übermittelt (HTTP-Header „Accept-Language“), gegebenenfalls zur englischen oder französischen Fassung weiter; dafür wird auf Ihrem Gerät nichts gelesen oder gespeichert. Nur wenn Sie „Sprache merken“ erlauben, speichern wir Ihre gewählte Sprache 12 Monate lang im Cookie „afl_lang“.',
        'Ihre Datenschutz-Einstellungen speichern wir unter „afl-consent“ im lokalen Speicher Ihres Browsers (12 Monate), damit wir Ihre Wahl beachten können; dies ist unbedingt erforderlich (§ 25 Abs. 2 Nr. 2 TDDDG). Der Eintrag enthält keine personenbezogenen Angaben und wird nicht an uns übermittelt.',
        ...(o.ratingsOn
          ? [
              'Bewertungen: Nur wenn Sie beim Bewerten „Auf diesem Gerät merken“ wählen, setzen wir das Cookie „afl_rv“ (12 Monate) und speichern Ihre Sternzahl unter „afl-rated:<Gericht>“, damit Sie Ihre Bewertung später ändern können. Für die Anmeldung von Mitarbeitenden im internen Verwaltungsbereich wird ein Sitzungs-Cookie („afl_admin“, höchstens 8 Stunden) gesetzt, das für die Anmeldung unbedingt erforderlich ist.',
            ]
          : []),
        'Optionale Speicherungen erfolgen nur mit Ihrer Einwilligung (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO). Sie können sie jederzeit über „Cookie-Einstellungen“ am Ende jeder Seite mit Wirkung für die Zukunft widerrufen; die betroffenen Einträge löschen wir dann sofort.',
      ],
    },
    {
      h: 'Videos von YouTube und Facebook (erst nach Ihrer Freigabe)',
      p: [
        'Videos werden zunächst nur als Vorschaubild von unserem Server angezeigt. Klicken Sie darauf, erklären wir Ihnen zuerst, welcher Anbieter das Video bereitstellt und welche Daten übertragen werden. Erst wenn Sie „Video laden“ wählen, wird das Video von YouTube (Google Ireland Limited, über youtube-nocookie.com) bzw. Facebook (Meta Platforms Ireland Limited) geladen. Mit „Externe Videos immer erlauben“ speichern wir diese Wahl in Ihren Datenschutz-Einstellungen.',
        'Beim Laden werden Daten wie Ihre IP-Adresse an den Anbieter übertragen; die Anbieter können Cookies oder vergleichbare Speicherungen nutzen und Daten auch in den USA verarbeiten (Google und Meta sind unter dem EU-US Data Privacy Framework zertifiziert). Rechtsgrundlage ist Ihre Einwilligung (Art. 6 Abs. 1 lit. a DSGVO; § 25 Abs. 1 TDDDG), die Sie jederzeit über die Cookie-Einstellungen widerrufen können. Ohne Ihre Freigabe findet keine Verbindung statt.',
      ],
    },
    {
      h: 'Kontakt, Reservierungen und Anfragen',
      p: [
        'Wenn Sie uns anrufen, per WhatsApp schreiben oder eine E-Mail senden, verarbeiten wir Ihre Angaben (z. B. Name, Telefonnummer, Inhalt der Nachricht, gewünschter Termin), um Ihre Anfrage, Reservierung, Bestellung oder Ihren Catering-Wunsch zu bearbeiten. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertrag oder vorvertragliche Maßnahmen), im Übrigen Art. 6 Abs. 1 lit. f DSGVO (Beantwortung Ihrer Anfrage).',
        'Angaben zu Allergien, Unverträglichkeiten oder Ernährungsbedürfnissen (z. B. bei Diabetes) sind Gesundheitsdaten. Wir verarbeiten sie nur, wenn Sie sie uns selbst mitteilen, und nur, um Ihr Essen entsprechend zuzubereiten; Rechtsgrundlage ist Ihre ausdrückliche Einwilligung (Art. 9 Abs. 2 lit. a DSGVO), die Sie jederzeit widerrufen können.',
        'Wir löschen diese Angaben, sobald sie für die Bearbeitung nicht mehr erforderlich sind, soweit keine gesetzlichen Aufbewahrungspflichten (z. B. für Rechnungen) entgegenstehen.',
        'Der Anfrage-Assistent auf dieser Website speichert und übermittelt keine Daten; er erstellt in Ihrem Browser nur einen Text. Erst wenn Sie „Per WhatsApp senden“ wählen oder uns über WhatsApp schreiben, wird WhatsApp (WhatsApp Ireland Limited) genutzt. Dafür gelten die Datenschutzbestimmungen von WhatsApp; Meta kann Daten auch in den USA verarbeiten.',
      ],
    },
    ...(o.ratingsOn
      ? [
          {
            h: 'Bewertung von Gerichten',
            p: [
              'Sie können Gerichte anonym mit 1 bis 5 Sternen bewerten. Gespeichert werden das Gericht, die Sternzahl, Datum und Uhrzeit sowie ein pseudonymer Schlüssel. Namen, E-Mail-Adressen oder Konten werden nicht erhoben.',
              'Wenn Sie „Auf diesem Gerät merken“ wählen (Einwilligung), enthält das Cookie „afl_rv“ eine Zufallskennung, damit Sie Ihre Bewertung später ändern können; in der Datenbank wird nur ein daraus berechneter, nicht umkehrbarer Schlüssel gespeichert. Ohne diese Wahl wird auf Ihrem Gerät nichts gespeichert; dann zählt je Netzwerk, Gericht und Tag eine Bewertung.',
              'Zum Schutz vor Missbrauch (z. B. automatisierte Massenbewertungen) wird Ihre IP-Adresse nicht gespeichert, sondern nur ein täglich wechselnder, nicht umkehrbarer Schlüssel daraus gebildet und nach spätestens 30 Tagen gelöscht; Daten zur Begrenzung von Anfragen werden nach 2 Tagen gelöscht.',
              `Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an zuverlässigen Bewertungen und an der Verbesserung unserer Speisekarte). Die Bewertungen werden in einer Datenbank von Neon (Region Frankfurt am Main) gespeichert; Neon ist unter dem EU-US Data Privacy Framework zertifiziert.${o.neonDpa ? ' Mit Neon besteht ein Vertrag zur Auftragsverarbeitung (Art. 28 DSGVO).' : ''} Bewertungen bleiben für die Auswertung gespeichert, solange die Bewertungsfunktion besteht; sie lassen sich keiner Person zuordnen.`,
            ],
          },
        ]
      : []),
    {
      h: 'Externe Links',
      p: [
        'Links zu Google Maps, Google-Bewertungen, Facebook, Instagram, TikTok, YouTube und WhatsApp führen zu den Angeboten dieser Anbieter. Erst wenn Sie einen Link anklicken, werden Daten an den jeweiligen Anbieter übertragen; dann gelten dessen Datenschutzbestimmungen.',
      ],
    },
    {
      h: 'Keine automatisierte Entscheidung, keine Pflicht zur Bereitstellung',
      p: [
        'Eine automatisierte Entscheidungsfindung einschließlich Profiling findet nicht statt. Sie sind nicht verpflichtet, uns personenbezogene Daten bereitzustellen; ohne die technisch notwendigen Verbindungsdaten kann die Website jedoch nicht angezeigt werden.',
      ],
    },
    {
      h: 'Ihre Rechte',
      p: [
        'Sie haben das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Datenübertragbarkeit (Art. 20). Eine erteilte Einwilligung können Sie jederzeit mit Wirkung für die Zukunft widerrufen (Art. 7 Abs. 3). Für Ihr Anliegen genügt eine Nachricht an die oben genannten Kontaktdaten.',
        'Widerspruchsrecht: Soweit wir Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten, können Sie aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO).',
        'Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO), zum Beispiel bei der Landesbeauftragten für Datenschutz und Informationsfreiheit Nordrhein-Westfalen, Kavalleriestraße 2–4, 40213 Düsseldorf.',
      ],
    },
  ],
};

const en: Copy = {
  title: 'Privacy policy',
  lede: 'Information under Art. 13 GDPR about the use of this website. The German version is binding.',
  controller: 'Controller',
  controllerText: 'The controller responsible for data processing on this website is:',
  operator: 'Operator',
  address: 'Address',
  phone: 'Phone',
  email: 'E-mail',
  updated: 'Last updated: October 2026',
  sections: (o) => [
    {
      h: 'Hosting and delivery of the website',
      p: [
        'This website is operated on Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA. Pages are delivered through Vercel’s worldwide server network; server-side functions run in a data centre in Frankfurt am Main. When you visit the site, Vercel processes technically necessary data – in particular IP address, date and time, the page requested and browser/device information – and keeps it briefly in log files to deliver the site securely and reliably and to fend off attacks. Legal basis: Art. 6(1)(f) GDPR.',
        `Vercel is certified under the EU-US Data Privacy Framework; transfers to the USA are based on the European Commission’s adequacy decision (Art. 45 GDPR).${o.vercelDpa ? ' A data processing agreement with Vercel is in place (Art. 28 GDPR).' : ''}`,
      ],
    },
    {
      h: 'Cookies and storage on your device',
      p: [
        'During a normal visit this website sets no cookies, uses no local storage and loads nothing from third parties. We use no analytics, tracking or advertising services; fonts are served from our own server. A full overview with storage periods is in the cookie policy.',
        'Language: when you open the home page, we may redirect you to the English or French version based on the language setting your browser sends with every request anyway (HTTP header “Accept-Language”); nothing is read from or stored on your device for this. Only if you allow “Remember language” do we store your chosen language for 12 months in the cookie “afl_lang”.',
        'We store your privacy settings as “afl-consent” in your browser’s local storage (12 months) so that we can respect your choice; this is strictly necessary (§ 25(2) no. 2 TDDDG). The entry contains no personal details and is not sent to us.',
        ...(o.ratingsOn
          ? [
              'Ratings: only if you choose “Remember on this device” when rating do we set the cookie “afl_rv” (12 months) and store your stars as “afl-rated:<dish>”, so that you can change your rating later. Staff logging in to the internal management area receive a session cookie (“afl_admin”, at most 8 hours), which is strictly necessary for the login.',
            ]
          : []),
        'Optional storage only takes place with your consent (§ 25(1) TDDDG, Art. 6(1)(a) GDPR). You can withdraw it at any time with effect for the future via “Cookie settings” at the bottom of every page; we then delete the affected entries immediately.',
      ],
    },
    {
      h: 'Videos from YouTube and Facebook (only after you allow them)',
      p: [
        'Videos are first shown only as a preview image from our server. When you click it, we first explain which provider supplies the video and which data is transmitted. Only when you choose “Load video” is the video loaded from YouTube (Google Ireland Limited, via youtube-nocookie.com) or Facebook (Meta Platforms Ireland Limited). “Always allow external videos” stores this choice in your privacy settings.',
        'When a video loads, data such as your IP address is transmitted to the provider; the providers may use cookies or similar storage and also process data in the USA (Google and Meta are certified under the EU-US Data Privacy Framework). Legal basis: your consent (Art. 6(1)(a) GDPR; § 25(1) TDDDG), which you can withdraw at any time in the cookie settings. Without your permission, no connection is made.',
      ],
    },
    {
      h: 'Contact, reservations and enquiries',
      p: [
        'When you call us, write to us on WhatsApp or send an e-mail, we process your details (e.g. name, phone number, message, requested date) to handle your enquiry, reservation, order or catering request. Legal basis: Art. 6(1)(b) GDPR (contract or pre-contractual steps), otherwise Art. 6(1)(f) GDPR (answering your enquiry).',
        'Information about allergies, intolerances or dietary needs (e.g. diabetes) is health data. We only process it if you tell us yourself, and only to prepare your food accordingly; the legal basis is your explicit consent (Art. 9(2)(a) GDPR), which you can withdraw at any time.',
        'We delete these details once they are no longer needed for handling your request, unless statutory retention obligations (e.g. for invoices) apply.',
        'The enquiry assistant on this website neither stores nor transmits data; it only composes a text in your browser. WhatsApp (WhatsApp Ireland Limited) is used only when you choose “Send via WhatsApp” or write to us on WhatsApp. WhatsApp’s privacy terms then apply; Meta may also process data in the USA.',
      ],
    },
    ...(o.ratingsOn
      ? [
          {
            h: 'Rating dishes',
            p: [
              'You can rate dishes anonymously with 1 to 5 stars. We store the dish, the number of stars, date and time and a pseudonymous key. No names, e-mail addresses or accounts are collected.',
              'If you choose “Remember on this device” (consent), the cookie “afl_rv” contains a random identifier so that you can change your rating later; only an irreversible key derived from it is stored in the database. Without that choice nothing is stored on your device; one rating then counts per network, dish and day.',
              'To prevent abuse (e.g. automated mass ratings), your IP address is not stored; only a daily-changing, irreversible key derived from it is kept for at most 30 days; rate-limiting data is deleted after 2 days.',
              `Legal basis: Art. 6(1)(f) GDPR (legitimate interest in reliable ratings and improving our menu). Ratings are stored in a Neon database (Frankfurt region); Neon is certified under the EU-US Data Privacy Framework.${o.neonDpa ? ' A data processing agreement with Neon is in place (Art. 28 GDPR).' : ''} Ratings are kept for evaluation for as long as the rating function exists; they cannot be linked to a person.`,
            ],
          },
        ]
      : []),
    {
      h: 'External links',
      p: [
        'Links to Google Maps, Google reviews, Facebook, Instagram, TikTok, YouTube and WhatsApp lead to those providers’ services. Data is only transmitted to a provider when you click a link; that provider’s privacy terms then apply.',
      ],
    },
    {
      h: 'No automated decision-making, no obligation to provide data',
      p: [
        'No automated decision-making, including profiling, takes place. You are not obliged to provide personal data; without the technically necessary connection data, however, the website cannot be displayed.',
      ],
    },
    {
      h: 'Your rights',
      p: [
        'You have the right of access (Art. 15 GDPR), rectification (Art. 16), erasure (Art. 17), restriction of processing (Art. 18) and data portability (Art. 20). You may withdraw consent at any time with effect for the future (Art. 7(3)). A message to the contact details above is sufficient.',
        'Right to object: where we process data on the basis of Art. 6(1)(f) GDPR, you may object at any time on grounds relating to your particular situation (Art. 21 GDPR).',
        'You may lodge a complaint with a data protection supervisory authority (Art. 77 GDPR), for example the State Commissioner for Data Protection and Freedom of Information of North Rhine-Westphalia, Kavalleriestraße 2–4, 40213 Düsseldorf, Germany.',
      ],
    },
  ],
};

const fr: Copy = {
  title: 'Politique de confidentialité',
  lede: 'Informations selon l’art. 13 du RGPD sur l’utilisation de ce site. La version allemande fait foi.',
  controller: 'Responsable du traitement',
  controllerText: 'Le responsable du traitement des données sur ce site est :',
  operator: 'Exploitant',
  address: 'Adresse',
  phone: 'Téléphone',
  email: 'E-mail',
  updated: 'Mise à jour : octobre 2026',
  sections: (o) => [
    {
      h: 'Hébergement et diffusion du site',
      p: [
        'Ce site est exploité chez Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis. Les pages sont diffusées via le réseau mondial de serveurs de Vercel ; les fonctions côté serveur s’exécutent dans un centre de données à Francfort-sur-le-Main. Lors de votre visite, Vercel traite des données techniquement nécessaires – notamment l’adresse IP, la date et l’heure, la page consultée et des informations sur le navigateur et l’appareil – et les conserve brièvement dans des fichiers journaux afin de diffuser le site de manière sûre et stable et de parer aux attaques. Base juridique : art. 6, par. 1, point f) du RGPD.',
        `Vercel est certifié au titre du cadre de protection des données UE-États-Unis (Data Privacy Framework) ; les transferts vers les États-Unis reposent sur la décision d’adéquation de la Commission européenne (art. 45 RGPD).${o.vercelDpa ? ' Un contrat de sous-traitance a été conclu avec Vercel (art. 28 RGPD).' : ''}`,
      ],
    },
    {
      h: 'Cookies et stockage sur votre appareil',
      p: [
        'Lors d’une visite normale, ce site ne dépose aucun cookie, n’utilise pas le stockage local et ne charge rien depuis des tiers. Nous n’utilisons aucun service d’analyse, de suivi ou de publicité ; les polices sont chargées depuis notre propre serveur. Un aperçu complet avec les durées de conservation figure dans la politique relative aux cookies.',
        'Langue : à l’ouverture de la page d’accueil, nous pouvons vous rediriger vers la version anglaise ou française en fonction de la langue que votre navigateur transmet de toute façon à chaque requête (en-tête HTTP « Accept-Language ») ; rien n’est lu ni enregistré sur votre appareil pour cela. Ce n’est que si vous autorisez « Mémoriser la langue » que nous enregistrons votre langue pendant 12 mois dans le cookie « afl_lang ».',
        'Nous enregistrons vos paramètres de confidentialité sous « afl-consent » dans le stockage local de votre navigateur (12 mois) afin de respecter votre choix ; cela est strictement nécessaire (§ 25, al. 2, n° 2 TDDDG). L’entrée ne contient aucune donnée personnelle et ne nous est pas transmise.',
        ...(o.ratingsOn
          ? [
              'Notes : uniquement si vous choisissez « Mémoriser sur cet appareil » en notant, nous déposons le cookie « afl_rv » (12 mois) et enregistrons vos étoiles sous « afl-rated:<plat> », afin que vous puissiez modifier votre note. Le personnel qui se connecte à l’espace de gestion interne reçoit un cookie de session (« afl_admin », 8 heures au maximum), strictement nécessaire à la connexion.',
            ]
          : []),
        'Les stockages facultatifs n’ont lieu qu’avec votre consentement (§ 25, al. 1 TDDDG, art. 6, par. 1, point a) RGPD). Vous pouvez le retirer à tout moment pour l’avenir via « Paramètres des cookies » en bas de chaque page ; nous supprimons alors immédiatement les entrées concernées.',
      ],
    },
    {
      h: 'Vidéos YouTube et Facebook (uniquement après votre autorisation)',
      p: [
        'Les vidéos s’affichent d’abord sous forme d’image d’aperçu depuis notre serveur. Lorsque vous cliquez dessus, nous vous expliquons d’abord quel fournisseur diffuse la vidéo et quelles données sont transmises. Ce n’est que lorsque vous choisissez « Charger la vidéo » qu’elle est chargée depuis YouTube (Google Ireland Limited, via youtube-nocookie.com) ou Facebook (Meta Platforms Ireland Limited). « Toujours autoriser les vidéos externes » enregistre ce choix dans vos paramètres de confidentialité.',
        'Au chargement, des données comme votre adresse IP sont transmises au fournisseur ; les fournisseurs peuvent utiliser des cookies ou des stockages similaires et traiter des données aux États-Unis (Google et Meta sont certifiés au titre du Data Privacy Framework UE-États-Unis). Base juridique : votre consentement (art. 6, par. 1, point a) RGPD ; § 25, al. 1 TDDDG), que vous pouvez retirer à tout moment dans les paramètres des cookies. Sans votre autorisation, aucune connexion n’a lieu.',
      ],
    },
    {
      h: 'Contact, réservations et demandes',
      p: [
        'Lorsque vous nous appelez, nous écrivez sur WhatsApp ou nous envoyez un e-mail, nous traitons vos données (p. ex. nom, numéro de téléphone, contenu du message, date souhaitée) pour traiter votre demande, réservation, commande ou demande de traiteur. Base juridique : art. 6, par. 1, point b) du RGPD (contrat ou mesures précontractuelles), à défaut art. 6, par. 1, point f) du RGPD (réponse à votre demande).',
        'Les informations sur les allergies, intolérances ou besoins alimentaires (p. ex. diabète) sont des données de santé. Nous ne les traitons que si vous nous les communiquez vous-même, et uniquement pour préparer votre repas en conséquence ; la base juridique est votre consentement explicite (art. 9, par. 2, point a) du RGPD), que vous pouvez retirer à tout moment.',
        'Nous supprimons ces données dès qu’elles ne sont plus nécessaires au traitement de votre demande, sauf obligation légale de conservation (p. ex. pour les factures).',
        'L’assistant de demande de ce site n’enregistre ni ne transmet aucune donnée ; il compose seulement un texte dans votre navigateur. WhatsApp (WhatsApp Ireland Limited) n’est utilisé que si vous choisissez « Envoyer par WhatsApp » ou nous écrivez sur WhatsApp. Les règles de confidentialité de WhatsApp s’appliquent alors ; Meta peut aussi traiter des données aux États-Unis.',
      ],
    },
    ...(o.ratingsOn
      ? [
          {
            h: 'Notation des plats',
            p: [
              'Vous pouvez noter les plats de façon anonyme de 1 à 5 étoiles. Nous enregistrons le plat, le nombre d’étoiles, la date et l’heure ainsi qu’une clé pseudonyme. Aucun nom, adresse e-mail ou compte n’est collecté.',
              'Si vous choisissez « Mémoriser sur cet appareil » (consentement), le cookie « afl_rv » contient un identifiant aléatoire afin que vous puissiez modifier votre note ; seule une clé irréversible dérivée de celui-ci est enregistrée. Sans ce choix, rien n’est enregistré sur votre appareil ; une note compte alors par réseau, plat et jour.',
              'Pour prévenir les abus (p. ex. notes automatisées en masse), votre adresse IP n’est pas enregistrée ; seule une clé irréversible, renouvelée chaque jour, est conservée 30 jours au plus ; les données de limitation des requêtes sont supprimées après 2 jours.',
              `Base juridique : art. 6, par. 1, point f) du RGPD (intérêt légitime à des notes fiables et à l’amélioration de notre carte). Les notes sont enregistrées dans une base de données Neon (région Francfort) ; Neon est certifié au titre du Data Privacy Framework UE-États-Unis.${o.neonDpa ? ' Un contrat de sous-traitance a été conclu avec Neon (art. 28 RGPD).' : ''} Les notes sont conservées pour l’évaluation tant que la fonction existe ; elles ne permettent pas d’identifier une personne.`,
            ],
          },
        ]
      : []),
    {
      h: 'Liens externes',
      p: [
        'Les liens vers Google Maps, les avis Google, Facebook, Instagram, TikTok, YouTube et WhatsApp mènent aux services de ces fournisseurs. Les données ne leur sont transmises qu’au moment où vous cliquez sur un lien ; leurs règles de confidentialité s’appliquent alors.',
      ],
    },
    {
      h: 'Pas de décision automatisée, pas d’obligation de fournir des données',
      p: [
        'Aucune prise de décision automatisée, y compris le profilage, n’a lieu. Vous n’êtes pas obligé(e) de nous fournir des données personnelles ; sans les données de connexion techniquement nécessaires, le site ne peut toutefois pas s’afficher.',
      ],
    },
    {
      h: 'Vos droits',
      p: [
        'Vous disposez d’un droit d’accès (art. 15 RGPD), de rectification (art. 16), d’effacement (art. 17), de limitation du traitement (art. 18) et de portabilité (art. 20). Vous pouvez retirer votre consentement à tout moment pour l’avenir (art. 7, par. 3). Un message aux coordonnées ci-dessus suffit.',
        'Droit d’opposition : lorsque nous traitons des données sur la base de l’art. 6, par. 1, point f) du RGPD, vous pouvez vous y opposer à tout moment pour des raisons tenant à votre situation particulière (art. 21 RGPD).',
        'Vous pouvez introduire une réclamation auprès d’une autorité de contrôle (art. 77 RGPD), par exemple la commissaire à la protection des données et à la liberté d’information de Rhénanie-du-Nord-Westphalie, Kavalleriestraße 2–4, 40213 Düsseldorf, Allemagne.',
      ],
    },
  ],
};

export const privacy: Record<Lang, Copy> = { de, en, fr };
