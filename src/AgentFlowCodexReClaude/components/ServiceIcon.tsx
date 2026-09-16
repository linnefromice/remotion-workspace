import React from "react";

export type ServiceIconName = "phone" | "wave" | "calendar" | "check" | "people" | "agent" | "database" | "branch" | "tool" | "message" | "inbox" | "sliders";

/** Role pictograms rather than vendor logos. Color is inherited from IconNode. */
export const ServiceIcon: React.FC<{name: ServiceIconName}> = ({name}) => {
  const paths: Record<ServiceIconName, React.ReactNode> = {
    phone: <><path d="m14 7-6 5c-5 10 18 33 28 28l5-6-10-8-5 5-9-9 5-5Z"/><path d="M31 7a16 16 0 0 1 13 13M30 14a9 9 0 0 1 7 7"/></>,
    wave: <>{[12, 24, 38, 48, 30, 18, 8].map((h, i) => <path key={i} d={`M${5 + i * 7} ${25 - h / 2}v${h}`}/>)}</>,
    calendar: <><rect x="6" y="10" width="38" height="35" rx="4"/><path d="M6 20h38M15 5v10M35 5v10m-20 17 7 7 13-13"/></>,
    check: <><circle cx="25" cy="25" r="21"/><path d="m14 25 8 8 15-17"/></>,
    people: <><circle cx="18" cy="16" r="8"/><path d="M3 44v-5a15 15 0 0 1 30 0v5ZM35 8a8 8 0 0 1 0 16M38 30q10 2 10 14H39"/></>,
    agent: <><rect x="7" y="14" width="36" height="29" rx="7"/><path d="M25 5v9M2 23v11M48 23v11M18 34h14"/><circle cx="17" cy="25" r="2"/><circle cx="33" cy="25" r="2"/></>,
    database: <><ellipse cx="25" cy="10" rx="18" ry="7"/><path d="M7 10v30c0 10 36 10 36 0V10M7 24c0 10 36 10 36 0"/></>,
    branch: <><path d="M5 25h14q7 0 7-8V10h17M19 25q7 0 7 8v7h17m-7-37 7 7-7 7m0 16 7 7-7 7"/></>,
    tool: <><path d="m30 6-7 7 3 10 10 3 8-8c5 16-9 23-19 15L12 46 4 38l14-13C10 12 20 3 30 6Z"/></>,
    message: <><path d="M6 7h38v29H22L9 46V36H6Z"/><path d="M15 17h20M15 25h14"/></>,
    inbox: <><path d="M5 27h11l4 7h10l4-7h11M5 27l7-19h26l7 19v14a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3Z"/></>,
    sliders: <><path d="M9 8v12M9 30v12M25 8v6M25 24v18M41 8v18M41 36v6"/><circle cx="9" cy="25" r="5"/><circle cx="25" cy="19" r="5"/><circle cx="41" cy="31" r="5"/></>,
  };
  return <svg aria-hidden="true" width="56" height="56" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};
