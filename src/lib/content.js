// Everything the site says lives here, so Tavia's details and new gatherings are easy to change.

export const ORG = {
  name: 'Earth Bound Roots',
  tagline: 'Gentle circles of movement, breath, reiki and sound.',
  phone: '801-675-0634',
  phoneHref: 'sms:+18016750634',
  callHref: 'tel:+18016750634',
  email: 'tavia.valdez419@gmail.com',
  city: 'South Ogden, Utah',
  // from Tavia's Venmo QR code
  venmo: 'https://venmo.com/code?user_id=3654426761889264652',
}

// Add a new gathering at the top of this list. Past ones can stay; the site shows upcoming ones first.
export const GATHERINGS = [
  {
    id: '2026-12-13',
    title: 'Grief Gathering',
    date: '2026-12-13T15:00:00-07:00',
    dateLabel: 'Sunday, December 13',
    timeLabel: '3:00 PM',
    place: '1708 E. 5550 S., Suite 19',
    town: 'South Ogden, UT 84403',
    mapHref: 'https://maps.apple.com/?q=1708+E+5550+S+Suite+19,+South+Ogden,+UT+84403',
    summary:
      'A space to gather in the presence of grief — to honor what we carry, held in compassion and witnessed in community.',
    practices: ['Gentle movement', 'Breath', 'Reiki', 'Sound bath'],
    bring: ['Water', 'A small pillow', 'A blanket', 'An item that has meaning to you'],
    price: 'Donation based — give what you can',
    note: 'Space is limited. Please RSVP.',
  },
]

export const PRACTICES = [
  { name: 'Gentle movement', text: 'Slow, kind movement that lets the body take part in healing, at whatever pace it asks for.' },
  { name: 'Breath', text: 'Simple breathing that steadies the nervous system and makes room for what you are feeling.' },
  { name: 'Reiki', text: 'Quiet, hands-light energy work offered to help you rest and feel held.' },
  { name: 'Sound', text: 'Singing bowls and soft sound to settle the mind and let the body soften.' },
]

export const PRACTITIONERS = [
  {
    id: 'tavia',
    name: 'Tavia Valdez',
    initials: 'TV',
    photo: 'images/tavia.jpg',
    photoAlt: 'Tavia Valdez among trees, hands together at her heart',
    focus: '50% 30%',
    roles: ['Licensed Clinical Social Worker', 'Grief informed', 'Reiki practitioner'],
    bio: 'Tavia founded Earth Bound Roots to give people a gentle place to land. She brings clinical care, a grief-informed approach and reiki to every circle.',
    contact: true,
  },
  {
    id: 'kara',
    name: 'Kara Yeates',
    initials: 'KY',
    photo: 'images/kara.jpg',
    photoAlt: 'Kara Yeates kneeling among crystal singing bowls and candles',
    focus: '50% 35%',
    roles: ['Sound bath facilitator', 'Reiki practitioner'],
    bio: 'Kara holds the sound in our gatherings — singing bowls and soft tones that help the body rest — and offers reiki alongside Tavia.',
  },
]

export const upcoming = () => {
  const now = Date.now()
  return GATHERINGS.filter((g) => new Date(g.date).getTime() >= now - 6 * 3600e3).sort((a, b) => new Date(a.date) - new Date(b.date))
}
