// Clinical triage rules, vitals evaluator, food/plant guide, toxin calculator, first-aid guides, cost estimator, and ES/EN i18n

export const SPECIES_LIST = [
  { id: 'dog', label: { es: 'Perro', en: 'Dog' }, defaultBreed: { es: 'Mestizo', en: 'Mixed breed' }, normalTemp: '38.0–39.2°C', normalRpm: '15–30 RPM' },
  { id: 'cat', label: { es: 'Gato', en: 'Cat' }, defaultBreed: { es: 'Común Europeo', en: 'Domestic Shorthair' }, normalTemp: '38.0–39.2°C', normalRpm: '20–30 RPM' },
  { id: 'rabbit', label: { es: 'Conejo', en: 'Rabbit' }, defaultBreed: { es: 'Belier / Enano', en: 'Lop / Dwarf' }, normalTemp: '38.5–40.0°C', normalRpm: '30–60 RPM' },
  { id: 'bird', label: { es: 'Ave / Pájaro', en: 'Bird' }, defaultBreed: { es: 'Agapornis / Periquito', en: 'Parakeet / Lovebird' }, normalTemp: '40.0–42.0°C', normalRpm: '40–60 RPM' },
  { id: 'rodent', label: { es: 'Roedor (Cobaya/Hámster)', en: 'Rodent (Guinea Pig/Hamster)' }, defaultBreed: { es: 'Cobaya / Hámster', en: 'Guinea Pig / Hamster' }, normalTemp: '37.2–39.5°C', normalRpm: '60–110 RPM' },
  { id: 'reptile', label: { es: 'Reptil / Tortuga', en: 'Reptile / Turtle' }, defaultBreed: { es: 'Tortuga / Gecko', en: 'Turtle / Gecko' }, normalTemp: '24–32°C (amb)', normalRpm: '4–12 RPM' },
];

export function getSpeciesLabel(species, lang = 'es') {
  const found = SPECIES_LIST.find((s) => s.id === species);
  return found ? (found.label[lang] || found.label.es) : (lang === 'es' ? 'Mascota' : 'Pet');
}

