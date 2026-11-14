// Edita este archivo para personalizar el regalo.
// Las fotos van en public/photos/ y se enlazan así: imagen: '/photos/01.jpg'
// Deja imagen: '' (o hero: '') si todavía no tienes esa foto.

export const story = {
  eyebrow: 'Película',
  title: 'Mi lugar favorito\nsiempre serás tú',
  match: '100% Para ti',
  since: '13 NOV 2026',
  tagline: 'Renegón y renegona, un romance que nunca termina.',
  synopsis:
    'De todas las historias que pude empezar, la única que quiero volver a ver eres tú. Desde entonces cada día tiene algo de película: por tu forma de mirar, de reír y de hacer que todo parezca posible. Esto no es un final. Es el detalle en el que una persona llena de pronto la vida de la otra.',
  closingLine:
    'Sabes amor que si te vas de mi vida, mi mundo se acaba.',
  hero: '',
  rowTitle: 'Nuestros mejores momentos',
  moments: [
    {
      id: 'conocimos',
      titulo: 'El día que nos conocimos',
      texto:
        'Había ruido en todas partes y, aun así, te escuché. Ese día empezó esta película.',
      imagen: '/photos/primer-dia.jpg',
    },
    {
      id: 'cita',
      titulo: 'La primera cita',
      texto:
        'Nervios, una mesa pequeña y la certeza de que quería quedarme un rato más. No hizo falta un plan perfecto.',
      imagen: '/photos/primera-cita.jpg',
    },
    {
      id: 'domingo',
      titulo: 'Un domingo cualquiera',
      texto:
        'Nada extraordinario, y por eso fue perfecto: tu risa, el café y el tiempo que no queríamos que acabara.',
      imagen: '/photos/domingo.jpg',
    },
    {
      id: 'viaje',
      titulo: 'El viaje',
      texto:
        'Un mapa doblado, una foto torcida y la prueba de que contigo cualquier lugar se siente casa.',
      imagen: '/photos/viaje.jpg',
    },
    // {
    //   id: 'promesa',
    //   titulo: 'La promesa',
    //   texto:
    //     'No hizo falta un escenario. Bastó mirarte y decir, en voz baja, que me quedo.',
    //   imagen: '',
    // },
    {
      id: 'hoy',
      titulo: 'Hoy, contigo',
      texto:
        'Esta escena todavía se está rodando. Y, de todas, es mi favorita.',
      imagen: '/photos/hoy.jpg',
    },
  ],
}
