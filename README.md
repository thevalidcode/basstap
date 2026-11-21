# BassTap 🎸

**Your bass guitar, in your pocket.**

BassTap is a lightweight, interactive virtual bass instrument that makes playing bass notes as simple as tapping a keypad. Select a musical key, tap any of the eight scale degrees, and start playing.

Built to make bass practice more accessible, intuitive, and fun, BassTap brings the simplicity of a phone keypad to the world of bass guitar.

## ✨ The Idea

Learning and practicing bass shouldn't always require carrying a physical instrument.

BassTap reimagines how people interact with a virtual bass guitar. Instead of traditional strings and frets, it uses a familiar eight-button keypad based on the musical scale:

| Button | Solfège | Scale Degree |
| --- | --- | --- |
| 1 | Do | Tonic |
| 2 | Re | Major 2nd |
| 3 | Mi | Major 3rd |
| 4 | Fa | Perfect 4th |
| 5 | Sol | Perfect 5th |
| 6 | La | Major 6th |
| 7 | Ti | Major 7th |
| 8 | Do | Octave |

Select a musical key to choose the major scale represented by the keypad.

No complicated fretboards. No unnecessary controls. Just select, tap, and play.

## 🚀 Features

- **Eight-Button Keypad:** Play the eight degrees of a musical scale.
- **Musical Key Selection:** Switch between all 12 chromatic keys.
- **Real Bass Sounds:** Use recorded bass guitar samples for an authentic playing experience.
- **Fingerstyle and Pick:** Support for different bass playing techniques.
- **Touch-to-Play:** Press and hold buttons to sustain notes, then release to trigger the natural note decay.
- **Responsive Interface:** Designed for phones, tablets, and desktop browsers.
- **Lightweight Experience:** No account or complicated setup required.

*Note: Features are part of the product vision and may be at different stages of implementation.*

## 🛠️ Tech Stack

BassTap is built with modern web technologies.

| Technology | Purpose |
| --- | --- |
| React | User interface |
| TypeScript | Type safety |
| Vite | Development and build tooling |
| Tailwind CSS | Styling |
| Tone.js | Audio playback and sample management |
| Web Audio API | Browser-based audio processing |
| PWA | Installable web application |

## 📁 Project Structure

The project follows a simple and modular structure.

```text
basstap/
├── public/
│   ├── finger/          # Fingerstyle bass samples
│   └── pick/             # Pick-style bass samples
│
├── src/
│   ├── components/       # Reusable UI components
│   ├── features/         # Core application features
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Shared utilities
│   ├── audio/            # Audio engine and sample management
│   ├── styles/           # Global styles
│   ├── types/            # TypeScript definitions
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

The actual directory structure may evolve as development progresses.

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (LTS recommended)
- pnpm
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/thevalidcode/basstap.git
```

Navigate into the project:

```bash
cd basstap
```

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Open the local URL provided by Vite in your browser.

### Production Build

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## 🎵 How It Works

BassTap uses musical scale degrees rather than fixed note assignments.

When a user selects a key, the application calculates the corresponding notes for each keypad button.

For example:

**C Major**

`C - D - E - F - G - A - B - C`

**G Major**

`G - A - B - C - D - E - F# - G`

The same eight buttons work across different keys without requiring a separate set of audio recordings for every musical key.

### Audio Engine

BassTap uses Tone.js to manage bass sample playback and pitch transposition.

The audio engine is designed around:

- Sample loading and mapping.
- Pitch transposition using semitone intervals.
- Note triggering and release.
- Natural sample decay.
- Support for fingerstyle and pick samples.

Recorded samples are used as the sound source, while Tone.js handles playback and pitch adjustments.

## 🗺️ Roadmap

- [x] Project concept and initial setup
- [ ] Build the keypad interface
- [ ] Implement musical key selection
- [ ] Implement major scale note mapping
- [ ] Integrate fingerstyle bass samples
- [ ] Integrate pick-style bass samples
- [ ] Implement touch-and-hold playback
- [ ] Implement natural note release
- [ ] Optimize audio playback for mobile browsers
- [ ] Add minor scale support
- [ ] Introduce practice modes and interactive exercises
- [ ] Make BassTap installable as a PWA

## 🤝 Contributing

Contributions, suggestions, bug reports, and feature requests are welcome.

If you'd like to contribute:

1. Fork the repository.
2. Create a new feature branch.

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. Make your changes.
4. Ensure your code follows the existing project structure and conventions.
5. Test your changes and run the production build.

   ```bash
   pnpm build
   ```

6. Commit your changes with a descriptive message.

   ```bash
   git commit -m "feat: add minor scale support"
   ```

7. Push your branch and open a Pull Request.

### Contribution Guidelines

- Keep changes focused and avoid unnecessary complexity.
- Use TypeScript and maintain proper type safety.
- Write reusable and maintainable components.
- Avoid introducing dependencies without a good reason.
- Preserve existing audio samples and their directory structure.
- Test audio functionality across supported browsers when making audio-related changes.
- Provide clear descriptions for issues and pull requests.

For significant changes, open an issue first to discuss the proposed implementation.

## 📄 License

The project's license has not yet been specified. Check the repository for licensing information before reusing or distributing its source code or audio assets.

## 👨‍💻 Author

Built with ❤️ by **Valid (Precious Ibeh)**.

I'm a software engineer interested in building useful products, exploring technology, and creating things that make everyday experiences better.

Connect with me:

- **Instagram:** [@thevalidcode](https://instagram.com/thevalidcode)
- **LinkedIn:** [@thevalidcode](https://linkedin.com/in/thevalidcode)
- **X (Twitter):** [@thevalidcode](https://x.com/thevalidcode)
- **Portfolio:** [thevalidcreative.com](https://thevalidcreative.com)
- **GitHub:** [@thevalidcode](https://github.com/thevalidcode)

---

**BassTap — Pick a key. Tap a note. Play your bass.**
