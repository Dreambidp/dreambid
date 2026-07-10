import { useState, useContext, createContext } from 'react';

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '+917428264402';
const WHATSAPP_API_URL = 'https://api.whatsapp.com/send';

const normalizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
};

export const WhatsAppFloatContext = createContext();

export default function WhatsAppFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const bottomOffset = useContext(WhatsAppFloatContext) || 'calc(15rem + env(safe-area-inset-bottom, 0))';

  const message = "Hello! I'm interested in learning more about your properties.";
  const normalized = normalizePhone(WHATSAPP_NUMBER);
  const url = normalized
    ? `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`
    : `${WHATSAPP_API_URL}?text=${encodeURIComponent(message)}`;

  const handleWhatsAppClick = (e) => {
    // preserve behavior for non-link environments and close tooltip
    setIsOpen(false);
  };

  return (
    <div 
      className="fixed z-50 right-6 bottom-44 lg:bottom-60 pointer-events-none"
    >      
      {/* Tooltip */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 bg-gray-800 text-white rounded-lg px-4 py-2 mb-2 whitespace-nowrap text-sm shadow-lg animate-fadeIn z-50">
          Chat with us
        </div>
      )}

      {/* Main Button (now an anchor link to WhatsApp) */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleWhatsAppClick}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onTouchStart={() => setIsOpen(!isOpen)}
        className="relative group bg-green-500 hover:bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex-shrink-0 pointer-events-auto"
        aria-label="Chat on WhatsApp"
      >
        <img
          src="/whatsapp.svg"
          alt="WhatsApp"
          className="w-6 h-6"
        />
      </a>

      {/* Mobile Tooltip Alternative */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
