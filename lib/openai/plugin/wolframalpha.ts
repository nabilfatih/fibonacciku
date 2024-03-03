import { generateNanoID } from "@/lib/utils"

export const AppId = process.env.WOLFRAMALPHA_APP_ID as string

type XMLData = {
  [key: string]: string
}

export const extractDataFromXML = (xml: string): XMLData => {
  const regexPatterns = {
    results:
      /<pod title='Results'[^>]*>[\s\S]*?<subpod title='Possible intermediate steps'>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    scientificNotation:
      /<pod title='Scientific notation'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    numberName:
      /<pod title='Number name'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    numberLength:
      /<pod title='Number length'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    comparisons:
      /<pod title='Comparisons'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    realSolution:
      /<pod title='Real solution'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    solution:
      /<pod title='Solution'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    derivative:
      /<pod title='Derivative'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    geometricFigure:
      /<pod title='Geometric figure'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    expandedForm:
      /<pod title='Expanded form'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    alternateForm:
      /<pod title='Alternate forms'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    polynomialDiscriminant:
      /<pod title='Polynomial discriminant'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    indefiniteIntegral:
      /<pod title='Indefinite integral'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    definiteIntegral:
      /<pod title='Definite integral'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    expandedFormOfIntegral:
      /<pod title='Expanded form of the integral'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    alternateFormOfIntegral:
      /<pod title='Alternate forms of the integral'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    globalMinimum:
      /<pod title='Global minimum'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    globalMaximum:
      /<pod title='Global maximum'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    pAdicExpansion:
      /<pod title='p-adic expansion'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/,
    expansionOverFiniteField:
      /<pod title='Expansion over finite field'[^>]*>[\s\S]*?<subpod title=''>[\s\S]*?<plaintext>([^<]*)<\/plaintext>/
  }

  return Object.entries(regexPatterns).reduce((data, [key, regex]) => {
    const match = xml.match(regex)
    data[key] = match ? match[1].trim() : ""
    return data
  }, {} as XMLData)
}

export const wolframalphaPlugin = async (query: string) => {
  // replace + with %2B and space with %20
  query = query.replace(/\+/g, "%2B").replace(/\s/g, "%20")
  try {
    const response = await fetch(
      `https://www.fibonacciku.com/api/ai/plugin/wolframalpha`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ query })
      }
    )
    if (!response.ok) {
      throw new Error(`Error searching WolframAlpha: ${response.statusText}`)
    }
    const data = await response.json()

    console.log("WolframAlpha Data: ", data)

    const finalData = {
      id: generateNanoID(5),
      ...data
    }

    return {
      message:
        "Must show complete steps for the solution! Do not give direct answer!",
      results: [finalData]
    }
  } catch (error) {
    console.log("WolframAlpha Error: ", error)
    return {
      message: "Quota exceeded for searching WolframAlpha",
      results: []
    }
  }
}
