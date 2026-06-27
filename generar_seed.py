import json, os, pathlib

seed = []

# Helper to add a product
def add(slug, nombre_es, nombre_en, desc_es, desc_en, hist_es, hist_en, cat_es, cat_en, mxn, usd, stock, destacado, imagenes, cols):
    seed.append({
        "slug": slug,
        "nombre_es": nombre_es,
        "nombre_en": nombre_en,
        "descripcion_es": desc_es,
        "descripcion_en": desc_en,
        "historia_es": hist_es,
        "historia_en": hist_en,
        "categoria_es": cat_es,
        "categoria_en": cat_en,
        "precio_mxn": mxn,
        "precio_usd": usd,
        "stock": stock,
        "destacado": destacado,
        "imagenes": imagenes,
        "colores": cols
    })

# Default colors for each category
llavero_colors = [
    {"nombre_es": "Barro Natural", "nombre_en": "Natural Clay", "hex": "#B87333", "imagen": ""},
    {"nombre_es": "Terracota", "nombre_en": "Terracotta", "hex": "#C86A4E", "imagen": ""},
    {"nombre_es": "Negro", "nombre_en": "Black", "hex": "#2D2D2D", "imagen": ""},
    {"nombre_es": "Blanco", "nombre_en": "White", "hex": "#EAE0D5", "imagen": ""},
]
porta_colors = [
    {"nombre_es": "Barro Natural", "nombre_en": "Natural Clay", "hex": "#B87333", "imagen": ""},
    {"nombre_es": "Verde Maguey", "nombre_en": "Maguey Green", "hex": "#4A7C59", "imagen": ""},
    {"nombre_es": "Terracota", "nombre_en": "Terracotta", "hex": "#C86A4E", "imagen": ""},
    {"nombre_es": "Negro", "nombre_en": "Black", "hex": "#2D2D2D", "imagen": ""},
]
alcancia_colors = [
    {"nombre_es": "Barro Natural", "nombre_en": "Natural Clay", "hex": "#B87333", "imagen": ""},
    {"nombre_es": "Rojo Óxido", "nombre_en": "Rust Red", "hex": "#8B3A3A", "imagen": ""},
    {"nombre_es": "Negro", "nombre_en": "Black", "hex": "#2D2D2D", "imagen": ""},
    {"nombre_es": "Crema", "nombre_en": "Cream", "hex": "#F5DEB3", "imagen": ""},
]
cuenco_colors = [
    {"nombre_es": "Barro Natural", "nombre_en": "Natural Clay", "hex": "#B87333", "imagen": ""},
    {"nombre_es": "Azul Añil", "nombre_en": "Indigo Blue", "hex": "#264653", "imagen": ""},
    {"nombre_es": "Terracota", "nombre_en": "Terracotta", "hex": "#C86A4E", "imagen": ""},
    {"nombre_es": "Blanco", "nombre_en": "White", "hex": "#EAE0D5", "imagen": ""},
]

def c(colors, img):
    return [dict(c, imagen=img) for c in colors]

# ====== Llaveros (3 models) ======
add("llavero-tlalchichi-sentado", "Llavero Tlalchichi Sentado", "Sitting Tlalchichi Keychain",
    "Llavero artesanal con figura de Tlalchichi sentado. Hecho a mano en barro de Colima.",
    "Handcrafted keychain with a sitting Tlalchichi figure. Made by hand in Colima clay.",
    "Los llaveros Tlalchichi mantienen viva la tradición milenaria de Colima en un formato portable.",
    "Tlalchichi keychains keep the millenary tradition of Colima alive in a portable format.",
    "Llaveros", "Keychains", 35, 2, 69, True,
    ["/img/productos/tlalchichi-sentado-miniatura-colima.png"], c(llavero_colors, "/img/productos/tlalchichi-sentado-miniatura-colima.png"))

