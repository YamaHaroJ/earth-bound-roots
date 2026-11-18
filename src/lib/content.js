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
    practices: ['Gentle Movement', 'Breath', 'Reiki', 'Sound'],
    bring: ['Water', 'A small pillow', 'A blanket', 'An item that has meaning to you'],
    price: 'Donation based — give what you can',
    note: 'Space is limited. Please RSVP.',
  },
  {
    id: '2027-05-08',
    title: "Mother's Day Circle",
    date: '2027-05-08T15:00:00-06:00',
    dateLabel: 'Saturday, May 8',
    timeLabel: '3:00 PM',
    place: '1708 E. 5550 S., Suite 19',
    town: 'South Ogden, UT 84403',
    mapHref: 'https://maps.apple.com/?q=1708+E+5550+S+Suite+19,+South+Ogden,+UT+84403',
    summary:
      "A gentle circle for everything Mother's Day can hold: celebrating, missing, longing and grieving. Mothers, anyone missing their mother, and anyone carrying a loss around motherhood are welcome.",
    practices: ['Gentle Movement', 'Breath', 'Reiki', 'Sound'],
    bring: ['Water', 'A small pillow', 'A blanket', 'An item that has meaning to you'],
    price: 'Donation based — give what you can',
    note: 'Space is limited. Please RSVP.',
  },
]

export const PRACTICES = [
  // Tavia's own wording (2026-11-17)
  { name: 'Gentle Movement', text: 'Slow, mindful movement that invites you to reconnect with your body, release tension, and move in a way that feels good for you.' },
  { name: 'Breath', text: 'Simple, guided breathing to help you slow down, settle your nervous system, and make space for whatever you may be feeling.' },
  { name: 'Reiki', text: 'Gentle energy work offered through light touch or hands held above the body, creating space for rest, relaxation, and receiving.' },
  { name: 'Sound', text: 'Singing bowls and soothing sounds invite you to quiet the mind, soften the body, and settle into a deeper sense of rest.' },
]

export const COME_AS_YOU_ARE = 'Each gathering offers a different way to slow down, reconnect, and care for yourself. A gentle space to pause, breathe, and simply be.'

export const PRACTITIONERS = [
  {
    id: 'tavia',
    name: 'Tavia Valdez',
    initials: 'TV',
    photo: 'images/tavia-2.jpg',
    photoAlt: 'Tavia Valdez smiling, kneeling among trees and green plants',
    focus: '50% 22%',
    roles: ['Licensed Clinical Social Worker', 'Grief informed', 'Reiki practitioner', 'Yoga instructor'],
    bio: 'Tavia founded Earth Bound Roots to give people a gentle place to land. She brings clinical care, yoga, a grief-informed approach and reiki to every circle.',
    contact: true,
  },
  {
    id: 'kara',
    name: 'Kara Yeates',
    initials: 'KY',
    photo: 'images/kara.jpg',
    photoAlt: 'Kara Yeates kneeling among crystal singing bowls and candles',
    focus: '50% 35%',
    roles: ['Sound bath facilitator', 'Reiki practitioner', 'Yoga instructor'],
    bio: 'Kara holds the sound in our gatherings — singing bowls and soft tones that help the body rest — and offers reiki and yoga alongside Tavia.',
  },
]

export const upcoming = () => {
  const now = Date.now()
  return GATHERINGS.filter((g) => new Date(g.date).getTime() >= now - 6 * 3600e3).sort((a, b) => new Date(a.date) - new Date(b.date))
}
