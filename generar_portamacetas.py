import json, os, re

img_dir = 'public/img/productos/portamacetas'
seed_path = 'src/lib/seed.json'

# Category info
cat_es = 'Portamacetas'
cat_en = 'Planters'
price_mxn = 210
price_usd = 11
stock = 42

# Colors
colors = [
    {"nombre_es": "Blanco", "nombre_en": "White", "hex": "#F5F5F5", "imagen": ""},
    {"nombre_es": "Negro", "nombre_en": "Black", "hex": "#2D2D2D", "imagen": ""},
    {"nombre_es": "Traslúcido", "nombre_en": "Translucent", "hex": "#D4D4D4", "imagen": ""},
    {"nombre_es": "Naranja", "nombre_en": "Orange", "hex": "#E87A3E", "imagen": ""},
]

# Name mapping
name_map = {
    'acostado': ('Portamaceta Tlalchichi Acostado', 'Tlalchichi Acostado Planter', 'Reproducción fiel a escala de un Tlalchichi en posición de descanso, fabricado en plástico PET de alta resistencia. Portamaceta artesanal que captura la serenidad del perro cebollo mesoamericano.', 'Faithful scale reproduction of a resting Tlalchichi, made in high-resistance PET plastic. An artisan planter capturing the serenity of the Mesoamerican hairless dog.'),
    'acostado-mediano': ('Portamaceta Tlalchichi Acostado Mediano', 'Tlalchichi Acostado Mediano Planter', 'Reproducción en formato mediano de un Tlalchichi acostado, fabricado en plástico PET de alta resistencia. Portamaceta ideal para plantas de tamaño medio con diseño tradicional.', 'Medium-sized reproduction of a resting Tlalchichi, made in high-resistance PET plastic. Ideal for medium plants with traditional design.'),
    'mascara-danza': ('Portamaceta Tlalchichi Máscara Danza', 'Tlalchichi Máscara Danza Planter', 'Portamaceta con figura de Tlalchichi danzante con máscara ceremonial, fabricado en plástico PET. Captura el movimiento y la espiritualidad de las danzas prehispánicas.', 'Planter featuring a dancing Tlalchichi with ceremonial mask, made in PET plastic. Captures the movement and spirituality of pre-Hispanic dances.'),
    'mazorca': ('Portamaceta Tlalchichi Mazorca', 'Tlalchichi Mazorca Planter', 'Portamaceta Tlalchichi sosteniendo una mazorca, símbolo de abundancia y fertilidad. Fabricado en plástico PET de alta resistencia.', 'Tlalchichi planter holding a corncob, symbol of abundance and fertility. Made in high-resistance PET plastic.'),
    'parado': ('Portamaceta Tlalchichi Parado', 'Tlalchichi Parado Planter', 'Portamaceta con Tlalchichi en posición erguida, fabricado en plástico PET de alta resistencia. Representa la vigilancia y protección del hogar.', 'Standing Tlalchichi planter, made in high-resistance PET plastic. Represents vigilance and home protection.'),
    'sentado': ('Portamaceta Tlalchichi Sentado', 'Tlalchichi Sentado Planter', 'Portamaceta con Tlalchichi en posición sedente, fabricado en plástico PET de alta resistencia. Ideal para cactus y suculentas.', 'Seated Tlalchichi planter, made in high-resistance PET plastic. Ideal for cacti and succulents.'),
    'viejo-sentado': ('Portamaceta Tlalchichi Viejo Sentado', 'Tlalchichi Viejo Sentado Planter', 'Portamaceta con Tlalchichi anciano sentado, fabricado en plástico PET de alta resistencia. Refleja la sabiduría y la tradición.', 'Seated elderly Tlalchichi planter, made in high-resistance PET plastic. Reflects wisdom and tradition.'),
}

# Load existing seed
with open(seed_path, 'r') as f:
    data = json.load(f)

# Remove ALL existing portamacetas
data = [p for p in data if p.get('categoria_es') != cat_es]

# Also remove products that are now portamacetas (if they existed in other categories)
for img_name, (nom_es, nom_en, desc_es, desc_en) in name_map.items():
    slug = 'portamaceta-' + img_name
    # Remove if exists
    data = [p for p in data if p['slug'] != slug]

# Build new products from images
files = sorted(os.listdir(img_dir))
new_products = []
for f_name in files:
    if not f_name.endswith('.png'):
        continue
    # Extract key name
    base = re.sub(r'^tlalchichi-', '', f_name)
    base = re.sub(r'-colima\.png$', '', base)
    
    if base not in name_map:
        print(f'SKIP no mapping: {base}')
        continue
    
    nom_es, nom_en, desc_es, desc_en = name_map[base]
    img_path = '/img/productos/portamacetas/' + f_name
    
    slug = 'portamaceta-' + base
    
    # Build colors with correct image
    prod_colors = []
    for c in colors:
        c_copy = dict(c)
        c_copy['imagen'] = img_path
        prod_colors.append(c_copy)
    
    new_products.append({
        "slug": slug,
        "nombre_es": nom_es,
        "nombre_en": nom_en,
        "descripcion_es": desc_es,
        "descripcion_en": desc_en,
        "historia_es": "Portamaceta artesanal inspirada en la tradición Tlalchichi de Colima, México.",
        "historia_en": "Artisan planter inspired by the Tlalchichi tradition of Colima, Mexico.",
        "categoria_es": cat_es,
        "categoria_en": cat_en,
        "precio_mxn": price_mxn,
        "precio_usd": price_usd,
        "stock": stock,
        "destacado": False,
        "imagenes": [img_path],
        "colores": prod_colors
    })
    print(f'  {nom_es:45s} | {img_path}')

# Append new products
data.extend(new_products)

with open(seed_path, 'w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f'\nTotal portamacetas: {len(new_products)}')
print(f'Total products in seed: {len(data)}')