export const SPECIES_CARE_GUIDES = {
  dog: {
    summary: {
      es: 'En perros, las urgencias más graves son la torsión gástrica (abdomen duro + arcadas), intoxicaciones y golpe de calor.',
      en: 'In dogs, top emergencies include gastric bloat/torsion (hard belly + dry heaving), poisoning, and heatstroke.',
    },
    conditions: [
      {
        title: { es: 'Gastroenteritis / Vómitos leves', en: 'Mild GI upset / Vomiting' },
        cure: {
          es: 'Ayuno corto de agua/comida 4–6h si solo vomitó 1 vez y está activo; luego agua en sorbos pequeños y dieta blanda (arroz blanco y pollo cocido sin piel ni sal). Si vomita >3 veces o hay sangre, requiere antiemético inyectable y suero veterinario.',
          en: 'Short 4–6h rest after 1 isolated vomit if alert; then small sips of water and bland diet (boiled white rice & plain chicken). >3 vomits or blood requires injectable vet anti-nausea and fluids.',
        },
      },
      {
        title: { es: 'Heridas superficiales y cojeras leves', en: 'Minor wounds & mild limps' },
        cure: {
          es: 'Limpia la herida con suero fisiológico estéril y clorhexidina diluida; evita alcohol o agua oxigenada. Para cojera leve, reposo estricto 24–48h sin saltos y revisa las almohadillas por espigas o cristales.',
          en: 'Flush wounds with sterile saline and diluted chlorhexidine (avoid alcohol/peroxide). For mild limps, strict 24–48h rest and inspect paw pads for foxtails or thorns.',
        },
      },
    ],
    homeCare: {
      es: [
        'Hidratación fraccionada en tomas pequeñas cada 30–45 min.',
        'Revisa encías (rosadas y húmedas) y cuenta respiraciones en reposo (<30 RPM).',
        'Mantén calma y evita ejercicio tras comer en razas grandes (previene torsión).',
      ],
      en: [
        'Offer small, frequent water sips every 30–45 min.',
        'Check gums (pink & moist) and resting breathing (<30 RPM).',
        'Keep calm and avoid exercise right after meals in large breeds.',
      ],
    },
    avoid: {
      es: 'Nunca des ibuprofeno, paracetamol, huesos cocidos ni provoques el vómito sin orden veterinaria.',
      en: 'Never give ibuprofen, acetaminophen, cooked bones, or induce vomiting without vet instruction.',
    },
  },
  cat: {
    summary: {
      es: 'Los gatos ocultan el dolor. Más de 24h sin comer o intentos de orinar sin éxito son urgencias médicas reales.',
      en: 'Cats hide pain well. >24h without eating or straining to urinate with no output are true medical emergencies.',
    },
    conditions: [
      {
        title: { es: 'Anorexia (>24h sin comer) y Lipidosis Hepática', en: 'Anorexia (>24h) & Hepatic Lipidosis' },
        cure: {
          es: 'Si un gato deja de comer más de 24h puede desarrollar fallo hepático graso. Prueba comida húmeda templada o caldos sin sal/cebolla; si rechaza todo, el veterinario debe tratar la causa, hidratar y pautar estimulantes del apetito o sonda.',
          en: 'Cats fasting >24h risk fatal fatty liver disease. Try warmed wet food or plain unsalted broth; if refused, a vet must treat the root cause with fluids and appetite support.',
        },
      },
      {
        title: { es: 'Obstrucción urinaria (machos sobre todo)', en: 'Urinary blockage (especially males)' },
        cure: {
          es: 'Entrar al arenero repetidamente sin sacar orina o maullar de dolor es URGENCIA VITAL (riesgo renal en <24h). Requiere sondaje urinario bajo sedación y fluidoterapia en clínica; no se cura en casa.',
          en: 'Repeatedly straining in the litter box with no urine is a LIFE-THREATENING emergency. Requires immediate vet catheterization under sedation and IV fluids.',
        },
      },
    ],
    homeCare: {
      es: [
        'Asegura agua fresca en fuentes o varios cuencos lejos del arenero.',
        'Si estornuda leve, limpia secreciones nasales con gasa humedecida en suero templado.',
        'Observa si respira con la boca abierta (en gatos siempre es urgencia inmediata).',
      ],
      en: [
        'Provide fresh water bowls or fountains away from the litter box.',
        'Gently wipe mild nasal discharge with warm saline-dampened gauze.',
        'Watch for open-mouth breathing (always an immediate ER sign in cats).',
      ],
    },
    avoid: {
      es: 'Paracetamol, aspirina, permetrinas (pipetas de perro) y lirios son MORTALES en gatos.',
      en: 'Acetaminophen, aspirin, dog flea permethrins, and lilies are FATAL to cats.',
    },
  },
  rabbit: {
    summary: {
      es: 'Los conejos son herbívoros estrictos cuyo intestino nunca debe detenerse. >12h sin comer o sin hacer bolitas es emergencia.',
      en: 'Rabbits are strict herbivores whose gut must never stop. >12h without eating or droppings is an emergency.',
    },
    conditions: [
      {
        title: { es: 'Estasis gastrointestinal (Íleo / Parada intestinal)', en: 'GI Stasis (Gut slowdown)' },
        cure: {
          es: 'Es la urgencia nº1: se trata en clínica con procinéticos (metoclopramida/cisaprida), analgesia segura (meloxicam), fluidos subcutáneos/IV y papilla de recuperación (Critical Care) si NO hay obstrucción. En casa, mantén temperatura estable y ofrece heno fresco o hierbas húmedas.',
          en: '#1 rabbit emergency: vets treat with gut motility meds, safe pain relief (meloxicam), fluids, and Critical Care syringe feeding ONLY if no blockage exists. At home, keep warm and offer fresh hay/wet greens.',
        },
      },
      {
        title: { es: 'Golpe de calor (>27°C) y Pododermatitis', en: 'Heatstroke (>27°C) & Sore Hocks' },
        cure: {
          es: 'Los conejos no sudan y toleran mal >27°C. Refresca aplicando paños frescos (no helados) en las orejas, donde disipan calor. Para patas irritadas, añade superficie blanda y consulta crema cicatrizante apta.',
          en: 'Rabbits cannot sweat. Cool them by gently dampening their ears with cool (not icy) cloths. For sore hocks, add soft bedding and seek vet-safe barrier care.',
        },
      },
    ],
    homeCare: {
      es: [
        'Heno de hierba ilimitado 24/7 (80% de su dieta) y agua siempre disponible.',
        'Palpa suavemente el abdomen: si está duro como un tambor, NO fuerces papilla y ve a exóticos.',
        'Controla el tamaño y cantidad de heces cada 6–8 horas.',
      ],
      en: [
        'Unlimited grass hay 24/7 (80% of diet) and fresh water at all times.',
        'Gently feel the belly: if drum-hard/bloated, DO NOT force-feed; go to an exotic ER.',
        'Monitor fecal pellet size and output every 6–8 hours.',
      ],
    },
    avoid: {
      es: 'Nunca bañes al conejo por inmersión (riesgo de shock) ni des antibióticos orales humanos o amoxicilina.',
      en: 'Never submerge a rabbit in water (shock risk) or give oral penicillin/amoxicillin.',
    },
  },
  bird: {
    summary: {
      es: 'Las aves ocultan los síntomas hasta estar muy débiles. Si está embolada en el fondo de la jaula o mueve la cola al respirar, es urgente.',
      en: 'Birds hide illness until critical. Fluffed feathers on the cage floor or tail bobbing with each breath require urgent avian care.',
    },
    conditions: [
      {
        title: { es: 'Dificultad respiratoria ("Tail bobbing") e Infecciones', en: 'Respiratory distress (Tail bobbing) & Infections' },
        cure: {
          es: 'Requiere veterinario de exóticos/aves para nebulización, oxígeno y antibiótico o antifúngico específico tras cultivo. Mientras llegas, coloca al ave en un transportín cálido (29–32°C), oscuro y sin corrientes.',
          en: 'Needs an avian vet for oxygen, nebulization, and targeted antibiotics/antifungals. Meanwhile, place in a warm (29–32°C), quiet, draft-free hospital box.',
        },
      },
      {
        title: { es: 'Hemorragia en cañón de pluma o uña rota', en: 'Broken blood feather or nail bleeding' },
        cure: {
          es: 'Las aves tienen poca sangre: aplica presión directa con gasa y polvo hemostático o maicena limpia durante 2–3 minutos. Si es una pluma de sangre rota que no deja de sangrar, el vet debe extraerla de raíz.',
          en: 'Birds have small blood volume: apply gentle pressure with gauze and styptic powder or cornstarch for 2–3 min. Uncontrolled blood feathers need vet removal.',
        },
      },
    ],
    homeCare: {
      es: [
        'Calor estable (28–31°C) con bolsa térmica envuelta en toalla fuera de la jaula.',
        'Reduce el estrés al mínimo: cubre 3 lados del transportín y evita ruidos.',
        'Retira perchas altas si está débil para evitar caídas y coloca agua/comida en el suelo.',
      ],
      en: [
        'Provide gentle warmth (28–31°C) via wrapped heating pad outside the carrier.',
        'Minimize stress: cover 3 sides of the carrier and keep quiet.',
        'Lower perches and place food/water on the floor if weak.',
      ],
    },
    avoid: {
      es: 'NUNCA cocines con teflón/PTFE cerca, ni uses aerosoles, velas perfumadas ni aguacate (mortal en aves).',
      en: 'NEVER use PTFE/Teflon cookware, aerosols, scented candles, or feed avocado (fatal to birds).',
    },
  },
  rodent: {
    summary: {
      es: 'Cobayas y hámsteres se deshidratan en horas. En hámsteres la "cola húmeda" es letal sin antibiótico rápido; las cobayas necesitan Vitamina C diaria.',
      en: 'Guinea pigs & hamsters dehydrate within hours. Hamster "wet tail" is fatal without rapid antibiotics; guinea pigs require daily Vitamin C.',
    },
    conditions: [
      {
        title: { es: 'Cola húmeda en hámsteres (Ileítis proliferativa)', en: 'Hamster Wet Tail (Proliferative ileitis)' },
        cure: {
          es: 'Diarrea acuosa que moja la zona trasera, postura encorvada y apatía. Se trata el mismo día en veterinario de exóticos con antibióticos específicos (enrofloxacina/metronidazol) y suero subcutáneo para frenar el shock.',
          en: 'Watery diarrhea soaking the rear, hunched posture, and lethargy. Requires same-day exotic vet antibiotics and subcutaneous fluids to prevent fatal dehydration.',
        },
      },
      {
        title: { es: 'Déficit de Vitamina C (Escorbuto) en cobayas', en: 'Vitamin C Deficiency (Scurvy) in Guinea Pigs' },
        cure: {
          es: 'Las cobayas no sintetizan Vitamina C. Provoca articulaciones inflamadas, cojera, sangrado de encías y apatía. Se corrige con suplemento de Vitamina C oral pautado por el vet y pimiento rojo/verduras frescas diarias.',
          en: 'Guinea pigs cannot make Vitamin C. Causes swollen joints, limping, and lethargy. Treated with vet-dosed oral Vitamin C and daily fresh bell pepper/leafy greens.',
        },
      },
    ],
    homeCare: {
      es: [
        'Aísla inmediatamente a un hámster con diarrea de otros roedores y desinfecta con agua caliente.',
        'Mantén ambiente templado (20–24°C) sin corrientes ni sol directo.',
        'Ofrece gotas de agua en jeringa sin aguja con mucho cuidado si acepta beber.',
      ],
      en: [
        'Immediately isolate a hamster with diarrhea and sanitize the habitat.',
        'Keep ambient temperature steady (20–24°C), away from drafts and direct sun.',
        'Offer tiny water drops via needleless syringe only if alert and swallowing.',
      ],
    },
    avoid: {
      es: 'No uses virutas de pino/cedro (dañan vías respiratorias) ni antibióticos de perro/gato.',
      en: 'Avoid pine/cedar shavings (respiratory toxins) and dog/cat antibiotics.',
    },
  },
  reptile: {
    summary: {
      es: 'El 80% de las enfermedades en reptiles (tortugas, geckos, pogonas) derivan de temperatura incorrecta, falta de luz UVB o déficit de calcio.',
      en: '80% of reptile illnesses (turtles, geckos, dragons) stem from improper thermal gradients, lack of UVB, or calcium deficiency.',
    },
    conditions: [
      {
        title: { es: 'Enfermedad Ósea Metabólica (MBD / Caparazón blando)', en: 'Metabolic Bone Disease (MBD / Soft shell)' },
        cure: {
          es: 'Mandíbula o caparazón blando, temblores o incapacidad para levantar el cuerpo. El veterinario administra calcio inyectable/líquido y ajusta UVB. En casa: instala lámpara UVB adecuada (5.0 o 10.0 según especie) y espolvorea calcio sin/con D3.',
          en: 'Soft shell/jaw, tremors, or inability to lift body. Vets treat with liquid/injectable calcium and UVB correction. At home: ensure proper UVB bulb (replaced every 6 mo) and calcium dusting.',
        },
      },
      {
        title: { es: 'Infección respiratoria (Burbujas nasales / Boca abierta)', en: 'Respiratory Infection (Nose bubbles / Gaping)' },
        cure: {
          es: 'Suele aparecer por frío o humedad inadecuada. Requiere antibiótico sistémico recetado por veterinario de exóticos (los reptiles no tosen bien el moco). Mientras tanto, eleva suavemente el punto caliente dentro de su rango seguro.',
          en: 'Often triggered by low temperatures or poor humidity. Requires exotic vet systemic antibiotics. Meanwhile, verify and gently optimize the basking temperature within safe species range.',
        },
      },
    ],
    homeCare: {
      es: [
        'Baño tibio poco profundo (28–30°C, agua sin superar la barbilla) 15 min ayuda a rehidratar tortugas y lagartos.',
        'Verifica con termómetro digital el gradiente térmico (zona fría vs punto de calor).',
        'Asegura renovación de bombilla UVB cada 6–9 meses aunque siga dando luz visible.',
      ],
      en: [
        'Shallow lukewarm soak (28–30°C, below chin level) for 15 min helps rehydrate.',
        'Verify thermal gradient (cool side vs basking spot) with a digital thermometer.',
        'Replace UVB bulbs every 6–9 months even if they still emit visible light.',
      ],
    },
    avoid: {
      es: 'No uses piedras calefactoras (causan quemaduras graves) ni agua fría en baños.',
      en: 'Never use hot rocks (severe thermal burns) or cold water for soaking.',
    },
  },
};

