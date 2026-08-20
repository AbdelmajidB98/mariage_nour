const lineArtAssets = {
  signature: {
    src: '/media/programme-signature-art.png',
    alt: 'Une main signe élégamment le contrat de mariage',
    width: 1536,
    height: 1024,
  },
  dance: {
    src: '/media/programme-dance-art.png',
    alt: 'Les mariés dansent enlacés',
    width: 1086,
    height: 1448,
  },
  rings: {
    src: '/media/programme-rings-art.png',
    alt: 'Deux alliances entrelacées',
    width: 1536,
    height: 1024,
  },
} as const

type LineArtType = keyof typeof lineArtAssets

export function LineArt({ type }: { type: LineArtType }) {
  const artwork = lineArtAssets[type]

  return (
    <img
      className={`line-art line-art--${type}`}
      src={artwork.src}
      alt={artwork.alt}
      width={artwork.width}
      height={artwork.height}
      loading="lazy"
      decoding="async"
    />
  )
}
