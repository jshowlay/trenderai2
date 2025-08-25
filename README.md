# TrenderAI Starter

A complete, production-ready Next.js App Router starter repository with TypeScript, Tailwind CSS, and shadcn/ui integration.

## 🚀 Features

- **Next.js 14** with App Router
- **TypeScript** with strict configuration
- **Tailwind CSS** with custom brand tokens
- **shadcn/ui** components library
- **Dark-first design** approach
- **Responsive design** with container constraints
- **Theme switching** with next-themes
- **ESLint + Prettier** for code quality
- **Absolute imports** via @/* paths

## 🎨 Brand Design System

- **Background**: #000000 (deep black)
- **Foreground**: #ffffff (white text)
- **Accent**: #e5c35a (gold)
- **Dark-first design** approach

## 📁 Application Structure

- **5 routes**: `/` (Home), `/explore`, `/trends`, `/alerts`, `/saved`
- **Clean layout** with sticky header and footer
- **Sample TrendCard component** demonstrating the design system
- **Responsive design** with container constraints

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes
- **Code Quality**: ESLint + Prettier

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trenderai-starter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

## 🎯 shadcn/ui Components

The following components are pre-configured and ready to use:

- **Button** - Various button variants and sizes
- **Card** - Content containers with header, content, and footer
- **Input** - Form input fields
- **Switch** - Toggle switches

### Adding More Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add <component-name>
```

## 🎨 Customization

### Brand Colors

The brand colors are defined in `tailwind.config.ts`:

```typescript
brand: {
  black: "#000000",
  gold: "#e5c35a", 
  white: "#ffffff",
}
```

### Custom CSS Classes

Custom brand styles are available in `src/app/globals.css`:

- `.bg-brand-black` - Black background
- `.text-brand-gold` - Gold text
- `.border-brand-gold` - Gold border
- `.hover:text-brand-gold` - Gold text on hover
- `.hover:bg-brand-gold` - Gold background on hover

## 📱 Responsive Design

The application is fully responsive with:

- **Mobile-first** approach
- **Container constraints** for optimal content width
- **Flexible grids** that adapt to screen size
- **Touch-friendly** interactive elements

## 🔧 Development

### File Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── explore/           # Explore page
│   ├── trends/            # Trends page
│   ├── alerts/            # Alerts page
│   └── saved/             # Saved page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Header component
│   ├── footer.tsx        # Footer component
│   ├── trend-card.tsx    # Trend card component
│   ├── theme-provider.tsx # Theme provider
│   └── theme-toggle.tsx  # Theme toggle
└── lib/                  # Utility functions
    └── utils.ts          # Utility functions
```

### TypeScript Configuration

Strict TypeScript configuration with:

- **No implicit any**
- **Strict null checks**
- **Exact optional property types**
- **No unchecked indexed access**

### Code Quality

- **ESLint** with Next.js recommended rules
- **Prettier** for consistent formatting
- **EditorConfig** for consistent development environment

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository to Vercel
3. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code examples

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS
