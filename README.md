# Website Builder

A modern, intuitive drag-and-drop website builder built with Next.js, React, and TypeScript. Create beautiful websites with customizable blocks including text, images, videos, galleries, and split-view layouts.

![Website Builder](https://img.shields.io/badge/Next.js-15.0.0-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.3-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.14-38B2AC?style=for-the-badge&logo=tailwind-css)

## 🚀 Features

### Core Functionality

- **Drag-and-Drop Interface**: Intuitive visual editor for building websites
- **Multiple Block Types**: Text, Video, Gallery, and Split-View components
- **Real-time Preview**: Live preview with desktop and mobile view modes
- **Auto-Save**: Automatic persistence of changes to the backend
- **Multi-Page Support**: Create and manage multiple pages within a website
- **Responsive Design**: Built-in responsive layouts for all devices

### Block Types

1. **Text Blocks**: Rich text editor powered by Quill.js with formatting options
2. **Video Blocks**: Embed videos with customizable dimensions and playback settings
3. **Gallery Blocks**: Image galleries with carousel display
4. **Split-View Blocks**: Two-column layouts with flexible content and ratios

### Advanced Features

- **Page Management**: Create, edit, delete, and navigate between pages
- **Block Reordering**: Use arrow buttons to reorder blocks within pages
- **Custom Styling**: Configurable background colors and maximum widths
- **SEO Support**: Built-in SEO settings for pages
- **Database Integration**: Persistent storage with Supabase
- **Auto-Save**: Automatic persistence of all changes to the backend
- **Loading States**: Professional overlay loader with user feedback
- **Error Handling**: Comprehensive error handling and user feedback

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.0.0** - React framework with App Router
- **React 19.2.0** - UI library with latest features
- **TypeScript 5.6.3** - Type-safe development
- **Tailwind CSS 3.4.14** - Utility-first CSS framework
- **Ant Design 5.21.0** - Professional UI components
- **Zustand 5.0.8** - Lightweight state management
- **Quill 2.0.3** - Rich text editor for content blocks
- **Formik 2.4.6** - Form management and validation

### Backend & Database

- **Supabase** - Database and real-time features
- **Next.js API Routes** - Server-side API endpoints

### Development Tools

- **ESLint** - Code linting and quality
- **Prettier 3.6.2** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 📁 Project Structure

```
website-builder/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── pages/               # Page management endpoints
│   │       ├── route.ts         # CRUD operations
│   │       └── upsert/          # Upsert operations
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # React components
│   ├── AddBlocks.tsx            # Block addition interface
│   ├── Editor.tsx               # Quill.js text editor
│   ├── Preview.tsx              # Website preview modal
│   ├── RenderWebPage.tsx        # Main website renderer
│   ├── Sidebar.tsx              # Page navigation sidebar
│   ├── StoreDataManager.tsx     # Data management utilities
│   ├── providers/               # Context providers
│   │   └── AntdProvider.tsx     # Ant Design configuration
│   ├── renderers/               # Block renderers
│   │   ├── GalleryRenderer.tsx  # Gallery block display
│   │   ├── Header.tsx           # Page header component
│   │   ├── SplitViewRenderer.tsx # Split-view block display
│   │   ├── TextRenderer.tsx     # Text block display
│   │   └── VideoRenderer.tsx    # Video block display
│   ├── GalleryEditModal.tsx     # Gallery editing interface
│   ├── SplitViewModal.tsx       # Split-view editing interface
│   └── VideoEditModal.tsx       # Video editing interface
├── hooks/                        # Custom React hooks
│   └── useStoreData.ts          # Data fetching and management
├── lib/                          # Utility libraries
│   └── api-client.ts            # API client functions
├── store/                        # State management
│   └── index.ts                 # Zustand store configuration
├── types/                        # TypeScript definitions
│   └── blocks.ts                # Block and page type definitions
└── database/                     # Database schemas and migrations
```

## 🏗️ Architecture

### State Management

The application uses **Zustand** for state management with the following key features:

- Centralized website and page data
- Automatic persistence to database
- Real-time UI updates
- Error handling and loading states

### Data Flow

1. **User Actions** → Components trigger store actions
2. **Store Updates** → State changes trigger UI re-renders
3. **Auto-Persistence** → Changes automatically sync to Supabase
4. **Error Handling** → Failed operations are logged silently

### Block System

Each block type implements a consistent interface:

```typescript
interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
  createdAt: string;
  updatedAt: string;
}
```

Specialized blocks extend this base interface with type-specific properties.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager
- Supabase account (for database)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/website-builder.git
cd website-builder
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Database Setup**
   Create a Supabase table called `pages`:

```sql
CREATE TABLE pages (
  id BIGSERIAL PRIMARY KEY,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

5. **Run the development server**

```bash
npm run dev
# or
yarn dev
```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### Creating Your First Website

1. **Add Content Blocks**
   - Click the "Add Block" button in the bottom-right corner
   - Choose from Text, Video, Gallery, or Split-view blocks
   - Configure your content in the modal dialogs

2. **Edit Existing Blocks**
   - Click the "Edit" button on any block
   - Modify content in the editing interface
   - Changes are automatically saved

3. **Reorder Blocks**
   - Use the up arrow (↑) button to move blocks higher on the page
   - Use the down arrow (↓) button to move blocks lower on the page
   - Arrow buttons are disabled when blocks can't move further

4. **Manage Pages**
   - Use the sidebar to create new pages
   - Rename or delete pages (except the home page)
   - Navigate between pages using the sidebar

5. **Preview Your Website**
   - Click the preview button (eye icon) to see your website
   - Toggle between desktop and mobile views
   - Preview shows exactly how visitors will see your site

### Block Types Guide

#### Text Blocks

- Rich text editor with formatting options
- Headers, lists, links, and styling
- Supports HTML content

#### Video Blocks

- Direct video URL embedding
- Customizable dimensions
- Autoplay, loop, and mute options

#### Gallery Blocks

- Multiple image support
- Carousel display format
- Alt text and captions for accessibility

#### Split-View Blocks

- Two-column layouts
- Mix text and images
- Configurable column ratios (30-70, 40-60, 50-50, 60-40, 70-30)
- Vertical alignment options

## 🔧 Configuration

### Page Settings

Each page supports:

- **Background Color**: Custom hex colors
- **Max Width**: Container width constraints
- **SEO Settings**: Title, description, and keywords

### Website Themes

Global theming options:

- Primary and secondary colors
- Font family selection
- Custom CSS variables

## 🌐 API Endpoints

### Page Management

- `GET /api/pages?id={pageId}` - Retrieve page data
- `POST /api/pages` - Create new page
- `PUT /api/pages` - Update existing page
- `POST /api/pages/upsert` - Create or update page

### Request/Response Format

```typescript
// Request body for creating/updating
{
  pageId?: number,
  storeData: Website
}

// Response format
{
  data: Website,
  id: number
}
```

## 🧪 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Code Quality Tools

- **ESLint**: Code linting with Next.js configuration
- **Prettier**: Consistent code formatting
- **TypeScript**: Type checking and IntelliSense

### Development Guidelines

1. Use TypeScript for all new code
2. Follow the existing component structure
3. Add proper error handling
4. Include JSDoc comments for complex functions
5. Use semantic commit messages

## 🔒 Security

### Data Protection

- Input sanitization for all user content
- XSS protection through React's built-in escaping
- CORS configuration for API endpoints
- Environment variable protection for sensitive keys

### Best Practices

- Never expose sensitive keys in client-side code
- Validate all user inputs on both client and server
- Use HTTPS in production environments
- Regular dependency updates for security patches

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on every push

### Manual Deployment

1. Build the application: `npm run build`
2. Start the server: `npm run start`
3. Configure reverse proxy (nginx/Apache)
4. Set up SSL certificates

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards

- Follow existing code style and patterns
- Add TypeScript types for all new code
- Include JSDoc comments for public APIs
- Write clear, descriptive commit messages
- Add tests for new functionality

## 🐛 Known Issues

- Gallery block image upload currently uses placeholder URLs
- Limited theme customization options
- Mobile preview could be more accurate

## 🗺️ Roadmap

### Version 1.1

- [x] Block reordering with arrow buttons ✅
- [x] Improved loading states with overlay loader ✅
- [x] Firebase dependency removal for cleaner codebase ✅
- [ ] Image upload to Supabase Storage
- [ ] More block types (Forms, Maps, Testimonials)
- [ ] Advanced theme customization
- [ ] Export to static HTML

### Version 1.2

- [ ] User authentication and multi-user support
- [ ] Template library
- [ ] SEO analytics integration
- [ ] Custom domain support
- [ ] A/B testing features

### Version 2.0

- [ ] Marketplace for blocks and themes
- [ ] Collaboration features
- [ ] Advanced animations and transitions
- [ ] E-commerce integration
- [ ] Performance analytics

---

**Built with ❤️ using Next.js and React**
