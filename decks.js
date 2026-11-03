/* If Only I Knew: the card content.
   Each deck is in PATHS; each card is in STORIES, with its chapter pictures in PICS and its artwork in SCENES.
   To add a deck: add its cards to STORIES, PICS and SCENES, then add the deck to PATHS. */
const ICONS = {
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/><circle cx="12" cy="12" r="6.5"/></svg>',
  pump:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21V7a3 3 0 0 1 6 0v14"/><path d="M6 21h10"/><path d="M14 10h3.5a1.5 1.5 0 0 1 1.5 1.5V13"/><path d="M19 16v1"/><path d="M8 8 4 4.5"/><circle cx="11" cy="4" r=".6"/></svg>',
  lamp:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"/><path d="M12 3v2"/><path d="M8 7h8l1 10a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z"/><path d="M12 11c1.2 1.3 1.3 2.7 0 4-1.3-1.3-1.2-2.7 0-4z"/></svg>',
  tree:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21v-8"/><path d="M12 13l-3-3M12 15l3-3"/><path d="M7.5 15a4.5 4.5 0 0 1-.8-8.9A5 5 0 0 1 16 5.2a4.5 4.5 0 0 1 .5 9.8"/><path d="M8 21h8"/></svg>',
  wheel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2"/><path d="M12 3.5V10M12 14v6.5M3.5 12H10M14 12h6.5M6 6l4.6 4.6M13.4 13.4 18 18M6 18l4.6-4.6M13.4 10.6 18 6"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 19 5v6.5c0 4.6-3 7.9-7 10-4-2.1-7-5.4-7-10V5z"/><path d="M12 6v12M8 10.5h8"/></svg>',
  rocket:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5c3 2.3 4.3 5.6 4 9.7L14.5 16h-5L8 12.2c-.3-4.1 1-7.4 4-9.7z"/><circle cx="12" cy="9" r="1.6"/><path d="M8.5 12.5 6 15.5l3 .5M15.5 12.5l2.5 3-3 .5"/><path d="M11 18.5 12 21l1-2.5"/></svg>',
  ship:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15h18l-2.5 4h-13z"/><path d="M8 15V5M14 15V7"/><path d="M8 6l4 1.5L8 9M14 8l3.5 1.4L14 11"/><path d="M2 21.5l3-1.5 3 1.5 3-1.5 3 1.5 3-1.5 3 1.5"/></svg>'
};

Object.assign(ICONS,{
  loom:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5" width="16" height="14" rx="1"/><path d="M8 5v14M12 5v14M16 5v14M4 15h16"/></svg>',
  thread:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 13c2-3.5 4-3.5 6 0s3.5 3 5 .5"/><path d="M16 11.5c1.5-2 3.5-2 5.5 1"/><path d="M14.3 9.5l.9 1.6M15.6 15l.5-1.4"/></svg>',
  stop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"/><path d="M9 9.5v5M12 8.5v6M15 9.5v5"/></svg>',
  car:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16.5V13l2-4h11l3 4h2v3.5z"/><circle cx="7.5" cy="16.8" r="1.9"/><circle cx="16.5" cy="16.8" r="1.9"/><path d="M7 9.5 8.6 7h6l2 2.5"/></svg>',
  drop:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/></svg>',
  door:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 21V4h12v17"/><path d="M4 21h16"/><circle cx="15" cy="13" r=".9"/><path d="M9 7.5h6"/></svg>',
  map:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/><path d="M11 10h2M11 12h3M11 14h2"/></svg>',
  tankard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 8h10v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="M15 11h2.5a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H15"/><path d="M5 8c-.5-2 1.5-3.5 3.5-3C9.5 3.3 12.5 3.3 13.5 5c2-.5 3 1.5 1.5 3"/></svg>',
  arches:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 20v-9a3 3 0 0 1 6 0v9M9 20v-9a3 3 0 0 1 6 0v9M15 20v-9a3 3 0 0 1 6 0v9"/><path d="M2 20h20M2 5h20"/></svg>',
  germ:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="12" rx="6.5" ry="4" transform="rotate(-30 12 12)"/><path d="M16.5 6.5c1.5-2 3.5-2 4.5-1M7.5 17.5c-1.5 2-3.5 2-4.5 1"/><circle cx="10.5" cy="12.5" r=".8"/><circle cx="13.5" cy="11" r=".8"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M8 7.5h7M8 11h7M8 14.5h4"/></svg>',
  rose:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12V2.5a9.5 9.5 0 0 1 8.2 4.7z"/><path d="M12 12l6.5 1.7A6.7 6.7 0 0 1 15 18z"/><path d="M12 12l.8 4a4 4 0 0 1-4.3-1.7z"/><path d="M12 12 3.3 8.3A9.4 9.4 0 0 1 9.5 2.8z"/></svg>',
  medal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 21l5-3 5 3-1.5-7"/><path d="M12 6.5l.8 1.7 1.8.2-1.3 1.2.4 1.8-1.7-.9-1.7.9.4-1.8-1.3-1.2 1.8-.2z"/></svg>',
  cross:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5v19M6.5 8h11"/><circle cx="12" cy="8" r="3.8"/><path d="M9 21.5h6"/></svg>',
  crown:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 17.5h17l-1.5-10-4.5 4-2.5-6.5-2.5 6.5-4.5-4z"/><path d="M3.5 20.5h17"/></svg>',
  swords:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 3.5 15.5 15M20 3.5 8.5 15"/><path d="M13 17.5l2.5-2.5 2.5 2.5M11 17.5 8.5 15 6 17.5"/><path d="M17 18.5l3 3M7 18.5l-3 3"/></svg>',
  raven:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12c2.5-.5 4.5-3 8.5-3.5 3-.3 5 1 6.5 1.2l3.5-1-2.2 2.6c0 4-3 6.7-7 6.7l-1.8 3-1-3.2c-2.5-.7-4.6-2.4-6.5-5.8z"/><circle cx="16.2" cy="10.6" r=".7" fill="currentColor"/></svg>',
  well:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="17" rx="8" ry="3"/><path d="M4 17v-3M20 17v-3M4 14c0 1.7 3.6 3 8 3s8-1.3 8-3"/><path d="M12 3.5s3 3.4 3 5.8a3 3 0 0 1-6 0c0-2.4 3-5.8 3-5.8z"/></svg>',
  scroll:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h11a2 2 0 0 1 2 2v1h-4"/><path d="M16 6v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1h11v1"/><path d="M7 4a2 2 0 0 0-2 2v11"/><path d="M8.5 9h5M8.5 12.5h5"/></svg>',
  laurel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-5-2-7-7-6-13M12 21c5-2 7-7 6-13"/><path d="M6.3 11.5c-2 0-3-1.5-3-3 1.5 0 3 1 3 3zM7 16c-2 .5-3.5-.5-4-2 1.5-.5 3.5.3 4 2zM17.7 11.5c2 0 3-1.5 3-3-1.5 0-3 1-3 3zM17 16c2 .5 3.5-.5 4-2-1.5-.5-3.5.3-4 2zM6.5 7c-1.5-1-1.5-2.5-1-3.5 1.2.6 1.6 2 1 3.5zM17.5 7c1.5-1 1.5-2.5 1-3.5-1.2.6-1.6 2-1 3.5z"/></svg>',
  flame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21.5c-4 0-6.5-2.7-6.5-6 0-4 4-6 3.5-11 3 2 4.5 4.5 4.5 7 1-1 1.5-2.5 1.5-3.5 2 1.8 3.5 4.5 3.5 7.5 0 3.3-2.5 6-6.5 6z"/><path d="M12 21.5c-1.6 0-2.6-1.1-2.6-2.6 0-1.8 2.6-3.4 2.6-3.4s2.6 1.6 2.6 3.4c0 1.5-1 2.6-2.6 2.6z"/></svg>',
  trees:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20.5v-4M17 20.5v-4M12 20.5v-6"/><path d="M7 16.5H3.5L7 9.5l3.5 7zM12 14.5H8l4-9 4 9zM17 16.5h-3.5l3.5-7 3.5 7z"/><path d="M2 20.5h20"/></svg>',
  vship:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 15h20l-3 4H5z"/><path d="M2 15c0-3 1.5-4.5 3-4.5M22 15c0-3-1.5-4.5-3-4.5"/><path d="M12 15V3.5"/><path d="M7.5 5.5h9v6h-9z"/><path d="M6 17h1M9 17h1M12 17h1M15 17h1"/></svg>',
  arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20 19 5"/><path d="M13.5 4.5H19.5V10.5"/><path d="M4 20l.5-4M4 20l4-.5M6.5 17.5l.5-3.5M6.5 17.5l3.5-.5"/></svg>',
  burst:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5l1.8 5.6 5.4-2.5-2.6 5.3 5.6 1.8-5.6 1.9 2.6 5.3-5.4-2.6L12 22.5l-1.8-5.2-5.4 2.6 2.6-5.3-5.6-1.9 5.6-1.8-2.6-5.3 5.4 2.5z"/></svg>',
  lander:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 5.5h7l2 5h-11z"/><path d="M6 10.5h12v3.5H6z"/><path d="M7 14l-3 6M17 14l3 6M2.5 20h3M18.5 20h3M12 14v4.5"/><path d="M12 5.5V2.5"/></svg>',
  squareround:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="7" width="10" height="10" rx="1"/><circle cx="16.5" cy="12" r="5"/><path d="M7.5 3.5v2M16.5 3.5v2"/></svg>',
  chute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10a8 6.5 0 0 1 16 0z"/><path d="M4 10l8 7.5 8-7.5M9 10l3 7.5 3-7.5"/><path d="M10.5 17.5h3v2h-3z"/><path d="M2 22c3-1 5 1 8 0s5 1 8 0 3 1 4 0"/></svg>',
  thermo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 14V5a2.5 2.5 0 0 1 5 0v9a4.5 4.5 0 1 1-5 0z"/><path d="M12 9v8"/><path d="M17 5.5h3M17 8.5h2M17 11.5h3"/></svg>',
  ice:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 15l5-5 4 3 5-5 5 7v5h-19z"/><path d="M7.5 10l1 4-3 2M16.5 8l-1 5 3 2"/></svg>',
  island:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17c2-1 3-5.5 6-7.5 2 1 3 3 4 3 1.5-2 3-3 4-2 1.5 2 2.5 4.5 4 6.5z"/><path d="M2 20.5c2-1 4 1 6 0s4 1 6 0 4 1 6 0"/></svg>',
  boat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h18l-3 4.5H6z"/><path d="M12 14V3.5l6 8.5h-6"/><path d="M2 21.5c2-1 4 1 6 0s4 1 6 0 4 1 6 0"/></svg>',
  people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="6.5" cy="8.5" r="2.2"/><circle cx="12" cy="7" r="2.5"/><circle cx="17.5" cy="8.5" r="2.2"/><path d="M2.5 19.5c0-3 1.8-5 4-5s4 2 4 5M8.5 19.5c0-3.7 1.6-6.3 3.5-6.3s3.5 2.6 3.5 6.3M13.5 19.5c0-3 1.8-5 4-5s4 2 4 5"/></svg>'
});

Object.assign(ICONS,{
  house:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/></svg>',
  orbit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-25 12 12)"/><circle cx="20.2" cy="8.2" r="1.3" fill="currentColor"/></svg>',
  moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><circle cx="9" cy="9" r="1.8"/><circle cx="15" cy="14" r="2.4"/><circle cx="9.5" cy="16" r="1"/></svg>',
  alarm:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 22 20H2z"/><path d="M12 9v5"/><circle cx="12" cy="17" r=".7" fill="currentColor"/></svg>',
  boot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h6l1 9c3 .5 5 2 5 4.5V20H6V12z"/><path d="M6 17h14M9 20v-3M13 20v-3M17 20v-3"/></svg>',
  telescope:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 16 6.5l2 5-13 5z"/><path d="M16 6.5l3-1.2 1.6 4-3 1.2"/><path d="M10.5 14 7.5 21M10.5 14l3 7"/></svg>',
  blur:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="12" r="5" stroke-dasharray="2 2"/><circle cx="12" cy="12" r="8.5" stroke-dasharray="1.5 3"/></svg>',
  lens:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3c3 2.5 3 15.5 0 18-3-2.5-3-15.5 0-18z"/><path d="M2 12h6M16 12h6"/><path d="M19 9l3 3-3 3"/></svg>',
  galaxy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c0-2 2-3 3.5-2s1.5 4-1.5 5.5-7 0-7.5-4S9 3.5 13 4s7 4 6.5 8.5"/><path d="M12 12c0 2-2 3-3.5 2"/><circle cx="12" cy="12" r=".9" fill="currentColor"/></svg>',
  radio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="12" rx="2"/><circle cx="8.5" cy="14" r="3"/><path d="M14 12h4M14 15h4M7 8l9-5"/></svg>',
  bar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M5 9h14M5 15h14M12 3v18"/></svg>',
  station:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="10" width="6" height="4" rx="1"/><path d="M12 10V6M12 14v4M10.5 6h3M10.5 18h3"/><rect x="2.5" y="8" width="5" height="8"/><rect x="16.5" y="8" width="5" height="8"/><path d="M7.5 12H9M15 12h1.5M2.5 12h5M16.5 12h5"/></svg>'
});

Object.assign(ICONS,{
  plane:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12c0-.8-.7-1.5-1.5-1.5H14L9.5 3H7.5l2.5 7.5H5L3 8H1.5l1 4-1 4H3l2-2.5h5L7.5 21h2l4.5-7.5h5.5c.8 0 1.5-.7 1.5-1.5z"/></svg>',
  radar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12 19 5"/><path d="M4.9 19.1A10 10 0 1 1 19 5"/><path d="M8.5 15.5A5 5 0 1 1 15.5 8.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>',
  trophy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/><path d="M12 14v4M8 21h8M9.5 18h5"/></svg>',
  enigma:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="18" height="10" rx="1.5"/><path d="M6 13.5h1M9 13.5h1M12 13.5h1M15 13.5h1M17.5 13.5h.5M7.5 17h9"/><circle cx="8" cy="6.5" r="2.2"/><circle cx="12" cy="6.5" r="2.2"/><circle cx="16" cy="6.5" r="2.2"/></svg>',
  note:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="6" width="19" height="12" rx="1.5"/><circle cx="12" cy="12" r="3"/><path d="M5.5 9v6M18.5 9v6"/></svg>'
});

Object.assign(ICONS,{
  flag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V3.5"/><path d="M5 4h14v9H5"/><path d="M9.7 4v9M14.3 4v9M5 8.5h14"/><path d="M5 4h4.7v4.5H5zM14.3 4H19v4.5h-4.7zM9.7 8.5h4.6V13H9.7z" fill="currentColor" stroke="none"/></svg>'
});

/* What each chapter's picture shows: [icon, caption] */
const PICS = {
  rollsroyce:[['car','Royce\u2019s first car, 1904'],['people','Charles Rolls, car dealer'],['house','The Midland Hotel, Manchester'],['trophy','The Silver Ghost'],['plane','The Merlin engine']],
  mini:[['drop','Petrol rationing, 1956'],['scroll','The design brief'],['gear','The sideways engine'],['car','Austin Seven and Morris Mini-Minor'],['trophy','The Monte Carlo Rally']],
  thrustssc:[['medal','Thrust2, 1983'],['plane','Two Spey jet engines'],['shield','RAF pilot Andy Green'],['burst','The sonic boom'],['flag','A record that still stands']],
  toyoda:[['loom','A hand loom, Shizuoka'],['thread','A single broken thread'],['gear','The Type G automatic loom, 1924'],['stop','Jidoka: stop, fix, restart'],['car','Toyota Motor Co., 1937']],
  snow:[['drop','Cholera'],['door','Snow’s door-to-door survey'],['map','Snow’s cholera map'],['tankard','The Lion Brewery'],['pump','The Broad Street pump']],
  nightingale:[['arches','Barracks hospital, Scutari'],['germ','Cholera, typhus and dysentery'],['book','Nightingale’s records'],['rose','The rose diagram'],['medal','Royal Statistical Society, 1858']],
  oswald:[['cross','Lindisfarne monastery'],['crown','Penda, king of Mercia'],['swords','Battle of Maserfield, 642'],['raven','The raven legend'],['well','St Oswald’s Well, Oswestry']],
  boudica:[['scroll','Prasutagus’s will'],['laurel','Emperor Nero’s Rome'],['flame','Londinium in flames'],['trees','Paulinus chooses his ground'],['wheel','Boudica’s statue, Westminster']],
  hastings:[['crown','King Harold II crowned'],['vship','Battle of Stamford Bridge'],['ship','William lands at Pevensey'],['shield','The English shield wall'],['arrow','The Bayeux Tapestry']],
  apollo:[['burst','Oxygen tank no. 2'],['lander','Lunar module Aquarius'],['squareround','The CO2 filter fix'],['chute','Splashdown, 17 April 1970'],['thermo','The gauge that stopped at 80°F']],
  endurance:[['ship','The Endurance'],['ice','Weddell Sea pack ice'],['island','Elephant Island'],['boat','The James Caird'],['people','All 28 men home']],
  gagarin:[['house','Klushino, his home village'],['people','The first cosmonaut group'],['rocket','Vostok 1, Baikonur'],['orbit','One orbit in 108 minutes'],['chute','Parachute landing near Saratov']],
  apollo11:[['moon','The Sea of Tranquility'],['alarm','Program alarms 1202 and 1201'],['book','Margaret Hamilton\u2019s software'],['lander','Lunar module Eagle'],['boot','First footprints on the Moon']],
  hubble:[['telescope','Mount Wilson Observatory'],['rocket','Space Shuttle Discovery'],['blur','Hubble\u2019s blurry first images'],['lens','The faulty test device'],['galaxy','The Hubble Deep Field']],
  sharman:[['radio','\u2018Astronaut wanted\u2019'],['bar','A chocolate research lab'],['house','Star City, near Moscow'],['rocket','Soyuz TM-12'],['station','The Mir space station']],
  battle:[['map','France has fallen, summer 1940'],['radar','Radar and the Dowding system'],['people','The Few'],['flame','The Blitz begins'],['medal','Battle of Britain Day, 15 September']],
  mitchell:[['house','Near Stoke-on-Trent'],['gear','Supermarine, Southampton'],['trophy','The Schneider Trophy'],['plane','Spitfire prototype, 1936'],['medal','More than 20,000 built']],
  bletchley:[['enigma','The Enigma machine'],['book','Marian Rejewski\u2019s team, Poland'],['gear','The Bombe'],['people','About 10,000 codebreakers'],['note','Turing on the \u00a350 note']]
};

