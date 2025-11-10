# AI Model Studio - Professional Product Photography

Transform your product images into professional marketing visuals using AI. Perfect for Facebook ads, Instagram posts, and print-on-demand businesses.

## Features

- **Step-by-Step Workflow**: Intuitive, morphing UI that guides you through each step
- **Drag & Drop Upload**: Easy image upload with preview and management
- **AI-Powered Generation**: Uses Google's Gemini 2.5 Flash to create professional model photos
- **Multiple Export Options**: Download HD images, copy to clipboard, or share directly
- **Professional Design**: Clean, modern interface optimized for business users
- **Responsive Layout**: Works seamlessly on desktop and mobile devices

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Modelmaker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up your API key**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## How It Works

1. **Upload Products**: Upload 1-5 high-quality images of your product
2. **Describe Scene**: Describe the setting, lighting, and style you want
3. **Generate**: Click generate and wait 10-30 seconds
4. **Download & Share**: Get your professional image ready for marketing

## Use Cases

- **E-commerce**: Create product listings without expensive photoshoots
- **Social Media**: Generate eye-catching content for Instagram and Facebook
- **Print-on-Demand**: Create mockups for t-shirts, mugs, and other products
- **Marketing Campaigns**: Produce professional ads quickly and affordably
- **Content Creation**: Generate unlimited variations for A/B testing

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.5 Flash Image
- **Deployment**: Optimized for AI Studio

## Build for Production

```bash
npm run build
```

The build output will be in the `dist` folder.

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Modelmaker/
├── components/
│   ├── ImageUploader.tsx       # File upload with drag-drop
│   └── GeneratedImageViewer.tsx # Image display and actions
├── services/
│   └── geminiService.ts        # Gemini API integration
├── App.tsx                     # Main application with step flow
├── types.ts                    # TypeScript type definitions
├── index.html                  # HTML entry point with design system
└── vite.config.ts             # Vite configuration
```

## Design System

### Colors
- **Primary**: Indigo-600 to Purple-600 gradient
- **Background**: Soft gray gradient (gray-50 to gray-100)
- **Accents**: Green for success, Red for errors
- **Text**: Gray-900 for primary, Gray-600 for secondary

### Typography
- **Font**: Inter (modern, professional sans-serif)
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold), 800 (extrabold)

### Components
- **Buttons**: Gradient primary buttons with hover effects
- **Cards**: White cards with rounded corners and subtle shadows
- **Inputs**: Bordered inputs with focus states
- **Steps**: Visual progress indicators with checkmarks

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.

---

**Powered by Google Gemini AI** • Perfect for Facebook ads, Instagram posts, and print-on-demand products
