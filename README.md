# Pokédex Web Application

![Pokédex](https://img.shields.io/badge/Pok%C3%A9dex-Web%20App-red)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

A modern, responsive Pokédex web application built with HTML, CSS, and vanilla JavaScript. This project uses the [PokéAPI](https://pokeapi.co/) to fetch and display Pokémon data in an interactive and user-friendly interface.

## 📋 Table of Contents

- [Features](#features)
- [Project Versions](#project-versions)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [API Reference](#api-reference)
- [License](#license)

## ✨ Features

- **Pokémon Browsing**: View the first 50 Pokémon with their images, types, and basic information
- **Search Functionality**: Search for Pokémon by name
- **Detailed Information**: View detailed stats, abilities, and descriptions for each Pokémon
- **Responsive Design**: Works on desktop and mobile devices
- **Theme Toggle**: Switch between light and dark themes
- **Animated Sprites**: Display animated sprites when available

## 🔄 Project Versions

This repository contains two versions of the Pokédex application:

### Version 1 (v1)

- **Grid Layout**: Displays Pokémon in a card grid format
- **Modal Details**: Shows Pokémon details in a modal overlay when a card is clicked
- **Simple UI**: Straightforward user interface with all Pokémon displayed at once

### Version 2 (v2)

- **Split View Layout**: Features a sidebar list of Pokémon and a details panel
- **Persistent Selection**: Maintains selected Pokémon state during searches
- **Enhanced UI**: Improved user experience with a more app-like interface
- **Optimized for Larger Screens**: Better utilizes screen space on desktop devices

## 🚀 Installation

No installation is required! This is a client-side web application that runs directly in your browser.

1. Clone this repository or download the ZIP file:

   ```bash
   git clone https://github.com/yourusername/pokedex.git
   ```

2. Navigate to either version directory:

   ```bash
   cd pokedex/v1
   # or
   cd pokedex/v2
   ```

3. Open the `index.html` file in your web browser:
   - Double-click the file
   - Or use a local development server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code

## 🎮 Usage

### Version 1

1. Browse the grid of Pokémon cards
2. Click on a card to view detailed information
3. Use the search bar to find specific Pokémon
4. Toggle between light and dark themes using the sun/moon button

### Version 2

1. Browse the list of Pokémon on the left sidebar
2. Click on a Pokémon to view its details in the right panel
3. Use the search bar to filter the Pokémon list
4. Toggle between light and dark themes using the sun/moon button

## 💻 Technologies Used

- **HTML5**: Structure and content
- **CSS3**: Styling, animations, and responsive design
  - Custom properties (CSS variables) for theming
  - Flexbox and Grid for layouts
  - Media queries for responsiveness
- **JavaScript (ES6+)**:
  - Fetch API for data retrieval
  - Async/await for asynchronous operations
  - DOM manipulation
  - Event handling
  - Local storage for theme preference

## 🔌 API Reference

This project uses the [PokéAPI](https://pokeapi.co/), a RESTful API for Pokémon data.

Endpoints used:

- `https://pokeapi.co/api/v2/pokemon?limit=50` - Get first 50 Pokémon
- `https://pokeapi.co/api/v2/pokemon/{id or name}` - Get specific Pokémon details
- `https://pokeapi.co/api/v2/pokemon-species/{id}` - Get Pokémon species information

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Data provided by [PokéAPI](https://pokeapi.co/). Pokémon and Pokémon character names are trademarks of Nintendo.
