import React from 'react';
import auditProcessArticle from './content/blog/our-smart-contract-audit-process.md?raw';
import aragonVeGovernanceReport from './content/portfolio/aragon_ve_1/aragon_ve_1.md?raw';
import aragonVeGovernanceTwoReport from './content/portfolio/aragon_ve_2/aragon_ve_2.md?raw';
import aragonVeBoundaryConditionsReport from './content/portfolio/aragon_ve_boundary_conditions/aragon_ve_boundary_conditions.md?raw';
import berryblockReport from './content/portfolio/berryblock/berryblock.md?raw';
import solanaReport from './content/portfolio/solana/solana.md?raw';
import aaveReport from './content/portfolio/aave/aave.md?raw';

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
            href="/contact"
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
            Distributed Systems | dApps | Startups | Innovators
          </p>
          <div className="mt-6">
            <a
              href="/contact"
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
  {
    title: "Aragon's VE Governance #1",
    subtitle: 'Smart Contract Audit',
    src: '/images/cards/aragon_ve_1.png',
    href: '/portfolio/aragon-ve-governance-1',
  },
  {
    title: "Aragon's VE Governance #2",
    subtitle: 'Smart Contract Audit',
    src: '/images/cards/aragon_ve_2.png',
    href: '/portfolio/aragon-ve-governance-2',
  },
  {
    title: 'Swaplor Review',
    subtitle: 'Smart Contract Audit',
    src: '/images/cards/berryblock_1.png',
    href: '/portfolio/swaplor-review',
  },
];

const auditReportCards = [
  ...auditCardsPrimary,
  { title: 'Coral Systems Review', subtitle: 'Smart Contract Audit', src: '/images/cards/coral.png' },
  {
    title: "Aragon's VE Boundary",
    subtitle: 'Smart Contract Audit',
    src: '/images/cards/aragon_ve_boundary.png',
    href: '/portfolio/aragon-ve-boundary',
  },
];

const featuredWorks = [
  {
    title: 'DAO Governance UX',
    subtitle: 'Development Grant',
    src: '/images/cards/aave.png',
    href: '/portfolio/dao-governance-ux',
  },
  {
    title: 'Web3 Geography Analytics',
    subtitle: 'Development Grant',
    src: '/images/cards/solana.png',
    href: '/portfolio/web3-geography-analytics',
  },
  { title: 'Sports Arbitrage Bot', subtitle: 'Trading Algorithm & Execution', src: '/images/cards/sports_arb.png' },
];

const additionalPortfolioCards = [
  { title: 'Eleventh House Initiative', subtitle: 'Research & Development', src: '/images/cards/eleventh_house.png' },
  {
    title: 'Hound: Language-agnostic AI auditor',
    subtitle: 'Research & Development',
    src: '/images/cards/hound.png',
    href: 'https://github.com/scabench-org/hound',
    external: true,
  },
];

const portfolioDetails = [
  {
    slug: 'aragon-ve-governance-1',
    title: "Aragon's VE Governance #1",
    subtitle: 'Smart Contract Audit',
    heroImage: '/images/cards/aragon_ve_1.png',
    content: aragonVeGovernanceReport,
  },
  {
    slug: 'aragon-ve-governance-2',
    title: "Aragon's VE Governance #2",
    subtitle: 'Smart Contract Audit',
    heroImage: '/images/cards/aragon_ve_2.png',
    content: aragonVeGovernanceTwoReport,
  },
  {
    slug: 'aragon-ve-boundary',
    title: "Aragon's VE Boundary",
    subtitle: 'Smart Contract Audit',
    heroImage: '/images/cards/aragon_ve_boundary.png',
    content: aragonVeBoundaryConditionsReport,
  },
  {
    slug: 'swaplor-review',
    title: 'Swaplor Review',
    subtitle: 'Smart Contract Audit',
    heroImage: '/images/cards/berryblock_1.png',
    content: berryblockReport,
  },
  {
    slug: 'web3-geography-analytics',
    title: 'Web3 Geography Analytics',
    subtitle: 'Development Grant',
    heroImage: '/images/cards/solana.png',
    content: solanaReport,
  },
  {
    slug: 'dao-governance-ux',
    title: 'DAO Governance UX',
    subtitle: 'Development Grant',
    heroImage: '/images/cards/aave.png',
    content: aaveReport,
  },
];

