import React from 'react';
import auditProcessArticle from './content/blog/our-smart-contract-audit-process.md?raw';

/*
Start by making a HEADER.

Background: 03012E

Left hand side: 
-> logo/logo_colour.svg
-> name: TOZERS LABS (D9D9D9) (IBM Plex Mono; Regular 18px)


Right hand side:
-> Services (dropdown: Smart Contract Audits; Research & Development) (A8BBD6)
-> Audit Reports (A8BBD6)
-> Portfolio (A8BBD6)
-> Blog (A8BBD6)
-> About (A8BBD6)
-> Contact Us Button (5640FF background; slight curvature; white text; responsive.)

Footer higher: medium for industry standard.

*/

const navLinks = [
  { label: 'Audit Reports', href: '/reports' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
];

const serviceOptions = [
  { label: 'Smart Contract Audits', href: '/audits' },
  { label: 'Research & Development', href: '/research' },
];

const clientRowOne = [
  { name: 'Aragon', src: '/images/logos/aragon.svg', height: '52px', maxWidth: '210px' },
  { name: 'Berryblock', src: '/images/logos/berryblock.svg', height: '52px', maxWidth: '230px' },
  { name: 'Benqi', src: '/images/logos/benqi.svg', height: '52px', maxWidth: '190px' },
  { name: 'Coral2', src: '/images/logos/coral2.svg', height: '52px', maxWidth: '210px' },
];

const clientRowTwo = [
  { name: 'Solana', src: '/images/logos/solana.svg', height: '48px', maxWidth: '220px' },
  { name: 'Eleventh House', src: '/images/logos/eleventh_house.svg', height: '50px', maxWidth: '200px' },
  { name: 'Aave DAO', src: '/images/logos/aave_grants_dao.svg', height: '58px', maxWidth: '170px' },
  { name: 'Scabench', src: '/images/logos/scabench.svg', height: '48px', maxWidth: '160px' },
];

const ServicesDropdown = () => {
  const [open, setOpen] = React.useState(false);

  const closeMenu = () => setOpen(false);
  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpen(false);
    }
  };

  return (
    <div
      className="relative -mx-2 px-2 py-3"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={closeMenu}
      onBlur={handleBlur}
    >
      <button
        className="flex items-center gap-1 rounded-lg px-4 py-2.5 text-sm font-medium text-[#C3CCE2] transition-colors hover:text-white focus:text-white focus:outline-none"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={open}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            closeMenu();
            event.currentTarget.blur();
          }
        }}
      >
        Services
        <span
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>
      {open && (
        <>
          <span
            aria-hidden="true"
            className="absolute left-0 top-full z-10 block h-2 w-96"
          />
          <div
            className="absolute left-0 top-full z-20 mt-2 w-96 rounded-2xl border border-white/10 bg-[#07051F] p-6 shadow-2xl shadow-black/40"
          >
            <ul className="flex flex-col gap-3">
              {serviceOptions.map((option) => (
                <li key={option.label}>
                  <a
                    href={option.href}
                    className="block rounded-lg px-5 py-3 text-base text-[#E3EAF6] transition-colors hover:bg-white/5 hover:text-white"
                  >
                    {option.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

const Header = () => {
  return (
    <header className="w-full bg-[#03012E]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3 lg:px-6">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/images/logo/logo_colour.svg"
              alt="Tozers Labs logo"
              className="h-[4.6rem] w-auto"
            />
            <span
              className="text-lg font-normal tracking-[0.096em] text-[#C3CCE2]"
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              TOZER LABS
            </span>
          </a>
        <nav className="flex flex-1 flex-wrap items-center justify-start gap-x-6 gap-y-3 text-sm text-[#C3CCE2] sm:justify-end sm:gap-x-8">
          <ServicesDropdown />
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-[#C3CCE2] transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="ml-auto inline-flex items-center justify-center rounded-lg bg-[#5640FF] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(86,64,255,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:ml-6"
          >
            Contact Us
          </a>
        </nav>
      </div>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#03012E]">
      <div className="absolute inset-0">
        <img
          src="/images/banner/banner_dark.jpeg"
          alt="Abstract security inspired banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03012E]/80 via-[#03012E]/60 to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-[200px] w-full max-w-6xl items-stretch px-3 pt-1 pb-0 sm:px-4 lg:px-6">
        <div className="w-full rounded-3xl bg-[#03012E]/95 px-6 pt-6 pb-8 shadow-[0_25px_50px_rgba(3,1,46,0.55)] backdrop-blur-md md:w-1/2 md:px-8 md:pt-8 md:pb-8">
          <p
            className="font-medium leading-tight text-white"
            style={{ fontFamily: '"Poppins", sans-serif' }}
          >
            <span
              className="block text-[34px] text-transparent sm:text-[43px] lg:text-[52px]"
              style={{
                backgroundImage: 'linear-gradient(180deg, #FFFFFF 0%, #4D4A86 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                letterSpacing: '-0.02em',
              }}
            >
              Web3 Security & Development Services
            </span>
          </p>
          <p
            className="mt-6 text-[18px] leading-7 text-[#EEE0FF]"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}
          >
            Startups | dApps | Traders | Distributed Systems | Innovators
          </p>
          <div className="mt-6">
            <a
              href="#contact"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-[#5640FF] px-10 py-5 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(86,64,255,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ClientsSection = () => {
  return (
    <section className="bg-[#03012E] py-14">
      <div className="mx-auto w-full max-w-6xl px-3 text-center sm:px-4 lg:px-6">
        <h2
          className="font-medium leading-tight text-white text-center"
          style={{ fontFamily: '"Poppins", sans-serif' }}
        >
          <span
            className="block text-[30px] text-transparent sm:text-[40px]"
            style={{
              backgroundImage: 'linear-gradient(180deg, #C6C3EC 0%, #7F7ABE 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}
          >
            Select Clients & Collaborators
          </span>
        </h2>
        <div className="mt-10 space-y-10 text-white/70">
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
            {clientRowOne.map((client) => (
              <img
                key={client.name}
                src={client.src}
                alt={`${client.name} logo`}
                className="w-auto object-contain"
                style={{
                  height: client.height ?? '48px',
                  maxWidth: client.maxWidth ?? '220px',
                }}
                loading="lazy"
              />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16 translate-x-5 sm:translate-x-10">
            {clientRowTwo.map((client) => (
              <img
                key={client.name}
                src={client.src}
                alt={`${client.name} logo`}
                className="w-auto object-contain"
                style={{
                  height: client.height ?? '48px',
                  maxWidth: client.maxWidth ?? '220px',
                }}
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ServicesOverview = () => {
  return (
    <section className="bg-[#05042A] px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4 text-left">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8B8BB6]">
            Secure your smart contracts
          </p>
          <div className="text-[42px] leading-tight text-[#E5E2FF]" style={{ fontFamily: '"Poppins", sans-serif' }}>
            <div className="font-medium text-[#E5E2FF]">Smart Contract</div>
            <div className="font-medium text-[#9C96D0]">Auditing Services</div>
          </div>
        </div>
        <div className="space-y-6 text-base leading-7 text-[#F1EDFF] sm:max-w-md">
          <p>
            Identify functional and security vulnerabilities in your smart contracts. We deliver a thorough
            report outlining risks, severity, impact, and remediation guidance to support secure deployment
            and ongoing maintenance.
          </p>
          <a
            href="/audits"
            className="inline-flex items-center justify-center rounded-xl bg-[#5B4BFF] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Learn More&nbsp;&nbsp;→
          </a>
        </div>
      </div>
    </section>
  );
};

const ResearchDevelopment = () => {
  return (
    <section className="bg-[#03002A] px-5 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-4 text-left">
          <p className="text-sm uppercase tracking-[0.2em] text-[#8B8BB6]">
            Building your vision
          </p>
          <div className="text-[42px] leading-tight text-[#E5E2FF]" style={{ fontFamily: '"Poppins", sans-serif' }}>
            <div className="font-medium text-[#E5E2FF]">Research &amp; Development</div>
          </div>
        </div>
        <div className="space-y-6 text-base leading-7 text-[#F1EDFF] sm:max-w-md">
          <p>
            We conduct research and development services focused on exploring complex technical problems and building
            innovative solutions. Our work blends deep investigation with hands-on engineering to validate ideas,
            develop prototypes, and push systems beyond known limits.
          </p>
          <a
            href="/research"
            className="inline-flex items-center justify-center rounded-xl bg-[#5B4BFF] px-8 py-4 text-sm font-semibold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Learn More&nbsp;&nbsp;→
          </a>
        </div>
      </div>
    </section>
  );
};

const auditCardsPrimary = [
  { title: "Aragon's VE Governance #1", subtitle: 'Smart Contract Audit', src: '/images/cards/aragon_ve_1.png' },
  { title: "Aragon's VE Governance #2", subtitle: 'Smart Contract Audit', src: '/images/cards/aragon_ve_2.png' },
  { title: 'Swaplor Review', subtitle: 'Smart Contract Audit', src: '/images/cards/berryblock_1.png' },
];

const auditReportCards = [
  ...auditCardsPrimary,
  { title: 'Coral Systems Review', subtitle: 'Smart Contract Audit', src: '/images/cards/coral.png' },
  { title: "Aragon's VE Boundary", subtitle: 'Smart Contract Audit', src: '/images/cards/aragon_ve_boundary.png' },
];

const featuredWorks = [
  { title: 'DAO Governance UX', subtitle: 'Development Grant', src: '/images/cards/aave.png' },
  { title: 'Web3 Geography Analytics', subtitle: 'Development Grant', src: '/images/cards/solana.png' },
  { title: 'Sports Arbitrage Bot', subtitle: 'Trading Algorithm & Execution', src: '/images/cards/sports_arb.png' },
];

const additionalPortfolioCards = [
  { title: 'Eleventh House Initiative', subtitle: 'Research & Development', src: '/images/cards/eleventh_house.png' },
  { title: 'Hound Signal Engine', subtitle: 'Research & Development', src: '/images/cards/hound.png' },
];

const portfolioCards = [...auditReportCards, ...featuredWorks, ...additionalPortfolioCards];
const researchCards = [...featuredWorks, ...additionalPortfolioCards];

const convertMarkdownToHtml = (markdown) => {
  const escapeHtml = (str) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const formatInline = (text) =>
    escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

  const lines = markdown.split('\n');
  const htmlParts = [];
  let listBuffer = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      htmlParts.push(`<ul>${listBuffer.join('')}</ul>`);
      listBuffer = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      return;
    }

    if (line.startsWith('- ')) {
      const content = formatInline(line.replace(/^- /, ''));
      listBuffer.push(`<li>${content}</li>`);
      return;
    }

    flushList();

    if (line.startsWith('## ')) {
      htmlParts.push(
        `<h3>${formatInline(line.replace(/^##\s*/, ''))}</h3>`,
      );
      return;
    }

    htmlParts.push(`<p>${formatInline(line)}</p>`);
  });

  flushList();
  return htmlParts.join('');
};

const blogPosts = [
  {
    slug: 'our-smart-contract-audit-process',
    title: 'Our Smart Contract Audit Process',
    excerpt:
      'From discovery to remediation, here is how we uncover vulnerabilities that escape other teams.',
    date: 'January 2025',
    readingTime: '8 min read',
    content: auditProcessArticle,
  },
];

const FeaturedAudits = ({
  cards = auditCardsPrimary,
  label = 'Proven in production',
  title = 'Featured Audit Reports',
}) => {
  return (
    <section className="bg-[#03012E] px-5 pb-16 pt-12 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <p className="text-sm uppercase tracking-[0.3em] text-[#8B8BB6]">{label}</p>
        <h3
          className="mt-2 text-[32px] font-medium text-white sm:text-[40px]"
          style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
        >
          {title}
        </h3>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-3xl bg-white/5 transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
              style={{ boxShadow: '0 25px 70px rgba(0,0,0,0.35)' }}
            >
              <img
                src={card.src}
                alt={`${card.title} preview`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const methodDiagramEmbedUrl = 'https://link.excalidraw.com/readonly/Qw6Y2tLPhtQAptqGDSTk';

const FeaturedWorks = () => {
  return (
    <section className="bg-[#03012E] px-5 pb-16 pt-12 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <h3
          className="text-[32px] font-medium text-white sm:text-[40px]"
          style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
        >
          Featured Works
        </h3>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredWorks.map((card) => (
            <article
              key={card.title}
              className="overflow-hidden rounded-3xl bg-[#050316] transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
              style={{ boxShadow: '0 25px 70px rgba(0,0,0,0.35)' }}
            >
              <img
                src={card.src}
                alt={`${card.title} preview`}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

const footerLinks = [
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#about' },
      { label: 'Contact Us', href: '#contact' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Smart Contract Auditing', href: '#services' },
      { label: 'Audit Reports', href: '#reports' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="bg-[#030030] px-5 pb-10 pt-12 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl space-y-10 text-[#D5D4F2]">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4 text-white">
            <img src="/images/logo/logo_colour.svg" alt="Tozer Labs emblem" className="h-12 w-auto" />
            <span
              className="text-2xl tracking-[0.2em]"
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              TOZER LABS
            </span>
          </div>
          <div className="grid flex-1 grid-cols-1 gap-8 text-sm sm:grid-cols-3">
            {footerLinks.map((group) => (
              <div key={group.heading}>
                <p className="text-base font-semibold text-white">{group.heading}</p>
                <ul className="mt-4 space-y-2 text-[#C2C0E6]">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="transition hover:text-white">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-white/10" />
        <p className="text-center text-xs text-[#A5A3CD]">
          © {new Date().getFullYear()} TozerLabs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const SmartContractAuditHero = () => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#03012E]">
      <div className="absolute inset-0">
        <img
          src="/images/banner/banner_dark.jpeg"
          alt="Abstract security inspired banner"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03012E]/85 via-[#03012E]/60 to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-[300px] w-full max-w-6xl items-stretch px-5 pt-4 pb-8 sm:px-8 lg:px-10">
        <div className="w-full rounded-3xl bg-[#03012E]/95 px-6 py-8 shadow-[0_30px_60px_rgba(3,1,46,0.6)] backdrop-blur-md md:w-1/2 md:px-8 md:py-10">
          <p
            className="text-[34px] font-medium leading-tight text-white sm:text-[46px]"
            style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
          >
            Smart Contract Audits
          </p>
          <p
            className="mt-4 text-[18px] leading-7 text-[#EEE0FF]"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}
          >
            Our process uncovers vulnerabilities that elite audit firms miss. We combine depth-first research with
            relentless testing to secure your Web3 systems.
          </p>
          <div className="mt-6">
            <a
              href="#contact"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-[#5B4BFF] px-10 py-4 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(86,64,255,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Request Audit&nbsp;&nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const AuditClientReel = () => {
  const logos = [
    { name: 'Aragon', src: '/images/logos/aragon.svg' },
    { name: 'Berryblock', src: '/images/logos/berryblock.svg' },
    { name: 'Benqi', src: '/images/logos/benqi.svg' },
    { name: 'Coral2', src: '/images/logos/coral2.svg' },
  ];

  const looped = [...logos, ...logos];

  return (
    <div className="bg-[#120B3B] py-6">
      <div className="flex overflow-hidden">
        <div className="flex animate-[slide_11s_linear_infinite] gap-10 px-6">
          {looped.map((logo, index) => (
            <img
              key={`${logo.name}-${index}`}
              src={logo.src}
              alt={`${logo.name} logo`}
              className="h-12 w-auto object-contain opacity-80"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const TargetedInvestigations = () => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#03012E]">
      <div className="absolute inset-0">
        <img
          src="/images/banner/banner_dark.jpeg"
          alt="Abstract targeted investigation background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#03012E]/85 via-[#03012E]/65 to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-[320px] w-full max-w-6xl items-stretch px-5 py-14 sm:px-8 lg:px-10">
        <div className="ml-auto w-full rounded-3xl bg-[#03012E]/95 px-6 py-8 shadow-[0_30px_60px_rgba(3,1,46,0.6)] backdrop-blur-md md:w-1/2 md:px-8 md:py-10">
          <p
            className="text-[34px] font-medium leading-tight text-white sm:text-[46px]"
            style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
          >
            Targeted Investigations
          </p>
          <p className="mt-4 text-base leading-7 text-[#EEE0FF]" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
            For issues that fall outside a full audit, we offer focused engagements, including parameter reviews,
            threat modeling, architecture deep dives, and workshops. We’ll define the scope with you and deliver
            practical recommendations and prioritized fixes.
          </p>
          <div className="mt-6">
            <a
              href="#contact"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-[#5B4BFF] px-10 py-4 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(86,64,255,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Contact Us&nbsp;&nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const AuditReportsHero = () => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#03012E]">
      <div className="absolute inset-0">
        <img
          src="/images/banner/banner_dark.jpeg"
          alt="Audit reports hero background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03012E]/85 via-[#03012E]/60 to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-[300px] w-full max-w-6xl items-stretch px-5 pt-4 pb-8 sm:px-8 lg:px-10">
        <div className="w-full rounded-3xl bg-[#03012E]/95 px-6 py-8 shadow-[0_30px_60px_rgba(3,1,46,0.6)] backdrop-blur-md md:w-1/2 md:px-8 md:py-10">
          <p
            className="text-[34px] font-medium leading-tight text-white sm:text-[46px]"
            style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
          >
            Audit Reports
          </p>
          <p
            className="mt-4 text-[18px] leading-7 text-[#EEE0FF]"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}
          >
            Read our detailed reports that outline findings, methodologies, and remediation guidance for top Web3
            teams.
          </p>
          <div className="mt-6">
            <a
              href="#reports"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-[#5B4BFF] px-10 py-4 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(86,64,255,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Read Reports&nbsp;&nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const PortfolioHero = () => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#03012E]">
      <div className="absolute inset-0">
        <img
          src="/images/banner/banner_dark.jpeg"
          alt="Portfolio hero background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03012E]/85 via-[#03012E]/60 to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-[300px] w-full max-w-6xl items-stretch px-5 pt-4 pb-8 sm:px-8 lg:px-10">
        <div className="w-full rounded-3xl bg-[#03012E]/95 px-6 py-8 shadow-[0_30px_60px_rgba(3,1,46,0.6)] backdrop-blur-md md:w-1/2 md:px-8 md:py-10">
          <p
            className="text-[34px] font-medium leading-tight text-white sm:text-[46px]"
            style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
          >
            Portfolio
          </p>
          <p
            className="mt-4 text-[18px] leading-7 text-[#EEE0FF]"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}
          >
            Explore every audit, research engagement, and prototype we’ve delivered for ambitious teams.
          </p>
          <div className="mt-6">
            <a
              href="#portfolio-grid"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-[#5B4BFF] px-10 py-4 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(86,64,255,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              View Work&nbsp;&nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const ResearchHero = () => {
  return (
    <section className="relative isolate w-full overflow-hidden bg-[#03012E]">
      <div className="absolute inset-0">
        <img
          src="/images/banner/banner_dark.jpeg"
          alt="Research hero background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#03012E]/85 via-[#03012E]/60 to-transparent" />
      </div>
      <div className="relative mx-auto flex min-h-[300px] w-full max-w-6xl items-stretch px-5 pt-4 pb-8 sm:px-8 lg:px-10">
        <div className="w-full rounded-3xl bg-[#03012E]/95 px-6 py-8 shadow-[0_30px_60px_rgba(3,1,46,0.6)] backdrop-blur-md md:w-1/2 md:px-8 md:py-10">
          <p
            className="text-[34px] font-medium leading-tight text-white sm:text-[46px]"
            style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
          >
            Research &amp; Development
          </p>
          <p
            className="mt-4 text-[18px] leading-7 text-[#EEE0FF]"
            style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}
          >
            We build prototypes, perform deep investigations, and validate new systems for founders pushing the edge of
            Web3.
          </p>
          <div className="mt-6">
            <a
              href="#research-grid"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-[#5B4BFF] px-10 py-4 text-lg font-semibold text-white shadow-[0_20px_40px_rgba(86,64,255,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Start a Project&nbsp;&nbsp;→
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const methodStepsPrimary = [
  {
    title: 'Step 1: Top-level Architecture',
    subtitle: 'We follow timeless principles - understand & read the code',
    src: 'https://link.excalidraw.com/readonly/Qw6Y2tLPhtQAptqGDSTk',
  },
];

const methodStepsAnalysis = [
  {
    title: 'Step N+1: Breadth-First Analysis',
    subtitle: 'We review breadth-first to find emergent behaviors across contracts',
    src: 'https://link.excalidraw.com/readonly/YEEDuljowOddcER8zcMC',
  },
  {
    title: 'Step N+1: Breadth-First Analysis',
    subtitle: 'We review breadth-first to find emergent behaviors across contracts',
    src: 'https://link.excalidraw.com/readonly/DHYDsuV4DAOc0dBPJXwt',
  },
  {
    title: 'Step N+1: Breadth-First Analysis',
    subtitle: 'We review breadth-first to find emergent behaviors across contracts',
    src: 'https://link.excalidraw.com/readonly/1HJNbsZVM85CCR4u28m7',
  },
  {
    title: 'Step N+1: Breadth-First Analysis',
    subtitle: 'We review breadth-first to find emergent behaviors across contracts',
    src: 'https://link.excalidraw.com/readonly/jxsR5Tp0vPPibWbs7ZC0',
  },
];

const MethodSection = () => {
  const [analysisIndex, setAnalysisIndex] = React.useState(0);
  const mainStep = methodStepsPrimary[0];
  const currentAnalysis = methodStepsAnalysis[analysisIndex];

  const handlePrev = () => {
    setAnalysisIndex((prev) => (prev === 0 ? methodStepsAnalysis.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setAnalysisIndex((prev) => (prev === methodStepsAnalysis.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="bg-[#03012E] px-5 pb-20 pt-12 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-6xl text-center text-white">
        <p className="text-sm uppercase tracking-[0.3em] text-[#8B8BB6]">Our method</p>
        <h3
          className="mt-2 text-[36px] font-medium text-white sm:text-[44px]"
          style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
        >
          {mainStep.title}
        </h3>
        <p className="mt-3 text-base text-[#CBC4E8]">{mainStep.subtitle}</p>
        <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#060724] shadow-[0_30px_60px_rgba(3,1,46,0.6)]">
          <iframe
            title="Tozer Labs Method Diagram"
            src={mainStep.src}
            className="h-[520px] w-full"
            loading="lazy"
            allowFullScreen
          />
        </div>
        <h4
          className="mt-16 text-[32px] font-medium text-white sm:text-[40px]"
          style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
        >
          {currentAnalysis.title}
        </h4>
        <p className="mt-3 text-base text-[#CBC4E8]">{currentAnalysis.subtitle}</p>
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-[#060724] shadow-[0_30px_60px_rgba(3,1,46,0.6)]">
          <iframe
            title="Tozer Labs Breadth Analysis Diagram"
            src={currentAnalysis.src}
            className="h-[520px] w-full"
            loading="lazy"
            allowFullScreen
          />
        </div>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
            onClick={handlePrev}
            aria-label="Previous method step"
          >
            ‹
          </button>
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 text-white transition hover:bg-white/10"
            onClick={handleNext}
            aria-label="Next method step"
          >
            ›
          </button>
        </div>
        <p className="mt-3 text-sm text-[#B6B2D4]">
          {analysisIndex + 1} / {methodStepsAnalysis.length}
        </p>
      </div>
    </section>
  );
};

const AuditPricingCTA = () => (
  <section className="bg-[#03012E] px-5 pb-20 pt-12 sm:px-8 lg:px-10">
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-6 rounded-[40px] bg-gradient-to-b from-[#0A0630] via-[#080528] to-[#030214] px-6 py-16 text-center text-white shadow-[0_50px_120px_rgba(3,1,46,0.6)]">
      <div>
        <p
          className="text-[36px] font-medium leading-tight text-white sm:text-[42px]"
          style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
        >
          Pay-Per-
          <span className="bg-gradient-to-r from-[#786FFF] to-[#A469FF] bg-clip-text text-transparent">
            Vulnerability
          </span>
        </p>
        <p className="mt-2 text-lg text-[#CBC4E8]">or Fixed Price Engagements Available</p>
      </div>
      <a
        href="#contact"
        className="inline-flex items-center justify-center rounded-2xl bg-[#5B4BFF] px-10 py-4 text-base font-semibold text-white shadow-[0_20px_40px_rgba(86,64,255,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Start Now&nbsp;&nbsp;→
      </a>
    </div>
  </section>
);

const HomePage = () => (
  <>
    <Hero />
    <ClientsSection />
    <ServicesOverview />
    <FeaturedAudits />
    <ResearchDevelopment />
    <FeaturedWorks />
    <Footer />
  </>
);

const SmartContractAuditsPage = () => (
  <>
    <SmartContractAuditHero />
    <AuditClientReel />
    <FeaturedAudits />
    <TargetedInvestigations />
    <MethodSection />
    <AuditPricingCTA />
    <Footer />
  </>
);

const AuditReportsPage = () => (
  <>
    <AuditReportsHero />
    <FeaturedAudits cards={auditReportCards} label="Read the details" title="Audit Reports Library" />
    <Footer />
  </>
);

const PortfolioPage = () => (
  <>
    <PortfolioHero />
    <div id="portfolio-grid">
      <FeaturedAudits
        cards={portfolioCards}
        label="Across audits, R&D, and prototypes"
        title="Portfolio Highlights"
      />
    </div>
    <Footer />
  </>
);

const ResearchPage = () => (
  <>
    <ResearchHero />
    <div id="research-grid">
      <FeaturedAudits
        cards={researchCards}
        label="Innovation lab"
        title="Research & Development Work"
      />
    </div>
    <Footer />
  </>
);

const AboutHero = () => (
  <section className="relative isolate w-full overflow-hidden bg-[#03012E]">
    <div className="absolute inset-0">
      <img
        src="/images/banner/banner_dark.jpeg"
        alt="About hero background"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#03012E]/85 via-[#03012E]/60 to-transparent" />
    </div>
    <div className="relative mx-auto flex min-h-[260px] w-full max-w-6xl items-stretch px-5 pt-4 pb-8 sm:px-8 lg:px-10">
      <div className="w-full rounded-3xl bg-[#03012E]/95 px-6 py-8 shadow-[0_30px_60px_rgba(3,1,46,0.6)] backdrop-blur-md md:w-2/3 md:px-8 md:py-10">
        <p
          className="text-[34px] font-medium leading-tight text-white sm:text-[46px]"
          style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
        >
          Tozer Labs Team
        </p>
        <p
          className="mt-4 text-[18px] leading-7 text-[#EEE0FF]"
          style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}
        >
          A focused group of auditors, builders, and systems thinkers covering smart contract security and applied AI.
        </p>
      </div>
    </div>
  </section>
);

const teamMembers = [
  {
    name: 'Ian Tozer',
    title: 'Founder • Smart Contract Security & Full-Stack Engineer',
    bio: [
      'Security engineer with extensive experience in smart contract auditing, vulnerability research, and LLM-assisted tooling.',
      'Private auditor for notable protocols, contributor to Hound’s knowledge-graph analysis engine, and discoverer of several high-impact vulnerabilities.',
      'Focuses on exploit-path reasoning, code comprehension tooling, architectural mapping, and rigorous security workflows.',
    ],
    bullets: ['CFA Level II', 'Member of TheMarketSniper', 'Governance and Mathematics'],
    actions: [{ label: 'CV / Resume', href: '/ian_tozer_cv.pdf' }],
    image: '/images/folks/ian.jpg',
  },
  {
    name: 'Jonathan Van Den Berg',
    title: 'Lead Technical Project Manager • Full-Stack Web3 & AI Engineer',
    bio: [
      'Experienced lead technical project manager and engineer specializing in Web3, blockchain, and AI-driven platforms.',
      'Has led distributed teams to design, build, and operate production-grade systems across finance, media, and decentralized marketplaces.',
      'Work spans frontend, backend, blockchain, and applied AI, with a strong focus on reliability, security, and high-impact shipping.',
      'Highly committed to staying current with the latest advancements in Web3 and AI.',
    ],
    logos: [
      { name: 'ztudium', src: '/images/logos/ztudium.png' },
      { name: 'DandelionLabs', src: '/images/logos/dandelion_labs.png' },
    ],
    actions: [{ label: 'LinkedIn', href: 'https://www.linkedin.com' }],
    image: '/images/folks/jon.jpeg',
  },
];

const AboutPage = () => (
  <>
    <AboutHero />
    <section className="bg-[#03002A] px-5 pb-20 pt-12 sm:px-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16">
        {teamMembers.map((member) => (
          <article
            key={member.name}
            className="grid gap-8 rounded-[32px] bg-[#05042A] p-8 text-white shadow-[0_25px_80px_rgba(0,0,0,0.4)] md:grid-cols-2"
          >
            <div className="space-y-4 text-left">
              <h3
                className="text-[30px] font-medium"
                style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
              >
                {member.name}
              </h3>
              <p className="text-lg text-[#BEB7FF]">{member.title}</p>
              {member.bio.map((paragraph, index) => (
                <p key={`${member.name}-bio-${index}`} className="text-base text-[#D2CDF4]">
                  {paragraph}
                </p>
              ))}
              {member.bullets && (
                <ul className="mt-4 space-y-1 text-sm text-[#9C96D0]">
                  {member.bullets.map((item) => (
                    <li key={`${member.name}-${item}`}>{item}</li>
                  ))}
                </ul>
              )}
              {member.logos && (
                <div className="mt-5 flex flex-wrap gap-4">
                  {member.logos.map((logo) => (
                    <div
                      key={logo.name}
                      className="flex items-center rounded-2xl bg-white/10 px-4 py-2 backdrop-blur"
                    >
                      <img src={logo.src} alt={`${logo.name} logo`} className="h-6 w-auto" />
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-6 flex flex-wrap gap-4">
                {member.actions.map((action) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className="inline-flex items-center rounded-xl border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
                    target={action.href.startsWith('http') ? '_blank' : undefined}
                    rel={action.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-72 w-full overflow-hidden rounded-[36px] border border-white/10 bg-[#0B0C2F]">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={`${member.name} portrait`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[#665F9A]">
                    Photo coming soon
                  </div>
                )}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#05042A] to-transparent p-4">
                  <p className="text-sm font-semibold text-white">{member.name}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
    <Footer />
  </>
);

const BlogHero = ({ title, subtitle }) => (
  <section className="relative isolate w-full overflow-hidden bg-[#03012E]">
    <div className="absolute inset-0">
      <img
        src="/images/banner/banner_dark.jpeg"
        alt="Blog hero background"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#03012E]/85 via-[#03012E]/60 to-transparent" />
    </div>
    <div className="relative mx-auto flex min-h-[260px] w-full max-w-6xl items-stretch px-5 pt-4 pb-8 sm:px-8 lg:px-10">
      <div className="w-full rounded-3xl bg-[#03012E]/95 px-6 py-8 shadow-[0_30px_60px_rgba(3,1,46,0.6)] backdrop-blur-md md:w-2/3 md:px-8 md:py-10">
        <p
          className="text-[34px] font-medium leading-tight text-white sm:text-[46px]"
          style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
        >
          {title}
        </p>
        <p
          className="mt-4 text-[18px] leading-7 text-[#EEE0FF]"
          style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}
        >
          {subtitle}
        </p>
      </div>
    </div>
  </section>
);

const BlogListPage = () => (
  <>
    <BlogHero title="Insights & Field Notes" subtitle="Research write-ups, audit notes, and Tozer Labs thinking." />
    <section className="bg-[#03012E] px-5 pb-20 pt-12 sm:px-8 lg:px-10">
      <div className="mx-auto grid w-full max-w-5xl gap-8">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="rounded-3xl border border-white/10 bg-[#080726] p-8 text-left text-white shadow-[0_25px_70px_rgba(0,0,0,0.35)]"
          >
            <p className="text-sm uppercase tracking-[0.3em] text-[#8B8BB6]">
              {post.date} • {post.readingTime}
            </p>
            <h3
              className="mt-3 text-[30px] font-medium"
              style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
            >
              {post.title}
            </h3>
            <p className="mt-4 text-base text-[#D5D1F0]">{post.excerpt}</p>
            <a
              href={`/blog/${post.slug}`}
              className="mt-6 inline-flex items-center text-sm font-semibold text-[#8F87FF] transition hover:text-white"
            >
              Read Article&nbsp;&nbsp;→
            </a>
          </article>
        ))}
      </div>
    </section>
    <Footer />
  </>
);

const BlogArticlePage = ({ slug }) => {
  const post = blogPosts.find((entry) => entry.slug === slug);

  if (!post) {
    return <BlogListPage />;
  }

  const htmlContent = React.useMemo(() => convertMarkdownToHtml(post.content), [post.content]);
  const iframeLinks = [
    { label: 'Architectural Map', src: 'https://link.excalidraw.com/readonly/Qw6Y2tLPhtQAptqGDSTk' },
    { label: 'Investigation 1', src: 'https://link.excalidraw.com/readonly/YEEDuljowOddcER8zcMC' },
    { label: 'Investigation 2', src: 'https://link.excalidraw.com/readonly/DHYDsuV4DAOc0dBPJXwt' },
    { label: 'Investigation 3', src: 'https://link.excalidraw.com/readonly/jxsR5Tp0vPPibWbs7ZC0' },
  ];

  return (
    <>
      <BlogHero title={post.title} subtitle={`${post.date} • ${post.readingTime}`} />
      <article className="bg-[#03012E] px-5 pb-20 pt-12 text-white sm:px-8 lg:px-10">
        <div
          className="markdown-content mx-auto max-w-3xl text-[#DED9FF]"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <div className="markdown-iframes mx-auto max-w-4xl">
          {iframeLinks.map((frame) => (
            <div key={frame.src} className="text-left text-sm text-[#B6B2D4]">
              <p className="mb-2 font-semibold text-white">{frame.label}</p>
              <iframe title={frame.label} src={frame.src} loading="lazy" />
            </div>
          ))}
        </div>
        <div className="mx-auto mt-10 max-w-3xl rounded-3xl border border-white/10 bg-[#05042A] p-6 text-center">
          <p className="text-base text-[#BEB7FF]">
            Need a deep dive like this for your protocol?{' '}
            <a href="/audits" className="text-white underline">
              Start a Smart Contract Audit
            </a>
            .
          </p>
        </div>
      </article>
      <Footer />
    </>
  );
};

const App = () => {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
  const segments = pathname.split('/').filter(Boolean);
  const root = segments[0] ?? '';
  const subSlug = segments[1];

  let page = <HomePage />;

  switch (root) {
    case 'audits':
      page = <SmartContractAuditsPage />;
      break;
    case 'reports':
      page = <AuditReportsPage />;
      break;
    case 'portfolio':
      page = <PortfolioPage />;
      break;
    case 'research':
      page = <ResearchPage />;
      break;
    case 'blog':
      page = subSlug ? <BlogArticlePage slug={subSlug} /> : <BlogListPage />;
      break;
    case 'about':
      page = <AboutPage />;
      break;
    default:
      page = <HomePage />;
  }

  return (
    <div className="overflow-x-hidden bg-[#03012E]">
      <Header />
      {page}
    </div>
  );
};

export default App;