/* Illustrated scenes, drawn over each story's era colour */
const loop=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join('');
const svgOpen='<svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">';
const SCENES = {
  rollsroyce:()=>svgOpen+`
    <g fill="rgba(20,22,28,.55)"><rect x="300" y="40" width="16" height="120"/><rect x="330" y="70" width="14" height="90"/><path d="M250 160V110l25-14 25 14v50zM350 160V100l25-14 25 14v60z"/></g>
    <path d="M296 40c4-14 18-16 24-28" stroke="rgba(255,255,255,.25)" stroke-width="6" fill="none" stroke-linecap="round"/>
    <rect y="168" width="400" height="32" fill="rgba(20,22,28,.45)"/>
    <g stroke="rgba(235,230,215,.9)" stroke-width="3" fill="none"><circle cx="110" cy="150" r="24"/><circle cx="230" cy="150" r="24"/></g>
    <g stroke="rgba(235,230,215,.6)" stroke-width="1.5">${loop(8,i=>{const a=i*Math.PI/4;return `<path d="M${110} 150l${(Math.cos(a)*22).toFixed(1)} ${(Math.sin(a)*22).toFixed(1)}M${230} 150l${(Math.cos(a)*22).toFixed(1)} ${(Math.sin(a)*22).toFixed(1)}"/>`})}</g>
    <path d="M70 130h40l10-14h70l14-26h22l6 26h22v14H70z" fill="rgba(200,205,215,.92)"/>
    <rect x="236" y="104" width="22" height="26" rx="2" fill="rgba(235,225,190,.95)"/>
    <path d="M240 108v18M245 108v18M250 108v18M254 108v18" stroke="rgba(120,110,80,.6)" stroke-width="1"/>
    <path d="M120 116c10-16 30-20 50-20" stroke="rgba(60,50,40,.7)" stroke-width="5" fill="none"/>
    <circle cx="262" cy="118" r="5" fill="rgba(255,220,140,.95)"/></svg>`,
  mini:()=>svgOpen+`
    <g fill="rgba(20,16,18,.5)"><path d="M0 120l30-18v18l30-18v18l30-18v18l30-18v18l30-18v18l30-18v18l30-18v18l30-18v18l30-18v18l30-18v18l30-18v18l30-18v18l10-6V170H0z"/></g>
    <rect x="345" y="50" width="14" height="70" fill="rgba(20,16,18,.5)"/>
    <rect y="170" width="400" height="30" fill="rgba(30,30,36,.6)"/>
    <path d="M0 184h40M70 184h40M140 184h40M210 184h40M280 184h40M350 184h40" stroke="rgba(255,240,200,.5)" stroke-width="3"/>
    <path d="M118 160h170q10 0 10-12v-14q0-8-8-10l-26-6q-14-28-40-30h-48q-26 2-40 30l-20 6q-8 2-8 10v14q0 12 10 12z" fill="rgba(200,40,40,.95)"/>
    <path d="M150 116q12-22 34-23h44q22 1 34 23z" fill="rgba(245,245,240,.95)"/>
    <path d="M160 116q10-16 26-17h18v17zM212 99h16q16 1 26 17h-42z" fill="rgba(140,180,210,.85)"/>
    <circle cx="150" cy="160" r="15" fill="rgba(20,20,22,.95)"/><circle cx="262" cy="160" r="15" fill="rgba(20,20,22,.95)"/>
    <circle cx="150" cy="160" r="6" fill="rgba(200,200,205,.9)"/><circle cx="262" cy="160" r="6" fill="rgba(200,200,205,.9)"/>
    <circle cx="294" cy="132" r="5" fill="rgba(255,240,190,.95)"/></svg>`,
  thrustssc:()=>svgOpen+`
    <path d="M0 120L40 96L80 110L130 80L190 112L240 90L300 108L350 84L400 100V140H0z" fill="rgba(40,20,40,.45)"/>
    <rect y="138" width="400" height="62" fill="rgba(240,220,190,.35)"/>
    <g stroke="rgba(255,255,255,.35)" stroke-width="2" fill="none"><path d="M330 120L230 70M330 120L230 170"/><path d="M345 120L250 60M345 120L250 180" stroke-opacity=".6"/></g>
    <path d="M20 150C80 140 120 150 160 146" stroke="rgba(240,220,190,.6)" stroke-width="14" fill="none" stroke-linecap="round"/>
    <path d="M150 140h150l40-12-40-10H190l-40 10z" fill="rgba(30,30,40,.92)"/>
    <rect x="200" y="112" width="60" height="12" rx="6" fill="rgba(60,60,70,.95)"/><rect x="200" y="140" width="60" height="12" rx="6" fill="rgba(60,60,70,.95)"/>
    <path d="M150 124l-18-14h24z" fill="rgba(30,30,40,.92)"/>
    <path d="M196 118h-14M196 146h-14" stroke="rgba(255,170,80,.9)" stroke-width="5" stroke-linecap="round"/>
    <circle cx="300" cy="128" r="4" fill="rgba(150,200,240,.9)"/></svg>`,
  toyoda:()=>svgOpen+`
    <circle cx="330" cy="46" r="24" fill="rgba(255,236,210,.3)"/>
    <path d="M150 200 L243 98 Q256 88 269 98 L390 200Z" fill="rgba(25,10,8,.24)"/>
    <path d="M226 117 L243 98 Q256 88 269 98 L287 117 L274 112 L264 121 L256 111 L247 121 L238 112Z" fill="rgba(255,250,240,.42)"/>
    <g stroke="rgba(255,244,228,.55)" stroke-width="1.3">${loop(14,i=>{const x=58+i*8;return i===7?`<path d="M${x} 72V104M${x} 112V148"/>`:`<path d="M${x} 72V148"/>`})}</g>
    <g fill="rgba(30,14,8,.6)"><rect x="40" y="64" width="10" height="136"/><rect x="172" y="64" width="10" height="136"/><rect x="32" y="56" width="158" height="11" rx="2"/></g>
    <path d="M70 124 q40 -11 80 0 q-40 11 -80 0z" fill="rgba(255,236,210,.8)"/>
    <rect x="50" y="146" width="122" height="24" rx="12" fill="rgba(255,238,215,.62)"/>
    <path d="M62 153h98M62 158h98M62 163h98" stroke="rgba(150,50,35,.45)" stroke-width="2"/>
    <circle cx="232" cy="168" r="22" fill="none" stroke="rgba(30,14,8,.55)" stroke-width="9" stroke-dasharray="7 5"/>
    <circle cx="232" cy="168" r="10" fill="rgba(30,14,8,.55)"/></svg>`,
  snow:()=>svgOpen+`
    <circle cx="60" cy="40" r="14" fill="rgba(255,250,230,.45)"/>
    <path d="M0 200V112h44V98h9v14h33V92l30-20 30 20v20h42V102h11V90h8v12h38v-8l26-16 26 16v8h52v106z" fill="rgba(8,14,12,.52)"/>
    <g fill="rgba(255,222,150,.5)">${loop(9,i=>`<rect x="${12+i*44}" y="124" width="9" height="12" rx="1"/><rect x="${26+i*44}" y="152" width="9" height="12" rx="1"/>`)}</g>
    <circle cx="335" cy="104" r="28" fill="rgba(255,220,150,.16)"/>
    <rect x="333" y="110" width="4" height="90" fill="rgba(8,14,12,.75)"/>
    <rect x="328" y="96" width="14" height="14" rx="2" fill="rgba(255,225,165,.9)"/>
    <g fill="rgba(5,10,8,.62)">${loop(7,i=>loop(1+((i*5)%4)+(i===3?3:0),j=>`<rect x="${120+i*9}" y="${195-j*4}" width="7" height="3"/>`))}</g>
    <g fill="rgba(5,10,8,.8)"><rect x="196" y="118" width="18" height="82" rx="7"/><rect x="190" y="190" width="30" height="10"/><rect x="214" y="140" width="15" height="8" rx="2"/></g>
    <path d="M199 126 L170 104" stroke="rgba(5,10,8,.8)" stroke-width="5" stroke-linecap="round"/></svg>`,
  nightingale:()=>svgOpen+`
    <path d="M345 22a16 16 0 1 0 14 24a13 13 0 1 1-14-24z" fill="rgba(255,248,230,.62)"/>
    <path d="M40 72a30 30 0 0 1 60 0zM300 72a30 30 0 0 1 60 0z" fill="rgba(25,15,5,.38)"/>
    <rect x="374" y="22" width="8" height="50" fill="rgba(25,15,5,.38)"/><path d="M372 22l6-10 6 10z" fill="rgba(25,15,5,.38)"/>
    <rect x="0" y="72" width="400" height="128" fill="rgba(25,15,5,.38)"/>
    <g fill="rgba(255,230,190,.14)">${loop(7,i=>{const x=8+i*58;return `<path d="M${x} 200V130a22 22 0 0 1 44 0V200z"/>`})}</g>
    <circle cx="200" cy="128" r="62" fill="rgba(255,220,150,.2)"/><circle cx="200" cy="128" r="30" fill="rgba(255,225,160,.22)"/>
    <path d="M193 110c0-9 14-9 14 0" stroke="rgba(255,238,195,.9)" stroke-width="3" fill="none"/>
    <path d="M189 112h22l3 30a8 8 0 0 1-8 8h-12a8 8 0 0 1-8-8z" fill="rgba(255,238,195,.9)"/>
    <path d="M200 124c3 3 3 7 0 10-3-3-3-7 0-10z" fill="rgba(200,110,40,.8)"/></svg>`,
  oswald:()=>svgOpen+`
    <circle cx="330" cy="66" r="22" fill="rgba(255,245,210,.25)"/>
    <path d="M0 140 Q100 92 220 120 T400 108 V200H0z" fill="rgba(10,20,5,.24)"/>
    <path d="M250 112q50-22 100-4M258 120q45-18 90-2" stroke="rgba(255,255,240,.22)" stroke-width="2" fill="none"/>
    <path d="M0 172 Q120 140 260 166 T400 160 V200H0z" fill="rgba(10,20,5,.5)"/>
    <path d="M95 174C100 142 92 122 84 100M93 134C110 120 120 112 132 98M90 122C78 112 70 106 60 102" stroke="rgba(15,22,8,.85)" stroke-width="7" fill="none" stroke-linecap="round"/>
    <g fill="rgba(15,22,8,.6)"><circle cx="80" cy="88" r="26"/><circle cx="110" cy="78" r="24"/><circle cx="132" cy="96" r="18"/><circle cx="58" cy="98" r="16"/></g>
    <path transform="translate(236 44) scale(1.5)" d="M0 8C10 0 18 2 24 8C30 2 40 0 50 6C40 6 32 10 27 14L24 18L21 14C16 10 8 8 0 8z" fill="rgba(10,10,10,.8)"/>
    <ellipse cx="188" cy="182" rx="24" ry="5" fill="rgba(220,240,255,.5)"/></svg>`,
  boudica:()=>svgOpen+`
    <g fill="rgba(0,0,0,.16)"><circle cx="80" cy="40" r="40"/><circle cx="140" cy="20" r="34"/><circle cx="250" cy="34" r="44"/><circle cx="330" cy="18" r="36"/></g>
    <path d="M0 200V130h30v-10h20v10h20V115l40-25 40 25v15h10v-40h12v40h18V120h50v-10h12v10h40v-30l16-14 16 14v30h20V125h40v75z" fill="rgba(20,6,2,.6)"/>
    <g fill="rgba(255,215,170,.2)">${loop(5,i=>`<rect x="${117+i*9}" y="117" width="3" height="30"/>`)}</g>
    <g fill="rgba(255,175,90,.7)"><path d="M58 132C46 110 64 98 60 76C78 92 88 108 82 132z"/><path d="M186 132C170 100 196 86 190 52C216 78 226 104 216 132z"/><path d="M296 132C284 106 300 92 296 70C314 86 322 104 316 132z"/></g>
    <g fill="rgba(255,236,170,.65)"><path d="M64 132C60 120 68 112 68 102C76 112 80 122 76 132z"/><path d="M196 132C190 112 202 100 202 86C214 102 216 118 208 132z"/><path d="M302 132C298 120 306 112 306 102C314 112 316 122 312 132z"/></g>
    <g stroke="rgba(20,6,2,.85)" stroke-width="3" stroke-linecap="round"><path d="M20 200L64 136M44 200L80 146M360 200L330 140M384 200L350 150"/></g></svg>`,
  hastings:()=>svgOpen+`
    <g stroke="rgba(15,18,30,.55)" stroke-width="2" stroke-linecap="round">${loop(6,i=>{const x=20+i*34,y=30+(i%3)*18;return `<path d="M${x} ${y}l46 26M${x+46} ${y+26}l-7-1M${x+46} ${y+26}l-3-6"/>`})}</g>
    <path d="M0 200L0 172Q150 152 260 112Q320 96 400 92V200z" fill="rgba(10,14,25,.52)"/>
    <path d="M318 96V40" stroke="rgba(10,14,25,.8)" stroke-width="3"/><path d="M318 42l36 10-36 10z" fill="rgba(255,240,220,.55)"/>
    <g fill="rgba(225,205,165,.65)" stroke="rgba(10,14,25,.7)" stroke-width="1.5">${loop(10,i=>{const x=226+i*17,y=118-i*3.3;return `<path transform="translate(${x} ${y})" d="M0 0h14v9c0 8-7 14-7 16 0-2-7-8-7-16z"/>`})}</g></svg>`,
  apollo:()=>svgOpen+`
    <circle cx="70" cy="168" r="82" fill="rgba(110,165,230,.5)"/>
    <path d="M20 130c20-10 40 0 50 14s30 10 40 0M40 180c20-6 36 4 50 0" stroke="rgba(120,190,120,.55)" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="70" cy="168" r="86" fill="none" stroke="rgba(200,230,255,.3)" stroke-width="3"/>
    <circle cx="332" cy="50" r="28" fill="rgba(255,250,235,.68)"/>
    <g fill="rgba(0,0,0,.09)"><circle cx="322" cy="42" r="6"/><circle cx="342" cy="58" r="5"/><circle cx="336" cy="36" r="3"/></g>
    <path d="M140 120C220 40 372 0 368 56C364 104 270 118 214 104" stroke="rgba(255,250,235,.4)" stroke-width="2" stroke-dasharray="4 6" fill="none"/>
    <g transform="translate(206 92) rotate(-30)" fill="rgba(255,250,240,.88)"><path d="M0 0l10-8 10 8z"/><rect x="0" y="0" width="20" height="14"/><rect x="2" y="14" width="16" height="10" fill="rgba(255,250,240,.6)"/></g></svg>`,
  endurance:()=>svgOpen+`
    <path d="M0 52C80 22 160 72 240 42S380 30 400 50" stroke="rgba(170,255,220,.3)" stroke-width="18" fill="none"/>
    <path d="M0 70C90 46 170 86 250 60S370 52 400 66" stroke="rgba(170,255,220,.18)" stroke-width="8" fill="none"/>
    <path d="M0 132L50 92L90 122L140 72L200 126L260 86L320 122L370 82L400 102V200H0z" fill="rgba(255,255,255,.2)"/>
    <g transform="rotate(-9 220 140)">
      <path d="M150 140h140l-14 22H164z" fill="rgba(10,20,30,.8)"/>
      <g fill="rgba(10,20,30,.8)"><rect x="180" y="62" width="3" height="78"/><rect x="216" y="56" width="3" height="84"/><rect x="252" y="66" width="3" height="74"/></g>
      <g stroke="rgba(10,20,30,.7)" stroke-width="2"><path d="M168 80h28M168 100h28M202 74h32M202 96h32M240 84h28M240 104h28M150 140L182 64M290 140L254 68"/></g>
    </g>
    <g fill="rgba(240,250,255,.75)"><path d="M0 166L60 156L110 172L92 200H0z"/><path d="M120 176L190 162L262 174L240 200H130z"/><path d="M272 168L342 158L400 166V200H282z"/></g></svg>`,
  gagarin:()=>svgOpen+`
    <circle cx="200" cy="470" r="310" fill="rgba(80,135,210,.6)"/>
    <circle cx="200" cy="470" r="316" fill="none" stroke="rgba(170,215,255,.45)" stroke-width="7"/>
    <path d="M40 190c40-14 80-10 110 0M220 176c40-10 90-6 140 8" stroke="rgba(255,255,255,.35)" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M20 120C120 40 300 30 390 90" stroke="rgba(255,250,235,.35)" stroke-width="2" stroke-dasharray="4 6" fill="none"/>
    <g transform="translate(150 70)"><path d="M14 -6L58 -14V14L14 6z" fill="rgba(205,205,215,.8)"/><circle cx="0" cy="0" r="19" fill="rgba(238,238,242,.92)"/><circle cx="-5" cy="-4" r="4" fill="rgba(60,70,90,.6)"/><path d="M-12 -14l-10-12M-2 -19l0-14" stroke="rgba(238,238,242,.8)" stroke-width="1.5"/></g></svg>`,
  apollo11:()=>svgOpen+`
    <circle cx="330" cy="44" r="17" fill="rgba(110,170,235,.85)"/><path d="M330 27a17 17 0 0 1 0 34a12 17 0 0 0 0-34z" fill="rgba(2,3,12,.55)"/>
    <path d="M0 142Q100 128 200 138T400 132V200H0z" fill="rgba(205,205,212,.6)"/>
    <g fill="rgba(0,0,0,.14)"><ellipse cx="60" cy="168" rx="26" ry="6"/><ellipse cx="320" cy="180" rx="34" ry="7"/><ellipse cx="230" cy="160" rx="12" ry="3"/></g>
    <g stroke="rgba(230,230,235,.9)" stroke-width="3" stroke-linecap="round"><path d="M154 124l-16 22M196 124l16 22M164 128l-6 18M186 128l6 18"/></g>
    <g fill="rgba(230,230,235,.9)"><rect x="132" y="145" width="12" height="3"/><rect x="206" y="145" width="12" height="3"/></g>
    <rect x="150" y="106" width="50" height="22" fill="rgba(222,180,88,.9)"/>
    <path d="M158 106l4-20h26l6 20z" fill="rgba(232,232,238,.92)"/><path d="M168 92h12v8h-12z" fill="rgba(40,45,60,.7)"/>
    <path d="M262 142V92" stroke="rgba(235,235,240,.9)" stroke-width="2"/>
    <rect x="262" y="92" width="30" height="18" fill="rgba(245,245,248,.85)"/>
    <path d="M262 96h30M262 100h30M262 104h30" stroke="rgba(190,60,60,.7)" stroke-width="1.5"/><rect x="262" y="92" width="12" height="9" fill="rgba(60,80,150,.8)"/>
    <g fill="rgba(60,60,70,.45)">${loop(5,i=>`<ellipse cx="${300+i*16}" cy="${160+(i%2)*6}" rx="4" ry="2.2"/>`)}</g></svg>`,
  hubble:()=>svgOpen+`
    <g>${[[60,40,14,6,'255,200,180'],[340,150,18,7,'200,210,255'],[90,160,10,4,'255,230,190'],[300,30,8,3,'255,190,170'],[30,100,6,3,'200,220,255']].map(([x,y,rx,ry,c])=>`<ellipse cx="${x}" cy="${y}" rx="${rx*1.8}" ry="${ry*1.8}" fill="rgba(${c},.12)" transform="rotate(-20 ${x} ${y})"/><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="rgba(${c},.4)" transform="rotate(-20 ${x} ${y})"/>`).join('')}</g>
    <path d="M352 70c0-6 7-9 12-6s4 13-4 16-20 0-21-11 9-19 19-17" stroke="rgba(255,235,220,.45)" stroke-width="2.5" fill="none"/>
    <g transform="translate(205 100) rotate(-18)">
      <g fill="rgba(70,95,170,.9)" stroke="rgba(200,210,240,.5)" stroke-width="1"><rect x="-40" y="-62" width="22" height="44"/><rect x="-40" y="18" width="22" height="44"/></g>
      <path d="M-29 -18v-4M-29 18v4" stroke="rgba(220,225,235,.8)" stroke-width="2"/>
      <rect x="-70" y="-18" width="120" height="36" rx="5" fill="rgba(222,226,236,.92)"/>
      <rect x="-70" y="-18" width="30" height="36" rx="4" fill="rgba(190,195,210,.95)"/>
      <path d="M50 -18l20 -14" stroke="rgba(222,226,236,.92)" stroke-width="4" stroke-linecap="round"/>
      <path d="M-40 -18v36M-10 -18v36M20 -18v36" stroke="rgba(120,130,150,.4)" stroke-width="1"/>
    </g></svg>`,
  sharman:()=>svgOpen+`
    <circle cx="200" cy="560" r="420" fill="rgba(70,145,200,.62)"/>
    <circle cx="200" cy="560" r="425" fill="none" stroke="rgba(170,225,255,.4)" stroke-width="6"/>
    <path d="M10 186c50-12 100-10 150-2M220 170c50-6 110-4 170 10" stroke="rgba(255,255,255,.35)" stroke-width="6" fill="none" stroke-linecap="round"/>
    <g fill="rgba(60,90,160,.9)" stroke="rgba(200,215,245,.45)" stroke-width="1"><rect x="138" y="36" width="16" height="44"/><rect x="138" y="98" width="16" height="44"/><rect x="214" y="98" width="16" height="40"/><rect x="262" y="40" width="40" height="14"/></g>
    <g fill="rgba(232,234,238,.92)"><rect x="100" y="80" width="150" height="18" rx="6"/><circle cx="252" cy="89" r="12"/><rect x="262" y="84" width="46" height="10" rx="4"/><rect x="276" y="54" width="10" height="30" rx="3"/><rect x="70" y="83" width="32" height="12" rx="4"/></g>
    <path d="M146 80V36M146 98v44M222 98v40" stroke="rgba(232,234,238,.7)" stroke-width="2"/>
    <g transform="translate(350 70)"><ellipse cx="0" cy="0" rx="12" ry="7" fill="rgba(225,228,232,.9)"/><rect x="-6" y="-22" width="6" height="15" fill="rgba(60,90,160,.9)"/><rect x="-6" y="7" width="6" height="15" fill="rgba(60,90,160,.9)"/><path d="M-12 0h-10" stroke="rgba(225,228,232,.9)" stroke-width="2"/></g></svg>`,
  battle:()=>svgOpen+`
    <circle cx="340" cy="38" r="20" fill="rgba(255,250,220,.4)"/>
    <g fill="rgba(255,255,255,.32)"><circle cx="60" cy="40" r="16"/><circle cx="82" cy="34" r="20"/><circle cx="106" cy="42" r="14"/><circle cx="250" cy="96" r="12"/><circle cx="268" cy="90" r="16"/><circle cx="288" cy="98" r="11"/></g>
    <g stroke="rgba(255,255,255,.6)" stroke-width="2.5" fill="none" stroke-linecap="round"><path d="M10 120C80 40 170 150 250 60S360 40 380 70"/><path d="M60 150C120 110 160 60 230 80"/><path d="M150 30C200 60 240 20 300 40"/></g>
    ${[[380,70,30,1.5],[230,80,-15,1.3],[300,40,10,1.2]].map(([x,y,a,k])=>`<g transform="translate(${x} ${y}) rotate(${a}) scale(${k})"><path transform="translate(-12 -12)" d="M21 12c0-.8-.7-1.5-1.5-1.5H14L9.5 3H7.5l2.5 7.5H5L3 8H1.5l1 4-1 4H3l2-2.5h5L7.5 21h2l4.5-7.5h5.5c.8 0 1.5-.7 1.5-1.5z" fill="rgba(25,30,40,.8)"/></g>`).join('')}
    <rect y="166" width="400" height="34" fill="rgba(25,65,105,.5)"/>
    <path d="M0 150L140 146Q170 150 196 162L196 200H0z" fill="rgba(245,245,235,.85)"/>
    <path d="M0 146L140 142Q170 146 196 158L196 162Q170 150 140 146L0 150z" fill="rgba(90,140,70,.9)"/></svg>`,
  mitchell:()=>svgOpen+`
    <rect y="160" width="400" height="40" fill="rgba(25,55,70,.45)"/>
    <path d="M0 172c30-4 50 4 80 0s50-4 80 0 50 4 80 0 50-4 80 0 50 4 80 0M0 186c30-4 50 4 80 0s50-4 80 0 50 4 80 0 50-4 80 0 50 4 80 0" stroke="rgba(255,255,255,.2)" stroke-width="2" fill="none"/>
    <g transform="translate(0 -6)">
      <ellipse cx="230" cy="90" rx="112" ry="22" fill="rgba(78,88,52,.95)"/>
      <path d="M150 82c20-8 40-4 52 4-16 6-34 10-52-4zM258 86c14-10 40-12 60-2-20 8-44 10-60 2z" fill="rgba(120,100,62,.85)"/>
      <ellipse cx="230" cy="150" rx="36" ry="9" fill="rgba(78,88,52,.95)"/>
      <ellipse cx="230" cy="96" rx="13" ry="70" fill="rgba(88,96,58,.98)"/>
      <path d="M223 70h14l-2 18h-10z" fill="rgba(180,200,215,.7)"/>
      <circle cx="230" cy="26" r="6" fill="rgba(30,30,30,.9)"/>
      <path d="M200 24h60" stroke="rgba(30,30,30,.55)" stroke-width="3" stroke-linecap="round"/>
      ${[[172,88],[288,88]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="10" fill="rgba(40,60,120,.95)"/><circle cx="${x}" cy="${y}" r="6.5" fill="rgba(240,240,235,.95)"/><circle cx="${x}" cy="${y}" r="3.5" fill="rgba(190,40,40,.95)"/>`).join('')}
    </g></svg>`,
  bletchley:()=>svgOpen+`
    <rect width="400" height="200" fill="rgba(6,3,16,.35)"/>
    <g fill="none" stroke="rgba(255,236,210,.28)"><circle cx="300" cy="58" r="46" stroke-width="10" stroke-dasharray="3 4"/><circle cx="300" cy="58" r="22" stroke-width="2"/><circle cx="364" cy="96" r="32" stroke-width="8" stroke-dasharray="3 4"/><circle cx="364" cy="96" r="14" stroke-width="2"/></g>
    <path d="M30 200V122h22V102l15-14 15 14v20h30V110h10l12-16 12 16h10V126h40V114l10-10 10 10v12h18V200z" fill="rgba(10,6,20,.7)"/>
    <g fill="rgba(255,215,140,.6)">${loop(6,i=>`<rect x="${40+i*30}" y="140" width="8" height="12" rx="1"/><rect x="${52+i*30}" y="166" width="8" height="12" rx="1"/>`)}</g>
    <g fill="rgba(10,6,20,.6)">${loop(3,i=>`<rect x="${248+i*50}" y="168" width="42" height="14"/><path d="M${246+i*50} 168l23-8 23 8z"/>`)}</g>
    <g fill="rgba(255,215,140,.45)">${loop(9,i=>`<rect x="${252+i*16}" y="172" width="5" height="5"/>`)}</g></svg>`
};

const PATHS = [
  {id:'makers', art:'blueprint', name:'Makers and Fixers', blurb:'People who solved problems with evidence.', ids:['toyoda','snow','nightingale']},
  {id:'crowns', art:'glass', name:'Crowns and Conquest', blurb:'Kings, queens and the fights for Britain.', ids:['oswald','boudica','hastings']},
  {id:'odds', art:'storm', name:'Against the Odds', blurb:'When the plan fails, and the people do not.', ids:['apollo','endurance']},
  {id:'space', art:'space', name:'Into Space', blurb:'The first people and machines beyond the sky.', ids:['gagarin','apollo11','hubble','sharman']},
  {id:'war', art:'dusk', name:'Britain at War', blurb:'1940, and the people who held the line.', ids:['battle','mitchell','bletchley']},
  {id:'speed', art:'speed', name:'Speed and Machines', blurb:'Cars, engines and record breakers.', ids:['rollsroyce','mini','thrustssc']}
];

const STORIES = {
  rollsroyce:{
    title:'A Meeting in Manchester', place:'Manchester', year:'1904', icon:'gear', era:'#5a6b7a', added:'2026-11-03',
    who:{name:'Henry Royce', epithet:'The engineer behind Rolls-Royce', dates:'1863 to 1933', initials:'HR'},
    cards:[
      {h:"Never good enough", t:"Henry Royce is an electrical engineer in Manchester. He buys a second-hand French car and is unimpressed by how badly it is made, so he decides to build his own. His first car runs in 1904."},
      {h:"The salesman", t:"Charles Rolls is a wealthy young car dealer and racing driver from London. He is looking for a well-made British car to sell, and a friend arranges for the two men to meet."},
      {h:"Lunch at the Midland Hotel", t:"On 4 May 1904, Rolls and Royce meet at the Midland Hotel in Manchester. Rolls is so impressed by Royce's car that he agrees to sell every car Royce can build, under the name Rolls-Royce."},
      {h:"The best car in the world", t:"Rolls-Royce Limited is formed in 1906. Its Silver Ghost runs almost 15,000 miles in a 1907 trial with hardly a problem, and earns a reputation as the best car in the world."},
      {h:"Wings", t:"In 1910 Rolls is killed flying at an air show in Bournemouth, the first Briton to die in a powered aeroplane accident. The company turns to aero engines, and its Merlin engine later powers the Spitfire and the Hurricane."}
    ],
    quiz:[
      {q:'Where did Rolls and Royce first meet?', o:['Brooklands racetrack','The Midland Hotel, Manchester','A London motor show','Bournemouth air show'], a:1, why:'They met over lunch on 4 May 1904, and a famous partnership began.'},
      {q:'What was Charles Rolls\u2019s job when they met?', o:['Car dealer and racing driver','Banker','Electrical engineer','Newspaper owner'], a:0, why:'Royce was the engineer. Rolls was the one who sold the cars.'},
      {q:'Which Rolls-Royce engine powered the Spitfire and the Hurricane?', o:['The Pegasus','The Jupiter','The Merlin','The Gipsy'], a:2, why:'The Merlin. The other three were made by other companies.'}
    ],
    take:'Quality sells. Royce refused to accept good enough, and that obsession became a name people still pay extra for over a century later.'
  },
  mini:{
    title:'The Mini', place:'Longbridge, Birmingham', year:'1959', icon:'car', era:'#b33a3a', added:'2026-11-03',
    who:{name:'Alec Issigonis', epithet:'Designer of the Mini', dates:'1906 to 1988', initials:'AI'},
    cards:[
      {h:"A fuel crisis", t:"In 1956 the Suez Crisis cuts Britain's oil supplies and petrol is rationed. Big, thirsty cars suddenly look foolish, and tiny German bubble cars start selling well."},
      {h:"The brief", t:"Leonard Lord, head of the British Motor Corporation, gives his designer Alec Issigonis a clear brief: a proper car for four adults that is as small and economical as possible."},
      {h:"Turning the engine sideways", t:"Issigonis mounts the engine sideways and makes it drive the front wheels. He pushes tiny 10-inch wheels right out to the corners, which leaves about 80 per cent of the car's floor for people and luggage."},
      {h:"Launch day", t:"The Mini goes on sale on 26 August 1959, as the Austin Seven and the Morris Mini-Minor, for just under five hundred pounds. Its go-kart handling soon makes it a favourite with rally drivers too."},
      {h:"Monte Carlo and beyond", t:"Mini Coopers win the Monte Carlo Rally in 1964, 1965 and 1967. When production at Longbridge finally ends in 2000, more than 5.3 million have been built."}
    ],
    quiz:[
      {q:'Which crisis led to the Mini being designed?', o:['The Suez Crisis','The Three-Day Week','The Cuban Missile Crisis','The General Strike'], a:0, why:'Petrol rationing after Suez made small, economical cars suddenly very attractive.'},
      {q:'What was clever about the Mini\u2019s engine?', o:['It sat in the boot','It ran on electricity','It was mounted sideways and drove the front wheels','It had twelve cylinders'], a:2, why:'That layout freed up space inside. Most small cars are still built that way today.'},
      {q:'Which famous rally did Mini Coopers win three times?', o:['The Le Mans 24 Hours','The Monte Carlo Rally','The Isle of Man TT','The Paris to Dakar'], a:1, why:'Wins in 1964, 1965 and 1967 turned a small family car into a motorsport legend.'}
    ],
    take:'Constraints breed creativity. A fuel crisis and a tight brief forced a design so clever that most small cars still copy its layout.'
  },
  thrustssc:{
    title:'Faster Than Sound', place:'Black Rock Desert, Nevada', year:'1997', icon:'flag', era:'#8a5a9a', added:'2026-11-03',
    who:{name:'Andy Green', epithet:'The fastest man on land', dates:'born 1962', initials:'AG'},
    cards:[
      {h:"The record hunters", t:"Richard Noble already holds the world land speed record, set in his jet car Thrust2 in 1983 at 633 miles an hour. In the 1990s he sets out to do something nobody has ever done: drive faster than the speed of sound."},
      {h:"Two jet engines", t:"His new car, Thrust SSC, is powered by two Rolls-Royce Spey jet engines from a Phantom fighter. It is about 16.5 metres long, weighs around 10 tonnes and produces roughly 110,000 horsepower."},
      {h:"The driver", t:"The driver is Andy Green, an RAF fighter pilot. At those speeds, steering is done with tiny, careful movements, and the team builds up speed run by run, checking the data every time."},
      {h:"The sonic boom", t:"On 15 October 1997, in Nevada's Black Rock Desert, Green averages 763 miles an hour over two runs. Thrust SSC becomes the first land vehicle to officially break the sound barrier, and its sonic boom rolls across the desert."},
      {h:"Fifty years and a day", t:"The record comes 50 years and one day after Chuck Yeager first broke the sound barrier in an aircraft. Nobody has driven faster on land since."}
    ],
    quiz:[
      {q:'What powered Thrust SSC?', o:['A rocket motor','Two Rolls-Royce Spey jet engines','A V12 car engine','Electric motors'], a:1, why:'The same engines that powered the Phantom fighter jet.'},
      {q:'What was Andy Green\u2019s day job?', o:['Racing driver','Engineer','RAF fighter pilot','Astronaut'], a:2, why:'A fighter pilot\u2019s skills suited a car that behaved more like a jet.'},
      {q:'What speed did Thrust SSC average for the record?', o:['1,000 miles an hour','633 miles an hour','500 miles an hour','763 miles an hour'], a:3, why:'633 was Thrust2\u2019s old record. 763 broke the sound barrier.'}
    ],
    take:'Edge towards a huge goal in steps you can learn from. The team raised the speed run by run and checked the data each time, rather than gambling on one big attempt.'
  },
  toyoda:{
    title:'The Loom That Stopped Itself', place:'Japan', year:'1924', icon:'gear', era:'#c8553d',
    who:{name:'Sakichi Toyoda', epithet:'Inventor of jidoka', dates:'1867 to 1930', initials:'ST'},
    cards:[
      {h:'A mother at the loom', t:"Shizuoka, Japan, the 1880s. A carpenter's son watches his mother weave by hand, throwing the shuttle back and forth for hours. Sakichi Toyoda decides there has to be a better way."},
      {h:'One thread, one ruined roll', t:"He teaches himself, tinkers for years, and patents his first wooden hand loom in 1890. Power looms follow. But one problem nags at him. When a single thread snaps, the machine keeps running, the cloth is ruined, and someone has to stand and watch every loom."},
      {h:'The machine that knew', t:"His answer, perfected in the Type G automatic loom of 1924, is brilliantly simple. If a thread breaks, the loom stops itself. No defect slips silently down the line, and one weaver can now look after many looms instead of one."},
      {h:'A name for the idea', t:"The idea later gets a name: jidoka, often translated as automation with a human touch. Build quality in at the source. Stop at the first sign of trouble, fix it, then restart."},
      {h:'Oldham pays for Toyota', t:"In 1929 the English firm Platt Brothers of Oldham buys the rights to his loom for one hundred thousand pounds, a fortune at the time. His son Kiichiro uses the money to start a car department. In 1937 it becomes Toyota Motor Co., and jidoka becomes one of the two pillars of the Toyota Production System. The other is just-in-time: making only what is needed, when it is needed."}
    ],
    quiz:[
      {q:'What did the Type G loom do when a thread broke?', o:['Kept weaving and marked the cloth','Stopped itself automatically','Rang a bell for the overseer','Rewound the broken thread'], a:1, why:'Stopping at the first defect meant no bad cloth was made, and one person could mind many machines.'},
      {q:'Who bought the patent rights in 1929?', o:['Ford Motor Company','Mitsubishi','Platt Brothers of Oldham','The Lancashire Cotton Board'], a:2, why:'An English textile machinery maker. Their money helped fund what became Toyota.'},
      {q:'Jidoka is one pillar of the Toyota Production System. What is the other?', o:['5S','Just-in-time','Six Sigma','Total Productive Maintenance'], a:1, why:'TPS is usually drawn as a house resting on two pillars: just-in-time and jidoka.'}
    ],
    take:'Make problems stop the line instead of hiding in it. A defect caught at the source costs pennies. One caught by the customer costs the brand.'
  },
  snow:{
    title:'The Pump on Broad Street', place:'Soho, London', year:'1854', icon:'pump', era:'#5f8f73',
    who:{name:'Dr John Snow', epithet:'Father of epidemiology', dates:'1813 to 1858', initials:'JS'},
    cards:[
      {h:'Death in Soho', t:"Late summer, 1854. Cholera tears through Soho, and within days hundreds are dead in a handful of streets. Most doctors blame miasma: bad air rising from filth and rot."},
      {h:'Where did you get your water?', t:"Dr John Snow, a London anaesthetist who had given chloroform to Queen Victoria, does not believe it. He suspects cholera spreads through dirty water. So he goes door to door asking one question: where did you get your water?"},
      {h:'The map', t:"He marks every death on a street map. The deaths cluster around one public pump on Broad Street. Even the outliers fit. A widow in Hampstead who died had liked the taste of Broad Street water so much that she had it carted to her home."},
      {h:'The ones who lived', t:"The exceptions are just as telling. Men at the Lion Brewery, who drank beer, were spared. The workhouse nearby had its own well, and few of its inmates died. On 8 September, Snow persuades the parish to take the handle off the pump."},
      {h:'Proof, slowly', t:"To be fair, the outbreak was already fading by then, and many officials stayed unconvinced. Later the Reverend Henry Whitehead traced the likely source: a baby's nappy rinsed into a leaking cesspit just feet from the well. Germ theory took decades to win, but Snow's map became a founding moment of modern epidemiology."}
    ],
    quiz:[
      {q:'What did most doctors blame for cholera in 1854?', o:['Rats','Miasma, or bad air','Dirty water','Imported cotton'], a:1, why:'Miasma theory was the mainstream view. Snow was the outlier.'},
      {q:'Why were the brewery workers spared?', o:['They drank beer, not pump water','They lived outside Soho','They had been vaccinated','They boiled everything'], a:0, why:'They had a free beer allowance and never drank from the pump.'},
      {q:'What was removed on 8 September?', o:['The local sewer','The workhouse well','The pump handle','The brewery licence'], a:2, why:'No handle, no water from that pump. It became one of the most famous acts in public health.'}
    ],
    take:'Go and see. Snow did not argue theory in a lecture hall. He went to where the problem was, collected data at the source and let the pattern speak. Often it is the outliers that prove the case.'
  },
  nightingale:{
    title:'The Lady with the Data', place:'Scutari', year:'1855', icon:'lamp', era:'#b9824a',
    who:{name:'Florence Nightingale', epithet:'The passionate statistician', dates:'1820 to 1910', initials:'FN'},
    cards:[
      {h:'Scutari', t:"November 1854. Florence Nightingale arrives at the British Army's barracks hospital at Scutari, across the water from Constantinople, with 38 nurses. She finds overcrowded wards, broken drains, rats, and soldiers dying in huge numbers."},
      {h:'The real enemy', t:"The shock is not the battle wounds. Far more men are dying of disease, cholera, typhus and dysentery, than of anything the enemy did to them."},
      {h:'Counting everything', t:"Nightingale keeps meticulous records. In March 1855 a Sanitary Commission arrives from London, flushes out the sewers and improves the ventilation. Over the following months the death rate falls dramatically."},
      {h:'The rose diagram', t:"Back home, she knows numbers alone will not move politicians. So she draws them. Her rose diagrams show a coloured wedge for each month, split into deaths from preventable disease and deaths from wounds. One glance tells the whole story."},
      {h:'A first', t:"In 1858 she becomes the first woman elected to the Royal Statistical Society. Her real legacy is not the lamp. It is the idea that you fix a system by measuring it honestly and showing the evidence so clearly that nobody can ignore it."}
    ],
    quiz:[
      {q:'What killed most soldiers at Scutari?', o:['Battle wounds','The cold','Preventable disease','Food shortages'], a:2, why:'Disease killed far more than the fighting did, which is exactly what her diagrams made obvious.'},
      {q:'What did her famous diagram look like?', o:['A rose of coloured wedges, one per month','A simple bar chart','A line graph of deaths','A pie chart of regiments'], a:0, why:'Often called a coxcomb or polar area diagram. Each wedge was a month.'},
      {q:'What did she achieve in 1858?', o:['The Victoria Cross','A seat in Parliament','First woman elected to the Royal Statistical Society','The Freedom of the City of London'], a:2, why:'A remarkable first for a woman in Victorian Britain.'}
    ],
    take:'Data only changes minds when people can see it in seconds. A clear visual board beats a perfect spreadsheet.'
  },
  oswald:{
    title:"Oswald's Tree", place:'Oswestry, Shropshire', year:'642', icon:'tree', era:'#748c4c',
    who:{name:'King Oswald', epithet:'King and saint of Northumbria', dates:'about 604 to 642', initials:'O'},
    cards:[
      {h:'A Christian king', t:"AD 642. Oswald, the Christian king of Northumbria, is one of the most powerful rulers in Britain. He has brought monks from Iona to found a monastery at Lindisfarne and spread his faith across the north."},
      {h:'Penda of Mercia', t:"His great rival is Penda, the pagan king of Mercia, whose lands stretch across the Midlands to the Welsh borders. On 5 August 642 their armies meet at a place the monk Bede calls Maserfield."},
      {h:'A grim warning', t:"Oswald is defeated and killed. According to Bede, Penda has his head and arms cut off and set up on stakes, a warning to anyone who might follow him."},
      {h:'The raven and the well', t:"Legend says a raven carried off one of Oswald's arms and dropped it, and where it fell a spring burst from the ground. St Oswald's Well can still be visited in Oswestry today. The town's name is traditionally said to mean Oswald's tree."},
      {h:'Still argued over', t:"A year later his brother Oswiu recovers the remains, and Oswald is soon honoured as a saint across Europe. Historians still debate whether Maserfield really was Oswestry, and Makerfield in Lancashire has a rival claim. Oswestry has held on to the story for over 1,300 years."}
    ],
    quiz:[
      {q:'Who killed Oswald at Maserfield?', o:['Offa of Mercia','Penda of Mercia','Cadwallon of Gwynedd','Harold Godwinson'], a:1, why:'Penda, the pagan king of Mercia. Offa came over a century later and built the dyke.'},
      {q:'Which monk wrote the account of the battle?', o:['Alcuin','Gildas','Aidan','Bede'], a:3, why:'Bede told the story in his Ecclesiastical History of the English People, finished around 731.'},
      {q:'What does Oswestry traditionally mean?', o:["Oswald's well","Oswald's tree","Oswald's town","East river"], a:1, why:'The tree, or stake, where his remains were said to hang.'}
    ],
    take:'History is on your doorstep. St Oswald’s Well and the Iron Age hillfort at Old Oswestry are both close by and make a good walk.'
  },
  boudica:{
    title:'The Queen Who Burned London', place:'Roman Britain', year:'AD 60', icon:'wheel', era:'#a8432f',
    who:{name:'Boudica', epithet:'Queen of the Iceni', dates:'died AD 60 or 61', initials:'B'},
    cards:[
      {h:'A king’s will', t:"Around AD 60, Prasutagus, king of the Iceni in what is now Norfolk, dies. Hoping to protect his family, he leaves his kingdom jointly to his daughters and the Roman emperor Nero."},
      {h:'Rome ignores it', t:"Rome tears up the deal. Officials seize the land, Iceni nobles lose their estates, Prasutagus's widow Boudica is flogged and her daughters are assaulted. It is a catastrophic misjudgement."},
      {h:'Three cities burn', t:"While the governor, Suetonius Paulinus, is away attacking the druids on Anglesey, Boudica rises. Tens of thousands join her. They burn Camulodunum, now Colchester, then Londinium, then Verulamium, now St Albans. Archaeologists still find a red layer of burnt debris beneath the City of London."},
      {h:'Choosing the ground', t:"Paulinus hurries back and picks his battlefield with care, somewhere in the Midlands, with woods behind him and a narrow front. His force of around ten thousand trained soldiers faces a far larger army."},
      {h:'Defeat and legend', t:"The Romans win decisively. Boudica dies soon afterwards, and the historian Tacitus says she took poison. Her bronze statue, with her daughters in a chariot, now stands by Westminster Bridge."}
    ],
    quiz:[
      {q:'Where was Paulinus when the revolt began?', o:["Hadrian's Wall",'Anglesey','Rome','Gaul'], a:1, why:"He was attacking the druids on Anglesey. Hadrian's Wall did not exist yet."},
      {q:'Which towns did the rebels destroy?', o:['York, Chester and Bath','Norwich, Ely and Lincoln','Colchester, London and St Albans','Exeter, Bath and Gloucester'], a:2, why:'Camulodunum, Londinium and Verulamium, in that order.'},
      {q:'How does Tacitus say Boudica died?', o:['By poison','In the final battle','Executed in Rome','Of old age'], a:0, why:'Another Roman writer, Cassius Dio, says she fell ill. Nobody knows for certain.'}
    ],
    take:'Big failures often start with someone ignoring an agreement. Rome lost three cities because local officials decided the rules did not apply to them.'
  },
  hastings:{
    title:'Three Weeks in 1066', place:'Battle, East Sussex', year:'1066', icon:'shield', era:'#5c7ca5',
    who:{name:'Harold Godwinson', epithet:'Last Anglo-Saxon king', dates:'about 1022 to 1066', initials:'HG'},
    cards:[
      {h:'A crown in a day', t:"5 January 1066. Edward the Confessor dies without a child. Within a day the powerful earl Harold Godwinson is crowned king. Across the Channel, Duke William of Normandy insists the throne was promised to him."},
      {h:'Danger from the north', t:"Then a second threat. In September the Norwegian king Harald Hardrada lands in Yorkshire, joined by Harold's own exiled brother Tostig. Harold races north and on 25 September crushes them at Stamford Bridge. Both are killed."},
      {h:'Danger from the south', t:"Three days later, on 28 September, William lands at Pevensey on the south coast. Harold marches his battered army back south, roughly 250 miles, gathering men as he goes."},
      {h:'The shield wall', t:"14 October 1066. Harold's men form a shield wall along a ridge near what is now the town of Battle. For hours it holds. But the Normans pretend to retreat, drawing Englishmen down the slope, where cavalry cut them off."},
      {h:'An arrow and a crown', t:"Late in the day Harold is killed. The Bayeux Tapestry seems to show an arrow in the eye, though historians argue over which figure is Harold. On Christmas Day William is crowned in Westminster Abbey, and English history changes course."}
    ],
    quiz:[
      {q:'Who did Harold defeat at Stamford Bridge?', o:['William of Normandy','Harald Hardrada','Malcolm of Scotland','Edward the Confessor'], a:1, why:'Hardrada and Tostig were both killed, just three days before William landed.'},
      {q:'Where did William land?', o:['Dover','Southampton','Pevensey','Hastings beach'], a:2, why:'Pevensey, on 28 September, while Harold was still in the north.'},
      {q:'What tactic helped break the shield wall?', o:['Pretend retreats','Siege towers','A night attack','Greek fire'], a:0, why:'Feigned retreats tempted defenders off the ridge and into the open.'}
    ],
    take:'Two crises in three weeks, with no time to recover. Harold’s army was capable but exhausted. Capacity matters as much as capability.'
  },
  apollo:{
    title:'Square Peg, Round Hole', place:'Between Earth and Moon', year:'1970', icon:'rocket', era:'#d1792a', art:'space',
    who:{name:'Jim Lovell', epithet:'Commander of Apollo 13', dates:'born 1928', initials:'JL'},
    cards:[
      {h:'We’ve had a problem', t:"13 April 1970, nearly 56 hours into the flight to the Moon. Jack Swigert radios: ‘Okay, Houston, we’ve had a problem here.’ An oxygen tank in the service module has exploded. Power and oxygen are bleeding away."},
      {h:'A lifeboat', t:"The landing is off. The only goal now is getting three men home alive. Jim Lovell, Fred Haise and Swigert crowd into the lunar module, Aquarius, a craft built to keep two men alive for about two days, and use it as a lifeboat."},
      {h:'Square peg, round hole', t:"Carbon dioxide starts building up. The command module's spare filters are square, and the lunar module needs round ones. Engineers in Houston design a fix using only what is on board: plastic bags, cardboard, hoses and duct tape. The crew copies it, and the readings fall."},
      {h:'Home, then the hunt', t:"On 17 April the crew splashes down safely in the Pacific. Then the root cause hunt begins. The tank had been dropped about two inches during handling in 1968, and its heater switches were rated for the spacecraft's 28 volts, not the 65 volts used on the ground."},
      {h:'The gauge that couldn’t see', t:"In a test before launch, the heater ran for hours. The switches welded shut, the temperature soared and the wiring insulation was damaged. Nobody noticed, because the temperature gauge only read up to 80°F. The measurement system could not see the problem."}
    ],
    quiz:[
      {q:'What did the crew use as a lifeboat?', o:['The command module, Odyssey','The lunar module, Aquarius','An escape pod','The service module'], a:1, why:'Aquarius was meant for the Moon landing. It kept three men alive for four days.'},
      {q:"Why didn't the spare CO2 filters fit?", o:['They were damaged in the explosion','Wrong chemical inside','Square filters, round sockets','Wrong voltage'], a:2, why:'Two spacecraft from two contractors, two different filter shapes.'},
      {q:'Why did nobody spot the overheating before launch?', o:['The gauge only read up to 80°F','The test was skipped','The tank had no sensor','The data was lost'], a:0, why:'The real temperature went far higher, but the gauge could not show it.'}
    ],
    take:'Check the measurement system before you trust the data. A gauge that tops out below the failure point will always tell you everything is fine.'
  },
  endurance:{
    title:'Endurance', place:'The Weddell Sea, Antarctica', year:'1915', icon:'ship', era:'#6fa3b9',
    who:{name:'Ernest Shackleton', epithet:'Polar explorer', dates:'1874 to 1922', initials:'ES'},
    cards:[
      {h:'Frozen in', t:"August 1914. As war breaks out in Europe, Ernest Shackleton sails south to make the first crossing of Antarctica on foot. By January 1915 his ship, Endurance, is frozen solid in the pack ice of the Weddell Sea."},
      {h:'Crushed', t:"For months the crew wait as the ice drifts. Then the pressure starts to crush the hull. In November 1915 Endurance sinks. Twenty-eight men are left camping on floating ice, hundreds of miles from anywhere."},
      {h:'Elephant Island', t:"In April 1916 the ice breaks up and they escape in three small boats to Elephant Island, a bleak rock nobody would think to search. Shackleton knows the only hope is to go for help himself."},
      {h:'Eight hundred miles', t:"He and five men sail the James Caird, a lifeboat about 23 feet long, roughly 800 miles across some of the roughest seas on Earth to South Georgia. Then three of them cross its unmapped mountains in 36 hours to reach a whaling station."},
      {h:'Every man home', t:"It takes four attempts to get back through the ice, but on 30 August 1916 Shackleton reaches Elephant Island. All 28 men survived. In 2022 the wreck of Endurance was found about 3,000 metres down, remarkably well preserved."}
    ],
    quiz:[
      {q:'Where did Endurance become trapped?', o:['The Ross Sea','The Weddell Sea','The Drake Passage','The Bering Strait'], a:1, why:'The Weddell Sea, which still has some of the worst pack ice on the planet.'},
      {q:'What did Shackleton sail to South Georgia?', o:['Endurance','The Yelcho','The James Caird','The Aurora'], a:2, why:'A 23-foot lifeboat, named after one of the expedition’s sponsors.'},
      {q:'How many of the 28 men survived?', o:['22','14','All 28','6'], a:2, why:'Every one of the Endurance party made it home.'}
    ],
    take:'The plan failed completely, and the leadership did not. When the original goal became impossible, Shackleton changed it to getting everyone home and gave that everything.'
  },
  gagarin:{
    title:'108 Minutes', place:'Baikonur, Kazakhstan', year:'1961', icon:'orbit', era:'#9c3d54',
    who:{name:'Yuri Gagarin', epithet:'First human in space', dates:'1934 to 1968', initials:'YG'},
    cards:[
      {h:"A boy from Klushino", t:"Yuri Gagarin is born in 1934 in a village west of Moscow, the son of farm workers. When German troops occupy the village during the war, his family is forced out of their house and lives in a dugout in the garden."},
      {h:"Foundryman to pilot", t:"After the war he trains as a foundryman, casting metal, and spends his spare time at a flying club. He becomes a military jet pilot, and in 1960 he is one of 20 men picked for the Soviet Union's first cosmonaut group. Being just 1.57 metres tall helps, because the capsule is tiny."},
      {h:"Let's go!", t:"12 April 1961, Baikonur. Strapped into the Vostok 1 capsule on top of a converted missile, Gagarin calls out ‘Poyekhali!’, which means ‘Let's go!’. Minutes later he is the first human being in space."},
      {h:"Once around the world", t:"He circles the Earth once in about 108 minutes. The controls are locked, because nobody knows whether weightlessness will affect a person's mind. An unlock code travels with him in a sealed envelope, just in case."},
      {h:"Coming down", t:"Vostok cannot land gently, so about 7 kilometres up he ejects and comes down by parachute, separately from the capsule. A farmer's wife and her granddaughter are the first people to meet him, in a field near Saratov. He becomes a hero around the world, but dies in 1968 when his training jet crashes. He was 34."}
    ],
    quiz:[
      {q:'What did Gagarin call out at launch?', o:['Houston, we have lift-off','Poyekhali! (Let\u2019s go!)','For the motherland!','One small step'], a:1, why:'A casual, cheerful phrase that became famous across the Soviet Union.'},
      {q:'Roughly how long did his flight last?', o:['12 minutes','108 minutes','One day','Three days'], a:1, why:'One orbit of the Earth, from launch to landing, in about 108 minutes.'},
      {q:'How did he get back to the ground?', o:['Landed the capsule on a runway','Splashed down at sea','Ejected and parachuted down separately','Was picked up by helicopter in orbit'], a:2, why:'The Soviets kept this quiet for years, because record rules at the time expected a pilot to land with the craft.'}
    ],
    take:'Plan for what you do not know. With no idea how a human would cope, the designers locked the controls, sealed a backup code on board and fitted an ejection seat.'
  },
  apollo11:{
    title:'The Eagle Has Landed', place:'The Moon', year:'1969', icon:'boot', era:'#6c7591',
    who:{name:'Neil Armstrong', epithet:'First person on the Moon', dates:'1930 to 2012', initials:'NA'},
    cards:[
      {h:"The target", t:"16 July 1969. Neil Armstrong, Buzz Aldrin and Michael Collins launch on Apollo 11. Four days later, Armstrong and Aldrin climb into the lunar module, Eagle, and start down towards a flat plain called the Sea of Tranquility."},
      {h:"Alarms", t:"Partway down, warnings flash up: 1202, then 1201. The guidance computer is overloaded. In Houston, a young controller recognises the codes and makes a split-second call. They are safe. Keep going."},
      {h:"Margaret Hamilton's code", t:"It is safe because of the software. A team led by Margaret Hamilton at MIT designed it to drop low-priority jobs when overloaded and keep doing the ones that matter, like landing. The computer has a tiny fraction of the memory in a modern phone, but it holds."},
      {h:"Thirty seconds", t:"Then Armstrong sees the computer steering them into a field of boulders. He takes manual control and flies on, hunting for a clear spot as the fuel runs low. Mission Control calls out ‘thirty seconds’. On 20 July, Eagle touches down. ‘The Eagle has landed.’"},
      {h:"One small step", t:"Hours later Armstrong steps onto the Moon, watched by an estimated 600 million people. Aldrin follows him. Above them, Collins orbits alone in the command module, Columbia, cut off from all radio contact each time he passes behind the Moon. Their footprints are still there."}
    ],
    quiz:[
      {q:'What caused the 1202 alarms?', o:['A fuel leak','The guidance computer was overloaded','A cracked window','Radio interference from Earth'], a:1, why:'Too many jobs at once. The software coped by dropping the less important ones.'},
      {q:'Who led the team that wrote the landing software?', o:['Katherine Johnson','Margaret Hamilton','Wernher von Braun','Gene Kranz'], a:1, why:'Hamilton later received the US Presidential Medal of Freedom for the work.'},
      {q:'Who stayed in orbit in Columbia?', o:['Buzz Aldrin','Jim Lovell','Michael Collins','John Glenn'], a:2, why:'Collins flew around the Moon alone while the others walked on it.'}
    ],
    take:'Design systems to fail gracefully. When it was overloaded, Eagle\u2019s computer dropped the unimportant jobs and kept landing. Protect the critical task and shed the rest.'
  },
  hubble:{
    title:'The Telescope That Needed Glasses', place:'In orbit above Earth', year:'1990', icon:'galaxy', era:'#3d5a9e',
    who:{name:'Edwin Hubble', epithet:'The man who measured the universe', dates:'1889 to 1953', initials:'EH'},
    cards:[
      {h:"A bigger universe", t:"1923, Mount Wilson, California. Astronomer Edwin Hubble spots a special kind of pulsing star in the Andromeda nebula and works out how far away it is. It is far too distant to be inside our own galaxy. Andromeda is a galaxy of its own, and the universe is suddenly vastly bigger."},
      {h:"His name in orbit", t:"In April 1990 the Space Shuttle Discovery carries a telescope named after him into orbit. Above the blur of the atmosphere, the Hubble Space Telescope is meant to see the universe more clearly than ever before."},
      {h:"Blurry", t:"The first pictures are a disaster. Stars look fuzzy. The main mirror, one of the most precisely polished ever made, has been ground to the wrong shape. The error at its edge is about 2.2 microns, roughly one fiftieth of the width of a human hair."},
      {h:"The test was wrong", t:"The root cause is in the testing kit. A device used to check the mirror's shape had a lens fitted about 1.3 millimetres out of position. Other, cruder tests did show a problem, but they were dismissed because everyone trusted the precision instrument."},
      {h:"Glasses, then wonder", t:"In December 1993, astronauts fit corrective optics, in effect a pair of glasses. In 1995 Hubble stares for about ten days at a tiny patch of sky that looks empty. The picture, the Hubble Deep Field, reveals around 3,000 galaxies."}
    ],
    quiz:[
      {q:'What did Edwin Hubble show about Andromeda?', o:['It was a cloud of gas in our galaxy','It was a separate galaxy','It was a comet','It was a dying star'], a:1, why:'It proved there are other galaxies beyond our own Milky Way.'},
      {q:'How far out was the telescope\u2019s mirror at the edge?', o:['About 2 centimetres','About 2 millimetres','About 2.2 microns','It was perfect; the camera was faulty'], a:2, why:'A tiny error, but enough to blur every image.'},
      {q:'Why was the flaw not caught before launch?', o:['Nobody tested it','The testing device was set up wrongly','The mirror bent during launch','The test results were lost'], a:1, why:'The mirror was polished perfectly to the wrong shape, because the instrument guiding it was wrong.'}
    ],
    take:'When one test disagrees, investigate it instead of dismissing it. Hubble\u2019s mirror passed the precise test that was wrong and failed the rough tests that were right.'
  },
  sharman:{
    title:'Astronaut Wanted', place:'Mir space station', year:'1991', icon:'station', era:'#2f7f86',
    who:{name:'Helen Sharman', epithet:'First Briton in space', dates:'born 1963', initials:'HS'},
    cards:[
      {h:"The advert", t:"1989. Helen Sharman, a chemist from Sheffield, is driving home from work when she hears an advert on the radio: ‘Astronaut wanted. No experience necessary.’ She applies."},
      {h:"The day job", t:"At the time she works for Mars, the confectionery company, developing flavours in its chocolate research labs. Around 13,000 people apply. She gets through medical, psychological and fitness tests all the way to the final shortlist, and is chosen."},
      {h:"Star City", t:"Project Juno, a deal with the Soviet Union, sends her to Star City near Moscow. For 18 months she trains as a cosmonaut and learns Russian. When the British money falls short, the Soviets decide to fly her anyway."},
      {h:"Soyuz", t:"18 May 1991. Aged 27, she launches from Baikonur on Soyuz TM-12 with two Soviet cosmonauts. Two days later they dock with the Mir space station."},
      {h:"Eight days", t:"On Mir she runs medical and plant-growing experiments, photographs Britain from orbit and talks to British schoolchildren by amateur radio. She lands on 26 May after eight days in space. Tim Peake, the first British astronaut with the European Space Agency, followed in 2015."}
    ],
    quiz:[
      {q:'How did Helen Sharman hear about the job?', o:['A newspaper advert','A radio advert','Through her university','A friend at NASA'], a:1, why:'‘Astronaut wanted. No experience necessary.’ She heard it on her drive home.'},
      {q:'What was her job before?', o:['RAF pilot','Chemist at Mars, the chocolate maker','Doctor','Science teacher'], a:1, why:'She went from developing chocolate flavours to orbiting the Earth.'},
      {q:'Which space station did she visit?', o:['The International Space Station','Skylab','Mir','Salyut 7'], a:2, why:'Mir, the Soviet station. The ISS did not exist until 1998.'}
    ],
    take:'Talent turns up in unexpected places. A chocolate chemist became Britain\u2019s first astronaut because the job was advertised widely and people were judged on ability, not background.'
  },
  battle:{
    title:'The Battle of Britain', place:'The skies over southern England', year:'1940', icon:'radar', era:'#4f7fa8',
    who:{name:'Hugh Dowding', epithet:'Architect of the Battle of Britain', dates:'1882 to 1970', initials:'HD'},
    cards:[
      {h:"Summer 1940", t:"France has fallen. Hitler plans to invade Britain, an operation codenamed Sea Lion. But first the German air force, the Luftwaffe, must win control of the skies. Only the RAF's Fighter Command stands in the way."},
      {h:"Dowding's system", t:"Fighter Command's chief, Hugh Dowding, has spent years building something new: a network. Radar stations along the coast spot raids as they form over France. Thousands of Observer Corps volunteers track them inland. All of it flows to a filter room at Bentley Priory, then to operations rooms that send fighters exactly where they are needed."},
      {h:"The Few", t:"Around 3,000 aircrew fly in the battle. Most are British, but hundreds come from Poland, Czechoslovakia, Canada, New Zealand and beyond, and the Polish 303 Squadron becomes one of the most successful of all. The Spitfire gets the fame, but it is the Hurricane that shoots down the most enemy aircraft."},
      {h:"London burns", t:"In late August and early September the Luftwaffe pounds the RAF's airfields, and Fighter Command comes close to breaking. Then, on 7 September, Germany switches to bombing London. The Blitz is terrible for Londoners, but it gives the airfields vital breathing space."},
      {h:"15 September", t:"On 15 September the Luftwaffe sends huge raids against London, expecting to finish the RAF. Fighter Command meets them in force and the attacks fail. Two days later Hitler postpones the invasion. Churchill had already summed it up: never was so much owed by so many to so few. The date is now marked as Battle of Britain Day."}
    ],
    quiz:[
      {q:'What was the codename for Hitler’s planned invasion of Britain?', o:['Operation Overlord','Operation Sea Lion','Operation Barbarossa','Operation Dynamo'], a:1, why:'Sea Lion depended on the Luftwaffe beating the RAF first, and it never did.'},
      {q:'In Dowding’s system, what spotted raids as they formed over France?', o:['Spies in France','Barrage balloons','Radar stations along the coast','Codebreakers'], a:2, why:'Radar gave the early warning. The Observer Corps tracked raids once they crossed the coast.'},
      {q:'Which RAF fighter shot down the most enemy aircraft?', o:['The Spitfire','The Hurricane','The Lancaster','The Mosquito'], a:1, why:'The Spitfire is more famous, but the Hurricane did most of the damage.'}
    ],
    take:'Win with the system as well as the heroes. Dowding’s real advantage was information: the right data reaching the right decision-maker fast enough to act on it.'
  },
  mitchell:{
    title:'The Spitfire', place:'Southampton', year:'1936', icon:'plane', era:'#6b7a4a',
    who:{name:'R.J. Mitchell', epithet:'Designer of the Spitfire', dates:'1895 to 1937', initials:'RM'},
    cards:[
      {h:"A boy from the Potteries", t:"Reginald Mitchell is born in 1895 near Stoke-on-Trent. As a boy he is obsessed with model aeroplanes. He leaves school to become an apprentice at a locomotive works and studies engineering and maths at night."},
      {h:"Supermarine", t:"In 1917 he joins the Supermarine aircraft company in Southampton. Within a few years, still in his mid-twenties, he is its chief designer."},
      {h:"Racing seaplanes", t:"His sleek racing seaplanes win the Schneider Trophy for Britain in 1927, 1929 and 1931. When the government refuses to pay for the 1931 entry, a wealthy widow, Lady Houston, donates one hundred thousand pounds. The winning S.6B later sets a world speed record of over 400 miles an hour."},
      {h:"A new fighter", t:"Mitchell takes those lessons into a fighter. The prototype Spitfire first flies on 5 March 1936. Its thin, elliptical wing makes it fast and graceful, yet still has room inside for eight machine guns."},
      {h:"Racing the clock", t:"Mitchell has been diagnosed with cancer, but he keeps working. He dies in June 1937, aged 42, before the Spitfire enters RAF service. More than 20,000 are eventually built, and the aircraft becomes the symbol of 1940."}
    ],
    quiz:[
      {q:'Which competition did Mitchell’s racing seaplanes win?', o:['The King’s Cup','The Schneider Trophy','The Blue Riband','The Gordon Bennett Cup'], a:1, why:'Three wins, in 1927, 1929 and 1931.'},
      {q:'Who paid for the 1931 entry when the government refused?', o:['The RAF','Rolls-Royce','Lady Houston','Winston Churchill'], a:2, why:'Her donation of one hundred thousand pounds kept Britain in the race.'},
      {q:'What was special about the Spitfire’s wing?', o:['It folded for aircraft carriers','It was made of wood','It was thin and elliptical, with room for eight guns','It was swept back like a jet'], a:2, why:'That wing shape is what makes a Spitfire instantly recognisable.'}
    ],
    take:'Use a fast test bed. The racing seaplanes were Mitchell’s laboratory: every lesson they taught him went straight into the Spitfire.'
  },
  bletchley:{
    title:'Breaking Enigma', place:'Bletchley Park, Buckinghamshire', year:'1940', icon:'enigma', era:'#6a4a6e',
    who:{name:'Alan Turing', epithet:'Codebreaker and computing pioneer', dates:'1912 to 1954', initials:'AT'},
    cards:[
      {h:"The machine", t:"German forces send their orders using Enigma, a machine like a typewriter that scrambles every letter. Its settings change every day, giving around 159 million million million possibilities. The Germans believe it cannot be broken."},
      {h:"A Polish head start", t:"In fact, Polish mathematicians led by Marian Rejewski had been reading Enigma messages since the early 1930s. In July 1939, weeks before the war begins, they share everything they know with the British and the French."},
      {h:"Bletchley Park", t:"At a country house in Buckinghamshire, Britain gathers mathematicians, linguists, chess champions and crossword fans. Alan Turing and Gordon Welchman design the Bombe, an electro-mechanical machine that rapidly tests possible settings to find each day's key."},
      {h:"Thousands of secrets", t:"By 1945 around 10,000 people work there, about three-quarters of them women. Their intelligence, codenamed Ultra, helps win the Battle of the Atlantic against the U-boats. For decades none of them can tell anyone, not even their families, what they did."},
      {h:"Turing's legacy", t:"Turing goes on to help shape modern computing. In 1952 he is prosecuted for being gay, which was then illegal, and he dies in 1954 aged 41. In 2013 he receives a royal pardon, and since 2021 his face has been on the £50 note."}
    ],
    quiz:[
      {q:'Who shared their Enigma breakthroughs with Britain in July 1939?', o:['French spies','A German defector','Polish mathematicians','American codebreakers'], a:2, why:'Marian Rejewski and his colleagues gave Bletchley a crucial head start.'},
      {q:'What did the Bombe do?', o:['Encrypted British messages','Rapidly tested possible settings to find the day’s key','Tracked U-boats by radio','Built the first radar'], a:1, why:'Turing and Welchman’s machine did in hours what would take people far longer by hand.'},
      {q:'By 1945, roughly what share of Bletchley’s staff were women?', o:['About a tenth','About a quarter','About half','About three-quarters'], a:3, why:'Around three-quarters of the roughly 10,000 people there.'}
    ],
    take:'Mix the team. Bletchley cracked a problem no single expert could by putting mathematicians, linguists and puzzle-solvers in one place with one shared goal.'
  }
};

/* Requests that have become cards: request ID (from Firebase, families/<code>/requests) -> card id in STORIES.
   Those requests show a tick and an "Added as a card" link in the app. */
const FULFILLED = {
};
