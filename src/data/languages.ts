import { LanguageOption } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en-US',
    matchPrefix: 'en',
    name: 'English (US)',
    nativeName: 'English (United States)',
    flag: '🇺🇸',
    sampleTexts: [
      {
        title: 'Technology & AI',
        text: 'The future of speech synthesis combines zero-latency offline intelligence with expressive human inflections, allowing seamless communication anywhere in the world.',
      },
      {
        title: 'Calm Reflection',
        text: 'Take a slow, deep breath. Notice the gentle rhythm of the air around you, and let any tension fade away into quiet stillness.',
      },
      {
        title: 'Quick Briefing',
        text: 'Good morning! Here is your daily summary: all systems are running with optimum efficiency, and network connectivity is verified.',
      },
    ],
  },
  {
    code: 'en-GB',
    matchPrefix: 'en',
    name: 'English (UK)',
    nativeName: 'English (United Kingdom)',
    flag: '🇬🇧',
    sampleTexts: [
      {
        title: 'Literature',
        text: 'To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment of all.',
      },
      {
        title: 'Weather & Travel',
        text: 'A rather crisp morning in the countryside, with light showers clearing to unveil pleasant afternoon sunshine across the valley.',
      },
    ],
  },
  {
    code: 'es-ES',
    matchPrefix: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    sampleTexts: [
      {
        title: 'Bienvenida',
        text: 'Bienvenido al estudio de síntesis de voz. Puedes escribir cualquier texto y escucharlo con pronunciación natural incluso sin conexión a internet.',
      },
      {
        title: 'Poesía y Vida',
        text: 'Caminante, no hay camino, se hace camino al andar. Al andar se hace el camino, y al volver la vista atrás se ve la senda que nunca se ha de volver a pisar.',
      },
    ],
  },
  {
    code: 'fr-FR',
    matchPrefix: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    sampleTexts: [
      {
        title: 'Présentation',
        text: 'La technologie de synthèse vocale transforme instantanément vos écrits en paroles harmonieuses et naturelles.',
      },
      {
        title: 'Citation classique',
        text: 'On ne voit bien qu’avec le cœur. L’essentiel est invisible pour les yeux.',
      },
    ],
  },
  {
    code: 'de-DE',
    matchPrefix: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    sampleTexts: [
      {
        title: 'Innovation',
        text: 'Die moderne Sprachsynthese ermöglicht eine flüssige und natürliche Aussprache direkt auf Ihrem Gerät, völlig offline und datenschutzfreundlich.',
      },
      {
        title: 'Philosophie',
        text: 'Es ist nicht genug zu wissen, man muss auch anwenden; es ist nicht genug zu wollen, man muss auch tun.',
      },
    ],
  },
  {
    code: 'it-IT',
    matchPrefix: 'it',
    name: 'Italian',
    nativeName: 'Italiano',
    flag: '🇮🇹',
    sampleTexts: [
      {
        title: 'Armonia',
        text: 'La voce umana è lo strumento più bello e versatile, capace di trasmettere emozione, chiarezza e passione in ogni parola.',
      },
      {
        title: 'Cultura',
        text: 'Nel mezzo del cammin di nostra vita mi ritrovai per una selva oscura, ché la diritta via era smarrita.',
      },
    ],
  },
  {
    code: 'pt-BR',
    matchPrefix: 'pt',
    name: 'Portuguese (BR)',
    nativeName: 'Português do Brasil',
    flag: '🇧🇷',
    sampleTexts: [
      {
        title: 'Boas-vindas',
        text: 'Experimente a tecnologia de texto para voz com entonação expressiva, funcionando perfeitamente sem precisar de conexão à internet.',
      },
      {
        title: 'Inspiração',
        text: 'Tudo vale a pena quando a alma não é pequena. O futuro pertence àqueles que acreditam na beleza de seus sonhos.',
      },
    ],
  },
  {
    code: 'ja-JP',
    matchPrefix: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    sampleTexts: [
      {
        title: '挨拶と紹介',
        text: 'こんにちは。テキストを入力するだけで、いつでも自然でクリアな音声を再生できます。オフラインでも安心してご利用いただけます。',
      },
      {
        title: 'ことわざ',
        text: '千里の道も一歩から。日々の小さな積み重ねが、やがて大きな成果となって実を結びます。',
      },
    ],
  },
  {
    code: 'zh-CN',
    matchPrefix: 'zh',
    name: 'Chinese (Simplified)',
    nativeName: '简体中文',
    flag: '🇨🇳',
    sampleTexts: [
      {
        title: '科技与未来',
        text: '欢迎使用高品质语音合成系统。无论在线还是离线，都能为您提供清晰、自然流畅的语音朗读体验。',
      },
      {
        title: '经典名句',
        text: '不积跬步，无以至千里；不积小流，无以成江海。坚持不懈，方能致远。',
      },
    ],
  },
  {
    code: 'ko-KR',
    matchPrefix: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    sampleTexts: [
      {
        title: '환영 인사',
        text: '텍스트를 음성으로 변환하는 스튜디오에 오신 것을 환영합니다. 오프라인에서도 자연스럽고 생생한 발음으로 들으실 수 있습니다.',
      },
      {
        title: '희망의 문장',
        text: '시작이 반이다. 작은 첫걸음이 모여 세상에서 가장 특별하고 빛나는 여정을 완성합니다.',
      },
    ],
  },
  {
    code: 'hi-IN',
    matchPrefix: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    sampleTexts: [
      {
        title: 'स्वागत संदेश',
        text: 'टेक्स्ट टू स्पीच स्टूडियो में आपका स्वागत है। आप किसी भी पाठ को प्राकृतिक और स्पष्ट आवाज़ में बिना इंटरनेट के भी सुन सकते हैं।',
      },
    ],
  },
  {
    code: 'ar-SA',
    matchPrefix: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    sampleTexts: [
      {
        title: 'مرحبا بكم',
        text: 'مرحباً بكم في استوديو تحويل النص إلى كلام. استمتع بنطق نقي وطبيعي يدعم العمل بشكل كامل دون اتصال بالإنترنت.',
      },
    ],
  },
  {
    code: 'ru-RU',
    matchPrefix: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    sampleTexts: [
      {
        title: 'Введение',
        text: 'Добро пожаловать в студию синтеза речи. Вы можете преобразовывать любой текст в живой и выразительный голос в автономном режиме.',
      },
    ],
  },
  {
    code: 'nl-NL',
    matchPrefix: 'nl',
    name: 'Dutch',
    nativeName: 'Nederlands',
    flag: '🇳🇱',
    sampleTexts: [
      {
        title: 'Welkom',
        text: 'Welkom bij de tekst-naar-spraak studio. Ervaar heldere en natuurlijke stemmen die ook offline uitstekend functioneren.',
      },
    ],
  },
  {
    code: 'tr-TR',
    matchPrefix: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    flag: '🇹🇷',
    sampleTexts: [
      {
        title: 'Hoş Geldiniz',
        text: 'Metinden sese dönüştürme stüdyosuna hoş geldiniz. Çevrimdışı desteğiyle metinlerinizi doğal ve akıcı bir sesle dinleyin.',
      },
    ],
  },
  {
    code: 'pl-PL',
    matchPrefix: 'pl',
    name: 'Polish',
    nativeName: 'Polski',
    flag: '🇵🇱',
    sampleTexts: [
      {
        title: 'Powitanie',
        text: 'Witaj w studiu syntezy mowy. Odtwarzaj dowolne teksty naturalnym głosem, również bez połączenia z siecią.',
      },
    ],
  },
  {
    code: 'sv-SE',
    matchPrefix: 'sv',
    name: 'Swedish',
    nativeName: 'Svenska',
    flag: '🇸🇪',
    sampleTexts: [
      {
        title: 'Välkommen',
        text: 'Välkommen till text-till-tal studion. Skriv in din text och lyssna med klar och naturlig röst offline.',
      },
    ],
  },
  {
    code: 'vi-VN',
    matchPrefix: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    sampleTexts: [
      {
        title: 'Chào mừng',
        text: 'Chào mừng bạn đến với ứng dụng chuyển văn bản thành giọng nói. Trải nghiệm âm thanh tự nhiên và mượt mà ngay cả khi ngoại tuyến.',
      },
    ],
  },
  {
    code: 'id-ID',
    matchPrefix: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    sampleTexts: [
      {
        title: 'Selamat Datang',
        text: 'Selamat datang di studio teks-ke-suara. Ketik teks apa saja dan dengarkan dengan suara alami bahkan saat offline.',
      },
    ],
  },
];