const externalPortfolioLinks = [
  {
    title: 'Hound: Language-agnostic AI auditor',
    href: 'https://github.com/scabench-org/hound',
  },
];

const portfolioCards = [...auditReportCards, ...featuredWorks, ...additionalPortfolioCards].map((card) => {
  const detail = portfolioDetails.find((item) => item.title === card.title);
  if (detail) {
    return { ...card, href: `/portfolio/${detail.slug}` };
  }
  const externalLink = externalPortfolioLinks.find((item) => item.title === card.title);
  return externalLink ? { ...card, href: externalLink.href, external: true } : card;
});
const researchCards = [...featuredWorks, ...additionalPortfolioCards];

const convertMarkdownToHtml = (markdown) => {
  const escapeHtml = (str) =>
    str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const formatInline = (text) =>
    escapeHtml(text)
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/!\[(.*?)\]\((.+?)\)/g, '<img alt="$1" src="$2" />')
      .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

  const splitTableRow = (row) =>
    row
      .split('|')
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0);

  const lines = markdown.split('\n');
  const htmlParts = [];
  let listBuffer = [];
  let inCodeBlock = false;
  let codeBuffer = [];
  let codeLang = '';
  let inImageGrid = false;
  let imageGridItems = [];

  const flushList = () => {
    if (listBuffer.length > 0) {
      htmlParts.push(`<ul>${listBuffer.join('')}</ul>`);
      listBuffer = [];
    }
  };

  const flushCode = () => {
    if (codeBuffer.length > 0) {
      const languageClass = codeLang ? ` class="language-${codeLang}"` : '';
      htmlParts.push(
        `<pre><code${languageClass}>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`,
      );
      codeBuffer = [];
      codeLang = '';
    }
  };

  const flushImageGrid = () => {
    if (imageGridItems.length > 0) {
      htmlParts.push(`<div class="markdown-image-grid">${imageGridItems.join('')}</div>`);
      imageGridItems = [];
    }
  };

  const parseTable = (startIndex) => {
    const headerCells = splitTableRow(lines[startIndex]);
    const bodyRows = [];
    let index = startIndex + 2;

    while (index < lines.length) {
      const rowLine = lines[index].trim();
      if (!rowLine || !rowLine.includes('|')) {
        break;
      }
      bodyRows.push(splitTableRow(rowLine));
      index += 1;
    }

    const headerHtml = headerCells.map((cell) => `<th>${formatInline(cell)}</th>`).join('');
    const bodyHtml = bodyRows
      .map((row) => `<tr>${row.map((cell) => `<td>${formatInline(cell)}</td>`).join('')}</tr>`)
      .join('');

    return {
      html: `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`,
      nextIndex: index - 1,
    };
  };

  for (let i = 0; i < lines.length; i += 1) {
    const rawLine = lines[i];

    if (rawLine.trim().startsWith('```')) {
      if (inCodeBlock) {
        inCodeBlock = false;
        flushCode();
      } else {
        flushList();
        inCodeBlock = true;
        codeLang = rawLine.trim().replace(/```/, '').trim();
      }
      continue;
    }

    if (inCodeBlock) {
      codeBuffer.push(rawLine);
      continue;
    }

    const line = rawLine.trim();

    if (line.startsWith(':::image-grid')) {
      flushList();
      inImageGrid = true;
      continue;
    }

    if (inImageGrid) {
      if (line.startsWith(':::')) {
        flushImageGrid();
        inImageGrid = false;
        continue;
      }
      if (!line) {
        continue;
      }
      imageGridItems.push(
        `<div class="markdown-image-grid__item">${formatInline(line)}</div>`,
      );
      continue;
    }

    if (line.startsWith(':::excalidraw')) {
      flushList();
      flushImageGrid();
      const src = line.replace(':::excalidraw', '').trim();
      if (src) {
        htmlParts.push(
          `<div class="markdown-excalidraw"><iframe title="Excalidraw diagram" src="${src}" loading="lazy" allowFullScreen></iframe></div>`,
        );
      }
      continue;
    }

    if (!line) {
      flushList();
      continue;
    }

    const nextLine = lines[i + 1] ? lines[i + 1].trim() : '';
    const tableDividerPattern = /^(\|?\s*:?-+:?\s*)+\|?$/;
    if (line.includes('|') && tableDividerPattern.test(nextLine)) {
      flushList();
      const tableResult = parseTable(i);
      htmlParts.push(tableResult.html);
      i = tableResult.nextIndex;
      continue;
    }

    if (line.startsWith('- ')) {
      const content = formatInline(line.replace(/^- /, ''));
      listBuffer.push(`<li>${content}</li>`);
      continue;
    }

    flushList();

    const headingMatch = line.match(/^(#{1,5})\s+(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      htmlParts.push(`<h${level}>${formatInline(headingMatch[2])}</h${level}>`);
      continue;
    }

    htmlParts.push(`<p>${formatInline(line)}</p>`);
  }

  flushList();
  if (inCodeBlock) {
    flushCode();
  }
  if (inImageGrid) {
    flushImageGrid();
  }

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
          {cards.map((card) => {
            const cardMarkup = (
              <article
                className="relative overflow-hidden rounded-3xl bg-white/5 transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                style={{ boxShadow: '0 25px 70px rgba(0,0,0,0.35)' }}
              >
                <img
                  src={card.src}
                  alt={`${card.title} preview`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {card.href && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05042A]/95 via-[#05042A]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#A7A0D6]">{card.subtitle}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{card.title}</p>
                      <span className="mt-4 inline-flex items-center text-sm font-semibold text-white">
                        Read case study&nbsp;&nbsp;→
                      </span>
                    </div>
                  </div>
                )}
              </article>
            );

            return card.href ? (
              <a
                key={card.title}
                href={card.href}
                className="group block"
                target={card.external ? '_blank' : undefined}
                rel={card.external ? 'noreferrer' : undefined}
              >
                {cardMarkup}
              </a>
            ) : (
              <div key={card.title}>{cardMarkup}</div>
            );
          })}
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
          {featuredWorks.map((card) => {
            const cardMarkup = (
              <article
                className="relative overflow-hidden rounded-3xl bg-[#050316] transition duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                style={{ boxShadow: '0 25px 70px rgba(0,0,0,0.35)' }}
              >
                <img
                  src={card.src}
                  alt={`${card.title} preview`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                {card.href && (
                  <div className="absolute inset-0 bg-gradient-to-t from-[#05042A]/95 via-[#05042A]/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <p className="text-xs uppercase tracking-[0.3em] text-[#A7A0D6]">{card.subtitle}</p>
                      <p className="mt-2 text-lg font-semibold text-white">{card.title}</p>
                      <span className="mt-4 inline-flex items-center text-sm font-semibold text-white">
                        Read case study&nbsp;&nbsp;→
                      </span>
                    </div>
                  </div>
                )}
              </article>
            );

            return card.href ? (
              <a key={card.title} href={card.href} className="group block">
                {cardMarkup}
              </a>
            ) : (
              <div key={card.title}>{cardMarkup}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const footerLinks = [
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact Us', href: '/contact' },
    ],
  },
  {
    heading: 'Services',
    links: [
      { label: 'Smart Contract Auditing', href: '/audits' },
      { label: 'Audit Reports', href: '/reports' },
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
              className="text-2xl tracking-[0.2em] text-[#C3CCE2]"
              style={{ fontFamily: '"IBM Plex Mono", monospace' }}
            >
              TOZER LABS
            </span>
          </div>
          <div className="grid w-full max-w-md grid-cols-1 gap-8 text-sm sm:w-auto sm:grid-cols-2 sm:gap-10">
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
              href="/contact"
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
              href="/contact"
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
              href="/contact"
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
              href="/contact"
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
            We take on focused R&D projects and aim to ship them as durable, maintainable systems. We investigate, build, and validate targeted solutions designed to keep working well after launch.
          </p>
          <div className="mt-6">
            <a
              href="/contact"
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
        href="/contact"
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

const PortfolioArticleHero = ({ title, subtitle, image }) => (
  <section className="relative isolate w-full overflow-hidden bg-[#03012E]">
    <div className="absolute inset-0">
      <img
        src="/images/banner/banner_dark.jpeg"
        alt="Abstract security inspired banner"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#03012E]/90 via-[#03012E]/70 to-transparent" />
    </div>
    <div className="relative mx-auto flex min-h-[260px] w-full max-w-6xl items-stretch px-5 pt-6 pb-10 sm:px-8 lg:px-10">
      <div className="w-full rounded-3xl bg-[#03012E]/95 px-6 py-8 shadow-[0_30px_60px_rgba(3,1,46,0.6)] backdrop-blur-md md:w-2/3 md:px-8 md:py-10">
        <a href="/portfolio" className="text-sm text-[#A9A5D4] hover:text-white">
          ← Back to Portfolio
        </a>
        <p className="mt-4 text-xs uppercase tracking-[0.3em] text-[#8B8BB6]">Portfolio</p>
        <p
          className="mt-3 text-[34px] font-medium leading-tight text-white sm:text-[46px]"
          style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
        >
          {title}
        </p>
        {subtitle && (
          <p className="mt-4 text-base text-[#EEE0FF]" style={{ fontFamily: '"Inter", sans-serif', fontWeight: 300 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  </section>
);

const PortfolioArticlePage = ({ slug }) => {
  const entry = portfolioDetails.find((item) => item.slug === slug);

  if (!entry) {
    return <PortfolioPage />;
  }

  const htmlContent = React.useMemo(() => convertMarkdownToHtml(entry.content), [entry.content]);

  return (
    <>
      <PortfolioArticleHero title={entry.title} subtitle={entry.subtitle} image={entry.heroImage} />
      <article className="bg-[#03012E] px-5 pb-20 pt-12 text-white sm:px-8 lg:px-10">
        <div
          className="markdown-content mx-auto max-w-4xl text-[#DED9FF]"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
        <div className="mx-auto mt-12 max-w-4xl rounded-3xl border border-white/10 bg-[#05042A] p-6 text-center">
          <p className="text-base text-[#BEB7FF]">
            Interested in a similar engagement?{' '}
            <a href="/contact" className="text-white underline">
              Contact us
            </a>
            .
          </p>
        </div>
      </article>
      <Footer />
    </>
  );
};

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
          Focused on Smart Contract Security and R&D.
        </p>
      </div>
    </div>
  </section>
);

const teamMembers = [
  {
    name: 'Ian Tozer',
    title: 'Founder',
    bio: [
      'Ian is a security engineer and full-stack developer with extensive experience in smart contract auditing. He became involved in blockchain in 2018 through meetups and technical talks, with an early focus on DAOs and on-chain governance, and later transitioned into smart contract security, vulnerability research, and protocol development. Through competitive auditing, he has developed strong capabilities in exploit-path analysis, architectural review, and rigorous security workflows.',
      'Ian\'s interests include technology, mathematics, and macroeconomics. He holds a CFA Level II and a BSc in Psychology, and attributes much of his expertise to hands-on experimentation, self-study, peer collaboration, and mentorship. He is frequently exploring new technologies through research and development.',
    ],
    bullets: [],
    actions: [{ label: 'CV / Resume', href: '/ian_tozer_cv.pdf' }],
    image: '/images/folks/ian3.png',
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
    actions: [{ label: 'CV / Resume', href: '/jon_cv.pdf' }],
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
              <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-[36px] border border-white/10 bg-[#0B0C2F]">
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

const ContactPage = () => (
  <>
    <section className="relative overflow-hidden bg-[#03012E] px-5 pb-20 pt-12 sm:px-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 right-[-120px] h-72 w-72 rounded-full bg-[#5B4BFF]/25 blur-3xl" />
        <div className="absolute bottom-[-180px] left-[-80px] h-80 w-80 rounded-full bg-[#7BFFC9]/10 blur-3xl" />
        <div className="absolute left-1/2 top-20 h-44 w-[70%] -translate-x-1/2 rounded-[50%] bg-gradient-to-r from-transparent via-white/5 to-transparent blur-2xl" />
      </div>
      <div className="relative mx-auto w-full max-w-4xl text-white">
        <a
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#C9C6EA] transition hover:border-white/30 hover:text-white"
        >
          ← Back to Home
        </a>
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center text-center">
          <h1
            className="text-[40px] font-medium sm:text-[48px]"
            style={{ fontFamily: '"Poppins", sans-serif', letterSpacing: '-0.02em' }}
          >
            Contact Us
          </h1>
          <p className="mt-3 text-base text-[#C9C6EA]">
            To reach out directly, message us on Telegram or send an email to{' '}
            <a href="mailto:ian.z.tozer@gmail.com" className="text-white underline">
              ian.z.tozer@gmail.com
            </a>
            .
          </p>
        </div>
        <div className="mx-auto mt-10 w-full max-w-3xl rounded-[28px] bg-gradient-to-br from-[#5B4BFF]/35 via-[#0B0933] to-[#05041B] p-[1px] shadow-[0_40px_90px_rgba(0,0,0,0.45)]">
          <form
            action="https://formspree.io/f/mbddbkdq"
            method="POST"
            className="space-y-5 rounded-[27px] border border-white/10 bg-[#05042A]/90 p-8 text-left backdrop-blur"
          >
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-[#9A95C7]">Project Name (Optional)</span>
              <input
                type="text"
                name="project"
                placeholder="Your project name"
                className="w-full rounded-2xl border border-white/10 bg-[#0A0934] px-4 py-3 text-base text-white placeholder:text-white/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] focus:border-[#6F61FF] focus:outline-none focus:ring-2 focus:ring-[#6F61FF]/40"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-[#9A95C7]">Telegram (Optional)</span>
              <input
                type="text"
                name="telegram"
                placeholder="@yourusername"
                className="w-full rounded-2xl border border-white/10 bg-[#0A0934] px-4 py-3 text-base text-white placeholder:text-white/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] focus:border-[#6F61FF] focus:outline-none focus:ring-2 focus:ring-[#6F61FF]/40"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-[#9A95C7]">Email *</span>
              <input
                type="email"
                name="email"
                required
                placeholder="you@email.com"
                className="w-full rounded-2xl border border-white/10 bg-[#0A0934] px-4 py-3 text-base text-white placeholder:text-white/40 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03)] focus:border-[#6F61FF] focus:outline-none focus:ring-2 focus:ring-[#6F61FF]/40"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl bg-gradient-to-r from-[#6E5BFF] via-[#5B4BFF] to-[#3E2BFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(90,76,255,0.45)] transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Submit Contact Request
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-sm text-[#8D89B3]">Contact us on Telegram</p>
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

  return (
    <>
      <BlogHero title={post.title} subtitle={`${post.date} • ${post.readingTime}`} />
      <article className="bg-[#03012E] px-5 pb-20 pt-12 text-white sm:px-8 lg:px-10">
        <div
          className="markdown-content mx-auto max-w-3xl text-[#DED9FF]"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
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
      page = subSlug ? <PortfolioArticlePage slug={subSlug} /> : <PortfolioPage />;
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
    case 'contact':
      page = <ContactPage />;
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
