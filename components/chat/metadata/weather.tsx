import { memo } from "react"
import {
  IconCloud,
  IconCloudFog,
  IconCloudRain,
  IconCloudStar,
  IconCloudStorm,
  IconDropletHalf2Filled,
  IconMist,
  IconMoon,
  IconSnowflake,
  IconSun,
  IconWind
} from "@tabler/icons-react"

import type { Weather } from "@/types/types"
import { useScopedI18n } from "@/locales/client"

type Props = {
  metadata: Weather[]
}

function ChatMetadataWeather({ metadata }: Props) {
  const t = useScopedI18n("MetadataChat")

  return (
    <div className="flex flex-col justify-start gap-2">
      <div className="flex flex-row items-center gap-1">
        <IconWind className="h-5 w-5" />
        <span className="font-medium">{t("weather")}:</span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {metadata.map((weather, index) => {
          const dataWeather = weather.weather[0]
          return (
            <div key={index} className="group rounded-xl border p-2 shadow">
              <div className="flex h-full w-full flex-col items-start justify-between gap-3">
                <div className="flex w-full flex-wrap items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <p
                      className="line-clamp-2 whitespace-pre-wrap break-words text-sm font-medium"
                      title={weather.name}
                    >
                      {weather.name}
                    </p>

                    <p className="whitespace-pre-wrap break-words text-xs text-muted-foreground first-letter:uppercase">
                      {weather.coord.lat}, {weather.coord.lon}
                    </p>
                  </div>
                  <p className="text-xs sm:text-sm">
                    {weather.main.temp}°C / {weather.main.feels_like}°C
                  </p>
                </div>

                <div className="flex w-full flex-row justify-between gap-2">
                  <WeatherIcon icon={dataWeather.icon} />
                  <div className="flex flex-col items-start gap-1 sm:items-end">
                    <p className="whitespace-pre-wrap break-words text-sm">
                      {t(
                        dataWeather.description
                          .toLowerCase()
                          .replace(" ", "-") as never
                      )}
                    </p>
                    <p className="whitespace-pre-wrap break-words text-xs text-muted-foreground">
                      {t(
                        dataWeather.main
                          .toLowerCase()
                          .replace(" ", "-") as never
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function WeatherIcon({ icon }: { icon: string }) {
  switch (icon) {
    case "01d":
      return <IconSun className="h-8 w-8" />
    case "01n":
      return <IconMoon className="h-8 w-8" />
    case "02d":
    case "02n":
      return <IconCloudStar className="h-8 w-8" />
    case "03d":
    case "03n":
      return <IconCloud className="h-8 w-8" />
    case "04d":
    case "04n":
      return <IconCloudFog className="h-8 w-8" />
    case "09d":
    case "09n":
      return <IconCloudRain className="h-8 w-8" />
    case "10d":
    case "10n":
      return <IconDropletHalf2Filled className="h-8 w-8" />
    case "11d":
    case "11n":
      return <IconCloudStorm className="h-8 w-8" />
    case "13d":
    case "13n":
      return <IconSnowflake className="h-8 w-8" />
    case "50d":
    case "50n":
      return <IconMist className="h-8 w-8" />
    default:
      return <IconWind className="h-8 w-8" />
  }
}

export default memo(ChatMetadataWeather)
