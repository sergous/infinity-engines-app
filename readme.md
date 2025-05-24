# Expo Supabase Starter

![social-preview-dark](https://github.com/user-attachments/assets/9697a7da-10aa-4661-bb76-b5bc0dd611f0)

## Introduction

This repository serves as a comprehensive starter project for developing React Native and Expo applications with Supabase as the backend. It integrates various technologies such as Expo Router for navigation, Tailwind CSS for styling, React-Hook-Form for form handling, Zod for schema validation, and TypeScript for type safety. By leveraging these powerful tools, this starter template provides a robust foundation for building modern, scalable, and efficient mobile applications.

#### Disclaimer

This is not supposed to be a template, boilerplate or a framework. It is an opinionated guide that shows how to do some things in a certain way. You are not forced to do everything exactly as it is shown here, decide what works best for you and your team and stay consistent with your style.

## Table of Contents

- [💻 Application Overview](docs/application-overview.md)
- [⚙️ Project Configuration](docs/project-configuration.md)
- [🗄️ Project Structure](docs/project-structure.md)
- [🧱 Components And Styling](docs/components-and-styling.md)
- [🗃️ State Management](docs/state-management.md)
- [🚀 PWA Support](#pwa-support)
- [📋 Available Commands](#available-commands)

## Available Commands

The project includes several commands for development, building, and deploying your application:

```bash
# Start the development server
npm start
# or with Bun
bun start

# Start the development server for web
npm run web
# or with Bun
bun start --web

# Build the web application for production
npm run build

# Run the application on Android
npm run android

# Run the application on iOS
npm run ios

# Run linting
npm run lint

# Generate color constants
npm run generate-colors

# Run the post-build script manually (for PWA support)
npm run post-build
```

## PWA Support

This project includes full Progressive Web App (PWA) support, allowing your application to be installed on devices and work offline. PWA features include:

- Installable web application with icon on home screen
- Offline support via service worker caching
- Splash screen and themed experience
- Fast loading and performance optimization

### PWA Configuration

PWA settings are configured in the following files:

- `app.json` - Contains basic PWA settings in the `web` section
- `web/manifest.json` - Web App Manifest with application metadata
- `web/service-worker.js` - Service Worker for caching and offline support
- `web/index.html` - Custom HTML template with PWA meta tags

### Building the PWA

To build the application as a PWA, run:

```bash
npm run build
```

This command builds the web application and automatically applies PWA configurations through the post-build script.

### Testing the PWA

After building, you can test the PWA using a local server:

```bash
npx serve dist/
```

Open the application in Chrome, open Developer Tools (F12), navigate to the Application tab, and check:

1. The Manifest section to verify the PWA manifest
2. The Service Workers section to verify registration
3. Look for the install icon in the address bar

## Contributing

Contributions to this starter project are highly encouraged and welcome! If you have any suggestions, bug reports, or feature requests, please feel free to create an issue or submit a pull request. Let's work together to enhance the developer experience and make it easier for everyone to build exceptional Expo applications with Supabase.

## License

This repository is licensed under the MIT License. You are granted the freedom to use, modify, and distribute the code for personal or commercial purposes. For more details, please refer to the [LICENSE](https://github.com/FlemingVincent/supabase-starter/blob/main/LICENSE) file.
