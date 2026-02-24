# Neural Ennead Executive Dashboard

An interactive document management and visualization dashboard for executives to manage Neural Ennead documentation.

## Features

- **Document Filtering**: Filter documents by priority, audience, bookmarks, and progress status
- **Search Functionality**: Search across document titles and content
- **Reading Progress Tracking**: Track your reading progress for each document
- **Annotation System**: Add and manage annotations for each document
- **Bookmarking**: Bookmark important documents for quick access
- **AI-Powered Chat Assistant**: Get help finding documents and information
- **Document Export**: Export document metadata and annotations
- **CSV Upload**: Load your own document data via CSV upload

## Getting Started

### Prerequisites

- Node.js 14+ and npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/neural-ennead-executive-dashboard.git
cd neural-ennead-executive-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Usage

### Default Data

The dashboard comes pre-loaded with demo data to demonstrate functionality.

### Loading Your Own Data

To use your own data:
1. Prepare a CSV file with the following headers:
   - File Name
   - Summary
   - Key Takeaway
   - Decision or Action Required
   - Priority Level
   - Audience
   - Dependencies

2. Click the "Upload CSV" button in the dashboard notification banner

3. Select your CSV file

A sample CSV file is provided in the `sample-data` directory.

## Data Persistence

The dashboard uses browser localStorage to persist:
- Bookmarks
- Reading progress
- Annotations

This allows your data to persist between browser sessions.

## Technology Stack

- React
- TailwindCSS
- PapaParse (CSV parsing)
- Lucide React (Icons)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Neural Ennead is a fictional technology for demonstration purposes

