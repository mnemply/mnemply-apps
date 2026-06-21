# Mnemply Bingo

Static GitHub Pages app for Mnemply Bingo.

## Current version

- Foundation Level uses the blue and green Canva number tiles from 1 to 6.
- Expansion Level uses the blue and green Canva number tiles from 1 to 12.
- Foundation and Expansion are separate pages: `foundation.html` and `expansion.html`.
- Each game calls every Mem-Link once before requiring a new game.
- The Flip-It button unlocks Reveal when the Mem-Link Tile is larger than the Cousin Tile.
- The Level 1 bingo card PDF is included at `assets/cards/bingo-cards-level-1.pdf`.
- The Level 2 bingo card PDF is included at `assets/cards/bingo-cards-level-2.pdf`.
- The app avoids the old dice wording and uses number-tile language instead.
- Local Cousin and Mem-Link artwork is stored at `assets/cousins` and `assets/mem-links`.

## Hosting on GitHub Pages

1. Push this folder to a GitHub repository.
2. In GitHub, open **Settings > Pages**.
3. Set the source to the main branch and root folder.
4. Open the GitHub Pages URL once the deployment finishes.

## Expansion Level

The Expansion Level is enabled with the valid Level 2 product list and Mem-Link data from the previous systeme.io code. It also uses the local 1 to 12 Cousin images.
