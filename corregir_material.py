import json

with open('src/lib/seed.json', 'r') as f:
    data = json.load(f)

# Replace all mentions of "barro" / "clay" in llavero descriptions with PET plastic
replacements_es = [
    ('esculpido en barro tradicional de Colima', 'reproducido en plástico PET de alta resistencia'),
    ('esculpido en barro tradicional', 'reproducido en plástico PET de alta resistencia'),
    ('tallado en barro tradicional de Colima', 'fabricado en plástico PET de alta resistencia'),
    ('elaborado en barro natural de Colima', 'fabricado en plástico PET de alta resistencia'),
    ('Hecho a mano con barro natural', 'Réplica fiel de la pieza original de barro, ahora en plástico PET'),
    ('Hecho a mano con barro natural.', 'Réplica fiel de la pieza original de barro, ahora en plástico PET.'),
    ('Hecha a mano en barro natural de Colima', 'Réplica fiel de la pieza original de barro, ahora en plástico PET'),
    ('hecho a mano con barro natural.', 'réplica fiel de la pieza original de barro, ahora en plástico PET.'),
]

replacements_en = [
    ('sculpted in traditional Colima clay', 'reproduced in high-resistance PET plastic'),
    ('sculpted in traditional clay', 'reproduced in high-resistance PET plastic'),
    ('made from natural Colima clay', 'faithfully reproduced from the original clay sculpture in PET plastic'),
    ('made from natural clay', 'faithfully reproduced from the original clay sculpture in PET plastic'),
    ('Handmade with natural clay.', 'Faithful reproduction of the original clay piece, now in PET plastic.'),
    ('Handmade with natural clay', 'Faithful reproduction of the original clay piece, now in PET plastic'),
    ('handmade in natural Colima clay', 'faithfully reproduced from original Colima clay sculpture, now in PET plastic'),
    ('carved in traditional Colima clay', 'faithfully reproduced from original Colima clay sculpture, now in PET plastic'),
]

updated = 0
for p in data:
    if p.get('categoria_es') == 'Llaveros':
        for old, new in replacements_es:
            if old in p['descripcion_es']:
                p['descripcion_es'] = p['descripcion_es'].replace(old, new)
                print(f'  ES [{p["slug"]}]: {old} -> {new}')
                updated += 1
        for old, new in replacements_en:
            if old in p['descripcion_en']:
                p['descripcion_en'] = p['descripcion_en'].replace(old, new)
                updated += 1

print(f'Total replacements: {updated}')

with open('src/lib/seed.json', 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