export const SYMPTOM_CATEGORIES = [
  {
    id: 'digestive',
    icon: 'stethoscope',
    label: { es: 'Digestivo', en: 'Digestive' },
    symptoms: [
      { id: 'vomit_once', label: { es: 'Vómito aislado (1-2 veces)', en: 'Isolated vomiting (1-2x)' }, severity: 'mild' },
      { id: 'vomit_repeated', label: { es: 'Vómitos repetidos (+3 veces / no retiene agua)', en: 'Repeated vomiting (3+ / can’t keep water down)' }, severity: 'high' },
      { id: 'diarrhea_mild', label: { es: 'Diarrea blanda sin sangre', en: 'Soft diarrhea without blood' }, severity: 'mild' },
      { id: 'diarrhea_blood', label: { es: 'Diarrea con sangre o negra', en: 'Bloody or black/tarry diarrhea' }, severity: 'critical' },
      { id: 'no_appetite', label: { es: 'No quiere comer (>12-24h)', en: 'Loss of appetite (>12-24h)' }, severity: 'moderate' },
      { id: 'bloated_abdomen', label: { es: 'Abdomen hinchado, duro o arcadas sin vómito', en: 'Swollen/hard abdomen or dry heaving' }, severity: 'critical' },
      { id: 'rabbit_no_poop', label: { es: 'Conejo/Roedor: sin heces o heces muy pequeñas (>12h)', en: 'Rabbit/Rodent: no droppings or tiny pellets (>12h)' }, severity: 'critical' },
      { id: 'rodent_wet_tail', label: { es: 'Roedor/Hámster: zona trasera húmeda o diarrea acuosa', en: 'Rodent/Hamster: wet soiled rear or watery diarrhea' }, severity: 'critical' },
    ],
  },
  {
    id: 'respiratory',
    icon: 'wind',
    label: { es: 'Respiratorio', en: 'Respiratory' },
    symptoms: [
      { id: 'sneezing', label: { es: 'Estornudos o secreción nasal clara', en: 'Sneezing or clear nasal discharge' }, severity: 'mild' },
      { id: 'cough_mild', label: { es: 'Tos seca ocasional', en: 'Occasional dry cough' }, severity: 'moderate' },
      { id: 'open_mouth_cat', label: { es: 'Gato respirando con la boca abierta', en: 'Cat open-mouth breathing' }, severity: 'critical' },
      { id: 'labored_breathing', label: { es: 'Respiración rápida, forzada o jadeo en reposo', en: 'Fast/labored breathing or panting at rest' }, severity: 'critical' },
      { id: 'bird_tail_bob', label: { es: 'Ave: cola sube y baja al respirar o plumaje erizado', en: 'Bird: tail bobbing when breathing or fluffed feathers' }, severity: 'critical' },
      { id: 'reptile_resp_bubbles', label: { es: 'Reptil: burbujas en nariz/boca o respiración abierta', en: 'Reptile: nose/mouth bubbles or open-mouth breathing' }, severity: 'critical' },
    ],
  },
  {
    id: 'mobility',
    icon: 'bone',
    label: { es: 'Movilidad y Dolor', en: 'Mobility & Pain' },
    symptoms: [
      { id: 'limp_mild', label: { es: 'Cojera leve (apoya la pata)', en: 'Mild limp (bears some weight)' }, severity: 'mild' },
      { id: 'no_weight', label: { es: 'No apoya la pata / llora al tocar', en: 'Won’t bear weight / cries when touched' }, severity: 'high' },
      { id: 'sudden_paralysis', label: { es: 'Incapacidad repentina para levantarse o arrastrar patas', en: 'Sudden inability to stand or dragging legs' }, severity: 'critical' },
      { id: 'stiffness', label: { es: 'Rigidez al levantarse tras dormir', en: 'Stiffness after resting' }, severity: 'mild' },
      { id: 'reptile_soft_shell', label: { es: 'Reptil/Tortuga: caparazón o mandíbula blanda / temblores', en: 'Reptile/Turtle: soft shell/jaw or tremors' }, severity: 'high' },
    ],
  },
  {
    id: 'skin_eyes',
    icon: 'eye',
    label: { es: 'Piel, Ojos y Oídos', en: 'Skin, Eyes & Ears' },
    symptoms: [
      { id: 'itching', label: { es: 'Rascado frecuente o enrojecimiento leve', en: 'Frequent scratching or mild redness' }, severity: 'mild' },
      { id: 'ear_shake', label: { es: 'Sacude la cabeza o se rasca el oído', en: 'Head shaking or ear scratching' }, severity: 'moderate' },
      { id: 'eye_squint', label: { es: 'Ojo cerrado, rojo o con secreción espesa', en: 'Squinting, red eye, or thick discharge' }, severity: 'high' },
      { id: 'facial_swelling', label: { es: 'Hinchazón repentina de cara, hocico o párpados', en: 'Sudden facial, muzzle, or eyelid swelling' }, severity: 'critical' },
      { id: 'deep_wound', label: { es: 'Herida profunda o sangrado que no para', en: 'Deep wound or active bleeding' }, severity: 'critical' },
    ],
  },
  {
    id: 'urinary_neuro',
    icon: 'zap',
    label: { es: 'Urinario y Neurológico', en: 'Urinary & Neuro' },
    symptoms: [
      { id: 'frequent_pee', label: { es: 'Orina muchas veces en pequeñas cantidades', en: 'Frequent small urinations' }, severity: 'high' },
      { id: 'cant_urinate', label: { es: 'Intenta orinar y no sale nada (esfuerzo sin orina)', en: 'Straining to urinate with no output' }, severity: 'critical' },
      { id: 'lethargy', label: { es: 'Apatía o decaimiento notable', en: 'Noticeable lethargy or weakness' }, severity: 'moderate' },
      { id: 'seizure', label: { es: 'Convulsión, desorientación severa o colapso', en: 'Seizure, severe disorientation, or collapse' }, severity: 'critical' },
    ],
  },
];

