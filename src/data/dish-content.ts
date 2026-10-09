/**
 * DISH CONTENT — original Afrolink copy for every current food item (DE / EN / FR).
 *
 * Two kinds of text, never mixed:
 * - `summary`, `typical`, `kind`: how the dish is TRADITIONALLY known in West African / Nigerian
 *   cooking (culinary background, written for guests who do not know the dish). These are NOT
 *   statements about Afrolink's recipe and never name ingredients as "in our dish".
 * - What Afrolink actually serves (description, sides, sizes, price, spice) is NOT written here:
 *   it is generated from src/data/menu.ts (Afrolink's printed menu 2026 + owner statements).
 *
 * Research notes and sources: docs/research/seo-menu-allergen-research-2026-10-09.md. Never copy competitor text.
 * `allergyHint` only flags an ingredient that is TRADITIONALLY typical and allergy-relevant, as a
 * reason to ask — it is never an allergen declaration (see src/data/allergens.ts).
 */
import type { L10n } from '../i18n/config';

export interface DishContent {
  /** Short noun phrase for titles, e.g. "Melon-seed soup". */
  kind: L10n;
  /** 1–2 sentences for the menu card ("About this dish"). */
  summary: L10n;
  /** Cultural background for the dish page. */
  typical: L10n;
  /** Traditionally typical, allergy-relevant ingredient worth asking about. */
  allergyHint?: L10n;
}

