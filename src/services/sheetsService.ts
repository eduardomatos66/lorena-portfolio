/**
 * sheetsService.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Fetches portfolio content from a publicly-viewable Google Sheets document.
 *
 * Each sheet tab maps to a section of the portfolio. The spreadsheet ID is
 * read from the VITE_SHEETS_ID environment variable (.env file).
 *
 * Falls back to the static `defaultContent` if any fetch or parse step fails.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { content as defaultContent } from '../data/content';

export type ContentType = typeof defaultContent;

const SHEETS_ID = import.meta.env.VITE_SHEETS_ID as string | undefined;

// ── URL builder ──────────────────────────────────────────────────────────────

function csvUrl(sheetName: string): string {
  return (
    `https://docs.google.com/spreadsheets/d/${SHEETS_ID}` +
    `/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`
  );
}

// ── CSV parser ───────────────────────────────────────────────────────────────
// Handles quoted fields, escaped quotes (""), and commas inside strings.

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  // Normalize line endings
  const lines = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');

  for (const line of lines) {
    if (!line.trim()) continue;
    const cols: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // Escaped quote inside a quoted field
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (ch === ',' && !inQuotes) {
        cols.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    cols.push(current);
    rows.push(cols);
  }
  return rows;
}

// ── Generic fetcher (returns rows without header) ────────────────────────────

async function fetchSheet(sheetName: string): Promise<string[][]> {
  const res = await fetch(csvUrl(sheetName));
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching sheet "${sheetName}"`);
  const text = await res.text();
  const rows = parseCSV(text);
  return rows.slice(1); // drop the header row
}

// ── Per-section parsers ───────────────────────────────────────────────────────

/**
 * Sheet: personal
 * Columns: key | value
 * Example row: name | Lorena Santana
 */
async function fetchPersonal() {
  const rows = await fetchSheet('personal');
  const map: Record<string, string> = {};
  for (const [key, value] of rows) {
    if (key?.trim()) map[key.trim()] = value?.trim() ?? '';
  }
  const d = defaultContent.personal;
  return {
    name:     map['name']     ?? d.name,
    fullName: map['fullName'] ?? d.fullName,
    title:    map['title']    ?? d.title,
    subtitle: map['subtitle'] ?? d.subtitle,
    email:    map['email']    ?? d.email,
    phone:    map['phone']    ?? d.phone,
    location: map['location'] ?? d.location,
    tagline:  map['tagline']  ?? d.tagline,
  };
}

/**
 * Sheet: biography
 * Columns: text
 * Each row is a paragraph. An empty row creates a paragraph break.
 */
async function fetchBiography(): Promise<string> {
  const rows = await fetchSheet('biography');
  return rows
    .map(r => r[0]?.trim() ?? '')
    .filter(Boolean)
    .join('\n\n');
}

/**
 * Sheet: pillars
 * Columns: icon | title | description
 */
async function fetchPillars() {
  const rows = await fetchSheet('pillars');
  return rows
    .filter(r => r[1]?.trim())
    .map(([icon, title, description]) => ({
      icon:        icon?.trim()        ?? '',
      title:       title?.trim()       ?? '',
      description: description?.trim() ?? '',
    }));
}

/**
 * Sheet: services
 * Columns: icon | title | description
 */
async function fetchServices() {
  const rows = await fetchSheet('services');
  return rows
    .filter(r => r[1]?.trim())
    .map(([icon, title, description]) => ({
      icon:        icon?.trim()        ?? '',
      title:       title?.trim()       ?? '',
      description: description?.trim() ?? '',
    }));
}

/**
 * Sheet: approach
 * Columns: type | title | description
 * type = "main"      → section title & description
 * type = "principle" → a principle item
 */
async function fetchApproach() {
  const rows = await fetchSheet('approach');
  let title = defaultContent.approach.title;
  let description = defaultContent.approach.description;
  const principles: { title: string; description: string }[] = [];

  for (const [type, t, desc] of rows) {
    const kind = type?.trim();
    if (kind === 'main') {
      title       = t?.trim()    || title;
      description = desc?.trim() || description;
    } else if (kind === 'principle') {
      principles.push({ title: t?.trim() ?? '', description: desc?.trim() ?? '' });
    }
  }
  return { title, description, principles };
}

/**
 * Sheet: experience
 * Columns: role | company | location | period | highlight
 *
 * Supports TWO formats (auto-detected):
 *
 * Format A — one row per highlight (natural / Lorena-friendly):
 *   role, company, location, period are repeated on every row (or left blank to inherit).
 *   Rows with the same role+company are grouped into a single card.
 *
 * Format B — all highlights in one cell, separated by  |  (pipe):
 *   role, company, location, period, "bullet 1 | bullet 2 | bullet 3"
 */
