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
              "the mathematics question to solve, must be clear and specific what to solve and what is the questions. Must have prefix 'solve' at first and query must always in english language."
          }
        },
        required: ["query"]
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_links_or_videos_or_academic_research",
      description:
        "Get real time data or current information from internet, google search, youtube videos, or academic research. This function must be used when user want links, videos, or academic research. User can ask multiple questions.",
      parameters: {
        type: "object",
        properties: {
          type: {
            type: "string",
            description:
              "This can be multiple value. Multiple if user ask more than one. for example: 'google, youtube, academic' or 'google, youtube' or 'google, academic' or 'youtube, academic' or 'google' or 'youtube' or 'academic'"
          },
          query: {
            type: "string",
            description:
              "the query to search, this query will be used to search the related links from internet or google search. This can also be used to get the youtube videos that use YouTube API or academic research that use Semantic Scholar API"
          }
        },
        required: ["type", "query"]
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
