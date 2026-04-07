import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Navbar
    home: "Home",
    bookings: "My Bookings",
    rewards: "Rewards",
    profile: "Profile",
    getStarted: "Get Started",
    // Hero
    heroTitle: "Redefining",
    heroSubtitle: "Ethiopian Travel",
    heroDesc: "Experience the pinnacle of comfort and technology. Book premium buses instantly with our AI-integrated platform.",
    // Search
    from: "From",
    to: "To",
    date: "Date",
    findBus: "Find Bus",
    // AI
    askAi: "Ask AI",
    aiInsights: "AI Insights",
    // Footer
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    support: "Help Center",
  },
  am: {
    // Navbar
    home: "ዋና ገጽ",
    bookings: "የእኔ ጉዞዎች",
    rewards: "ሽልማቶች",
    profile: "መገለጫ",
    getStarted: "እንጀምር",
    // Hero
    heroTitle: "አዲስ ዓይነት",
    heroSubtitle: "የኢትዮጵያ ጉዞ",
    heroDesc: "ምርጥ ምቾት እና ቴክኖሎጂን ይለማመዱ። በ AI የታገዘ መድረካችንን በመጠቀም ፕሪሚየም አውቶቡሶችን በፍጥነት ያስይዙ።",
    // Search
    from: "መነሻ",
    to: "መድረሻ",
    date: "ቀን",
    findBus: "አውቶቡስ ፈልግ",
    // AI
    askAi: "AI ይጠይቁ",
    aiInsights: "AI መረጃዎች",
    // Footer
    privacy: "የግል ደህንነት",
    terms: "የአጠቃቀም ደንቦች",
    support: "ድጋፍ ማዕከል",
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en');

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'am' : 'en';
    setLanguage(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
