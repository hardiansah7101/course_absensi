export const listHello = [
    'Bagaimana kabarmu hari ini?',
    'Kamu harus tetap semangat ya!',
]

export const randomHello = () => listHello[Math.floor(Math.random() * listHello.length)];