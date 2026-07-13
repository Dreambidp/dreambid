const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '+917428264402';
const SUPPORT_PHONE = import.meta.env.VITE_SUPPORT_PHONE || '+917428264402';
const WHATSAPP_API_URL = 'https://api.whatsapp.com/send';

const formatIndianPhone = (phone) => {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return `91-${digits.slice(2, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
  }
  if (digits.length === 10) {
    return `91-${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`;
  }
  return phone;
};

export const shareProperty = (property) => {
  const title = property.title || 'Property';
  const location = [property.city, property.state].filter(Boolean).join(', ');
  const fullTitle = `${title} in ${location}`;
  const reservePrice = property.reserve_price ? `₹${parseFloat(property.reserve_price).toLocaleString('en-IN')}` : 'N/A';
  const auctionDate = property.auction_date
    ? new Date(property.auction_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'N/A';
  const propertyUrl = `${window.location.origin}/properties/${property.id}`;
  const supportPhone = formatIndianPhone(SUPPORT_PHONE);

  const message = `${fullTitle}\nReserve Price: ${reservePrice}\nApplication Deadline: ${auctionDate}\n\nProperty Link: ${propertyUrl}\n\nFor more details, contact us at: ${supportPhone}`;
  // Open WhatsApp Web/App in share mode - lets user choose recipient from contacts
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

export const contactViaWhatsApp = (property, enquiry = null) => {
  let message = `Hello, I'm interested in this property:\n\nProperty ID: ${property.id}\nTitle: ${property.title}\nLocation: ${property.city}, ${property.state}\nReserve Price: ₹${parseFloat(property.reserve_price).toLocaleString('en-IN')}`;
  
  if (enquiry) {
    message += `\n\nMy Details:\nName: ${enquiry.name}\nEmail: ${enquiry.email}\nPhone: ${enquiry.phone}`;
    if (enquiry.message) {
      message += `\nMessage: ${enquiry.message}`;
    }
  }
  
  const url = `${WHATSAPP_API_URL}/?phone=${WHATSAPP_NUMBER.replace(/\D/g, '')}&text=${encodeURIComponent(message)}&type=phone_number&app_absent=0`;
  window.open(url, '_blank');
};

