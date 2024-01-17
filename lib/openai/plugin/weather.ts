const fetchWeather = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Error searching weather: ${response.statusText}`)
  }
  return await response.json()
}

export const weatherPlugin = async (location: string) => {
  try {
    let url = ""

    if (location !== "") {
      // sanitize location, eliminate space, and convert to lowercase
      location = location.trim().toLowerCase()
      url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    } else {
      const response = await fetch(
        "https://www.fibonacciku.com/api/info/location"
      )
      if (!response.ok) {
        throw new Error(`Error searching weather: ${response.statusText}`)
      }
      const { location } = await response.json()
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    }

    return await fetchWeather(url)
  } catch (error) {
    return {
      message: "Sorry but I can't find the weather for that location."
    }
  }
}
