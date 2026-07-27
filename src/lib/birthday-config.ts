// All editable text for Chaitra's birthday surprise
export const birthdayConfig = {
  friendName: "Chaitra",
  fromName: "",

  opening: {
    greeting: "Hey Chaitra...",
    line1: "I made something for you...",
    line2: "Just a tiny little surprise ♡",
    button: "Start ♡",
  },

  cards: {
    title: "Pick a little card 🎀",
    items: [
      {
        id: "about",
        title: " ",
        image: "/images/your-future.gif",
        message:
          "Calm on the outside, strong-minded on the inside Someone who prefers keeping things simple and straightforward....🎀 ",
      },
      {
        id: "future",
        title: " ",
        image: "/images/last-one.gif",
        message:
          "Wishing you a future filled with peace, happiness, and the freedom to build a life that feels right for you... ✨",
      },
      {
        id: "surprise",
        title: "",
        image: "/images/about-you-2.gif",
        message:
          "Another year, another chapter.Hope this one brings you good memories, new experiences, and happier days. 🍃 ",
      },
    ],
    unlockText: "There is something more ✨",
  },

  countdown: {
    intro: "Dear Chaitra...",
    ready: "Ready?",
  },

  hero: {
    title: "HAPPY BIRTHDAY CHAITRA",
    funnyLine: "Hope you have a great birthday and an even better year ahead. Wishing you happiness, success, peace, and plenty of good memories",
    wish:
      "Today is your day—hope it's filled with good moments, genuine smiles, and everything that makes you happy. Have a wonderful birthday, Chaitra! 🎂✨",
  },

  timeline: {
    title: "Our Little Memories",
    items: [
      { img: "/photos/img1.jpg", caption: "sooo Beautifull" },
      { img: "/photos/img2.jpg", caption: "soo Elegent" },
      { img: "/photos/img3.jpg", caption: "just looking " },
      { img: "/photos/img4.jpg", caption: "likeaaaaaa" },
      { img: "/photos/img5.jpg", caption: "wow.....😅" },
    ],
  },

  gift: {
    prompt: "Tap to open 🎀",
    content:
      "That's it 🎁 " +
      "No actual gift hiding here 😄 " +
      "Just thought I'd try making something different for your birthday. " +
      "Hope you liked it!",
  },

  letter: {
    prompt: "Open me ♡",
    body: `Chaitra,

Just wanted to wish you a happy birthday in a slightly different way this time.

Hope the coming year brings you good opportunities, peaceful days, and plenty of reasons to be happy.

Have a great birthday and take care.`,
  },

  ending: {
    title: "Happy Birthday once again, Chaitra ♡",
    message: "Just be you and keep that smile going. Hope life treats you kindly and brings you happiness, peace, and good things wherever you go.",
    replay: "Replay Surprise",
  },
};

export type BirthdayConfig = typeof birthdayConfig;