add("llavero-tlalchichi-joven-viejo", "Llavero Tlalchichi Joven-Viejo", "Young-Old Tlalchichi Keychain",
    "Llavero de doble rostro que representa el ciclo de la vida. Pieza única de barro artesanal.",
    "Two-faced keychain representing the cycle of life. Unique handcrafted clay piece.",
    "La dualidad juventud-vejez es un concepto fundamental en la cosmovisión mesoamericana.",
    "The youth-old age duality is a fundamental concept in the Mesoamerican worldview.",
    "Llaveros", "Keychains", 35, 2, 42, True,
    ["/img/productos/tlalchichi-joven-viejo-colima.png"], c(llavero_colors, "/img/productos/tlalchichi-joven-viejo-colima.png"))

add("llavero-tlalchichi-parado", "Llavero Tlalchichi Parado", "Standing Tlalchichi Keychain",
    "Llavero con Tlalchichi de pie, guardian portatil. Artesanía tradicional de Colima.",
    "Keychain with standing guardian Tlalchichi. Traditional Colima craftsmanship.",
    "El Tlalchichi de pie era el guardián por excelencia, protector del hogar.",
    "The standing Tlalchichi was the ultimate guardian, protector of the home.",
    "Llaveros", "Keychains", 35, 2, 67, True,
    ["/img/productos/tlalchichi-parado-colima.png"], c(llavero_colors, "/img/productos/tlalchichi-parado-colima.png"))

# ====== Portamacetas (3 models) ======
add("portamaceta-tlalchichi-acostado", "Portamaceta Tlalchichi Acostado", "Lying Tlalchichi Planter",
    "Portamaceta artesanal con Tlalchichi en posición de descanso. Ideal para suculentas y cactus.",
    "Handcrafted planter with a resting Tlalchichi. Perfect for succulents and cacti.",
    "Los Tlalchichis acostados representan el descanso y la tranquilidad del espíritu.",
    "Lying Tlalchichis represent rest and tranquility of the spirit.",
    "Portamacetas", "Planters", 210, 11, 42, True,
    ["/img/productos/tlalchichi-acostado-colima.png"], c(porta_colors, "/img/productos/tlalchichi-acostado-colima.png"))

add("portamaceta-tlalchichi-acostado-mediano", "Portamaceta Tlalchichi Acostado Mediano", "Medium Lying Tlalchichi Planter",
    "Portamaceta tamaño mediano con Tlalchichi acostado. Perfecto para decorar cualquier espacio.",
    "Medium planter with a lying Tlalchichi. Perfect for decorating any space.",
    "Cada portamaceta Tlalchichi es única, tallada y pintada a mano en Colima.",
    "Each Tlalchichi planter is unique, hand-carved and hand-painted in Colima.",
    "Portamacetas", "Planters", 210, 11, 67, True,
    ["/img/productos/tlalchichi-acostado-mediano-colima.png"], c(porta_colors, "/img/productos/tlalchichi-acostado-mediano-colima.png"))

add("portamaceta-tlalchichi-sentado", "Portamaceta Tlalchichi Sentado", "Sitting Tlalchichi Planter",
    "Maceta decorativa con Tlalchichi sentado. Artesanía tradicional de barro de Colima.",
    "Decorative planter with a sitting Tlalchichi. Traditional Colima clay craftsmanship.",
    "La tradición de los Tlalchichis se remonta a las culturas prehispánicas del occidente de México.",
    "The tradition of Tlalchichis dates back to pre-Hispanic cultures of western Mexico.",
    "Portamacetas", "Planters", 210, 11, 69, False,
    ["/img/productos/tlalchichi-sentado-colima.png"], c(porta_colors, "/img/productos/tlalchichi-sentado-colima.png"))

# ====== Alcancías (3 models) ======
add("alcancia-tlalchichi-sentado", "Alcancía Tlalchichi Sentado", "Sitting Tlalchichi Piggy Bank",
    "Alcancía artesanal con forma de Tlalchichi sentado. Ahorra con estilo mexicano.",
    "Handcrafted piggy bank shaped like a sitting Tlalchichi. Save with Mexican style.",
    "Las alcancías Tlalchichi mantienen la tradición de ahorro con un toque cultural único.",
    "Tlalchichi piggy banks keep the savings tradition with a unique cultural touch.",
    "Alcancías", "Piggy Banks", 160, 9, 42, True,
    ["/img/productos/tlalchichi-sentado-colima.png"], c(alcancia_colors, "/img/productos/tlalchichi-sentado-colima.png"))