export const RED_FLAGS = [
  { id: 'rf_gums', label: { es: 'Encías pálidas, blancas o azuladas', en: 'Pale, white, or bluish gums' } },
  { id: 'rf_collapse', label: { es: 'Colapso, desmayo o no responde al llamarlo', en: 'Collapse, fainting, or unresponsive' } },
  { id: 'rf_breathing', label: { es: 'Asfixia o dificultad grave para respirar', en: 'Choking or severe breathing distress' } },
  { id: 'rf_bleeding', label: { es: 'Hemorragia activa que no cede en 5 min', en: 'Active bleeding not stopping after 5 min' } },
  { id: 'rf_toxin', label: { es: 'Sospecha de ingestión de veneno o medicamento humano', en: 'Suspected poison or human medication ingestion' } },
];

export const GUM_COLORS = [
  { id: 'pink', color: '#F4A6B8', label: { es: 'Rosadas y húmedas (Normal)', en: 'Pink & moist (Normal)' }, status: 'normal' },
  { id: 'pale', color: '#F5E6E8', label: { es: 'Pálidas o blancas (Shock/Anemia)', en: 'Pale or white (Shock/Anemia)' }, status: 'critical' },
  { id: 'blue', color: '#8FA8C8', label: { es: 'Azuladas o grises (Falta O₂)', en: 'Blue or gray (Low O₂)' }, status: 'critical' },
  { id: 'brick', color: '#B91C1C', label: { es: 'Rojo intenso (Golpe de calor)', en: 'Brick red (Heatstroke)' }, status: 'critical' },
  { id: 'yellow', color: '#EAB308', label: { es: 'Amarillas (Ictericia / Hígado)', en: 'Yellow (Jaundice / Liver)' }, status: 'high' },
];

const SPECIES_VITALS_THRESHOLDS = {
  dog: { tempMin: 37.7, tempMax: 39.3, tempCritLow: 37.0, tempCritHigh: 40.0, rpmHigh: 35, rpmCrit: 45, tempLabel: '38.0–39.2°C', rpmLabel: '<30' },
  cat: { tempMin: 37.7, tempMax: 39.3, tempCritLow: 37.0, tempCritHigh: 40.0, rpmHigh: 35, rpmCrit: 45, tempLabel: '38.0–39.2°C', rpmLabel: '<30' },
  rabbit: { tempMin: 38.2, tempMax: 40.1, tempCritLow: 37.5, tempCritHigh: 40.8, rpmHigh: 65, rpmCrit: 85, tempLabel: '38.5–40.0°C', rpmLabel: '30–60' },
  bird: { tempMin: 39.5, tempMax: 42.2, tempCritLow: 38.5, tempCritHigh: 43.0, rpmHigh: 65, rpmCrit: 85, tempLabel: '40.0–42.0°C', rpmLabel: '40–60' },
  rodent: { tempMin: 37.0, tempMax: 39.6, tempCritLow: 36.2, tempCritHigh: 40.5, rpmHigh: 115, rpmCrit: 140, tempLabel: '37.2–39.5°C', rpmLabel: '60–110' },
  reptile: { tempMin: 22.0, tempMax: 34.0, tempCritLow: 18.0, tempCritHigh: 38.0, rpmHigh: 18, rpmCrit: 28, tempLabel: '24–32°C', rpmLabel: '4–12' },
};

export function evaluateVitals({ species = 'dog', gums = 'pink', tempC = '', rpm = '' }) {
  const alerts = [];
  let maxSeverity = 'normal';
  const vt = SPECIES_VITALS_THRESHOLDS[species] || SPECIES_VITALS_THRESHOLDS.dog;

  const gumObj = GUM_COLORS.find((g) => g.id === gums);
  if (gumObj && gumObj.status === 'critical') {
    maxSeverity = 'critical';
    alerts.push({ es: `Encías anormalmente ${gums === 'blue' ? 'azuladas' : gums === 'brick' ? 'rojo intenso' : 'pálidas'}.`, en: 'Abnormal gum color indicates urgent circulation/oxygen issue.' });
  } else if (gumObj && gumObj.status === 'high') {
    if (maxSeverity === 'normal') maxSeverity = 'high';
    alerts.push({ es: 'Encías amarillentas (ictericia): requiere valoración veterinaria hoy.', en: 'Yellow gums (jaundice): requires vet evaluation today.' });
  }

  const t = parseFloat(tempC);
  if (Number.isFinite(t) && t > 0) {
    if (t >= vt.tempCritHigh || t < vt.tempCritLow) {
      maxSeverity = 'critical';
      alerts.push({ es: `Temperatura crítica (${t}°C): riesgo de golpe de calor, sepsis o hipotermia.`, en: `Critical temperature (${t}°C): risk of heatstroke, sepsis, or hypothermia.` });
    } else if (t > vt.tempMax || t < vt.tempMin) {
      if (maxSeverity === 'normal') maxSeverity = 'high';
      alerts.push({ es: `Temperatura alterada (${t}°C). Normal: ${vt.tempLabel}.`, en: `Abnormal temperature (${t}°C). Normal: ${vt.tempLabel}.` });
    }
  }

  const r = parseFloat(rpm);
  if (Number.isFinite(r) && r > 0) {
    if (r >= vt.rpmCrit) {
      maxSeverity = 'critical';
      alerts.push({ es: `Respiración en reposo muy elevada (${r} rpm). Normal ${vt.rpmLabel} rpm.`, en: `Very high resting respiratory rate (${r} rpm). Normal ${vt.rpmLabel} rpm.` });
    } else if (r > vt.rpmHigh) {
      if (maxSeverity === 'normal') maxSeverity = 'high';
      alerts.push({ es: `Respiración en reposo algo rápida (${r} rpm). Vigilar de cerca.`, en: `Slightly elevated resting breathing (${r} rpm). Monitor closely.` });
    }
  }

  return { maxSeverity, alerts };
}

