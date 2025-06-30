import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive translation data
const translations = {
  en: {
    // Navigation
    'nav.kids': 'Kids',
    'nav.myLibrary': 'My Library',
    'nav.account': 'Account',
    'nav.reborn': 'REBORN',
    
    // Home Page - Hero Section
    'hero.listen': 'Listen',
    'hero.imagine': 'Imagine',
    'hero.become': 'Become',
    'hero.title': 'Something new every day',
    'hero.subtitle': 'The world\'s first podcast-style audiobook platform with real-world examples',
    'hero.startLearning': 'Start Learning',
    
    // Home Page - How It Works
    'howItWorks.title': 'How REBORN Works',
    'howItWorks.subtitle': 'Transform your learning journey with our simple three-step process',
    'howItWorks.pickBook': 'Pick a Book',
    'howItWorks.pickBookDesc': 'Choose from our curated list of engaging books.',
    'howItWorks.listenInteract': 'Listen & Interact',
    'howItWorks.listenInteractDesc': 'Enjoy podcast-style audio with real-world examples.',
    'howItWorks.testGrow': 'Test & Grow',
    'howItWorks.testGrowDesc': 'Take quizzes and track your progress as you learn.',
    
    // Home Page - Books Section
    'books.title': 'Most Loved Books',
    'books.subtitle': 'Discover the titles that shaped minds and sparked new habits. Curated from millions of listening hours, our Most Loved Books help you start your journey strong, with proven favourites from every category.',
    
    // Home Page - Shuffle Hero
    'shuffle.everyMoment': 'REBORN Every Moment',
    'shuffle.subtitle': 'Forget carving out time. Slip in a little learning in the car, waiting in line, over lunch, before bed, or whenever you\'ve got a moment.',
    'shuffle.driving': 'Driving',
    'shuffle.chores': 'Doing Chores',
    'shuffle.training': 'Training',
    'shuffle.commuting': 'Commuting',
    
    // Home Page - Testimonials
    'testimonials.title': 'People Who REBORN',
    'testimonials.subtitle': 'Don\'t just take our word for it. See how real users transformed their commutes, routines, and mindsets with Reborn. These are the voices of a growing global community of learners—just like you.',
    
    // Home Page - FAQ
    'faq.title': 'Seeking Clarity? REBORN Illuminates the Path.',
    
    // Kids Page
    'kids.title': 'Kids Corner',
    'kids.subtitle': 'Safe, fun, and educational audiobooks for children 📚✨',
    'kids.safeContent': 'Safe Content',
    'kids.safeContentDesc': 'Age-appropriate stories',
    'kids.parentalControls': 'Parental Controls',
    'kids.parentalControlsDesc': 'Monitor listening time',
    'kids.educational': 'Educational',
    'kids.educationalDesc': 'Learn while having fun',
    'kids.featuredStories': 'Featured Stories ✨',
    'kids.searchPlaceholder': 'Search magical books... 🔍✨',
    'kids.allAges': 'All Ages 👶👧👦',
    'kids.allBooks': 'All Books',
    'kids.stories': 'Stories',
    'kids.adventures': 'Adventures',
    'kids.topRated': 'Top Rated',
    'kids.noBooks': 'No magical books found',
    'kids.noBooksSub': 'Try adjusting your search terms or age range to find more adventures! ✨',
    'kids.clearFilters': 'Clear Filters & Explore',
    
    // My Library Page
    'library.title': 'My Library',
    'library.subtitle': 'Your personal collection of audiobooks',
    'library.liveComm': 'Live Community',
    'library.listening': 'listening',
    'library.totalBooks': 'Total Books',
    'library.inProgress': 'In Progress',
    'library.completed': 'Completed',
    'library.totalHours': 'Total Hours',
    'library.searchPlaceholder': 'Search your library...',
    'library.browseCategory': 'Browse by Category',
    'library.allBooks': 'All Books',
    'library.favorites': 'Favourites',
    'library.noBooks': 'No books found',
    'library.noBooksDesc': 'Try adjusting your search terms or filters',
    'library.clearFilters': 'Clear All Filters',
    'library.exploreBooks': 'Explore Books',
    'library.lastPlayed': 'Last played:',
    'library.complete': 'complete',
    'library.narratedBy': 'Narrated by',
    
    // Account Page
    'account.title': 'Account Settings',
    'account.subtitle': 'Manage your account preferences and settings',
    'account.profile': 'Profile',
    'account.subscription': 'Subscription',
    'account.payment': 'Payment',
    'account.preferences': 'Preferences',
    'account.security': 'Security',
    
    // Profile Tab
    'profile.edit': 'Edit',
    'profile.cancel': 'Cancel',
    'profile.save': 'Save Changes',
    'profile.memberSince': 'Member since',
    'profile.totalListening': 'Total Listening',
    'profile.booksCompleted': 'Books Completed',
    'profile.favoriteBooks': 'Favorite Books',
    'profile.clickForDetails': 'Click for details',
    'profile.viewCompleted': 'View completed books',
    'profile.viewFavorites': 'View favorites',
    'profile.editProfile': 'Edit Profile',
    'profile.fullName': 'Full Name',
    'profile.email': 'Email',
    'profile.phone': 'Phone',
    'profile.favoriteGenres': 'Favorite Genres',
    'profile.addGenre': 'Add Genre',
    
    // Subscription Tab
    'subscription.choosePlan': 'Choose Your Plan',
    'subscription.description': 'Upgrade or change your subscription plan\nAll plans include access to our audiobook library and core features.',
    'subscription.free': 'Free',
    'subscription.premium': 'Premium',
    'subscription.family': 'Family',
    'subscription.currentPlan': 'Current Plan',
    'subscription.upgrade': 'Upgrade',
    'subscription.downgrade': 'Downgrade',
    'subscription.forever': 'forever',
    'subscription.month': 'month',
    'subscription.billedMonthly': 'billed monthly',
    'subscription.billedAnnually': 'billed annually',
    'subscription.save20': 'Save 20%',
    
    // Payment Tab
    'payment.methods': 'Payment Methods',
    'payment.addMethod': 'Add Payment Method',
    'payment.expires': 'Expires',
    'payment.default': 'Default',
    'payment.setDefault': 'Set as Default',
    
    // Preferences Tab
    'preferences.notifications': 'Notifications',
    'preferences.language': 'Language',
    'preferences.preferredLanguage': 'Preferred Language',
    'preferences.languageDescription': 'This will affect the app interface and available content languages.',
    'preferences.playbackSettings': 'Playback Settings',
    'preferences.autoPlayNext': 'Auto Play Next Chapter',
    'preferences.autoPlayDescription': 'Automatically play the next chapter when current one ends',
    'preferences.sleepTimer': 'Sleep Timer',
    'preferences.sleepTimerDescription': 'Default sleep timer duration',
    'preferences.playbackSpeed': 'Playback Speed',
    'preferences.playbackSpeedDescription': 'Default playback speed',
    'preferences.newReleases': 'New Releases',
    'preferences.newReleasesDescription': 'Get notified about new book releases',
    'preferences.recommendations': 'Recommendations',
    'preferences.recommendationsDescription': 'Receive personalized book recommendations',
    'preferences.promotions': 'Promotions',
    'preferences.promotionsDescription': 'Get updates about special offers and promotions',
    'preferences.reminders': 'Reminders',
    'preferences.remindersDescription': 'Receive reading reminders and progress updates',
    
    // Security Tab
    'security.settings': 'Security Settings',
    'security.currentPassword': 'Current Password',
    'security.newPassword': 'New Password',
    'security.confirmPassword': 'Confirm New Password',
    'security.updatePassword': 'Update Password',
    'security.twoFactor': 'Two-Factor Authentication',
    'security.enable2FA': 'Enable 2FA',
    'security.enable2FADescription': 'Add an extra layer of security to your account',
    'security.enable': 'Enable',
    'security.dangerZone': 'Danger Zone',
    'security.deleteAccount': 'Delete Account',
    'security.deleteAccountDescription': 'Permanently delete your account and all data',
    
    // Common
    'common.back': 'Back',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.play': 'Play',
    'common.pause': 'Pause',
    'common.download': 'Download',
    'common.favorite': 'Favorite',
    'common.share': 'Share',
    'common.rating': 'Rating',
    'common.duration': 'Duration',
    'common.author': 'Author',
    'common.narrator': 'Narrator',
    'common.category': 'Category',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    'common.new': 'NEW',
    'common.featured': 'Featured',
    'common.popular': 'Popular',
    'common.recommended': 'Recommended',
    
    // Languages
    'language.english': 'English',
    'language.spanish': 'Spanish',
    
    // Subscription Features
    'features.booksPerMonth': 'books per month',
    'features.unlimitedBooks': 'Unlimited books',
    'features.basicAudio': 'Basic audio quality',
    'features.highQualityAudio': 'High-quality audio',
    'features.limitedDownloads': 'Limited offline downloads',
    'features.unlimitedDownloads': 'Unlimited offline downloads',
    'features.communitySupport': 'Community support',
    'features.earlyAccess': 'Early access to new releases',
    'features.prioritySupport': 'Priority support',
    'features.advancedAnalytics': 'Advanced analytics',
    'features.familyMembers': 'Up to 6 family members',
    'features.kidsContent': 'Kids content included',
    'features.individualProfiles': 'Individual profiles',
    'features.parentalControls': 'Parental controls',
    'features.familySharing': 'Family sharing',
    
    // Subscription Descriptions
    'subscription.freeDescription': 'Perfect for casual listeners',
    'subscription.premiumDescription': 'Most popular choice for avid learners',
    'subscription.familyDescription': 'Perfect for families with children',
    
    // Categories
    'category.all': 'All Books',
    'category.productivity': 'Productivity',
    'category.startupBusiness': 'Startup & Business',
    'category.marketingSales': 'Marketing & Sales',
    'category.healthFitness': 'Health & Fitness',
    'category.mindfulnessMeditation': 'Mindfulness & Meditation',
    'category.leadership': 'Leadership',
    'category.personalGrowth': 'Personal Growth',
    'category.moneyFinance': 'Money & Finance',
    'category.habitsPsychology': 'Habits & Psychology',
    'category.spiritualityPhilosophy': 'Spirituality & Philosophy',
    'category.relationships': 'Relationships',
    'category.timeManagement': 'Time Management',
    'category.careerSkills': 'Career & Skills',
    'category.creativityWriting': 'Creativity & Writing',
    'category.scienceTechnology': 'Science & Technology',
    
    // Kids Categories
    'kidsCategory.adventure': 'Adventure',
    'kidsCategory.educational': 'Educational',
    'kidsCategory.stories': 'Stories',
    'kidsCategory.beginner': 'Beginner',
    'kidsCategory.intermediate': 'Intermediate',
    'kidsCategory.advanced': 'Advanced',
    
    // Time and Progress
    'time.hours': 'hours',
    'time.minutes': 'minutes',
    'time.seconds': 'seconds',
    'time.ago': 'ago',
    'time.day': 'day',
    'time.days': 'days',
    'time.week': 'week',
    'time.weeks': 'weeks',
    'time.month': 'month',
    'time.months': 'months',
    'time.year': 'year',
    'time.years': 'years',
    
    // Status
    'status.downloading': 'Downloading...',
    'status.downloaded': 'Downloaded',
    'status.playing': 'Playing',
    'status.paused': 'Paused',
    'status.completed': 'Completed',
    'status.inProgress': 'In Progress',
    'status.notStarted': 'Not Started',
  },
  es: {
    // Navigation
    'nav.kids': 'Niños',
    'nav.myLibrary': 'Mi Biblioteca',
    'nav.account': 'Cuenta',
    'nav.reborn': 'REBORN',
    
    // Home Page - Hero Section
    'hero.listen': 'Escucha',
    'hero.imagine': 'Imagina',
    'hero.become': 'Conviértete',
    'hero.title': 'Algo nuevo cada día',
    'hero.subtitle': 'La primera plataforma de audiolibros estilo podcast del mundo con ejemplos del mundo real',
    'hero.startLearning': 'Comenzar a Aprender',
    
    // Home Page - How It Works
    'howItWorks.title': 'Cómo Funciona REBORN',
    'howItWorks.subtitle': 'Transforma tu viaje de aprendizaje con nuestro simple proceso de tres pasos',
    'howItWorks.pickBook': 'Elige un Libro',
    'howItWorks.pickBookDesc': 'Elige de nuestra lista curada de libros atractivos.',
    'howItWorks.listenInteract': 'Escucha e Interactúa',
    'howItWorks.listenInteractDesc': 'Disfruta audio estilo podcast con ejemplos del mundo real.',
    'howItWorks.testGrow': 'Prueba y Crece',
    'howItWorks.testGrowDesc': 'Toma cuestionarios y rastrea tu progreso mientras aprendes.',
    
    // Home Page - Books Section
    'books.title': 'Libros Más Queridos',
    'books.subtitle': 'Descubre los títulos que moldearon mentes y despertaron nuevos hábitos. Curados de millones de horas de escucha, nuestros Libros Más Queridos te ayudan a comenzar tu viaje con fuerza, con favoritos probados de cada categoría.',
    
    // Home Page - Shuffle Hero
    'shuffle.everyMoment': 'REBORN Cada Momento',
    'shuffle.subtitle': 'Olvídate de reservar tiempo. Incluye un poco de aprendizaje en el auto, esperando en fila, durante el almuerzo, antes de dormir, o cuando tengas un momento.',
    'shuffle.driving': 'Conduciendo',
    'shuffle.chores': 'Haciendo Tareas',
    'shuffle.training': 'Entrenando',
    'shuffle.commuting': 'Viajando al Trabajo',
    
    // Home Page - Testimonials
    'testimonials.title': 'Personas que REBORN',
    'testimonials.subtitle': 'No solo tomes nuestra palabra. Ve cómo usuarios reales transformaron sus viajes, rutinas y mentalidades con Reborn. Estas son las voces de una creciente comunidad global de aprendices—como tú.',
    
    // Home Page - FAQ
    'faq.title': '¿Buscas Claridad? REBORN Ilumina el Camino.',
    
    // Kids Page
    'kids.title': 'Rincón de Niños',
    'kids.subtitle': 'Audiolibros seguros, divertidos y educativos para niños 📚✨',
    'kids.safeContent': 'Contenido Seguro',
    'kids.safeContentDesc': 'Historias apropiadas para la edad',
    'kids.parentalControls': 'Controles Parentales',
    'kids.parentalControlsDesc': 'Monitorea el tiempo de escucha',
    'kids.educational': 'Educativo',
    'kids.educationalDesc': 'Aprende mientras te diviertes',
    'kids.featuredStories': 'Historias Destacadas ✨',
    'kids.searchPlaceholder': 'Buscar libros mágicos... 🔍✨',
    'kids.allAges': 'Todas las Edades 👶👧👦',
    'kids.allBooks': 'Todos los Libros',
    'kids.stories': 'Historias',
    'kids.adventures': 'Aventuras',
    'kids.topRated': 'Mejor Calificados',
    'kids.noBooks': 'No se encontraron libros mágicos',
    'kids.noBooksSub': '¡Intenta ajustar tus términos de búsqueda o rango de edad para encontrar más aventuras! ✨',
    'kids.clearFilters': 'Limpiar Filtros y Explorar',
    
    // My Library Page
    'library.title': 'Mi Biblioteca',
    'library.subtitle': 'Tu colección personal de audiolibros',
    'library.liveComm': 'Comunidad en Vivo',
    'library.listening': 'escuchando',
    'library.totalBooks': 'Total de Libros',
    'library.inProgress': 'En Progreso',
    'library.completed': 'Completados',
    'library.totalHours': 'Horas Totales',
    'library.searchPlaceholder': 'Buscar en tu biblioteca...',
    'library.browseCategory': 'Explorar por Categoría',
    'library.allBooks': 'Todos los Libros',
    'library.favorites': 'Favoritos',
    'library.noBooks': 'No se encontraron libros',
    'library.noBooksDesc': 'Intenta ajustar tus términos de búsqueda o filtros',
    'library.clearFilters': 'Limpiar Todos los Filtros',
    'library.exploreBooks': 'Explorar Libros',
    'library.lastPlayed': 'Última reproducción:',
    'library.complete': 'completo',
    'library.narratedBy': 'Narrado por',
    
    // Account Page
    'account.title': 'Configuración de Cuenta',
    'account.subtitle': 'Gestiona las preferencias y configuraciones de tu cuenta',
    'account.profile': 'Perfil',
    'account.subscription': 'Suscripción',
    'account.payment': 'Pago',
    'account.preferences': 'Preferencias',
    'account.security': 'Seguridad',
    
    // Profile Tab
    'profile.edit': 'Editar',
    'profile.cancel': 'Cancelar',
    'profile.save': 'Guardar Cambios',
    'profile.memberSince': 'Miembro desde',
    'profile.totalListening': 'Tiempo Total de Escucha',
    'profile.booksCompleted': 'Libros Completados',
    'profile.favoriteBooks': 'Libros Favoritos',
    'profile.clickForDetails': 'Haz clic para detalles',
    'profile.viewCompleted': 'Ver libros completados',
    'profile.viewFavorites': 'Ver favoritos',
    'profile.editProfile': 'Editar Perfil',
    'profile.fullName': 'Nombre Completo',
    'profile.email': 'Correo Electrónico',
    'profile.phone': 'Teléfono',
    'profile.favoriteGenres': 'Géneros Favoritos',
    'profile.addGenre': 'Agregar Género',
    
    // Subscription Tab
    'subscription.choosePlan': 'Elige Tu Plan',
    'subscription.description': 'Actualiza o cambia tu plan de suscripción\nTodos los planes incluyen acceso a nuestra biblioteca de audiolibros y funciones principales.',
    'subscription.free': 'Gratis',
    'subscription.premium': 'Premium',
    'subscription.family': 'Familiar',
    'subscription.currentPlan': 'Plan Actual',
    'subscription.upgrade': 'Actualizar',
    'subscription.downgrade': 'Degradar',
    'subscription.forever': 'para siempre',
    'subscription.month': 'mes',
    'subscription.billedMonthly': 'facturado mensualmente',
    'subscription.billedAnnually': 'facturado anualmente',
    'subscription.save20': 'Ahorra 20%',
    
    // Payment Tab
    'payment.methods': 'Métodos de Pago',
    'payment.addMethod': 'Agregar Método de Pago',
    'payment.expires': 'Expira',
    'payment.default': 'Predeterminado',
    'payment.setDefault': 'Establecer como Predeterminado',
    
    // Preferences Tab
    'preferences.notifications': 'Notificaciones',
    'preferences.language': 'Idioma',
    'preferences.preferredLanguage': 'Idioma Preferido',
    'preferences.languageDescription': 'Esto afectará la interfaz de la aplicación y los idiomas de contenido disponibles.',
    'preferences.playbackSettings': 'Configuración de Reproducción',
    'preferences.autoPlayNext': 'Reproducir Automáticamente el Siguiente Capítulo',
    'preferences.autoPlayDescription': 'Reproducir automáticamente el siguiente capítulo cuando termine el actual',
    'preferences.sleepTimer': 'Temporizador de Sueño',
    'preferences.sleepTimerDescription': 'Duración predeterminada del temporizador de sueño',
    'preferences.playbackSpeed': 'Velocidad de Reproducción',
    'preferences.playbackSpeedDescription': 'Velocidad de reproducción predeterminada',
    'preferences.newReleases': 'Nuevos Lanzamientos',
    'preferences.newReleasesDescription': 'Recibe notificaciones sobre nuevos lanzamientos de libros',
    'preferences.recommendations': 'Recomendaciones',
    'preferences.recommendationsDescription': 'Recibe recomendaciones personalizadas de libros',
    'preferences.promotions': 'Promociones',
    'preferences.promotionsDescription': 'Recibe actualizaciones sobre ofertas especiales y promociones',
    'preferences.reminders': 'Recordatorios',
    'preferences.remindersDescription': 'Recibe recordatorios de lectura y actualizaciones de progreso',
    
    // Security Tab
    'security.settings': 'Configuración de Seguridad',
    'security.currentPassword': 'Contraseña Actual',
    'security.newPassword': 'Nueva Contraseña',
    'security.confirmPassword': 'Confirmar Nueva Contraseña',
    'security.updatePassword': 'Actualizar Contraseña',
    'security.twoFactor': 'Autenticación de Dos Factores',
    'security.enable2FA': 'Habilitar 2FA',
    'security.enable2FADescription': 'Agrega una capa adicional de seguridad a tu cuenta',
    'security.enable': 'Habilitar',
    'security.dangerZone': 'Zona de Peligro',
    'security.deleteAccount': 'Eliminar Cuenta',
    'security.deleteAccountDescription': 'Eliminar permanentemente tu cuenta y todos los datos',
    
    // Common
    'common.back': 'Atrás',
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.delete': 'Eliminar',
    'common.edit': 'Editar',
    'common.close': 'Cerrar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    'common.play': 'Reproducir',
    'common.pause': 'Pausar',
    'common.download': 'Descargar',
    'common.favorite': 'Favorito',
    'common.share': 'Compartir',
    'common.rating': 'Calificación',
    'common.duration': 'Duración',
    'common.author': 'Autor',
    'common.narrator': 'Narrador',
    'common.category': 'Categoría',
    'common.search': 'Buscar',
    'common.filter': 'Filtrar',
    'common.sort': 'Ordenar',
    'common.new': 'NUEVO',
    'common.featured': 'Destacado',
    'common.popular': 'Popular',
    'common.recommended': 'Recomendado',
    
    // Languages
    'language.english': 'Inglés',
    'language.spanish': 'Español',
    
    // Subscription Features
    'features.booksPerMonth': 'libros por mes',
    'features.unlimitedBooks': 'Libros ilimitados',
    'features.basicAudio': 'Calidad de audio básica',
    'features.highQualityAudio': 'Audio de alta calidad',
    'features.limitedDownloads': 'Descargas offline limitadas',
    'features.unlimitedDownloads': 'Descargas offline ilimitadas',
    'features.communitySupport': 'Soporte de la comunidad',
    'features.earlyAccess': 'Acceso temprano a nuevos lanzamientos',
    'features.prioritySupport': 'Soporte prioritario',
    'features.advancedAnalytics': 'Análisis avanzados',
    'features.familyMembers': 'Hasta 6 miembros de la familia',
    'features.kidsContent': 'Contenido para niños incluido',
    'features.individualProfiles': 'Perfiles individuales',
    'features.parentalControls': 'Controles parentales',
    'features.familySharing': 'Compartir en familia',
    
    // Subscription Descriptions
    'subscription.freeDescription': 'Perfecto para oyentes ocasionales',
    'subscription.premiumDescription': 'La opción más popular para estudiantes ávidos',
    'subscription.familyDescription': 'Perfecto para familias con niños',
    
    // Categories
    'category.all': 'Todos los Libros',
    'category.productivity': 'Productividad',
    'category.startupBusiness': 'Startup y Negocios',
    'category.marketingSales': 'Marketing y Ventas',
    'category.healthFitness': 'Salud y Fitness',
    'category.mindfulnessMeditation': 'Mindfulness y Meditación',
    'category.leadership': 'Liderazgo',
    'category.personalGrowth': 'Crecimiento Personal',
    'category.moneyFinance': 'Dinero y Finanzas',
    'category.habitsPsychology': 'Hábitos y Psicología',
    'category.spiritualityPhilosophy': 'Espiritualidad y Filosofía',
    'category.relationships': 'Relaciones',
    'category.timeManagement': 'Gestión del Tiempo',
    'category.careerSkills': 'Carrera y Habilidades',
    'category.creativityWriting': 'Creatividad y Escritura',
    'category.scienceTechnology': 'Ciencia y Tecnología',
    
    // Kids Categories
    'kidsCategory.adventure': 'Aventura',
    'kidsCategory.educational': 'Educativo',
    'kidsCategory.stories': 'Historias',
    'kidsCategory.beginner': 'Principiante',
    'kidsCategory.intermediate': 'Intermedio',
    'kidsCategory.advanced': 'Avanzado',
    
    // Time and Progress
    'time.hours': 'horas',
    'time.minutes': 'minutos',
    'time.seconds': 'segundos',
    'time.ago': 'hace',
    'time.day': 'día',
    'time.days': 'días',
    'time.week': 'semana',
    'time.weeks': 'semanas',
    'time.month': 'mes',
    'time.months': 'meses',
    'time.year': 'año',
    'time.years': 'años',
    
    // Status
    'status.downloading': 'Descargando...',
    'status.downloaded': 'Descargado',
    'status.playing': 'Reproduciendo',
    'status.paused': 'Pausado',
    'status.completed': 'Completado',
    'status.inProgress': 'En Progreso',
    'status.notStarted': 'No Iniciado',
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'es')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};