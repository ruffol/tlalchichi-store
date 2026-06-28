import json

with open('src/lib/seed.json', 'r') as f:
    data = json.load(f)

# Replacements for "artesanal" in descriptions and histories
repl_es = [
    ('artesanal', ''),
    ('Artesanal', ''),
    ('Pieza artesanal que captura', 'Captura'),
    ('Portamaceta artesanal inspirada', 'Portamaceta inspirada'),
    ('Pieza artesanal.', ''),
    ('  ', ' '),
]

repl_en = [
    ('An artisan piece capturing', 'Capturing'),
    ('An artisan planter capturing', 'Capturing'),
    ('an artisan piece capturing', 'capturing'),
    ('Artisan reproduction', 'Reproduction'),
    ('artisan reproduction', 'reproduction'),
    ('artisan planter', 'planter'),
    ('artisan piece', 'piece'),
    ('artisan', ''),
    ('Artisan', ''),
]

def clean_artesanal(text):
    if not text:
        return text
    for old, new in repl_es:
        text = text.replace(old, new)
    # Clean double spaces
    while '  ' in text:
        text = text.replace('  ', ' ')
    # Clean leading/trailing spaces
    text = text.strip()
    # Clean ".," and "., "
    text = text.replace('., ', '. ')
    text = text.replace('.,', '.')
    return text

def clean_artisan(text):
    if not text:
        return text
    for old, new in repl_en:
        text = text.replace(old, new)
    while '  ' in text:
        text = text.replace('  ', ' ')
    text = text.strip()
    text = text.replace('., ', '. ')
    text = text.replace('.,', '.')
    return text

count = 0
for p in data:
    for field in ['descripcion_es', 'descripcion_en', 'historia_es', 'historia_en']:
        old_val = p.get(field, '')
        if 'artesanal' in old_val.lower() or 'artisan' in old_val.lower():
            new_val = clean_artesanal(old_val) if 'es' in field else clean_artisan(old_val)
            if new_val != old_val:
                print(f'  [{field}] {p["slug"]}: "{old_val[:40]}..." -> "{new_val[:40]}..."')
                p[field] = new_val
                count += 1

print(f'\nTotal changes: {count}')

with open('src/lib/seed.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
