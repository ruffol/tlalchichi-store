import json

with open('src/lib/seed.json', 'r') as f:
    data = json.load(f)

# Add peso_kg based on category
for p in data:
    cat = p.get('categoria_es', '')
    if cat == 'Llaveros':
        p['peso_kg'] = 0.1
    elif cat == 'Portamacetas':
        p['peso_kg'] = 0.5
    elif cat == 'Alcancías':
        p['peso_kg'] = 0.3
    elif cat == 'Cuencos':
        p['peso_kg'] = 0.3
    else:
        p['peso_kg'] = 0.2
    print(f'  {p["slug"]:40s} {p["peso_kg"]} kg')

with open('src/lib/seed.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f'\nTotal: {len(data)} products updated')
