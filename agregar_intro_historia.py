import json

intro_es = "Los Tlalchichis son una de las figuras más representativas del estado de Colima y forman parte del patrimonio cultural de la región. Inspirados en antiguos perros de barro encontrados en zonas arqueológicas del occidente de México, estas esculturas reflejan la estrecha relación que las civilizaciones prehispánicas mantenían con estos animales, considerados compañeros, guardianes y símbolos de lealtad.\n\n"
intro_en = "Tlalchichis are one of the most representative figures of the state of Colima and are part of the region's cultural heritage. Inspired by ancient clay dogs found in archaeological sites in western Mexico, these sculptures reflect the close relationship that pre-Hispanic civilizations maintained with these animals, regarded as companions, guardians, and symbols of loyalty.\n\n"

with open('src/lib/seed.json', 'r') as f:
    data = json.load(f)

updated = 0
for p in data:
    if p.get('categoria_es') == 'Llaveros':
        p['historia_es'] = intro_es + p['historia_es']
        p['historia_en'] = intro_en + p['historia_en']
        print(f'  {p["nombre_es"]}')
        updated += 1

print(f'Updated: {updated}')
with open('src/lib/seed.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
