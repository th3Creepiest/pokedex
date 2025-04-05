# Pokédex Web Application

![Pokédex](https://img.shields.io/badge/Pok%C3%A9dex-Web%20App-red)
![HTML](https://img.shields.io/badge/HTML-5-orange)
![CSS](https://img.shields.io/badge/CSS-3-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)

A modern, responsive Pokédex web application built with HTML, CSS, and vanilla JavaScript. This project uses the [PokéAPI](https://pokeapi.co/) to fetch and display Pokémon data in an interactive and user-friendly interface.

## 📋 Table of Contents

- [Features](#features)

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

## 🚀 Installation

No installation is required! This is a client-side web application that runs directly in your browser.

1. Clone this repository or download the ZIP file:

   ```bash
   git clone https://github.com/yourusername/pokedex.git
   ```

2. Open the project directory:

   ```bash
   cd pokedex
   ```

3. Open the `index.html` file in your web browser:
   - Double-click the file
   - Or use a local development server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code

## 🎮 Usage

1. Browse Pokémon cards in a grid layout
2. Click any card to view detailed information
3. Use the search bar to find specific Pokémon
4. Toggle between light/dark themes using the theme button

## 💻 Technologies Used

- **HTML**: Structure and content
- **CSS**: Styling, animations, and responsive design
  - Custom properties (CSS variables) for theming
  - FlexBox and Grid for layouts
  - Media queries for responsiveness
- **JavaScript**:
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

Pokémon cries are sourced from [Pokémon Showdown](https://play.pokemonshowdown.com/audio/cries/).

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

Data provided by [PokéAPI](https://pokeapi.co/). Pokémon and Pokémon character names are trademarks of Nintendo.
