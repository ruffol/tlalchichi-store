import json

with open('src/lib/seed.json','r') as f:
    data = json.load(f)

details = {
    'llavero-acostado': {
        'desc_es': 'Reproducción fiel a escala de un Tlalchichi en posición de descanso, esculpido en barro tradicional de Colima. Pieza artesanal que captura la serenidad del perro cebollo mesoamericano.',
        'desc_en': 'Faithful scale reproduction of a resting Tlalchichi, sculpted in traditional Colima clay. An artisan piece capturing the serenity of the Mesoamerican hairless dog.',
        'hist_es': 'Representa el descanso y la protección del hogar. Los Tlalchichis acostados se colocaban en las entradas de las viviendas como guardianes espirituales. Según la tradición, su postura vigilante pero tranquila ahuyentaba las malas energías mientras el dueño dormía.',
        'hist_en': 'Represents rest and home protection. Resting Tlalchichis were placed at home entrances as spiritual guardians. According to tradition, their vigilant but calm posture warded off bad energies while the owner slept.'
    },
    'llavero-joven_viejo': {
        'desc_es': 'Reproducción detallada de la figura dual Tlalchichi que representa el ciclo de la vida, con rasgos juveniles y maduros en una misma pieza. Hecha a mano en barro natural de Colima.',
        'desc_en': 'Detailed reproduction of the dual Tlalchichi figure representing the cycle of life, featuring both youthful and mature features in a single piece. Handmade in natural Colima clay.',
        'hist_es': 'Simboliza la dualidad de la vida y la muerte, concepto central en la cosmovisión mesoamericana. Esta figura muestra dos caras en un mismo cuerpo: una joven y una vieja, representando que la vida y la muerte son parte de un mismo ciclo inseparable.',
        'hist_en': 'Symbolizes the duality of life and death, a central concept in the Mesoamerican worldview. This figure shows two faces in one body: one young and one old, representing that life and death are part of the same inseparable cycle.'
    },
    'llavero-mascara_danza': {
        'desc_es': 'Reproducción artesanal de un Tlalchichi danzante con máscara ceremonial, tallado en barro tradicional de Colima. Captura el movimiento y la espiritualidad de las danzas prehispánicas.',
        'desc_en': 'Artisan reproduction of a dancing Tlalchichi wearing a ceremonial mask, carved in traditional Colima clay. Captures the movement and spirituality of pre-Hispanic dances.',
        'hist_es': 'Las figuras danzantes con máscara representaban a los chamanes que guiaban las ceremonias religiosas. El perro Tlalchichi, al ser considerado un guía espiritual, se fusionaba con la figura del chamán danzante para conectar el mundo terrenal con el inframundo.',
        'hist_en': 'Masked dancing figures represented the shamans who led religious ceremonies. The Tlalchichi dog, being considered a spiritual guide, merged with the dancing shaman figure to connect the earthly world with the underworld.'
    },
    'llavero-parado': {
        'desc_es': 'Reproducción fiel de un Tlalchichi en posición erguida, esculpido en barro tradicional de Colima. Representa la vigilancia y la conexión espiritual en la tradición mesoamericana.',
        'desc_en': 'Faithful reproduction of a standing Tlalchichi, sculpted in traditional Colima clay. Represents vigilance and spiritual connection in the Mesoamerican tradition.',
        'hist_es': 'La postura erguida del Tlalchichi simboliza la alerta y la conexión con lo divino. Estas figuras se colocaban en tumbas de tiro como guardianes del alma, asegurando que el espíritu del difunto encontrara su camino hacia el Mictlán.',
        'hist_en': 'The standing posture of the Tlalchichi symbolizes alertness and connection with the divine. These figures were placed in shaft tombs as soul guardians, ensuring the spirit of the deceased found its way to Mictlán.'
    },
    'llavero-sentado': {
        'desc_es': 'Reproducción artesanal de un Tlalchichi en posición sedente, elaborado en barro natural de Colima. Pieza que evoca la majestuosidad de las esculturas ceremoniales mesoamericanas.',
        'desc_en': 'Artisan reproduction of a seated Tlalchichi, made from natural Colima clay. A piece evoking the majesty of Mesoamerican ceremonial sculptures.',
        'hist_es': 'La postura sedente del Tlalchichi representa la contemplación y la sabiduría. En las culturas prehispánicas de Colima, estas figuras se utilizaban en altares domésticos para meditar y conectar con los ancestros.',
        'hist_en': 'The seated posture of the Tlalchichi represents contemplation and wisdom. In the pre-Hispanic cultures of Colima, these figures were used on domestic altars for meditation and connecting with ancestors.'
    },
    'llavero-viejo_sentado': {
        'desc_es': 'Reproducción detallada de un Tlalchichi anciano sentado, esculpido en barro tradicional de Colima. Refleja la experiencia y la veneración por los mayores en la cultura mesoamericana.',
        'desc_en': 'Detailed reproduction of a seated elderly Tlalchichi, sculpted in traditional Colima clay. Reflects the experience and veneration of elders in Mesoamerican culture.',
        'hist_es': 'El Tlalchichi anciano representa la sabiduría acumulada y el respeto por los mayores. En la tradición de Colima, estas figuras se enterraban con personas de edad avanzada para que sirvieran como compañeros en el más allá, guiándolos con su experiencia espiritual.',
        'hist_en': 'The elderly Tlalchichi represents accumulated wisdom and respect for elders. In the Colima tradition, these figures were buried with elderly people to serve as companions in the afterlife, guiding them with their spiritual experience.'
    }
}

updated = 0
for p in data:
    if p.get('categoria_es') == 'Llaveros' and p['slug'] in details:
        d = details[p['slug']]
        p['descripcion_es'] = d['desc_es']
        p['descripcion_en'] = d['desc_en']
        p['historia_es'] = d['hist_es']
        p['historia_en'] = d['hist_en']
        print(f'  {p["nombre_es"]}')
        updated += 1

print(f'Updated: {updated} llaveros')
with open('src/lib/seed.json','w') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
