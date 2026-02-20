#!/usr/bin/env python3
import re

# Read the HTML file
with open('netflix-clone.html', 'r') as file:
    content = file.read()

# Define the movie names in order they appear
movies = [
    "The Queen's Gambit",  # Already fixed
    "Dark",                # Already fixed
    "Money Heist",         # Already fixed
    "The Crown",
    "Bridgerton", 
    "Ozark",
    "Squid Game",
    "Lupin",
    "The Witcher",
    "Wednesday",
    "Emily in Paris",
    "You",
    "Stranger Things",
    "The Queen's Gambit",  # Continue watching section
    "Ozark",
    "Money Heist"
]

# Pattern to find button groups
button_pattern = r'<div class="movie-controls">\s*<button class="control-btn play-btn"(?![^>]*aria-label)><i class="fas fa-play"></i></button>\s*<button class="control-btn"(?![^>]*aria-label)><i class="fas fa-plus"></i></button>\s*<button class="control-btn"(?![^>]*aria-label)><i class="fas fa-thumbs-up"></i></button>\s*<button class="control-btn"(?![^>]*aria-label)><i class="fas fa-thumbs-down"></i></button>\s*</div>'

# Find all matches
matches = list(re.finditer(button_pattern, content, re.MULTILINE))
print(f"Found {len(matches)} button groups without aria-labels")

# Process matches in reverse order to avoid offset issues
movie_index = 3  # Start from The Crown (index 3)
for match in reversed(matches):
    if movie_index < len(movies):
        movie_name = movies[movie_index]
        
        replacement = f'''<div class="movie-controls">
                                <button class="control-btn play-btn" aria-label="Play {movie_name}"><i class="fas fa-play"></i></button>
                                <button class="control-btn" aria-label="Add {movie_name} to My List"><i class="fas fa-plus"></i></button>
                                <button class="control-btn" aria-label="Like {movie_name}"><i class="fas fa-thumbs-up"></i></button>
                                <button class="control-btn" aria-label="Dislike {movie_name}"><i class="fas fa-thumbs-down"></i></button>
                            </div>'''
        
        content = content[:match.start()] + replacement + content[match.end():]
        print(f"Fixed buttons for: {movie_name}")
        movie_index += 1

# Also fix navigation buttons
nav_pattern = r'<button class="row-nav (prev|next)"(?![^>]*aria-label)><i class="fas fa-chevron-(left|right)"></i></button>'
content = re.sub(r'<button class="row-nav prev"(?![^>]*aria-label)><i class="fas fa-chevron-left"></i></button>', 
                 '<button class="row-nav prev" aria-label="Previous movies"><i class="fas fa-chevron-left"></i></button>', content)
content = re.sub(r'<button class="row-nav next"(?![^>]*aria-label)><i class="fas fa-chevron-right"></i></button>', 
                 '<button class="row-nav next" aria-label="Next movies"><i class="fas fa-chevron-right"></i></button>', content)

# Write the fixed content back
with open('netflix-clone.html', 'w') as file:
    file.write(content)

print("All accessibility issues fixed!")
