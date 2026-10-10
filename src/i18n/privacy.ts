/**
 * Privacy policy (Art. 13 DSGVO) — German is binding; EN/FR are courtesy translations.
 * Describes ONLY what this website technically does (verified in code, 2026-10-10):
 * - storage: `afl-lang` (language choice); with ratings enabled: cookie `afl_rv`, local storage
 *   `afl-rated:<dish>`, staff cookie `afl_admin` — see src/components/LanguageSwitcher.astro,
 *   src/lib/ratings/*.
 * - external content only after a click (YouTube via youtube-nocookie.com, Facebook video).
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
        'Wir verwenden keine Analyse-, Tracking- oder Werbedienste. Schriftarten werden von unserem eigenen Server geladen (keine Verbindung zu Google Fonts).',
        'Sprachwahl: Wenn Sie über die Sprachauswahl eine Sprache wählen, speichern wir diese Wahl unter „afl-lang“ im lokalen Speicher Ihres Browsers, damit die Website Sie beim nächsten Besuch in dieser Sprache anzeigt. Beim ersten Aufruf der Startseite liest die Website außerdem die Spracheinstellung Ihres Browsers aus, um Ihnen gegebenenfalls die englische oder französische Fassung zu zeigen; dabei wird nichts gespeichert oder übermittelt. Grundlage ist § 25 Abs. 2 Nr. 2 TDDDG (unbedingt erforderlich für den von Ihnen gewünschten Dienst). Sie können den Eintrag jederzeit in Ihren Browsereinstellungen löschen.',
        ...(o.ratingsOn
          ? [
              'Bewertungen: Nur wenn Sie selbst ein Gericht bewerten, setzen wir das Cookie „afl_rv“ (Laufzeit 12 Monate) und speichern Ihre Sternzahl unter „afl-rated:<Gericht>“ im lokalen Speicher, damit Ihre Bewertung angezeigt wird und Sie sie später ändern können (§ 25 Abs. 2 Nr. 2 TDDDG). Für die Anmeldung von Mitarbeitenden im internen Verwaltungsbereich wird ein Sitzungs-Cookie („afl_admin“, höchstens 8 Stunden) gesetzt.',
            ]
          : []),
        'Weitere Cookies setzen wir nicht. Externe Inhalte (Videos) werden erst nach Ihrem Klick geladen, siehe nächster Abschnitt.',
      ],
    },
    {
      h: 'Videos von YouTube und Facebook (erst nach Klick)',
      p: [
        'Videos werden zunächst nur als Vorschaubild von unserem Server angezeigt. Erst wenn Sie auf „Abspielen“ klicken, wird das Video von YouTube (Google Ireland Limited, über youtube-nocookie.com) bzw. Facebook (Meta Platforms Ireland Limited) geladen. Dabei werden Daten wie Ihre IP-Adresse an den jeweiligen Anbieter übertragen; die Anbieter können Cookies setzen und Daten auch in den USA verarbeiten (Google und Meta sind unter dem EU-US Data Privacy Framework zertifiziert). Rechtsgrundlage ist Ihre Einwilligung durch den Klick (Art. 6 Abs. 1 lit. a DSGVO; § 25 Abs. 1 TDDDG). Ohne Klick findet keine Verbindung statt.',
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
              'Damit jede Person ein Gericht nur einmal bewertet und die eigene Bewertung ändern kann, enthält das Cookie „afl_rv“ eine Zufallskennung; in der Datenbank wird nur ein daraus berechneter, nicht umkehrbarer Schlüssel gespeichert.',
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
        'We use no analytics, tracking or advertising services. Fonts are served from our own server (no connection to Google Fonts).',
        'Language choice: when you choose a language in the language selector, we store that choice as “afl-lang” in your browser’s local storage so the site opens in that language next time. On your first visit to the home page, the site also reads your browser’s language setting to show you the English or French version if appropriate; nothing is stored or transmitted. Legal basis: § 25(2) no. 2 TDDDG (strictly necessary for the service you requested). You can delete the entry at any time in your browser settings.',
        ...(o.ratingsOn
          ? [
              'Ratings: only when you rate a dish yourself do we set the cookie “afl_rv” (12 months) and store your stars as “afl-rated:<dish>” in local storage, so that your rating is shown and you can change it later (§ 25(2) no. 2 TDDDG). Staff logging in to the internal management area receive a session cookie (“afl_admin”, at most 8 hours).',
            ]
          : []),
        'We set no other cookies. External content (videos) is only loaded after you click, see the next section.',
      ],
    },
    {
      h: 'Videos from YouTube and Facebook (only after you click)',
      p: [
        'Videos are first shown only as a preview image from our server. Only when you click “Play” is the video loaded from YouTube (Google Ireland Limited, via youtube-nocookie.com) or Facebook (Meta Platforms Ireland Limited). Data such as your IP address is then transmitted to that provider, which may set cookies and also process data in the USA (Google and Meta are certified under the EU-US Data Privacy Framework). Legal basis: your consent given by clicking (Art. 6(1)(a) GDPR; § 25(1) TDDDG). Without a click, no connection is made.',
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
              'So that each person rates a dish only once and can change their rating, the cookie “afl_rv” contains a random identifier; only an irreversible key derived from it is stored in the database.',
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
        'Nous n’utilisons aucun service d’analyse, de suivi ou de publicité. Les polices sont chargées depuis notre propre serveur (aucune connexion à Google Fonts).',
        'Choix de langue : lorsque vous choisissez une langue dans le sélecteur, nous enregistrons ce choix sous « afl-lang » dans le stockage local de votre navigateur afin que le site s’affiche dans cette langue lors de votre prochaine visite. Lors de votre première visite de la page d’accueil, le site lit en outre la langue de votre navigateur pour vous proposer, le cas échéant, la version anglaise ou française ; rien n’est enregistré ni transmis. Base juridique : § 25, al. 2, n° 2 TDDDG (strictement nécessaire au service demandé). Vous pouvez supprimer cette entrée à tout moment dans les réglages de votre navigateur.',
        ...(o.ratingsOn
          ? [
              'Notes : uniquement si vous notez vous-même un plat, nous déposons le cookie « afl_rv » (12 mois) et enregistrons vos étoiles sous « afl-rated:<plat> » dans le stockage local, afin d’afficher votre note et de vous permettre de la modifier (§ 25, al. 2, n° 2 TDDDG). Le personnel qui se connecte à l’espace de gestion interne reçoit un cookie de session (« afl_admin », 8 heures au maximum).',
            ]
          : []),
        'Nous ne déposons aucun autre cookie. Les contenus externes (vidéos) ne sont chargés qu’après votre clic, voir la section suivante.',
      ],
    },
    {
      h: 'Vidéos YouTube et Facebook (uniquement après un clic)',
      p: [
        'Les vidéos s’affichent d’abord sous forme d’image d’aperçu depuis notre serveur. Ce n’est que lorsque vous cliquez sur « Lire » que la vidéo est chargée depuis YouTube (Google Ireland Limited, via youtube-nocookie.com) ou Facebook (Meta Platforms Ireland Limited). Des données comme votre adresse IP sont alors transmises au fournisseur, qui peut déposer des cookies et traiter des données aux États-Unis (Google et Meta sont certifiés au titre du Data Privacy Framework UE-États-Unis). Base juridique : votre consentement par le clic (art. 6, par. 1, point a) du RGPD ; § 25, al. 1 TDDDG). Sans clic, aucune connexion n’a lieu.',
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
              'Pour que chaque personne ne note un plat qu’une seule fois et puisse modifier sa note, le cookie « afl_rv » contient un identifiant aléatoire ; seule une clé irréversible dérivée de celui-ci est enregistrée dans la base de données.',
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
