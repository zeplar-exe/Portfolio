import re
import math

# Read the markdown file
with open('public/articles/eeg-interconnection.md', 'r') as f:
    text = f.read()

# Remove markdown formatting
text = re.sub(r'#+ ', '', text)  # Remove headers
text = re.sub(r'\[.*?\]', '', text)  # Remove link text
text = re.sub(r'\(.*?\)', '', text)  # Remove URLs
text = re.sub(r'\*\*?(.*?)\*\*?', r'\1', text)  # Remove bold/italic
text = re.sub(r'\|.*?\|', '', text)  # Remove table rows
text = re.sub(r'\$.*?\$', '', text)  # Remove inline math
text = re.sub(r'\n+', ' ', text)  # Replace newlines with spaces

# Count sentences
sentences = [s.strip() for s in re.split(r'[.!?]+', text) if s.strip()]
sentence_count = len(sentences)

# Count words
words = text.split()
word_count = len(words)

# Count syllables (approximate)
def count_syllables(word):
    word = word.lower()
    vowels = 'aeiouy'
    syllable_count = 0
    previous_was_vowel = False
    
    for char in word:
        is_vowel = char in vowels
        if is_vowel and not previous_was_vowel:
            syllable_count += 1
        previous_was_vowel = is_vowel
    
    # Adjust for silent e
    if word.endswith('e') and syllable_count > 1:
        syllable_count -= 1
    
    # Ensure at least 1 syllable
    if syllable_count == 0:
        syllable_count = 1
    
    return syllable_count

syllable_count = sum(count_syllables(word) for word in words)

# Calculate metrics
avg_words_per_sentence = word_count / sentence_count if sentence_count > 0 else 0
avg_syllables_per_word = syllable_count / word_count if word_count > 0 else 0

# Flesch Reading Ease (0-100, higher is easier)
flesch_reading_ease = 206.835 - (1.015 * avg_words_per_sentence) - (84.6 * avg_syllables_per_word)

# Flesch-Kincaid Grade Level
flesch_kincaid_grade = (0.39 * avg_words_per_sentence) + (11.8 * avg_syllables_per_word) - 15.59

# Gunning Fog Index
complex_words = sum(1 for word in words if count_syllables(word) >= 3)
percent_complex = (complex_words / word_count * 100) if word_count > 0 else 0
gunning_fog = 0.4 * (avg_words_per_sentence + percent_complex)

print('=== Reading Level Analysis ===')
print(f'Total words: {word_count}')
print(f'Total sentences: {sentence_count}')
print(f'Total syllables: {syllable_count}')
print(f'Complex words (3+ syllables): {complex_words} ({percent_complex:.1f}%)')
print()
print(f'Average words per sentence: {avg_words_per_sentence:.1f}')
print(f'Average syllables per word: {avg_syllables_per_word:.2f}')
print()
print(f'Flesch Reading Ease: {flesch_reading_ease:.1f}')
print('  (0-30: Very Difficult, 30-50: Difficult, 50-60: Fairly Difficult,')
print('   60-70: Standard, 70-80: Fairly Easy, 80-90: Easy, 90-100: Very Easy)')
print()
print(f'Flesch-Kincaid Grade Level: {flesch_kincaid_grade:.1f}')
print(f'  (Equivalent to US grade {flesch_kincaid_grade:.0f})')
print()
print(f'Gunning Fog Index: {gunning_fog:.1f}')
print(f'  (Years of formal education needed: {gunning_fog:.0f})')
print()

# Interpretation
if flesch_reading_ease < 30:
    difficulty = 'Very Difficult (College Graduate+)'
elif flesch_reading_ease < 50:
    difficulty = 'Difficult (College Level)'
elif flesch_reading_ease < 60:
    difficulty = 'Fairly Difficult (High School Senior)'
elif flesch_reading_ease < 70:
    difficulty = 'Standard (8th-9th Grade)'
else:
    difficulty = 'Easy (Middle School or below)'

print(f'Overall Assessment: {difficulty}')
print()

# Sample sentences for complexity
print('Sample sentences:')
for i, sent in enumerate(sentences[:3], 1):
    words_in_sent = len(sent.split())
    if len(sent) > 100:
        print(f'{i}. ({words_in_sent} words) {sent[:100]}...')
    else:
        print(f'{i}. ({words_in_sent} words) {sent}')