export function evaluateTriage({
  species = 'dog',
  ageGroup = 'adult',
  selectedSymptoms = [],
  redFlags = [],
  durationHours = 4,
  intensity = 'mild',
  vitals = null,
}) {
  const allSymptomsMap = new Map();
  for (const cat of SYMPTOM_CATEGORIES) {
    for (const sym of cat.symptoms) {
      allSymptomsMap.set(sym.id, sym);
    }
  }

  const matchedSymptoms = selectedSymptoms
    .map((id) => allSymptomsMap.get(id))
    .filter(Boolean);

  const vitalsEval = vitals ? evaluateVitals({ species, ...vitals }) : { maxSeverity: 'normal', alerts: [] };

  const hasRedFlag = redFlags.length > 0;
  const hasCriticalSymptom = matchedSymptoms.some((s) => s.severity === 'critical');
  const hasHighSymptom = matchedSymptoms.some((s) => s.severity === 'high');
  const moderateCount = matchedSymptoms.filter((s) => s.severity === 'moderate').length;

  const catNoAppetiteLong = species === 'cat' && selectedSymptoms.includes('no_appetite') && durationHours >= 24;
  const herbivoreGiStasisRisk = (species === 'rabbit' || species === 'rodent') && selectedSymptoms.includes('no_appetite') && durationHours >= 12;
  const birdWeaknessRisk = species === 'bird' && (selectedSymptoms.includes('no_appetite') || selectedSymptoms.includes('lethargy'));
  const vulnerableAge = ageGroup === 'puppy' || ageGroup === 'senior';

  let level = 'monitor';
  if (hasRedFlag || hasCriticalSymptom || vitalsEval.maxSeverity === 'critical' || herbivoreGiStasisRisk) {
    level = 'emergency';
  } else if (
    hasHighSymptom ||
    vitalsEval.maxSeverity === 'high' ||
    catNoAppetiteLong ||
    birdWeaknessRisk ||
    intensity === 'severe' ||
    moderateCount >= 2 ||
    (vulnerableAge && matchedSymptoms.length > 0 && durationHours >= 12) ||
    (durationHours >= 36 && matchedSymptoms.length > 0)
  ) {
    level = 'vet24h';
  }

  const reasons = [...vitalsEval.alerts];
  if (hasRedFlag) {
    reasons.push({
      es: 'Se marcaron señales de alarma vitales.',
      en: 'Vital emergency red flags were selected.',
    });
  }
  if (hasCriticalSymptom) {
    reasons.push({
      es: 'Uno o más síntomas indican riesgo agudo (respiratorio, neurológico, obstrucción o hemorragia).',
      en: 'One or more symptoms indicate acute risk (respiratory, neuro, obstruction, or bleeding).',
    });
  }
  if (herbivoreGiStasisRisk) {
    reasons.push({
      es: 'En conejos y roedores, >12h sin comer puede provocar estasis gastrointestinal mortal.',
      en: 'In rabbits and rodents, >12h without eating risks fatal GI stasis.',
    });
  }
  if (birdWeaknessRisk) {
    reasons.push({
      es: 'Las aves ocultan enfermedades hasta estar graves; la apatía o falta de apetito requiere veterinario de exóticos hoy.',
      en: 'Birds hide illness until critical; lethargy or appetite loss needs same-day avian vet care.',
    });
  }
  if (catNoAppetiteLong) {
    reasons.push({
      es: 'En gatos, más de 24h sin comer conlleva riesgo de lipidosis hepática.',
      en: 'In cats, >24h without eating risks hepatic lipidosis.',
    });
  }
  if (vulnerableAge && level !== 'monitor') {
    reasons.push({
      es: 'Los cachorros y animales senior se deshidratan y descompensan más rápido.',
      en: 'Puppies/kittens and senior pets dehydrate and decompensate faster.',
    });
  }

  const guidance = {
    emergency: {
      badge: { es: 'URGENCIA INMEDIATA', en: 'IMMEDIATE EMERGENCY' },
      title: { es: 'Acude a urgencias veterinarias ahora', en: 'Go to an emergency vet now' },
      subtitle: {
        es: 'No esperes a ver si mejora. Llama de camino para que preparen el box de triaje.',
        en: 'Do not wait to see if it improves. Call ahead so the ER team is ready.',
      },
      dos: {
        es: [
          'Mantén a tu mascota tranquila, abrigada y con mínima manipulación.',
          'Si hubo vómito o ingestión de algo, haz una foto del envase o del vómito.',
          'Llama a la clínica de urgencias más cercana antes de salir.',
        ],
        en: [
          'Keep your pet calm, warm, and minimize movement.',
          'Take a photo of any packaging, plant, or vomit.',
          'Call the nearest ER clinic while on your way.',
        ],
      },
      donts: {
        es: [
          'NO des medicamentos humanos (ibuprofeno, paracetamol, aspirina).',
          'NO provoques el vómito sin indicación telefónica de un veterinario.',
          'NO fuerces comida ni agua si está muy decaído o vomitando.',
        ],
        en: [
          'DO NOT give human medications (ibuprofen, acetaminophen, aspirin).',
          'DO NOT induce vomiting unless explicitly instructed by a vet.',
          'DO NOT force food or water if lethargic or vomiting.',
        ],
      },
    },
    vet24h: {
      badge: { es: 'CONSULTA EN 24H', en: 'VET VISIT WITHIN 24H' },
      title: { es: 'Pide cita veterinaria hoy o mañana', en: 'Schedule a vet visit today or tomorrow' },
      subtitle: {
        es: 'No parece riesgo vital inmediato, pero requiere exploración profesional pronto.',
        en: 'Not an immediate life threat, but needs professional evaluation soon.',
      },
      dos: {
        es: [
          'Ofrece agua fresca en pequeñas cantidades frecuentes.',
          'Anota la hora exacta de cada episodio (vómito, deposición, cojera).',
          'Prepara la Ficha de Consulta en esta app para llevarla al veterinario.',
        ],
        en: [
          'Offer fresh water in small, frequent amounts.',
          'Log the exact time of each episode (vomit, stool, limp).',
          'Generate the Vet-Visit Brief in this app to bring to your appointment.',
        ],
      },
      donts: {
        es: [
          'NO automediques con sobras de tratamientos anteriores.',
          'NO salgas a correr ni hagas ejercicio intenso hasta que lo valoren.',
        ],
        en: [
          'DO NOT self-medicate with leftover prescriptions.',
          'DO NOT do intense exercise until evaluated.',
        ],
      },
    },
    monitor: {
      badge: { es: 'OBSERVAR EN CASA', en: 'MONITOR AT HOME' },
      title: { es: 'Cuidados suaves y observación 12-24h', en: 'Gentle home care & 12-24h monitoring' },
      subtitle: {
        es: 'Los síntomas son leves. Vigila su evolución y acude al vet si empeora.',
        en: 'Symptoms appear mild. Watch closely and visit a vet if anything worsens.',
      },
      dos: {
        es: [
          'Asegura hidratación constante y un lugar tranquilo para descansar.',
          'Si es digestivo leve, consulta con tu vet si conviene ayuno corto o dieta blanda.',
          'Revisa encías (deben estar rosadas y húmedas) y nivel de energía cada 4 horas.',
        ],
        en: [
          'Ensure steady hydration and a quiet resting space.',
          'Check gums (pink & moist) and energy level every 4 hours.',
          'Log any new symptom in the Pet Diary.',
        ],
      },
      donts: {
        es: [
          'NO ignores si aparecen nuevos síntomas (sangre, fiebre, apatía extrema).',
          'NO des lácteos ni comida con grasa o huesos.',
        ],
        en: [
          'DO NOT ignore new symptoms (blood, fever, extreme lethargy).',
          'DO NOT give dairy, fatty scraps, or cooked bones.',
        ],
      },
    },
  };

  return {
    level,
    reasons,
    matchedSymptoms,
    guidance: guidance[level],
  };
}