add("alcancia-tlalchichi-viejo-sentado", "Alcancía Tlalchichi Viejo Sentado", "Old Sitting Tlalchichi Piggy Bank",
    "Alcancía del Tlalchichi viejo sentado, símbolo de sabiduría y prosperidad. Barro artesanal de Colima.",
    "Old sitting Tlalchichi piggy bank, symbol of wisdom and prosperity. Handcrafted Colima clay.",
    "El Tlalchichi viejo simboliza la sabiduría de los ancestros y la protección del hogar.",
    "The old Tlalchichi symbolizes the wisdom of ancestors and protection of the home.",
    "Alcancías", "Piggy Banks", 160, 9, 69, True,
    ["/img/productos/tlalchichi-viejo-sentado-colima.png"], c(alcancia_colors, "/img/productos/tlalchichi-viejo-sentado-colima.png"))

add("alcancia-tlalchichi-mascara", "Alcancía Tlalchichi Máscara", "Mask Tlalchichi Piggy Bank",
    "Alcancía con Tlalchichi usando máscara tradicional. Inspirado en danzas folclóricas mexicanas.",
    "Piggy bank with Tlalchichi wearing a traditional mask. Inspired by Mexican folk dances.",
    "Las máscaras en la cultura mexicana tienen un profundo significado espiritual y ceremonial.",
    "Masks in Mexican culture have deep spiritual and ceremonial meaning.",
    "Alcancías", "Piggy Banks", 160, 9, 42, False,
    ["/img/productos/tlalchichi-mascara-colima.png"], c(alcancia_colors, "/img/productos/tlalchichi-mascara-colima.png"))

# ====== Cuencos (2 models) ======
add("cuenco-tlalchichi-mazorca", "Cuenco Tlalchichi Mazorca", "Corncob Tlalchichi Bowl",
    "Cuenco decorativo con Tlalchichi y mazorca. Símbolo de abundancia y prosperidad.",
    "Decorative bowl with Tlalchichi and corncob. Symbol of abundance and prosperity.",
    "El maíz es sagrado en la cultura mexicana. Este Tlalchichi representa la conexión con la tierra.",
    "Corn is sacred in Mexican culture. This Tlalchichi represents the connection with the earth.",
    "Cuencos", "Bowls", 210, 11, 67, True,
    ["/img/productos/tlalchichi-mazorca-colima.png"], c(cuenco_colors, "/img/productos/tlalchichi-mazorca-colima.png"))

add("cuenco-tlalchichi-viejo-color", "Cuenco Tlalchichi Viejo Edición Color", "Color Edition Old Tlalchichi Bowl",
    "Cuenco del Tlalchichi viejo en edición especial de color. Pieza decorativa única de Colima.",
    "Color edition old Tlalchichi bowl. Unique decorative piece from Colima.",
    "Cada cuenco Tlalchichi es una pieza única que combina funcionalidad y arte tradicional.",
    "Each Tlalchichi bowl is a unique piece combining functionality and traditional art.",
    "Cuencos", "Bowls", 210, 11, 42, False,
    ["/img/productos/tlalchichi-viejo-sentado-color-colima.png"], c(cuenco_colors, "/img/productos/tlalchichi-viejo-sentado-color-colima.png"))

# Write seed.json
output_path = pathlib.Path(__file__).parent / 'src' / 'lib' / 'seed.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(seed, f, ensure_ascii=False, indent=2)

print(f'Seed generado con {len(seed)} productos')
for p in seed:
    cat = p["categoria_es"]
    nom = p["nombre_es"]
    cols = len(p["colores"])
    print(f'  {cat} -> {nom} ({cols} colores)')
