export default function MarketingFooterArt() {
  return (
    <div className="mt-10 bg-muted-foreground pb-24">
      {Array.from({ length: 23 }).map((_, i) => (
        <div
          key={i}
          className="bg-muted"
          style={{
            marginTop: `${0 + i}px`,
            height: `${23 - i}px`
          }}
        />
      ))}
    </div>
  )
}