export const TOXINS_DB = [
  {
    id: 'dark_chocolate',
    name: { es: 'Chocolate negro / cacao puro (>70%)', en: 'Dark chocolate / baking cocoa (>70%)' },
    speciesRisk: ['dog', 'cat'],
    unitLabel: { es: 'gramos (g)', en: 'grams (g)' },
    mgPerUnit: 14,
    mildThresholdMgKg: 15,
    severeThresholdMgKg: 40,
    mechanism: {
      es: 'Contiene teobromina y cafeína: provoca taquicardia, temblores, vómitos y convulsiones.',
      en: 'Contains theobromine & caffeine: causes tachycardia, tremors, vomiting, and seizures.',
    },
  },
  {
    id: 'milk_chocolate',
    name: { es: 'Chocolate con leche', en: 'Milk chocolate' },
    speciesRisk: ['dog', 'cat'],
    unitLabel: { es: 'gramos (g)', en: 'grams (g)' },
    mgPerUnit: 2.2,
    mildThresholdMgKg: 15,
    severeThresholdMgKg: 40,
    mechanism: {
      es: 'Menor concentración de teobromina, pero peligroso en perros pequeños o grandes cantidades.',
      en: 'Lower theobromine concentration, still dangerous for small dogs or large amounts.',
    },
  },
  {
    id: 'grapes_raisins',
    name: { es: 'Uvas o pasas', en: 'Grapes or raisins' },
    speciesRisk: ['dog', 'cat'],
    unitLabel: { es: 'unidades (uvas/pasas)', en: 'pieces (grapes/raisins)' },
    anyAmountCritical: true,
    mechanism: {
      es: 'Toxicidad renal impredecible (ácido tartárico): incluso 1-2 uvas pueden causar fallo renal agudo.',
      en: 'Unpredictable kidney toxicity (tartaric acid): even 1-2 grapes can trigger acute renal failure.',
    },
  },
  {
    id: 'xylitol',
    name: { es: 'Xilitol (chicles, pasta dental, sin azúcar)', en: 'Xylitol / Birch sugar (gum, sugar-free)' },
    speciesRisk: ['dog'],
    unitLabel: { es: 'gramos o chicles (aprox 1g/u)', en: 'grams or gum pieces (~1g each)' },
    mgPerUnit: 1000,
    mildThresholdMgKg: 50,
    severeThresholdMgKg: 100,
    mechanism: {
      es: 'En perros dispara la insulina en 15-30 min causando hipoglucemia severa y daño hepático.',
      en: 'Triggers massive insulin release in dogs within 15-30 min, causing severe hypoglycemia & liver injury.',
    },
  },
  {
    id: 'ibuprofen',
    name: { es: 'Ibuprofeno (pastillas humanas)', en: 'Ibuprofen (human NSAID)' },
    speciesRisk: ['dog', 'cat'],
    unitLabel: { es: 'miligramos totales (ej. 400 o 600)', en: 'total milligrams (e.g. 200 or 400)' },
    mgPerUnit: 1,
    mildThresholdMgKg: 15,
    severeThresholdMgKg: 50,
    catAlwaysSevere: true,
    mechanism: {
      es: 'Causa úlceras gástricas perforantes y fallo renal agudo. En gatos es extremadamente tóxico.',
      en: 'Causes severe GI ulcers and acute kidney failure. Extremely toxic to cats.',
    },
  },
  {
    id: 'paracetamol',
    name: { es: 'Paracetamol / Acetaminofén', en: 'Acetaminophen / Paracetamol (Tylenol)' },
    speciesRisk: ['dog', 'cat'],
    unitLabel: { es: 'miligramos totales (ej. 500)', en: 'total milligrams (e.g. 500)' },
    mgPerUnit: 1,
    mildThresholdMgKg: 50,
    severeThresholdMgKg: 100,
    catAlwaysSevere: true,
    mechanism: {
      es: 'En GATOS es mortal incluso en dosis mínimas (destruye glóbulos rojos). En perros daña el hígado.',
      en: 'LETHAL in CATS even at tiny doses (methemoglobinemia). Causes liver failure in dogs.',
    },
  },
  {
    id: 'lilies',
    name: { es: 'Lirios / Azucenas (hojas, flor o polen)', en: 'Lilies (leaves, petals, pollen, vase water)' },
    speciesRisk: ['cat', 'dog'],
    unitLabel: { es: 'hojas o contacto (1 = mínimo)', en: 'leaves or contact (1 = minimal)' },
    catAlwaysSevere: true,
    mildThresholdMgKg: 999999,
    severeThresholdMgKg: 999999,
    mgPerUnit: 1,
    mechanism: {
      es: 'En GATOS cualquier contacto (incluso lamer polen del pelaje) causa fallo renal mortal en 24-72h.',
      en: 'In CATS, ANY exposure (even licking pollen off fur) causes fatal kidney failure within 24-72h.',
    },
  },
  {
    id: 'onion_garlic',
    name: { es: 'Cebolla, ajo o puerro', en: 'Onion, garlic, or chives' },
    speciesRisk: ['dog', 'cat'],
    unitLabel: { es: 'gramos (g)', en: 'grams (g)' },
    mgPerUnit: 1000,
    mildThresholdMgKg: 5000,
    severeThresholdMgKg: 15000,
    mechanism: {
      es: 'Oxida y rompe los glóbulos rojos produciendo anemia hemolítica (los gatos son más sensibles).',
      en: 'Damages red blood cells causing hemolytic anemia (cats are especially sensitive).',
    },
  },
  {
    id: 'rat_poison',
    name: { es: 'Veneno para ratas / raticida', en: 'Rat poison / rodenticide' },
    speciesRisk: ['dog', 'cat'],
    unitLabel: { es: 'gramos aproximados (g)', en: 'approx grams (g)' },
    anyAmountCritical: true,
    mechanism: {
      es: 'Puede causar hemorragias internas tardías (3-5 días) o edema cerebral según el tipo.',
      en: 'Can cause delayed internal bleeding (3-5 days) or brain swelling depending on active ingredient.',
    },
  },
];