export const dishContent: Record<string, DishContent> = {
  // ───────────── Soups ─────────────
  'egusi-soup': {
    kind: { de: 'Westafrikanische Melonenkern-Suppe', en: 'West African melon-seed soup', fr: 'Soupe ouest-africaine aux graines de melon' },
    summary: {
      de: 'Kräftige, nussige Suppe aus gemahlenen Egusi-Kernen, die ihr die typisch körnige Bindung geben. Einer der bekanntesten Klassiker Westafrikas – ideal zum Kennenlernen.',
      en: 'A rich, nutty soup made from ground egusi seeds, which give it its typical grainy body. One of West Africa’s best-known classics – a good place to start.',
      fr: 'Une soupe riche au goût de noisette, à base de graines d’egusi moulues qui lui donnent sa texture granuleuse. Un grand classique d’Afrique de l’Ouest – idéal pour découvrir.',
    },
    typical: {
      de: 'Egusi sind die Kerne einer melonenähnlichen Kürbisfrucht. Gemahlen und in der Suppe gegart, binden sie die Brühe und bilden kleine, weiche Flöckchen. Egusi Soup wird in ganz Nigeria und weiten Teilen Westafrikas gekocht, meist mit Palmöl und Blattgemüse, und mit einer festen Beilage wie Pounded Yam gegessen.',
      en: 'Egusi are the seeds of a melon-like gourd. Ground and cooked into the soup, they thicken the broth and form small, soft curds. Egusi soup is cooked all over Nigeria and much of West Africa, usually with palm oil and leafy greens, and eaten with a firm side such as pounded yam.',
      fr: 'L’egusi désigne les graines d’une cucurbitacée proche du melon. Moulues et cuites dans la soupe, elles l’épaississent et forment de petits flocons tendres. La soupe egusi se prépare dans tout le Nigeria et une grande partie de l’Afrique de l’Ouest, généralement à l’huile de palme et aux légumes-feuilles, et se mange avec un accompagnement ferme comme le pounded yam.',
    },
  },
  'afang-soup': {
    kind: { de: 'Blattgemüse-Suppe aus Südost-Nigeria', en: 'Leafy soup from south-eastern Nigeria', fr: 'Soupe aux feuilles du sud-est du Nigeria' },
    summary: {
      de: 'Eine sehr grüne, gehaltvolle Suppe aus fein geschnittenen Afang-Blättern und Wasserblatt – eine Spezialität der Efik und Ibibio aus dem Südosten Nigerias.',
      en: 'A deep-green, hearty soup of finely shredded afang leaves and waterleaf – a speciality of the Efik and Ibibio people of south-eastern Nigeria.',
      fr: 'Une soupe très verte et généreuse de feuilles d’afang finement émincées et de waterleaf – une spécialité des Efik et des Ibibio du sud-est du Nigeria.',
    },
    typical: {
      de: 'Afang (in anderen Regionen Okazi genannt) ist ein festes, leicht herbes Blatt aus dem Regenwald. Es wird hauchdünn geschnitten oder zerstoßen und mit dem weichen Wasserblatt gegart; so entsteht eine dichte, kräutrige Suppe. Afang Soup stammt aus den Bundesstaaten Akwa Ibom und Cross River.',
      en: 'Afang (called okazi in other regions) is a firm, slightly tart forest leaf. It is sliced paper-thin or pounded and cooked with soft waterleaf, giving a dense, herbal soup. Afang soup comes from Akwa Ibom and Cross River States.',
      fr: 'L’afang (appelé okazi dans d’autres régions) est une feuille de forêt ferme et légèrement acidulée. Émincée très finement ou pilée, elle cuit avec le waterleaf, plus tendre, pour donner une soupe dense et herbacée. La soupe afang vient des États d’Akwa Ibom et de Cross River.',
    },
  },
  edikaikong: {
    kind: { de: 'Gemüsesuppe der Efik', en: 'Efik vegetable soup', fr: 'Soupe de légumes efik' },
    summary: {
      de: 'Edikaikong (auch Edikang Ikong) ist eine üppige Gemüsesuppe aus Kürbisblättern und Wasserblatt – viel Grün, wenig Flüssigkeit, kräftig im Geschmack.',
      en: 'Edikaikong (also Edikang Ikong) is a generous vegetable soup of pumpkin leaves and waterleaf – lots of greens, little broth, full of flavour.',
      fr: 'L’edikaikong (ou edikang ikong) est une soupe de légumes généreuse aux feuilles de citrouille et au waterleaf – beaucoup de vert, peu de bouillon, beaucoup de goût.',
    },
    typical: {
      de: 'Der Name kommt aus der Sprache der Efik in Calabar und bedeutet sinngemäß „Gemüse“. Die Suppe besteht überwiegend aus den Blättern des Riesenkürbisses (Ugu) und Wasserblatt, die nur kurz mitgaren und so ihre Farbe behalten. Entsprechend reich an Blattgemüse ist sie.',
      en: 'The name comes from the Efik language of Calabar and roughly means “vegetables”. The soup is mostly fluted-pumpkin leaves (ugu) and waterleaf, cooked only briefly so they keep their colour. It is correspondingly rich in leafy greens.',
      fr: 'Le nom vient de la langue efik de Calabar et signifie à peu près « légumes ». La soupe se compose surtout de feuilles de courge cannelée (ugu) et de waterleaf, à peine cuites pour garder leur couleur. Elle est donc très riche en légumes-feuilles.',
    },
  },
  'ogbono-soup': {
    kind: { de: 'Suppe aus wilden Mangokernen', en: 'Wild-mango-seed soup', fr: 'Soupe aux graines de mangue sauvage' },
    summary: {
      de: 'Gemahlene Ogbono-Kerne geben dieser Suppe ihre besondere, leicht ziehende Konsistenz und einen erdigen Geschmack. Perfekt zum Tunken mit Pounded Yam oder Garri.',
      en: 'Ground ogbono seeds give this soup its distinctive, slightly stretchy texture and an earthy flavour. Made for dipping pounded yam or garri.',
      fr: 'Les graines d’ogbono moulues donnent à cette soupe sa texture un peu filante et son goût terreux. Parfaite pour y tremper le pounded yam ou le garri.',
    },
    typical: {
      de: 'Ogbono sind die Kerne der afrikanischen Wildmango. Gemahlen und gekocht machen sie die Suppe sämig und „ziehend“ – in Nigeria nennt man solche Suppen „draw soup“. Die Konsistenz ist ungewohnt für viele Gäste, aber genau das schätzen Fans: Die Suppe haftet gut an der festen Beilage.',
      en: 'Ogbono are the kernels of the African wild mango. Ground and cooked, they make the soup smooth and stretchy – in Nigeria this is called a “draw soup”. The texture is unfamiliar to many guests, but fans love it: the soup clings nicely to the swallow.',
      fr: 'L’ogbono est l’amande de la mangue sauvage africaine. Moulue et cuite, elle rend la soupe onctueuse et filante – au Nigeria, on parle de « draw soup ». Cette texture surprend souvent, mais les amateurs l’adorent : la soupe enrobe bien l’accompagnement.',
    },
  },
  'ofe-nsala': {
    kind: { de: 'Igbo-„White Soup“', en: 'Igbo “white soup”', fr: '« Soupe blanche » igbo' },
    summary: {
      de: 'Die „weiße Suppe“ der Igbo: ohne die typische rote Palmölfarbe, dafür pfeffrig und aromatisch – traditionell mit Wels zubereitet.',
      en: 'The Igbo “white soup”: without the usual red palm-oil colour, but peppery and aromatic – traditionally made with catfish.',
      fr: 'La « soupe blanche » des Igbo : sans la couleur rouge habituelle de l’huile de palme, mais poivrée et parfumée – traditionnellement au poisson-chat.',
    },
    typical: {
      de: 'Ofe Nsala stammt aus dem Südosten Nigerias. Die helle Brühe wird traditionell mit etwas zerstoßenem Yam gebunden und mit würzigen Kräutern wie Utazi und Uziza aromatisiert. Traditionell kommt sie ohne Palmöl aus und schmeckt leicht und cremig.',
      en: 'Ofe nsala comes from south-eastern Nigeria. The pale broth is traditionally thickened with a little pounded yam and flavoured with pungent herbs such as utazi and uziza. Traditionally it is made without palm oil and tastes light and creamy.',
      fr: 'L’ofe nsala vient du sud-est du Nigeria. Le bouillon clair est traditionnellement lié avec un peu d’igname pilée et parfumé d’herbes piquantes comme l’utazi et l’uziza. Traditionnellement préparée sans huile de palme, elle est légère et crémeuse.',
    },
  },
  'okra-soup': {
    kind: { de: 'Okra-Suppe', en: 'Okra soup', fr: 'Soupe de gombo' },
    summary: {
      de: 'Frische Okraschoten machen diese Suppe leicht sämig und angenehm frisch. Ein Alltagsklassiker in ganz Westafrika.',
      en: 'Fresh okra makes this soup lightly silky and pleasantly fresh. An everyday classic across West Africa.',
      fr: 'Le gombo frais rend cette soupe légèrement onctueuse et rafraîchissante. Un classique du quotidien dans toute l’Afrique de l’Ouest.',
    },
    typical: {
      de: 'Okra (Gombo) wird klein geschnitten oder gerieben; beim Garen gibt sie eine natürliche Bindung ab, ähnlich wie Ogbono. Okrasuppe ist schnell zubereitet und wird in Nigeria, Ghana und vielen Nachbarländern gegessen – oft mit Palmöl, Fisch und Fleisch.',
      en: 'Okra is chopped or grated; as it cooks it releases a natural thickness, much like ogbono. Okra soup is quick to make and is eaten in Nigeria, Ghana and many neighbouring countries – often with palm oil, fish and meat.',
      fr: 'Le gombo est haché ou râpé ; à la cuisson, il libère une liaison naturelle, un peu comme l’ogbono. Rapide à préparer, la soupe de gombo se mange au Nigeria, au Ghana et dans de nombreux pays voisins – souvent avec de l’huile de palme, du poisson et de la viande.',
    },
  },
  'banga-soup': {
    kind: { de: 'Palmnuss-Suppe aus dem Nigerdelta', en: 'Palm-nut soup from the Niger Delta', fr: 'Soupe de noix de palme du delta du Niger' },
    summary: {
      de: 'Banga wird aus dem Fruchtfleisch frischer Palmnüsse gekocht – orange-rot, vollmundig und duftend. Eine Spezialität der Urhobo und Isoko aus dem Nigerdelta.',
      en: 'Banga is cooked from the pulp of fresh palm fruit – orange-red, full-bodied and fragrant. A speciality of the Urhobo and Isoko people of the Niger Delta.',
      fr: 'La banga se prépare avec la pulpe de noix de palme fraîches – rouge orangé, onctueuse et parfumée. Une spécialité des Urhobo et des Isoko du delta du Niger.',
    },
    typical: {
      de: 'Für Banga werden Palmfrüchte gekocht und ausgepresst; der cremige Saft ist die Basis der Suppe. Typisch sind aromatische Gewürze und Blätter. Im Unterschied zu vielen anderen Suppen steht hier das Palmfrucht-Aroma selbst im Mittelpunkt.',
      en: 'For banga, palm fruits are boiled and pressed; the creamy extract is the base of the soup. Aromatic spices and leaves are typical. Unlike many other soups, the flavour of the palm fruit itself takes centre stage.',
      fr: 'Pour la banga, les fruits du palmier sont bouillis puis pressés ; leur jus crémeux forme la base de la soupe. Des épices et des feuilles aromatiques sont typiques. Contrairement à beaucoup d’autres soupes, c’est le goût du fruit du palmier lui-même qui domine.',
    },
  },
  'efo-riro': {
    kind: { de: 'Yoruba-Spinateintopf', en: 'Yoruba spinach stew', fr: 'Ragoût d’épinards yoruba' },
    summary: {
      de: 'Ein kräftiger Blattgemüse-Eintopf aus der Yoruba-Küche, mit Paprika und Chili geschmort – „Efo Riro“ heißt etwa „gerührtes Gemüse“.',
      en: 'A rich leafy-vegetable stew from Yoruba cooking, braised with peppers and chilli – “efo riro” roughly means “stirred vegetables”.',
      fr: 'Un ragoût de légumes-feuilles corsé de la cuisine yoruba, mijoté avec poivrons et piment – « efo riro » signifie à peu près « légumes remués ».',
    },
    typical: {
      de: 'Efo Riro kommt aus dem Südwesten Nigerias. Grundlage ist eine Sauce aus pürierten Paprika, Tomaten, Chili und Zwiebeln, in die reichlich Blattgemüse gerührt wird. Das Ergebnis ist eher ein dicker Eintopf als eine Suppe – sehr aromatisch und farbintensiv.',
      en: 'Efo riro comes from south-western Nigeria. It starts with a sauce of blended peppers, tomatoes, chilli and onions, into which plenty of leafy greens are stirred. The result is more a thick stew than a soup – very aromatic and colourful.',
      fr: 'L’efo riro vient du sud-ouest du Nigeria. On part d’une sauce de poivrons, tomates, piment et oignons mixés, dans laquelle on incorpore beaucoup de légumes-feuilles. Le résultat tient plus du ragoût épais que de la soupe – très parfumé et coloré.',
    },
  },
  'bitterleaf-soup': {
    kind: { de: 'Igbo-Bitterblattsuppe', en: 'Igbo bitterleaf soup', fr: 'Soupe igbo aux feuilles amères' },
    summary: {
      de: 'Ofe Onugbu, die Bitterblattsuppe der Igbo: gewaschene Bitterblätter geben ihr eine feine, angenehm herbe Note.',
      en: 'Ofe onugbu, the Igbo bitterleaf soup: washed bitterleaf gives it a subtle, pleasantly bitter note.',
      fr: 'L’ofe onugbu, soupe igbo aux feuilles amères : les feuilles lavées lui donnent une légère amertume agréable.',
    },
    typical: {
      de: 'Bitterblätter werden vor dem Kochen gründlich ausgewaschen, damit nur noch ein Hauch Bitterkeit bleibt. Die Suppe ist ein Klassiker im Südosten Nigerias und wird je nach Variante oft mit Cocoyam (Taro) gebunden. Wer herbe Aromen mag, wird sie lieben.',
      en: 'The bitter leaves are washed thoroughly before cooking so that only a hint of bitterness remains. The soup is a classic of south-eastern Nigeria and, depending on the variant, is often thickened with cocoyam (taro). If you like bitter flavours, you will love it.',
      fr: 'Les feuilles amères sont soigneusement lavées avant la cuisson pour n’en garder qu’une pointe d’amertume. Classique du sud-est du Nigeria, la soupe est souvent liée au macabo (taro), selon les variantes. Si vous aimez les saveurs amères, elle est faite pour vous.',
    },
  },
  'fishermans-soup': {
    kind: { de: 'Fisch- und Meeresfrüchtesuppe', en: 'Fish and seafood soup', fr: 'Soupe de poisson et fruits de mer' },
    summary: {
      de: 'Eine Suppe aus der Küstenküche des Nigerdeltas, ganz auf Fisch und Meeresfrüchte ausgerichtet. Bei uns nur auf Vorbestellung.',
      en: 'A soup from the coastal cooking of the Niger Delta, built around fish and seafood. Available on request only.',
      fr: 'Une soupe de la cuisine côtière du delta du Niger, centrée sur le poisson et les fruits de mer. Sur commande uniquement.',
    },
    typical: {
      de: 'Fisherman’s Soup ist in den Küstenregionen Nigerias zu Hause, etwa in Rivers State. Traditionell kommt frischer Fisch mit verschiedenen Meeresfrüchten in eine pfeffrige, leicht gebundene Brühe. Weil die Zutaten frisch eingekauft werden, bereiten wir sie nur nach Vorbestellung zu.',
      en: 'Fisherman’s soup is at home in Nigeria’s coastal regions, such as Rivers State. Traditionally, fresh fish and a variety of seafood go into a peppery, lightly thickened broth. Because the ingredients are bought fresh, we only prepare it on request.',
      fr: 'La fisherman’s soup est originaire des régions côtières du Nigeria, comme l’État de Rivers. Traditionnellement, du poisson frais et divers fruits de mer cuisent dans un bouillon poivré, légèrement lié. Les ingrédients étant achetés frais, nous la préparons uniquement sur commande.',
    },
  },
  'black-soup': {
    kind: { de: 'Kräutersuppe aus Edo', en: 'Herb soup from Edo', fr: 'Soupe aux herbes de l’Edo' },
    summary: {
      de: 'Black Soup (Omoebe) aus Benin City verdankt ihre dunkle Farbe einer Mischung pürierter Kräuterblätter – sehr aromatisch und würzig.',
      en: 'Black soup (omoebe) from Benin City owes its dark colour to a blend of puréed herb leaves – very aromatic and savoury.',
      fr: 'La black soup (omoebe) de Benin City doit sa couleur sombre à un mélange de feuilles d’herbes mixées – très parfumée et relevée.',
    },
    typical: {
      de: 'Die Suppe der Edo im Süden Nigerias wird traditionell aus einer Mischung von Blättern wie Duftblatt (Scent Leaf), Bitterblatt und Uziza gemacht, die fein püriert werden. So entsteht die fast schwarze Farbe. Sie ist würzig und kräutrig, ohne schwer zu sein.',
      en: 'This soup of the Edo people of southern Nigeria is traditionally made from a blend of leaves such as scent leaf, bitterleaf and uziza, puréed finely. That is what gives it its almost black colour. It is savoury and herbal without being heavy.',
      fr: 'Cette soupe du peuple edo, au sud du Nigeria, se prépare traditionnellement avec un mélange de feuilles – feuille parfumée, feuille amère, uziza – finement mixées. D’où sa couleur presque noire. Elle est relevée et herbacée sans être lourde.',
    },
  },
  'oha-soup': {
    kind: { de: 'Igbo-Suppe mit Oha-Blättern', en: 'Igbo soup with oha leaves', fr: 'Soupe igbo aux feuilles d’oha' },
    summary: {
      de: 'Zarte Oha-Blätter machen diese Igbo-Suppe mild-aromatisch und besonders. Für viele ein Geschmack von Zuhause.',
      en: 'Tender oha leaves make this Igbo soup mildly aromatic and special. For many, it is a taste of home.',
      fr: 'Les tendres feuilles d’oha rendent cette soupe igbo délicatement parfumée. Pour beaucoup, c’est un goût de la maison.',
    },
    typical: {
      de: 'Oha (auch Ora) ist ein Baum, dessen junge Blätter von Hand gezupft und in die Suppe gegeben werden. Traditionell wird Ofe Oha mit Cocoyam gebunden. Die Suppe stammt aus dem Südosten Nigerias und ist in der Igbo-Küche sehr geschätzt.',
      en: 'Oha (also ora) is a tree whose young leaves are torn by hand and added to the soup. Ofe oha is traditionally thickened with cocoyam. The soup comes from south-eastern Nigeria and is much loved in Igbo cooking.',
      fr: 'L’oha (ou ora) est un arbre dont les jeunes feuilles sont déchirées à la main et ajoutées à la soupe. L’ofe oha est traditionnellement lié au macabo. Originaire du sud-est du Nigeria, elle est très appréciée dans la cuisine igbo.',
    },
  },

  // ───────────── Rice ─────────────
  'fried-rice': {
    kind: { de: 'Nigerianischer Fried Rice', en: 'Nigerian fried rice', fr: 'Riz sauté nigérian' },
    summary: {
      de: 'Nigerianischer Fried Rice: locker gebratener, würzig-goldener Reis mit buntem Gemüse – ein fester Bestandteil jeder Feier.',
      en: 'Nigerian fried rice: fluffy, savoury golden rice with colourful vegetables – a fixture at every celebration.',
      fr: 'Le riz sauté nigérian : un riz doré, savoureux et léger avec des légumes colorés – incontournable de toutes les fêtes.',
    },
    typical: {
      de: 'Anders als asiatischer gebratener Reis wird der nigerianische Fried Rice meist in Brühe vorgegart, dann mit Gemüse wie Karotten, Erbsen und grünen Bohnen gebraten und oft mit Currypulver gewürzt, das ihm die goldene Farbe gibt. Er wird gern zusammen mit Jollof Rice serviert.',
      en: 'Unlike Asian fried rice, Nigerian fried rice is usually par-cooked in stock, then fried with vegetables such as carrots, peas and green beans and often seasoned with curry powder, which gives it its golden colour. It is often served alongside jollof rice.',
      fr: 'Contrairement au riz sauté asiatique, le riz sauté nigérian est généralement précuit dans un bouillon, puis sauté avec des légumes comme carottes, petits pois et haricots verts, et souvent assaisonné de curry, d’où sa couleur dorée. On le sert volontiers avec le riz jollof.',
    },
  },
  'jollof-rice': {
    kind: { de: 'Westafrikanischer Tomatenreis', en: 'West African tomato rice', fr: 'Riz ouest-africain à la tomate' },
    summary: {
      de: 'Der berühmteste Reis Westafrikas: im Topf mit einer Basis aus Tomaten, Paprika und Zwiebeln gegart, bis jedes Korn das Aroma aufgenommen hat.',
      en: 'West Africa’s most famous rice: cooked in one pot in a base of tomatoes, peppers and onions until every grain has soaked up the flavour.',
      fr: 'Le riz le plus célèbre d’Afrique de l’Ouest : cuit dans une seule marmite avec une base de tomates, poivrons et oignons jusqu’à ce que chaque grain en soit imprégné.',
    },
    typical: {
      de: 'Jollof Rice ist auf keiner Feier in Nigeria, Ghana oder dem Senegal wegzudenken – welches Land das beste Jollof kocht, ist ein beliebter Streit. Der Name geht auf das historische Wolof-Reich „Jolof“ im heutigen Senegal zurück. Der Reis gart direkt in der Sauce und bekommt so seine kräftige rot-orange Farbe.',
      en: 'Jollof rice is a must at every celebration in Nigeria, Ghana and Senegal – and which country makes the best jollof is a much-loved argument. The name goes back to the historic Wolof empire of “Jolof” in today’s Senegal. The rice cooks directly in the sauce, which gives it its deep red-orange colour.',
      fr: 'Le riz jollof est incontournable dans toutes les fêtes au Nigeria, au Ghana et au Sénégal – et savoir quel pays fait le meilleur jollof est un débat très apprécié. Son nom vient de l’ancien empire wolof du « Djolof », dans l’actuel Sénégal. Le riz cuit directement dans la sauce, d’où sa couleur rouge orangé.',
    },
  },
  'white-rice': {
    kind: { de: 'Reis mit Eintopf oder Pepper Soup', en: 'Rice with stew or pepper soup', fr: 'Riz avec ragoût ou pepper soup' },
    summary: {
      de: 'Schlichter weißer Reis, der von der Beilage lebt: mit einem kräftigen Tomaten-Paprika-Eintopf oder mit scharfer Pepper Soup.',
      en: 'Simple white rice that comes alive with what you pair it with: a rich tomato-and-pepper stew or a fiery pepper soup.',
      fr: 'Un riz blanc tout simple qui prend vie avec son accompagnement : un ragoût riche de tomates et poivrons ou une pepper soup bien relevée.',
    },
    typical: {
      de: 'In Nigeria ist „Rice and Stew“ ein Alltagsgericht: Reis mit einem lange geschmorten Eintopf aus Tomaten, Paprika, Zwiebeln und Fleisch oder Fisch. Wer es schärfer mag, nimmt stattdessen Pepper Soup dazu.',
      en: 'In Nigeria, “rice and stew” is an everyday favourite: rice with a slow-cooked stew of tomatoes, peppers, onions and meat or fish. If you like more heat, pair it with pepper soup instead.',
      fr: 'Au Nigeria, le « rice and stew » est un plat du quotidien : du riz avec un ragoût longuement mijoté de tomates, poivrons, oignons et viande ou poisson. Pour plus de piquant, on l’accompagne plutôt de pepper soup.',
    },
  },
  'coconut-rice': {
    kind: { de: 'Reis mit Kokosmilch', en: 'Rice cooked in coconut milk', fr: 'Riz à la noix de coco' },
    summary: {
      de: 'Reis, der in Kokosmilch gegart wird – cremig-duftend mit einer feinen, natürlichen Süße. Eine mildere Alternative zu Jollof.',
      en: 'Rice cooked in coconut milk – creamy and fragrant with a gentle natural sweetness. A milder alternative to jollof.',
      fr: 'Un riz cuit au lait de coco – crémeux, parfumé, d’une douceur naturelle. Une alternative plus douce au jollof.',
    },
    typical: {
      de: 'Coconut Rice ist in den Küstenregionen Westafrikas verbreitet. Statt in Wasser oder Brühe gart der Reis in Kokosmilch und wird meist mit Paprika, Zwiebeln und Gewürzen ergänzt. Er passt gut zu Fleisch oder Fisch.',
      en: 'Coconut rice is popular along the West African coast. Instead of water or stock, the rice cooks in coconut milk and is usually finished with peppers, onions and spices. It goes well with meat or fish.',
      fr: 'Le riz coco est répandu sur les côtes d’Afrique de l’Ouest. Au lieu de l’eau ou du bouillon, le riz cuit dans du lait de coco et se complète généralement de poivrons, d’oignons et d’épices. Il accompagne bien la viande ou le poisson.',
    },
  },

  // ───────────── Beans, yam & plantain ─────────────
  'beans-plantain': {
    kind: { de: 'Bohnen mit Kochbananen', en: 'Beans with plantain', fr: 'Haricots et banane plantain' },
    summary: {
      de: 'Weich geschmorte Bohnen in Palmölsauce mit gebratenen reifen Kochbananen – herzhaft und süß zugleich. In Nigeria als „Beans and Dodo“ bekannt.',
      en: 'Slow-cooked beans in palm-oil sauce with fried ripe plantain – savoury and sweet at once. Known in Nigeria as “beans and dodo”.',
      fr: 'Des haricots mijotés en sauce à l’huile de palme avec de la banane plantain mûre frite – à la fois salé et sucré. Au Nigeria, on dit « beans and dodo ».',
    },
    typical: {
      de: 'Für dieses Gericht werden Bohnen – oft Augenbohnen oder die süßlichen „Honey Beans“ – so lange gekocht, bis sie fast cremig zerfallen, und dann in einer Sauce aus Palmöl, Zwiebeln und Chili fertig gegart. Dazu gehört Dodo: in Scheiben frittierte, reife Kochbananen.',
      en: 'For this dish, beans – often black-eyed peas or the sweetish “honey beans” – are cooked until almost creamy, then finished in a sauce of palm oil, onions and chilli. It comes with dodo: slices of fried ripe plantain.',
      fr: 'Pour ce plat, les haricots – souvent des cornilles ou les « honey beans » légèrement sucrés – cuisent jusqu’à devenir presque crémeux, puis mijotent dans une sauce à l’huile de palme, oignons et piment. On les sert avec du dodo : des tranches de banane plantain mûre frites.',
    },
  },
  'porridge-yam': {
    kind: { de: 'Yam-Eintopf (Asaro)', en: 'Yam pottage (asaro)', fr: 'Ragoût d’igname (asaro)' },
    summary: {
      de: 'Yamswürfel, in würziger Palmölsauce gegart, bis sie teils zerfallen und einen sämigen Eintopf bilden – deftiges Soulfood.',
      en: 'Yam chunks cooked in a spiced palm-oil sauce until some of them break down into a thick pottage – hearty comfort food.',
      fr: 'Des cubes d’igname cuits dans une sauce épicée à l’huile de palme jusqu’à se défaire en partie en un ragoût épais – un plat réconfortant.',
    },
    typical: {
      de: 'Porridge Yam, bei den Yoruba „Asaro“, ist ein klassisches Hausgericht. Die Yamstücke kochen direkt in einer Sauce aus Paprika, Chili, Zwiebeln und Palmöl; ein Teil wird zerdrückt und bindet den Eintopf. Häufig kommen Blattgemüse dazu.',
      en: 'Porridge yam – “asaro” in Yoruba – is a classic home-cooked dish. The yam pieces cook directly in a sauce of peppers, chilli, onions and palm oil; some are mashed to thicken the pottage. Leafy greens are often added.',
      fr: 'Le porridge yam – « asaro » en yoruba – est un grand classique de la cuisine familiale. Les morceaux d’igname cuisent directement dans une sauce de poivrons, piment, oignons et huile de palme ; une partie est écrasée pour lier le ragoût. On y ajoute souvent des légumes-feuilles.',
    },
  },
  'fried-yam-egg-sauce': {
    kind: { de: 'Gebratener Yam mit Ei-Sauce', en: 'Fried yam with egg sauce', fr: 'Igname frite et sauce aux œufs' },
    summary: {
      de: 'Goldbraun gebratene Yamstücke mit einer Sauce aus Ei, Tomaten und Paprika – außen knusprig, innen weich.',
      en: 'Golden fried yam pieces with a sauce of egg, tomatoes and peppers – crisp outside, soft inside.',
      fr: 'Des morceaux d’igname frits bien dorés avec une sauce aux œufs, tomates et poivrons – croustillants dehors, fondants dedans.',
    },
    typical: {
      de: 'Yam ist eine stärkehaltige Knolle, fester und weniger süß als Süßkartoffel. In Nigeria sind frittierte Yamstücke mit „Egg Sauce“ – Rührei in einer Tomaten-Paprika-Sauce – ein beliebtes Frühstück und ein typisches Gericht für jede Tageszeit.',
      en: 'Yam is a starchy tuber, firmer and less sweet than sweet potato. In Nigeria, fried yam with “egg sauce” – scrambled egg in a tomato-and-pepper sauce – is a popular breakfast and a favourite at any time of day.',
      fr: 'L’igname est un tubercule riche en amidon, plus ferme et moins sucré que la patate douce. Au Nigeria, l’igname frite avec « egg sauce » – des œufs brouillés dans une sauce tomate-poivron – est un petit-déjeuner apprécié, et se mange à toute heure.',
    },
  },
  'assorted-plate': {
    kind: { de: 'Gemischtes Fleisch mit Yam oder Kochbanane', en: 'Mixed meats with yam or plantain', fr: 'Viandes assorties avec igname ou banane plantain' },
    summary: {
      de: 'Ein Teller mit gemischtem Fleisch, dazu nach Wahl Yam oder Kochbananen – für alle, die von allem etwas probieren möchten.',
      en: 'A plate of mixed meats with your choice of yam or plantain – for anyone who wants to try a little of everything.',
      fr: 'Une assiette de viandes assorties, avec au choix de l’igname ou de la banane plantain – pour goûter un peu de tout.',
    },
    typical: {
      de: '„Assorted“ bedeutet in der nigerianischen Küche eine Mischung aus verschiedenen Fleischsorten und Teilstücken. Welche Sorten heute im Topf sind, sagen wir Ihnen gern vor der Bestellung.',
      en: 'In Nigerian cooking, “assorted” means a mix of different meats and cuts. We are happy to tell you which ones are in the pot today before you order.',
      fr: 'Dans la cuisine nigériane, « assorted » désigne un mélange de différentes viandes et morceaux. Nous vous disons volontiers lesquels sont au menu aujourd’hui avant votre commande.',
    },
  },

  // ───────────── Specialities ─────────────
  suya: {
    kind: { de: 'Gegrillte Fleischspieße', en: 'Grilled meat skewers', fr: 'Brochettes de viande grillées' },
    summary: {
      de: 'Suya ist das berühmte Street Food aus Nordnigeria: dünne, würzig marinierte Fleischstücke vom Grill, serviert mit Zwiebeln und Tomaten.',
      en: 'Suya is the famous street food of northern Nigeria: thin, spice-crusted pieces of meat from the grill, served with onion and tomato.',
      fr: 'Le suya est le célèbre street food du nord du Nigeria : de fines tranches de viande épicées grillées, servies avec oignon et tomate.',
    },
    typical: {
      de: 'Suya stammt aus der Küche der Hausa. Das Fleisch wird dünn geschnitten, mit der Gewürzmischung „Yaji“ eingerieben und über offener Flamme gegrillt. Yaji besteht traditionell aus Chili, Ingwer, weiteren Gewürzen und gemahlenen Erdnüssen. Suya ist abends an Straßenständen in ganz Nigeria zu finden.',
      en: 'Suya comes from Hausa cooking. The meat is sliced thin, rubbed with the spice mix “yaji” and grilled over an open flame. Yaji is traditionally made from chilli, ginger, other spices and ground peanuts. In the evening you will find suya stands all over Nigeria.',
      fr: 'Le suya vient de la cuisine haoussa. La viande est tranchée finement, frottée avec le mélange d’épices « yaji » et grillée sur la flamme. Le yaji se compose traditionnellement de piment, de gingembre, d’autres épices et d’arachides moulues. Le soir, on trouve des stands de suya dans tout le Nigeria.',
    },
    allergyHint: {
      de: 'Traditionelle Suya-Gewürzmischungen enthalten meist Erdnüsse. Bei einer Erdnussallergie fragen Sie bitte vor der Bestellung nach unserer Zubereitung.',
      en: 'Traditional suya spice mixes usually contain peanuts. If you have a peanut allergy, please ask about our preparation before ordering.',
      fr: 'Les mélanges d’épices traditionnels pour le suya contiennent généralement des arachides. En cas d’allergie aux arachides, renseignez-vous sur notre préparation avant de commander.',
    },
  },
  'pepper-soup': {
    kind: { de: 'Scharfe Ziegenfleisch-Suppe', en: 'Spicy goat-meat soup', fr: 'Soupe épicée à la chèvre' },
    summary: {
      de: 'Eine klare, sehr scharfe Brühe mit Ziegenfleisch und aromatischen Pepper-Soup-Gewürzen – wärmend und intensiv.',
      en: 'A clear, very spicy broth with goat meat and aromatic pepper-soup spices – warming and intense.',
      fr: 'Un bouillon clair et très relevé à la viande de chèvre et aux épices de pepper soup – réconfortant et intense.',
    },
    typical: {
      de: 'Pepper Soup ist in Nigeria die Suppe für kalte Abende, gesellige Runden und Genesung. Ihre Würze kommt aus einer speziellen Mischung westafrikanischer Gewürze wie Calabash-Muskat und Paradieskörnern, dazu frische Kräuter. Sie ist dünnflüssig und wird nicht mit einer festen Beilage getunkt.',
      en: 'In Nigeria, pepper soup is the soup for cool evenings, get-togethers and getting back on your feet. Its flavour comes from a special blend of West African spices such as calabash nutmeg and grains of paradise, plus fresh herbs. It is a thin broth, not a soup for dipping swallow.',
      fr: 'Au Nigeria, la pepper soup est la soupe des soirées fraîches, des moments entre amis et des convalescences. Son goût vient d’un mélange d’épices ouest-africaines comme la noix de muscade de calebasse et la maniguette, avec des herbes fraîches. C’est un bouillon léger, pas une soupe pour accompagnement ferme.',
    },
  },
  stockfish: {
    kind: { de: 'Getrockneter Kabeljau', en: 'Dried cod', fr: 'Morue séchée' },
    summary: {
      de: 'Stockfisch – luftgetrockneter Kabeljau – hat in der nigerianischen Küche eine lange Tradition. Fest im Biss und sehr intensiv im Geschmack.',
      en: 'Stockfish – air-dried cod – has a long tradition in Nigerian cooking. Firm in texture and very intense in flavour.',
      fr: 'Le stockfisch – morue séchée à l’air – a une longue tradition dans la cuisine nigériane. Ferme sous la dent, au goût très intense.',
    },
    typical: {
      de: 'Stockfisch kommt aus Norwegen und ist in Nigeria – auf Igbo „Okporoko“ – vor allem seit den späten 1960er-Jahren weit verbreitet. Er wird vor dem Kochen lange eingeweicht und dann meist in einer würzigen Sauce oder in Suppen gegart. Wie wir ihn aktuell zubereiten, sagen wir Ihnen gern.',
      en: 'Stockfish comes from Norway and has been widely used in Nigeria – where the Igbo call it “okporoko” – especially since the late 1960s. It is soaked for a long time before cooking and then usually cooked in a spicy sauce or in soups. Ask us how we are preparing it at the moment.',
      fr: 'Le stockfisch vient de Norvège et s’est largement répandu au Nigeria – « okporoko » en igbo – surtout depuis la fin des années 1960. Il est longuement trempé avant cuisson, puis cuit le plus souvent dans une sauce relevée ou dans des soupes. Demandez-nous comment nous le préparons en ce moment.',
    },
  },
  snail: {
    kind: { de: 'Afrikanische Riesenschnecke', en: 'African giant land snail', fr: 'Escargot géant africain' },
    summary: {
      de: 'Afrikanische Riesenschnecke – in Westafrika eine geschätzte Delikatesse mit festem, leicht bissfestem Fleisch.',
      en: 'The African giant land snail – a prized delicacy in West Africa with firm, slightly chewy meat.',
      fr: 'L’escargot géant africain – un mets très apprécié en Afrique de l’Ouest, à la chair ferme et légèrement élastique.',
    },
    typical: {
      de: 'Die großen Landschnecken (auf Yoruba „Igbin“) gelten in Nigeria als Delikatesse. Sie werden gründlich gereinigt, vorgegart und anschließend gewürzt gegrillt oder in pfeffriger Sauce zubereitet. Ihr Fleisch ist kräftig und angenehm fest.',
      en: 'The large land snails (“igbin” in Yoruba) are considered a delicacy in Nigeria. They are cleaned thoroughly, pre-cooked and then grilled with spices or cooked in a peppery sauce. The meat is rich and pleasantly firm.',
      fr: 'Les gros escargots terrestres (« igbin » en yoruba) sont un mets recherché au Nigeria. Soigneusement nettoyés et précuits, ils sont ensuite grillés aux épices ou cuisinés en sauce poivrée. Leur chair est savoureuse et agréablement ferme.',
    },
  },
  okpa: {
    kind: { de: 'Gedämpfter Bambara-Nuss-Kuchen', en: 'Steamed Bambara-nut pudding', fr: 'Gâteau vapeur de pois bambara' },
    summary: {
      de: 'Okpa ist ein herzhafter, gedämpfter „Kuchen“ aus Bambara-Nuss-Mehl und Palmöl – sättigend, würzig und typisch für Enugu.',
      en: 'Okpa is a savoury steamed pudding of Bambara-nut flour and palm oil – filling, spiced and typical of Enugu.',
      fr: 'L’okpa est un gâteau salé cuit à la vapeur, à base de farine de pois bambara et d’huile de palme – nourrissant, épicé et typique d’Enugu.',
    },
    typical: {
      de: 'Okpa stammt aus dem Igbo-Land, besonders aus Enugu und Nsukka, wo es gern zum Frühstück gegessen wird. Das Mehl der Bambara-Erdnuss – einer Hülsenfrucht – wird mit Palmöl, Chili und Gewürzen zu einem Teig verrührt und traditionell in Blättern oder Förmchen gedämpft.',
      en: 'Okpa comes from Igboland, especially Enugu and Nsukka, where it is a popular breakfast. Flour from the Bambara groundnut – a legume – is mixed with palm oil, chilli and spices into a batter and traditionally steamed in leaves or moulds.',
      fr: 'L’okpa vient du pays igbo, notamment d’Enugu et de Nsukka, où on le mange volontiers au petit-déjeuner. La farine de pois bambara – une légumineuse – est mélangée à l’huile de palme, au piment et aux épices, puis cuite à la vapeur, traditionnellement dans des feuilles ou des moules.',
    },
  },
  abacha: {
    kind: { de: 'Afrikanischer Maniok-Salat', en: 'African cassava salad', fr: 'Salade africaine de manioc' },
    summary: {
      de: 'Abacha, der „African Salad“ der Igbo: feine Streifen getrockneter Maniok in einem würzigen Palmöl-Dressing – leicht knackig und voller Aroma.',
      en: 'Abacha, the Igbo “African salad”: fine strips of dried cassava in a spiced palm-oil dressing – slightly chewy and full of flavour.',
      fr: 'L’abacha, la « salade africaine » des Igbo : de fines lamelles de manioc séché dans un assaisonnement épicé à l’huile de palme – légèrement croquante et pleine de saveur.',
    },
    typical: {
      de: 'Für Abacha wird Maniok gekocht, in feine Streifen gehobelt und getrocknet. Vor dem Servieren wird er eingeweicht und mit einer Sauce aus Palmöl und Gewürzen vermengt. Traditionell gehören oft Ugba (fermentierte Ölbohnen), Zwiebeln und Garden Eggs dazu.',
      en: 'For abacha, cassava is cooked, shredded into thin strips and dried. Before serving it is soaked and tossed in a dressing of palm oil and spices. Traditionally, ugba (fermented oil-bean slices), onions and garden eggs are often added.',
      fr: 'Pour l’abacha, le manioc est cuit, découpé en fines lamelles puis séché. Avant de servir, on le réhydrate et on le mélange à une sauce à l’huile de palme et aux épices. Traditionnellement, on y ajoute souvent de l’ugba (graines fermentées), des oignons et des aubergines africaines.',
    },
  },
  nkwobi: {
    kind: { de: 'Rinderfuß in würziger Sauce', en: 'Cow foot in a spiced sauce', fr: 'Pied de bœuf en sauce épicée' },
    summary: {
      de: 'Nkwobi ist eine Igbo-Delikatesse: zarte Stücke vom Rinderfuß in einer dicken, scharfen Sauce, traditionell in der Holzschale serviert.',
      en: 'Nkwobi is an Igbo delicacy: tender pieces of cow foot in a thick, spicy sauce, traditionally served in a wooden bowl.',
      fr: 'Le nkwobi est un mets raffiné igbo : des morceaux de pied de bœuf tendres dans une sauce épaisse et relevée, servis traditionnellement dans un bol en bois.',
    },
    typical: {
      de: 'Nkwobi wird im Südosten Nigerias gern zu einem kühlen Getränk mit Freunden gegessen. Der lange gegarte Rinderfuß wird in einer gelb-orangen, cremigen Sauce angerichtet und traditionell mit Zwiebelringen und Utazi-Blättern garniert. Die gelatinöse Konsistenz ist typisch und gewollt.',
      en: 'In south-eastern Nigeria, nkwobi is a favourite to share with friends over a cold drink. The slow-cooked cow foot is served in a creamy yellow-orange sauce, traditionally garnished with onion rings and utazi leaves. The gelatinous texture is typical – and the point.',
      fr: 'Dans le sud-est du Nigeria, on partage volontiers le nkwobi entre amis autour d’une boisson fraîche. Le pied de bœuf longuement cuit est servi dans une sauce crémeuse jaune orangé, garni traditionnellement de rondelles d’oignon et de feuilles d’utazi. Sa texture gélatineuse est typique et recherchée.',
    },
  },
  isiewu: {
    kind: { de: 'Ziegenkopf in würziger Sauce', en: 'Goat head in a spiced sauce', fr: 'Tête de chèvre en sauce épicée' },
    summary: {
      de: 'Isiewu, auf Igbo wörtlich „Ziegenkopf“, ist eine Festtags-Delikatesse in würziger Sauce – bei uns als kleiner oder großer Teller.',
      en: 'Isiewu – Igbo for “goat head” – is a celebratory delicacy in a spiced sauce, served here as a small or big plate.',
      fr: 'L’isiewu – « tête de chèvre » en igbo – est un mets de fête en sauce épicée, servi chez nous en petite ou grande assiette.',
    },
    typical: {
      de: 'Isiewu wird ähnlich wie Nkwobi zubereitet und traditionell in einer Holzschale mit Zwiebeln und Utazi-Blättern serviert. In Nigeria gilt es als Gericht für besondere Abende und gesellige Runden. Für Neulinge: ein Gericht für Neugierige, das viel Geschmack und unterschiedliche Texturen bietet.',
      en: 'Isiewu is prepared much like nkwobi and is traditionally served in a wooden bowl with onions and utazi leaves. In Nigeria it is a dish for special evenings and get-togethers. For first-timers: a dish for the curious, with lots of flavour and a range of textures.',
      fr: 'L’isiewu se prépare un peu comme le nkwobi et se sert traditionnellement dans un bol en bois avec oignons et feuilles d’utazi. Au Nigeria, c’est un plat de soirées spéciales et de moments partagés. Pour les novices : un plat pour les curieux, riche en saveurs et en textures.',
    },
  },

  // ───────────── Fish ─────────────
  tilapia: {
    kind: { de: 'Ganze Tilapia', en: 'Whole tilapia', fr: 'Tilapia entier' },
    summary: {
      de: 'Eine ganze Tilapia, gebraten oder gekocht, mit Beilage – in zwei Größen. Zartes, mildes Fischfleisch, ideal zum Teilen.',
      en: 'A whole tilapia, fried or boiled, with a side – in two sizes. Tender, mild fish, ideal for sharing.',
      fr: 'Un tilapia entier, frit ou bouilli, avec accompagnement – en deux tailles. Une chair tendre et douce, idéale à partager.',
    },
    typical: {
      de: 'Tilapia ist einer der beliebtesten Speisefische Westafrikas. Im Ganzen zubereitet bleibt er besonders saftig; typisch sind eine pfeffrige Sauce und gebratene Kochbananen. Gräten gibt es – am besten mit den Fingern essen.',
      en: 'Tilapia is one of the most popular fish in West Africa. Cooked whole it stays especially juicy; a peppery sauce and fried plantain are typical companions. It has bones – best eaten with your fingers.',
      fr: 'Le tilapia est l’un des poissons les plus appréciés d’Afrique de l’Ouest. Cuit entier, il reste particulièrement juteux ; une sauce poivrée et des bananes plantain frites l’accompagnent souvent. Attention aux arêtes – il se mange volontiers avec les doigts.',
    },
  },
  'fried-fish-plantain': {
    kind: { de: 'Gebratener Fisch mit Kochbananen', en: 'Fried fish with plantain', fr: 'Poisson frit et banane plantain' },
    summary: {
      de: 'Knusprig gebratener Fisch mit süßen, gebratenen Kochbananen – ein einfacher, beliebter Klassiker.',
      en: 'Crisp fried fish with sweet fried plantain – a simple, much-loved classic.',
      fr: 'Du poisson frit croustillant avec des bananes plantain frites et sucrées – un classique simple et apprécié.',
    },
    typical: {
      de: 'Gebratener Fisch mit „Dodo“ – reifen, in Scheiben frittierten Kochbananen – ist in ganz Westafrika ein Lieblingsgericht. Die Süße der Kochbanane gleicht die würzige Kruste des Fisches aus.',
      en: 'Fried fish with dodo – slices of fried ripe plantain – is a favourite all over West Africa. The sweetness of the plantain balances the savoury crust of the fish.',
      fr: 'Le poisson frit avec du dodo – des tranches de banane plantain mûre frites – est un plat préféré dans toute l’Afrique de l’Ouest. La douceur de la plantain équilibre la croûte épicée du poisson.',
    },
  },

  // ───────────── Extras ─────────────
  'extra-pounded-yam': {
    kind: { de: 'Pounded Yam – Beilage zu Suppen', en: 'Pounded yam – the classic soup side', fr: 'Pounded yam – l’accompagnement des soupes' },
    summary: {
      de: 'Eine zusätzliche Portion Pounded Yam: gestampfte Yamswurzel, glatt und elastisch – die klassische Beilage zu unseren Suppen. Ähnlich wie Fufu.',
      en: 'An extra portion of pounded yam: yam pounded until smooth and stretchy – the classic side for our soups. Similar to fufu.',
      fr: 'Une portion supplémentaire de pounded yam : de l’igname pilée, lisse et élastique – l’accompagnement classique de nos soupes. Proche du foufou.',
    },
    typical: {
      de: 'Pounded Yam gehört zu den „Swallows“: feste Beilagen, von denen man mit der Hand ein Stück abnimmt, formt und in die Suppe tunkt. Gekochte Yamswurzel wird dafür so lange gestampft, bis sie glatt und elastisch ist. Wer „Fufu“ sucht: Fufu ist ein verwandter Swallow, oft aus Maniok; bei uns gibt es zu den Suppen Pounded Yam oder Garri.',
      en: 'Pounded yam is one of the “swallows”: firm sides from which you take a piece by hand, shape it and dip it into the soup. Boiled yam is pounded until smooth and stretchy. Looking for “fufu”? Fufu is a related swallow, often made from cassava; with our soups we serve pounded yam or garri.',
      fr: 'Le pounded yam fait partie des « swallows » : des accompagnements fermes dont on prend un morceau à la main pour le tremper dans la soupe. L’igname bouillie est pilée jusqu’à devenir lisse et élastique. Vous cherchez du « foufou » ? Le foufou est un swallow proche, souvent à base de manioc ; avec nos soupes, nous servons du pounded yam ou du garri.',
    },
  },
  'extra-garri': {
    kind: { de: 'Garri (Eba) – Beilage zu Suppen', en: 'Garri (eba) – the other classic soup side', fr: 'Garri (eba) – l’autre accompagnement des soupes' },
    summary: {
      de: 'Eine zusätzliche Portion Garri: aus Maniok hergestellt, fester und leicht körnig – neben Pounded Yam die zweite klassische Beilage zu unseren Suppen.',
      en: 'An extra portion of garri: made from cassava, firm and slightly grainy – alongside pounded yam, the other classic side for our soups.',
      fr: 'Une portion supplémentaire de garri : à base de manioc, ferme et légèrement granuleux – avec le pounded yam, l’autre accompagnement classique de nos soupes.',
    },
    typical: {
      de: 'Garri ist ein grobes Mehl aus geriebenem, fermentiertem und geröstetem Maniok. Mit heißem Wasser angerührt wird daraus Eba – ein fester „Swallow“, von dem man ein Stück abnimmt und in die Suppe tunkt. Gelbes Garri wird traditionell mit etwas Palmöl hergestellt und schmeckt leicht säuerlich.',
      en: 'Garri is a coarse flour made from grated, fermented and roasted cassava. Stirred with hot water it becomes eba – a firm “swallow” from which you take a piece and dip it into the soup. Yellow garri is traditionally made with a little palm oil and tastes slightly tangy.',
      fr: 'Le garri est une semoule grossière de manioc râpé, fermenté et grillé. Mélangé à de l’eau chaude, il devient de l’eba – un « swallow » ferme dont on prend un morceau pour le tremper dans la soupe. Le garri jaune est traditionnellement préparé avec un peu d’huile de palme et a un goût légèrement acidulé.',
    },
  },
  'extra-rice': {
    kind: { de: 'Weißer Reis als Beilage', en: 'Plain white rice as a side', fr: 'Riz blanc en accompagnement' },
    summary: {
      de: 'Eine zusätzliche Portion locker gekochter weißer Reis – für alle, die zu einem Gericht mit Sauce mehr Beilage möchten.',
      en: 'An extra portion of fluffy boiled white rice – for when you want more of a side with a dish that has plenty of sauce.',
      fr: 'Une portion supplémentaire de riz blanc bien cuit – pour ceux qui veulent plus d’accompagnement avec un plat en sauce.',
    },
    typical: {
      de: 'Weißer Reis ist in Westafrika die Grundlage vieler Alltagsgerichte, etwa „Rice and Stew“ – Reis mit einem kräftigen Tomaten-Paprika-Eintopf. Er nimmt Saucen gut auf und gleicht scharfe Gerichte angenehm aus.',
      en: 'White rice is the basis of many everyday West African meals, such as “rice and stew” – rice with a rich tomato-and-pepper stew. It soaks up sauces well and balances spicy dishes nicely.',
      fr: 'Le riz blanc est la base de nombreux plats du quotidien en Afrique de l’Ouest, comme le « rice and stew » – du riz avec un ragoût riche de tomates et poivrons. Il absorbe bien les sauces et adoucit les plats épicés.',
    },
  },
  'extra-yam': {
    kind: { de: 'Gekochte Yamswurzel als Beilage', en: 'Boiled yam as a side', fr: 'Igname bouillie en accompagnement' },
    summary: {
      de: 'Eine zusätzliche Portion gekochte Yamswurzel – mild, sättigend und fest im Biss, gut zu Saucen und Eintöpfen.',
      en: 'An extra portion of boiled yam – mild, filling and firm, good with sauces and stews.',
      fr: 'Une portion supplémentaire d’igname bouillie – douce, nourrissante et ferme, idéale avec les sauces et les ragoûts.',
    },
    typical: {
      de: 'Yam ist eine große, stärkehaltige Knolle und in Westafrika ein Grundnahrungsmittel. Gekocht ist sie fester und weniger süß als Süßkartoffel und wird gern zu Saucen gegessen. Gestampft wird aus gekochtem Yam auch Pounded Yam.',
      en: 'Yam is a large, starchy tuber and a staple food in West Africa. Boiled, it is firmer and less sweet than sweet potato and is often eaten with sauces. Pounded, boiled yam also becomes pounded yam.',
      fr: 'L’igname est un gros tubercule riche en amidon et un aliment de base en Afrique de l’Ouest. Bouillie, elle est plus ferme et moins sucrée que la patate douce et se mange volontiers avec des sauces. Pilée, l’igname bouillie devient le pounded yam.',
    },
  },
};
