import type { Tool } from "ai"

export const defaultToolsChat: Tool[] = [
  {
    type: "function",
    function: {
      name: "image_analysis",
      description:
        "Computer vision when asking about something in image and if 'fibo-attachment' is in the message. Analysis images, can be multiple images or one image. Must be used when 'fibo-attachment' is provided in current message or the previous message. Must be used when the questions is related to the image from previous message or the current message. User no need to say image to use this function.",
      parameters: {
        type: "object",
        properties: {
          image: {
            type: "string",
            description:
              "This can be multiple or single value, grab the file_id from current message and previous messages. separated by comma. for example: 'file_id1, file_id2, file_id3' or 'file_id1, file_id2' or 'file_id1'"
          }
        },
        required: ["image"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "ask_mathematics_question",
      description:
        "It can handle all type of mathematics questions. This function must be used whenever user ask about mathematics problem. This function will solve the math problem. It is using Wolfram Alpha API under the hood.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "the query to solve the math problem. Must be clear and specific what to solve. Only use 1 words and the equation must be clear and specific. Must be in english language."
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "google_search",
      description:
        "Get real time data or current information of anything from internet or find resources or google search. This can be used as resources of your answers. This function must be used when user want to get the real time data or current information from internet or google search.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "the query to search, this query will be used to search the related links from internet or google search."
          },
          lang: {
            type: "string",
            description:
              "the language (country code) to get the google search result. Only 2 characters. e.g. 'en', 'id', 'de', 'ru', etc."
          },
          dateRestrict: {
            type: "string",
            description:
              "the date to get the google search result. requests results from the specified number of past days/weeks/months/years. E.g. 'd1' for the past 1 day, 'w1' for the past 1 week, 'm1' for the past 1 month, 'y1' for the past 1 year. etc. Make the value empty string if you think the date is not important."
          }
        },
        required: ["query", "lang", "dateRestrict"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "youtube_videos",
      description:
        "Get videos from youtube based on the query. This function must be used when user want to get the videos from youtube or even just the link of the videos.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "the query to search, this query will be used to get the youtube videos that use YouTube API."
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_academic_research",
      description:
        "Get academic research based on the query. This function must be used when user want to get the academic research or just to make sure the information is valid and reliable.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "the query to search, this query will be used to get the academic research that use Semantic Scholar API."
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_website_information",
      description:
        "Get the website information based on the url. Scraping the website and get the information. Execute this whenever user provide the url of the website. e.g url with https://, http://, or www. or just the domain name with .com, .org, .net, etc.",
      parameters: {
        type: "object",
        properties: {
          url: {
            type: "string",
            description:
              "the url to get the website information. It will be used to scrape the website and get the information. Must start with https://"
          }
        },
        required: ["url"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_weather_information",
      description:
        "Get the weather information based on the location, if location is not provided, it will use the user's location. It is using open weather API under the hood.",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description:
              "the location to get the weather information, if location is not provided, it will use the user's location and location is an empty string e.g. ''."
          }
        },
        required: ["location"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_on_this_day",
      description:
        "Get today feature article, most read articles, daily feature image, today news, and on this day from wikipedia. It is using wikipedia API under the hood.",
      parameters: {}
    }
  },
  {
    type: "function",
    function: {
      name: "search_wikipedia",
      description:
        "Search the wikipedia content based on the query. This can be used as resources of your answers. It is using wikipedia API under the hood. Must be used for the explanation, description, definition, or summary.",
      parameters: {
        type: "object",
        properties: {
          lang: {
            type: "string",
            description:
              "the language to get the wikipedia content. Must be one of the language code. e.g. 'en', 'id', 'de', 'ru', etc."
          },
          query: {
            type: "string",
            description:
              "the query to get the explanation, description, or definition. Must be clear and specific what to get. Must only 1-4 words. Always in english language."
          }
        },
        required: ["lang", "query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_flashcards",
      description:
        "Create flashcards based on the query. This function must be used when user want to create or generate flashcards or want some flashcards. Always work in Anki format.",
      parameters: {
        type: "object",
        properties: {
          context: {
            type: "string",
            description:
              "the full context to create flashcards. Must be descriptive, detailed, and clear to get the best result. The context must be specific for the flashcards."
          }
        },
        required: ["context"]
      }
    }
  }
]

export const listToolsChat: Tool[] = [
  {
    type: "function",
    function: {
      name: "create_image",
      description:
        "Create or generate image using DALL-E 3 from OpenAI. This function must be used when user want to create or generate image or want some illustration.",
      parameters: {
        type: "object",
        properties: {
          prompt: {
            type: "string",
            description:
              "the prompt to generate image, must be descriptive, detailed, and clear to get the best result. The prompt must be specific for DALL-E 3."
          },
          size: {
            type: "string",
            description:
              "Size of the generated image. Must be one of 1024x1024, 1792x1024, or 1024x1792. Depend on the style and prompt for the best result."
          }
        },
        required: ["text", "size"]
      }
    }
  }
]