export const FOOD_PLANT_GUIDE = [
  { id: 'fp_apple', cat: 'fruit', status: 'safe', name: { es: 'Manzana (sin semillas ni corazón)', en: 'Apple (seedless, no core)' }, note: { es: 'Segura en trozos pequeños. Rica en fibra.', en: 'Safe in small slices. Rich in fiber.' } },
  { id: 'fp_carrot', cat: 'fruit', status: 'safe', name: { es: 'Zanahoria cruda o cocida', en: 'Carrots (raw or cooked)' }, note: { es: 'Snack bajo en calorías ideal para perros.', en: 'Great low-calorie snack for dogs.' } },
  { id: 'fp_blueberry', cat: 'fruit', status: 'safe', name: { es: 'Arándanos', en: 'Blueberries' }, note: { es: 'Antioxidantes seguros para perros y gatos.', en: 'Safe antioxidants for dogs & cats.' } },
  { id: 'fp_cheese', cat: 'human', status: 'caution', name: { es: 'Queso fresco / curado', en: 'Plain cheese' }, note: { es: 'Solo en muy poca cantidad; muchos son intolerantes a la lactosa.', en: 'Tiny amounts only; many pets are lactose intolerant.' } },
  { id: 'fp_avocado', cat: 'fruit', status: 'toxic', name: { es: 'Aguacate (hueso, piel y pulpa)', en: 'Avocado (pit, skin & flesh)' }, note: { es: 'Contiene persina; riesgo de vómitos y obstrucción por el hueso.', en: 'Contains persin; GI upset and pit choking/obstruction risk.' } },
  { id: 'fp_grapes', cat: 'fruit', status: 'toxic', name: { es: 'Uvas y pasas', en: 'Grapes & raisins' }, note: { es: 'Pueden provocar fallo renal agudo incluso en dosis mínimas.', en: 'Can trigger acute kidney failure even in small amounts.' }, toxinId: 'grapes_raisins' },
  { id: 'fp_choc', cat: 'human', status: 'toxic', name: { es: 'Chocolate / Cacao', en: 'Chocolate / Cocoa' }, note: { es: 'Teobromina tóxica. Usa la calculadora arriba.', en: 'Toxic theobromine. Use calculator above.' }, toxinId: 'dark_chocolate' },
  { id: 'fp_xylitol', cat: 'human', status: 'toxic', name: { es: 'Xilitol (chicles, crema cacahuete sin azúcar)', en: 'Xylitol (gum, sugar-free peanut butter)' }, note: { es: 'Hipoglucemia fulminante y fallo hepático en perros.', en: 'Rapid hypoglycemia & liver failure in dogs.' }, toxinId: 'xylitol' },
  { id: 'fp_lilies', cat: 'plant', status: 'toxic', name: { es: 'Lirios / Azucenas', en: 'Lilies' }, note: { es: 'MORTAL en gatos incluso por lamer el polen o el agua del jarrón.', en: 'FATAL to cats even from licking pollen or vase water.' }, toxinId: 'lilies' },
  { id: 'fp_monstera', cat: 'plant', status: 'caution', name: { es: 'Monstera / Poto', en: 'Monstera / Pothos' }, note: { es: 'Oxalatos insolubles: irritación oral, babeo y vómitos.', en: 'Insoluble oxalates: mouth irritation, drooling, vomiting.' } },
  { id: 'fp_ibuprofen', cat: 'meds', status: 'toxic', name: { es: 'Ibuprofeno / Naproxeno', en: 'Ibuprofen / Naproxen' }, note: { es: 'Úlceras gástricas graves y daño renal.', en: 'Severe stomach ulcers & kidney injury.' }, toxinId: 'ibuprofen' },
  { id: 'fp_paracetamol', cat: 'meds', status: 'toxic', name: { es: 'Paracetamol (Tylenol)', en: 'Acetaminophen / Paracetamol' }, note: { es: 'Mortal en gatos; tóxico hepático en perros.', en: 'Fatal in cats; liver toxin in dogs.' }, toxinId: 'paracetamol' },
];

export const FIRST_AID_GUIDES = [
  {
    id: 'fa_choking',
    icon: 'wind',
    title: { es: 'Atragantamiento / Asfixia', en: 'Choking / Airway Block' },
    steps: {
      es: [
        'Abre la boca con cuidado; si ves el objeto claramente y puedes cogerlo con pinzas o dedos sin empujarlo más adentro, retíralo.',
        'Perro pequeño o gato: colócalo boca abajo suavemente sobre tu antebrazo y da 4-5 palmadas firmes entre los omóplatos.',
        'Perro grande: abrázalo por detrás bajo las costillas y realiza 4-5 compresiones rápidas hacia arriba y adelante (Maniobra de Heimlich).',
        'Acude a urgencias inmediatamente incluso si logra expulsarlo para descartar lesiones.',
      ],
      en: [
        'Carefully open the mouth; only remove the object if clearly visible and easy to grab without pushing it deeper.',
        'Small dog or cat: hold gently head-down along your forearm and give 4-5 firm back blows between shoulder blades.',
        'Large dog: stand behind, place hands below ribcage, and give 4-5 quick upward/forward thrusts (Heimlich).',
        'Go to an ER vet immediately even if cleared to check for airway trauma.',
      ],
    },
  },
  {
    id: 'fa_heatstroke',
    icon: 'thermometer',
    title: { es: 'Golpe de Calor', en: 'Heatstroke' },
    steps: {
      es: [
        'Lleva a tu mascota a la sombra o a un lugar con aire acondicionado de inmediato.',
        'Moja patas, abdomen y axilas con agua FRESCA (nunca agua helada ni hielo directo, porque contrae los vasos y retiene el calor).',
        'Ofrece agua fresca en sorbos pequeños si está consciente; no la fuerces.',
        'Trasládala a urgencias con las ventanillas abiertas o aire puesto.',
      ],
      en: [
        'Move your pet into shade or air conditioning immediately.',
        'Wet paws, belly, and armpits with COOL water (never ice-cold water or ice packs directly).',
        'Offer small sips of cool water if alert; do not force.',
        'Transport to an ER vet immediately with AC or windows open.',
      ],
    },
  },
  {
    id: 'fa_bleeding',
    icon: 'bandage',
    title: { es: 'Herida o Hemorragia Activa', en: 'Active Bleeding / Wound' },
    steps: {
      es: [
        'Coloca una gasa estéril o paño limpio directamente sobre la herida.',
        'Aplica presión firme y continua durante al menos 5 minutos sin levantar la gasa para mirar.',
        'Si la sangre empapa la primera gasa, pon otra encima sin quitar la primera.',
        'Si el sangrado no cede en 5-10 min o es arterial (sale a pulsos), acude a urgencias.',
      ],
      en: [
        'Place sterile gauze or a clean cloth directly over the wound.',
        'Apply firm, continuous pressure for at least 5 minutes without lifting to peek.',
        'If blood soaks through, add another layer on top without removing the first.',
        'If bleeding persists past 5-10 min or spurts, go to ER immediately.',
      ],
    },
  },
  {
    id: 'fa_seizure',
    icon: 'zap',
    title: { es: 'Convulsión en Curso', en: 'Active Seizure' },
    steps: {
      es: [
        'NO metas la mano en su boca (no se tragan la lengua y pueden morder involuntariamente).',
        'Aparta muebles u objetos duros alrededor y pon un cojín bajo su cabeza si es seguro.',
        'Cronometra la duración exacta y graba un vídeo corto para enseñárselo al veterinario.',
        'Si dura más de 3-5 minutos o repite varias seguidas (estatus epiléptico), es urgencia vital.',
      ],
      en: [
        'DO NOT put your hands near their mouth (they cannot swallow their tongue).',
        'Clear away hard furniture and place a soft pillow under their head if safe.',
        'Time the exact duration and record a short video for your vet.',
        'If it lasts >3-5 minutes or clusters occur, go to ER immediately.',
      ],
    },
  },
];

