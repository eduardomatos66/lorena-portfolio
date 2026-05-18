# Lorena Santana — Portfolio

Personal portfolio website for **Lorena Cynthya Lopes de Santana**, Child and Youth Care Practitioner and Psychologist, based in London, Ontario.

[![Live Site](https://img.shields.io/badge/Live%20Site-lorena--portfolio.vercel.app-4a7c59?style=flat-square&logo=vercel)](https://lorena-portfolio.vercel.app)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org)

---

## Overview

A clean, responsive single-page portfolio built with **React + TypeScript + Vite**. All content is driven by a **Google Sheets spreadsheet**, allowing Lorena to update her information at any time without touching code.

### Features

- 🎨 Modern design with smooth animations and responsive layout
- 📊 **Google Sheets CMS** — content editable via spreadsheet, no code required
- 🔒 Automatic fallback to static content if the spreadsheet is unavailable
- ⚡ Fast loading via Vite with lazy content hydration
- 📱 Fully mobile-responsive

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 5.7 |
| Bundler | Vite 6 |
| Styling | Vanilla CSS |
| CMS | Google Sheets (public CSV export) |
| Hosting | Vercel |

---

## Project Structure

```
lorena-portfolio/
├── public/
│   └── photos/              # Lorena's photos (hero, about)
├── src/
│   ├── data/
│   │   └── content.ts       # Static fallback content
│   ├── services/
│   │   └── sheetsService.ts # Google Sheets data fetching & parsing
│   ├── App.tsx              # All page components + React Context
│   ├── index.css            # Global styles & design tokens
│   └── main.tsx             # App entry point
├── .env                     # Google Sheets ID (not committed to git)
├── .gitignore
├── package.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/eduardomatos66/lorena-portfolio.git
cd lorena-portfolio

# Install dependencies
npm install
```

### Environment Setup

Create a `.env` file in the project root:

```env
VITE_SHEETS_ID=<your-google-sheets-id>
```

The Sheets ID is the long string in the spreadsheet URL:
`https://docs.google.com/spreadsheets/d/**{ID_HERE}**/edit`

### Running Locally

```bash
npm run dev
```

The site will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

---

## Content Management System (Google Sheets)

All portfolio content is stored in a **Google Sheets spreadsheet**. The site fetches each sheet tab as a public CSV at runtime, parses it, and renders the content dynamically. If the spreadsheet is unavailable for any reason, the site automatically falls back to the static content in `src/data/content.ts`.

### How It Works

```
Lorena edits the spreadsheet → saves (auto) → reloads the portfolio → content updated ✅
```

### Spreadsheet Access

- **Edit access**: Lorena's Google account only
- **Read access**: Anyone with the link (required for the site to fetch data)

> To enable read access: open the spreadsheet → **Share** → **Anyone with the link** → set to **Viewer**.

---

## 📋 Content Editing Guide (For Lorena)

> You don't need to know programming. Just edit the spreadsheet and reload the page!

### General Rules

1. **Never delete the first row** of any tab — it's the header (column names)
2. **Never rename the tabs** — the site uses exact tab names to find data
3. **Never rename the key column values** in `personal` and `reference` tabs (name, email, etc.)
4. Commas in text are fine — the system handles them correctly

---

### Tab: `personal` — Personal Information

Simple key-value table. Edit the **Value** column only.

| Key | Description | Example |
|---|---|---|
| `name` | Short display name | Lorena Santana |
| `fullName` | Full legal name | Lorena C. L. de Santana |
| `title` | Professional title | Child and Youth Care Practitioner |
| `subtitle` | Page subtitle | Psychologist • Fanshawe CYC Student |
| `email` | Contact email | lorenacynthya@gmail.com |
| `phone` | Phone number | (226) 977-6973 |
| `location` | City and postal code | London, Ontario, N6A 1Y2 |
| `tagline` | Short inspirational phrase | Nurturing minds, growing possibilities. |

---

### Tab: `biography` — About Me Text

Each **row** is one paragraph. To create a new paragraph, just add a new row.

```
text
I am Lorena, and when I was 13 years old I decided to work with children...
Years later, I graduated in Psychology and was invited to work...
I aim to support children, empower them in their strengths...
```

---

### Tab: `pillars` — Core Pillars (4 cards at the top)

Columns: `icon` | `title` | `description`

```
icon | title               | description
🤝   | Individualized Care | Every story matters. Person-centred support in every interaction.
🛡️   | Safe Environment   | Listening, respect and empathy at every encounter.
🌱   | Healthy Development | Emotional and social support through every stage of growth.
🧠   | Integrative Approach| Evidence-based practice centred on the whole person.
```

---

### Tab: `services` — Services Offered

Same structure as `pillars`: `icon` | `title` | `description`

---

### Tab: `approach` — My Approach

Columns: `type` | `title` | `description`

- Use `main` in the `type` column for the section title and overview text
- Use `principle` in the `type` column for each approach principle

```
type      | title                    | description
main      | My Approach              | I work from an integrative perspective...
principle | Strengths-Based Practice | I identify and build on the strengths of each child...
principle | Trauma-Informed Care     | I understand the impact of trauma and apply techniques...
principle | Relational Practice      | I build authentic, trusting therapeutic relationships...
principle | Diversity & Inclusion    | I respect cultural individuality and promote equity...
```

---

### Tab: `experience` — Professional Experience

Columns: `role` | `company` | `location` | `period` | `highlight`

> **One row per bullet point.** You can leave `role`, `company`, `location`, and `period` blank on continuation rows — the system will group them automatically.

```
role                     | company                | location   | period               | highlight
Support Worker 3 – Casual| Humana Community Svc.  | London, ON | April 2025 – Present | Supporting children and youth
                         |                        |            |                      | Building trust relationships
                         |                        |            |                      | Organizing and maintaining daily routines
CYC Placement            | Merrymount Family Ctr. | London, ON | January 2025         | Supporting children using a trauma-informed approach
                         |                        |            |                      | Employing crisis prevention techniques
```

> **Alternative format:** You can also put all bullet points in one cell separated by ` | ` (pipe character):
> `Supporting children | Building trust | Organizing routines`

---

### Tab: `education` — Academic Background

Columns: `degree` | `institution` | `location` | `period` | `level`

```
degree                      | institution                  | location   | period               | level
Child and Youth Care Program| Fanshawe College             | London, ON | Sep 2023 – Present   | Diploma
Bachelor of Arts: Psychology| ESUDA – Faculty of Hum. Sci. | Recife, BR | March 2006 – Dec 2010| Undergraduate Degree
```

---

### Tab: `certifications` — Certificates & Training

Columns: `title` | `issuer` | `date` | `location`

```
title                           | issuer                          | date         | location
Initial Crisis Intervention     | Safe Management Group           | October 2024 | London, ON
First Aid CPR Level C           | Vantage First Aid – Red Cross   | October 2023 | London, ON
EMDR – Eye Movement Desens.     | EMDR Institute                  | April 2017   | Recife, PE – Brazil
```

---

### Tab: `highlights` — Skills & Highlights (About section)

One item per row in a single column:

```
text
Compassionate, quality care for children and their families
Emotional and behavioural support across developmental stages
Ethics-first approach aligned with provincial and institutional policies
Therapeutic recreational activities to strengthen emotional well-being
Committed to diversity, equity and inclusion
```

---

### Tab: `forFamilies` — For Families Section

Columns: `icon` | `title` | `description`

Special reserved values for the `icon` column:
- `TITLE` → sets the section heading (text goes in the `description` column)
- `INTRO` → sets the introductory paragraph (text goes in the `description` column)
- Any emoji → creates an information card

```
icon  | title                 | description
TITLE |                       | For Families
INTRO |                       | I believe that partnering with families is essential...
❤️    | Non-Judgmental Support| Every family has its own story. I offer a safe, welcoming space...
🎯    | Individualized Plans  | Each child and family receives a personalized care plan...
🔧    | Practical Life Tools  | I teach practical strategies for emotional regulation...
🤲    | Family Partnership    | We walk the journey together. I guide and collaborate...
```

---

### Tab: `reference` — Testimonial / Reference

Simple key-value table. Edit the **Value** column only.

| Key | Description |
|---|---|
| `name` | Referee's full name |
| `role` | Their job title and organization |
| `quote` | The testimonial text |

```
key  | value
name | Ryan Hughes
role | Vice-Principal – Old North Public School
quote| Lorena genuinely cares about working with youth and wants to use her expertise...
```

---

## Deployment

The project is automatically deployed to **Vercel** on every push to the `main` branch.

### Environment Variable on Vercel

After deploying, add the `VITE_SHEETS_ID` environment variable in the Vercel dashboard:

1. Go to your project on [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Add `VITE_SHEETS_ID` with the spreadsheet ID as the value
4. Redeploy

---

## License

This project is private and built for personal use by Lorena Cynthya Lopes de Santana.