async function fetchExperience() {
  const rows = await fetchSheet('experience');

  // Detect format: if ANY row has a pipe in the last column → Format B
  const hasAnyPipe = rows.some(r => (r[4] ?? '').includes('|'));

  if (hasAnyPipe) {
    // ── Format B: single row per job, pipe-separated highlights ──────────────
    return rows
      .filter(r => r[0]?.trim())
      .map(([role, company, location, period, highlightsRaw]) => ({
        role:       role?.trim()    ?? '',
        company:    company?.trim() ?? '',
        location:   location?.trim() ?? '',
        period:     period?.trim()  ?? '',
        highlights: (highlightsRaw ?? '')
          .split('|')
          .map(h => h.trim())
          .filter(Boolean),
      }));
  }

  // ── Format A: one row per highlight, group by role+company ─────────────────
  type ExpEntry = { role: string; company: string; location: string; period: string; highlights: string[] };
  const grouped: ExpEntry[] = [];
  let lastRole = '';
  let lastCompany = '';
  let lastLocation = '';
  let lastPeriod = '';

  for (const [role, company, location, period, highlight] of rows) {
    const r = role?.trim()     || lastRole;
    const c = company?.trim()  || lastCompany;
    const l = location?.trim() || lastLocation;
    const p = period?.trim()   || lastPeriod;
    const h = highlight?.trim() ?? '';

    // New job entry when role or company changes
    const isNew = r !== lastRole || c !== lastCompany;

    if (isNew && r) {
      grouped.push({ role: r, company: c, location: l, period: p, highlights: h ? [h] : [] });
    } else if (grouped.length > 0 && h) {
      grouped[grouped.length - 1].highlights.push(h);
    }

    lastRole     = r;
    lastCompany  = c;
    lastLocation = l;
    lastPeriod   = p;
  }

  return grouped;
}

/**
 * Sheet: education
 * Columns: degree | institution | location | period | level
 */
async function fetchEducation() {
  const rows = await fetchSheet('education');
  return rows
    .filter(r => r[0]?.trim())
    .map(([degree, institution, location, period, level]) => ({
      degree:      degree?.trim()      ?? '',
      institution: institution?.trim() ?? '',
      location:    location?.trim()    ?? '',
      period:      period?.trim()      ?? '',
      level:       level?.trim()       ?? '',
    }));
}

/**
 * Sheet: certifications
 * Columns: title | issuer | date | location
 */
async function fetchCertifications() {
  const rows = await fetchSheet('certifications');
  return rows
    .filter(r => r[0]?.trim())
    .map(([title, issuer, date, location]) => ({
      title:    title?.trim()    ?? '',
      issuer:   issuer?.trim()   ?? '',
      date:     date?.trim()     ?? '',
      location: location?.trim() ?? '',
    }));
}

/**
 * Sheet: highlights
 * Columns: text
 * One highlight per row.
 */
async function fetchHighlights(): Promise<string[]> {
  const rows = await fetchSheet('highlights');
  return rows.map(r => r[0]?.trim()).filter(Boolean) as string[];
}

/**
 * Sheet: forFamilies
 * Columns: icon | title | description
 * Special rows:
 *   icon = "TITLE" → section title  (value in description column)
 *   icon = "INTRO" → section intro  (value in description column)
 *   all others     → item cards
 */
async function fetchForFamilies() {
  const rows = await fetchSheet('forFamilies');
  let title = defaultContent.forFamilies.title;
  let intro = defaultContent.forFamilies.intro;
  const items: { icon: string; title: string; description: string }[] = [];

  for (const [icon, t, desc] of rows) {
    const tag = icon?.trim();
    if (tag === 'TITLE') {
      title = desc?.trim() || title;
    } else if (tag === 'INTRO') {
      intro = desc?.trim() || intro;
    } else if (tag || t?.trim()) {
      items.push({
        icon:        tag            ?? '',
        title:       t?.trim()      ?? '',
        description: desc?.trim()   ?? '',
      });
    }
  }
  return { title, intro, items };
}

/**
 * Sheet: reference
 * Columns: key | value
 * Keys: name, role, quote
 */
async function fetchReference() {
  const rows = await fetchSheet('reference');
  const map: Record<string, string> = {};
  for (const [key, value] of rows) {
    if (key?.trim()) map[key.trim()] = value?.trim() ?? '';
  }
  const d = defaultContent.reference;
  return {
    name:  map['name']  ?? d.name,
    role:  map['role']  ?? d.role,
    quote: map['quote'] ?? d.quote,
  };
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function fetchContent(): Promise<ContentType> {
  if (!SHEETS_ID) {
    console.warn('[sheetsService] VITE_SHEETS_ID not set — using static content.');
    return defaultContent;
  }

  try {
    const [
      personal,
      biography,
      pillars,
      services,
      approach,
      experience,
      education,
      certifications,
      highlights,
      forFamilies,
      reference,
    ] = await Promise.all([
      fetchPersonal(),
      fetchBiography(),
      fetchPillars(),
      fetchServices(),
      fetchApproach(),
      fetchExperience(),
      fetchEducation(),
      fetchCertifications(),
      fetchHighlights(),
      fetchForFamilies(),
      fetchReference(),
    ]);

    return {
      personal,
      biography,
      pillars,
      services,
      approach,
      experience,
      education,
      certifications,
      highlights,
      forFamilies,
      reference,
    };
  } catch (err) {
    console.error('[sheetsService] Failed to load Google Sheets content:', err);
    console.info('[sheetsService] Falling back to static content.');
    return defaultContent;
  }
}