export function evaluateToxin({ toxinId, species, weightKg, amount }) {
  const toxin = TOXINS_DB.find((t) => t.id === toxinId);
  if (!toxin) return null;

  const safeWeight = Number(weightKg);
  const safeAmount = Number(amount);

  if (!Number.isFinite(safeWeight) || safeWeight <= 0 || !Number.isFinite(safeAmount) || safeAmount <= 0) {
    return { valid: false };
  }

  const totalMg = safeAmount * (toxin.mgPerUnit || 1);
  const doseMgKg = totalMg / safeWeight;

  let risk = 'low';
  if (toxin.anyAmountCritical || (species === 'cat' && toxin.catAlwaysSevere)) {
    risk = 'critical';
  } else if (doseMgKg >= toxin.severeThresholdMgKg) {
    risk = 'critical';
  } else if (doseMgKg >= toxin.mildThresholdMgKg) {
    risk = 'moderate';
  }

  return {
    valid: true,
    toxin,
    doseMgKg: Math.round(doseMgKg * 10) / 10,
    risk,
  };
}

export const COST_REGIONS = [
  { id: 'ES', label: { es: 'España (€)', en: 'Spain (€)' }, currency: '€', multiplier: 1.0 },
  { id: 'MX', label: { es: 'México ($ MXN)', en: 'Mexico ($ MXN)' }, currency: '$', multiplier: 14.5, suffix: ' MXN' },
  { id: 'US', label: { es: 'EE.UU. ($ USD)', en: 'USA ($ USD)' }, currency: '$', multiplier: 2.35, suffix: ' USD' },
  { id: 'LATAM', label: { es: 'Latam ($ USD)', en: 'Latam ($ USD)' }, currency: '$', multiplier: 0.85, suffix: ' USD' },
];

export const COST_SCENARIOS = [
  {
    id: 'consult_blood',
    label: { es: 'Consulta + Analítica de sangre básica', en: 'Consultation + Basic Blood Panel' },
    items: [
      { name: { es: 'Consulta veterinaria', en: 'Vet consultation' }, min: 35, max: 55 },
      { name: { es: 'Hemograma y bioquímica', en: 'CBC & chemistry panel' }, min: 55, max: 95 },
      { name: { es: 'Medicación inicial', en: 'Initial medication' }, min: 15, max: 35 },
    ],
  },
  {
    id: 'gastro_iv',
    label: { es: 'Vómitos / Deshidratación + Suero', en: 'Vomiting / Dehydration + IV Fluids' },
    items: [
      { name: { es: 'Consulta y exploración', en: 'Consultation & exam' }, min: 40, max: 60 },
      { name: { es: 'Antiemético inyectable + fluidos', en: 'Injectable anti-nausea + fluids' }, min: 45, max: 90 },
      { name: { es: 'Test rápido / dieta blanda', en: 'Quick test / bland diet' }, min: 25, max: 55 },
    ],
  },
  {
    id: 'xray_ortho',
    label: { es: 'Cojera / Traumatismo + Radiografías', en: 'Lameness / Trauma + X-Rays' },
    items: [
      { name: { es: 'Consulta traumatológica', en: 'Orthopedic exam' }, min: 40, max: 65 },
      { name: { es: '2 proyecciones radiográficas', en: '2 X-ray views' }, min: 70, max: 130 },
      { name: { es: 'Sedación leve (si necesaria)', en: 'Light sedation (if needed)' }, min: 35, max: 65 },
      { name: { es: 'Antiinflamatorios / vendaje', en: 'Pain meds / bandage' }, min: 25, max: 50 },
    ],
  },
  {
    id: 'toxin_er',
    label: { es: 'Intoxicación + Lavado / Hospitalización 24h', en: 'Poisoning + Detox / 24h Hospitalization' },
    items: [
      { name: { es: 'Estabilización e inducción/carbón activo', en: 'Stabilization & activated charcoal' }, min: 70, max: 140 },
      { name: { es: 'Fluidoterapia IV 24 horas', en: '24h IV fluid therapy' }, min: 120, max: 240 },
      { name: { es: 'Analítica control hepático/renal', en: 'Liver/kidney blood monitoring' }, min: 75, max: 130 },
    ],
  },
  {
    id: 'foreign_body',
    label: { es: 'Cuerpo extraño (ecografía / cirugía)', en: 'Foreign Body (ultrasound / surgery)' },
    items: [
      { name: { es: 'Ecografía abdominal', en: 'Abdominal ultrasound' }, min: 80, max: 150 },
      { name: { es: 'Anestesia + cirugía digestiva', en: 'Anesthesia + GI surgery' }, min: 450, max: 950 },
      { name: { es: 'Hospitalización post-op (24-48h)', en: 'Post-op hospitalization (24-48h)' }, min: 150, max: 320 },
    ],
  },
];

export function estimateCost({ regionId = 'ES', clinicType = 'regular', petSize = 'medium', scenarioId = 'consult_blood' }) {
  const region = COST_REGIONS.find((r) => r.id === regionId) || COST_REGIONS[0];
  const scenario = COST_SCENARIOS.find((s) => s.id === scenarioId) || COST_SCENARIOS[0];

  const clinicFactor = clinicType === 'emergency' ? 1.65 : 1.0;
  const sizeFactor = petSize === 'small' ? 0.9 : petSize === 'large' ? 1.25 : 1.0;

  const breakdown = scenario.items.map((item) => {
    const min = Math.round(item.min * region.multiplier * clinicFactor * sizeFactor);
    const max = Math.round(item.max * region.multiplier * clinicFactor * sizeFactor);
    return {
      name: item.name,
      min,
      max,
    };
  });

  const totalMin = breakdown.reduce((acc, i) => acc + i.min, 0);
  const totalMax = breakdown.reduce((acc, i) => acc + i.max, 0);

  return {
    region,
    scenario,
    breakdown,
    totalMin,
    totalMax,
  };
}

export const I18N = {
  es: {
    appTagline: 'Triaje Veterinario y Costes',
    navTriage: 'Triaje',
    navToxins: 'Tóxicos',
    navCosts: 'Costes',
    navPets: 'Mascotas',
    navBrief: 'Ficha Vet',
    proBadge: 'Pro',
    disclaimer: 'Herramienta orientativa de triaje y preparación. No sustituye el diagnóstico de un veterinario colegiado.',
    activePet: 'Mascota activa',
    addPet: 'Añadir mascota',
    generateBrief: 'Generar Ficha para el Vet',
    copyBrief: 'Copiar para WhatsApp',
    printBrief: 'Imprimir / Guardar PDF',
    copiedSuccess: 'Ficha copiada al portapapeles',
  },
  en: {
    appTagline: 'Vet Triage & Cost Estimator',
    navTriage: 'Triage',
    navToxins: 'Toxins',
    navCosts: 'Costs',
    navPets: 'Pets',
    navBrief: 'Vet Brief',
    proBadge: 'Pro',
    disclaimer: 'Guidance tool for triage & visit prep. Does not replace a licensed veterinarian’s diagnosis.',
    activePet: 'Active pet',
    addPet: 'Add pet',
    generateBrief: 'Generate Vet-Visit Brief',
    copyBrief: 'Copy for WhatsApp / SMS',
    printBrief: 'Print / Save PDF',
    copiedSuccess: 'Brief copied to clipboard',
  },
};

export const BRIEF_QUESTIONS = {
  es: [
    '¿Qué pruebas son imprescindibles hoy y cuáles pueden esperar?',
    '¿Cuál es el presupuesto aproximado antes de realizar pruebas?',
    '¿Qué señales concretas indican que debo volver a urgencias?',
  ],
  en: [
    'Which tests are essential today vs. optional?',
    'Can we review a written cost estimate before running diagnostics?',
    'What specific warning signs mean I should return to the ER?',
  ],
};
