export default function MarketingFooterArt() {
  return (
    <div className="mt-24 bg-card-foreground pb-28">
      {Array.from({ length: 23 }).map((_, i) => (
        <div
          key={i}
          className="bg-card"
          style={{
            marginTop: `${0 + i}px`,
            height: `${23 - i}px`
          }}
        />
      ))}
    </div>
  )
}
