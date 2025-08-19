import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Star, Award, Camera } from 'lucide-react';

const Event = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const guestSpeakers = [
    {
      name: "الدكتور أحمد زهرة",
      title: "سبيكرز الديفينت",
      image: "dr-ahmed-zahra.jpg",
      description: "خبير في مجال التعليم والتطوير الشخصي"
    },
    {
      name: "الأستاذ إيهاب عبد العظيم",
      title: "الداعم الرسمي لور جول",
      image: "ehab-abdelazim.jpg",
      description: "مؤسس ومطور منصة Our Goal التعليمية"
    },
    {
      name: "عبد الرحمن عبد المنعم",
      title: "قيام محتوى لليفينت",
      image: "abdelrahman-abdelmoneim.jpg",
      description: "منشئ محتوى ومؤثر في المجال التعليمي"
    }
  ];

  const eventGallery = [
    "official-event-photo.jpg",
    "dr-ahmed-zahra.jpg",
    "ehab-abdelazim.jpg",
    "abdelrahman-abdelmoneim.jpg"
  ];

  return (
    <>
      <Helmet>
        <title>فعالية Our Goal 2025 | منصة اور جول التعليمية</title>
        <meta name="description" content="شاهد تفاصيل فعالية Our Goal 2025 مع ضيوف الشرف ومعرض الصور الرسمي للفعالية" />
        <meta name="keywords" content="فعالية, Our Goal, 2025, ضيوف شرف, معرض صور, تعليم" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground" dir="rtl">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-primary to-accent">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-golden-300 to-golden-500 bg-clip-text text-transparent">
                فعالية Our Goal 2025
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-foreground/80">
                رحلة نحو النجاح والتميز في اختبار القدرات
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-lg text-primary-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-6 h-6" />
                  <span>2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  <span>مصر</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  <span>مجتمع Our Goal</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Official Event Photo */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-card-foreground mb-4">الصورة الرسمية للفعالية</h2>
              <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <img
                src="official-event-photo.jpg"
                alt="الصورة الرسمية لفعالية Our Goal 2025"
                className="w-full rounded-2xl shadow-2xl hover:shadow-3xl transition-shadow duration-300 border border-border"
              />
            </motion.div>
          </div>
        </section>

        {/* Guest Speakers */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-foreground mb-4 flex items-center justify-center gap-3">
                <Star className="w-10 h-10 text-golden-500" />
                ضيوف الشرف
                <Star className="w-10 h-10 text-golden-500" />
              </h2>
              <p className="text-xl text-muted-foreground">نخبة من الخبراء والمؤثرين في المجال التعليمي</p>
              <div className="w-24 h-1 bg-gradient-to-r from-golden-500 to-golden-600 mx-auto mt-4"></div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {guestSpeakers.map((speaker, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  className="bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-border"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={speaker.image}
                      alt={speaker.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-card-foreground mb-2">{speaker.name}</h3>
                    <div className="flex items-center gap-2 mb-3">
                      <Award className="w-5 h-5 text-primary" />
                      <p className="text-primary font-semibold">{speaker.title}</p>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{speaker.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Photo Gallery */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-card-foreground mb-4 flex items-center justify-center gap-3">
                <Camera className="w-10 h-10 text-accent" />
                معرض الصور
              </h2>
              <p className="text-xl text-muted-foreground">لحظات مميزة من فعالية Our Goal 2025</p>
              <div className="w-24 h-1 bg-gradient-to-r from-accent to-primary mx-auto mt-4"></div>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {eventGallery.map((image, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image}
                    alt={`صورة من الفعالية ${index + 1}`}
                    className="w-full h-48 object-cover rounded-xl shadow-lg group-hover:shadow-2xl transition-all duration-300 border border-border"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="max-w-4xl max-h-full"
            >
              <img
                src={selectedImage}
                alt="صورة مكبرة"
                className="w-full h-full object-contain rounded-lg"
              />
            </motion.div>
          </div>
        )}

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-primary to-accent">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6 text-primary-foreground">انضم إلى مجتمع Our Goal</h2>
              <p className="text-xl mb-8 text-primary-foreground/80">
                كن جزءًا من رحلة النجاح والتميز في اختبار القدرات
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-card text-card-foreground px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 border border-border"
                onClick={() => window.location.href = '/'}
              >
                العودة للصفحة الرئيسية
              </motion.button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Event;

