import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import BrandsSection from "./BrandsSection";

const testimonials = [
  {
    text: "REBORN completely changed how I use my downtime. It feels like I've reclaimed hours of my life to grow mentally.",
    textEs: "REBORN cambió completamente cómo uso mi tiempo libre. Siento que he recuperado horas de mi vida para crecer mentalmente.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    name: "Emma Johnson",
    role: "Marketing Manager",
    roleEs: "Gerente de Marketing",
  },
  {
    text: "As a new mom, REBORN helped me find peace and purpose during chaotic days. The interactive format is perfect.",
    textEs: "Como nueva mamá, REBORN me ayudó a encontrar paz y propósito durante días caóticos. El formato interactivo es perfecto.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
    name: "Sarah Williams",
    role: "New Mother",
    roleEs: "Nueva Madre",
  },
  {
    text: "The podcast-style audiobooks make complex topics so much easier to understand and retain.",
    textEs: "Los audiolibros estilo podcast hacen que los temas complejos sean mucho más fáciles de entender y retener.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    name: "Michael Chen",
    role: "Software Engineer",
    roleEs: "Ingeniero de Software",
  },
  {
    text: "I've learned more in 3 months with REBORN than I did in years of traditional reading. Game changer!",
    textEs: "He aprendido más en 3 meses con REBORN que en años de lectura tradicional. ¡Un cambio total!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
    name: "David Rodriguez",
    role: "Entrepreneur",
    roleEs: "Emprendedor",
  },
  {
    text: "The real-time examples and interactive quizzes keep me engaged like no other learning platform has before.",
    textEs: "Los ejemplos en tiempo real y los cuestionarios interactivos me mantienen comprometido como ninguna otra plataforma de aprendizaje lo ha hecho antes.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face",
    name: "Lisa Thompson",
    role: "Teacher",
    roleEs: "Maestra",
  },
  {
    text: "Finally, a learning platform that fits into my busy lifestyle perfectly. I can learn while commuting!",
    textEs: "¡Finalmente, una plataforma de aprendizaje que se adapta perfectamente a mi estilo de vida ocupado. ¡Puedo aprender mientras viajo al trabajo!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
    name: "James Wilson",
    role: "Business Consultant",
    roleEs: "Consultor de Negocios",
  },
  {
    text: "The quality of content and production value is incredible. It's like having a personal tutor.",
    textEs: "La calidad del contenido y el valor de producción es increíble. Es como tener un tutor personal.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face",
    name: "Maria Garcia",
    role: "Designer",
    roleEs: "Diseñadora",
  },
  {
    text: "REBORN transformed my daily commute into productive learning time. I actually look forward to traffic now!",
    textEs: "REBORN transformó mi viaje diario al trabajo en tiempo de aprendizaje productivo. ¡Ahora espero con ansias el tráfico!",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop&crop=face",
    name: "Robert Kim",
    role: "Sales Director",
    roleEs: "Director de Ventas",
  },
  {
    text: "The way they break down complex concepts into digestible, engaging content is absolutely brilliant.",
    textEs: "La forma en que desglosan conceptos complejos en contenido digerible y atractivo es absolutamente brillante.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop&crop=face",
    name: "Jennifer Lee",
    role: "Product Manager",
    roleEs: "Gerente de Producto",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsSection = () => {
  const { t, language } = useLanguage();

  // Transform testimonials based on language
  const getLocalizedTestimonials = (testimonialArray: typeof testimonials) => {
    return testimonialArray.map(testimonial => ({
      ...testimonial,
      text: language === 'es' ? testimonial.textEs : testimonial.text,
      role: language === 'es' ? testimonial.roleEs : testimonial.role,
    }));
  };

  return (
    <>
      <section className="relative py-8 sm:py-16">
        {/* Grid background behind the heading - positioned to start from top and cover heading area */}
        <div className='absolute top-0 left-0 right-0 h-[50vh] sm:h-[60vh] bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] sm:bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>
        
        <div className="container z-10 mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center max-w-[540px] mx-auto pt-6 sm:pt-8"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-outfit font-bold text-brand-dark-text mt-6 sm:mt-8 text-center px-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg font-manrope text-brand-muted-text text-center mt-4 sm:mt-6 px-4">
              "{t('testimonials.subtitle')}"
            </p>
          </motion.div>

          <div className="flex justify-center gap-3 sm:gap-6 mt-8 sm:mt-12 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[600px] sm:max-h-[740px] overflow-hidden px-4 sm:px-0">
            <TestimonialsColumn testimonials={getLocalizedTestimonials(firstColumn)} duration={15} />
            <TestimonialsColumn testimonials={getLocalizedTestimonials(secondColumn)} className="hidden sm:block" duration={19} />
            <TestimonialsColumn testimonials={getLocalizedTestimonials(thirdColumn)} className="hidden lg:block" duration={17} />
          </div>
        </div>
      </section>

      {/* Brands Section - positioned right after testimonials */}
      <BrandsSection />
    </>
  );
};

export default TestimonialsSection;