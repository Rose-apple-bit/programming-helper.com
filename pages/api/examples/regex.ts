// This is an example of to protect an API route
import { getSession } from "next-auth/react"
import type { NextApiRequest, NextApiResponse } from "next"
import rateLimit from "../../../utils/rate-limit"
import { env } from "process"
import { MongoClient } from "mongodb"

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
}
const client = new MongoClient(process.env.MONGO_URI!)

interface Userpromt {
  input: string
  output: string
  createdAt: string
}

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 users per second
})

const { Configuration, OpenAIApi } = require("openai")

export default async (req: NextApiRequest, res: NextApiResponse) => {
  await limiter.check(res, 20, "CACHE_TOKEN") // 20 requests per minute

  let configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
  let openai = new OpenAIApi(configuration)

  const session = await getSession({ req })

  //console.log(req.body)
  //console.log(req.body.textup)
  //console.log(req.body.selectedOption.value)

  console.log(session)

  console.log("content length", req.body.textup.length)
  if (req.body.textup.length > 1000) {
    res.status(400).json({
      message: "Please under 1000 chars",
    })
    return
  }

  if (session) {
    const { user } = session

    openai
      .createCompletion({
        model: "content-filter-alpha",
        prompt: "<|endoftext|>" + req.body.textup + "\n--\nLabel:",
        temperature: 0,
        max_tokens: 1,
        top_p: 0,
        logprobs: 10,
      })
      .then(function (response: any) {
        console.log("content-filter score:", response.data.choices[0].text)
        if (response.data.choices[0].text === "0") {
          console.log("safe contnet")

          console.log("usermail:", user?.email)

          configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY_CODEX,
          })
          openai = new OpenAIApi(configuration)

          openai
            .createCompletion({
              model: "code-davinci-002",
              prompt:
                "Regex in " +
                req.body.selectedOption.value +
                " that implements: " +
                req.body.textup +
                "\n\n Regex:",

              temperature: 0.2,
              max_tokens: 250,
              top_p: 1,
              frequency_penalty: 0.2,
              presence_penalty: 0,
              user: user?.email,
            })
            .then(async (response: any) => {
              console.log(response.data.choices[0].text)
              //res.status(200).json(response.data)
              console.log("Response:", response.data.choices[0])
              try {
                res.status(200).json({ data: response.data.choices[0].text })
              } catch (err) {
                console.log(err)
              }
            })
            .catch((error: any) => {
              console.log(error)
              res.status(500).json(error.message)
            })
        } else {
          res.status(400).json({
            message: "Please under 1000 chars",
          })
        }
      })
  } else {
    res.send({
      error:
        "You must be signed in to view the protected content on this page.",
    })
  }
}
