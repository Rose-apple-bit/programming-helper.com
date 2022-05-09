import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Layout from "../components/layout"
import AccessDenied from "../components/access-denied"
import { NextScript } from "next/document"
import Select from "react-select"
import { NextSeo } from "next-seo"
import Head from "next/head"
import { signIn, signOut } from "next-auth/react"
import Script from "next/script"

export default function translate() {
  const { data: session, status } = useSession()
  const loading = status === "loading"
  const [content, setContent] = useState("")
  const [textup, setTextup] = useState("")
  const [selectedOption, setSelectedOption] = useState()
  const [requestloading, setRequestloading] = useState(false)
  const [count, setCount] = useState(0)

  // Fetch content from protected route
  const fetchData = async () => {
    const res = await fetch("/api/examples/regexexp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ textup: textup, selectedOption: selectedOption }),
    })
      .then(
        (response) => response.json(),

        (error) => console.log("An error occurred.", error)
      )
      .then((res) => setContent(res.data.trim()))
      .catch((err) => {
        setContent(
          "Max 1000 characters. Please dont Spam requests. No Adult Content. Try again in a few seconds."
        )
        console.log(err)
      })
      .finally(() => setRequestloading(false))
  }

  const buttonPress = () => {
    if (textup === "") {
      alert("Please enter some code")
      return
    }

    setRequestloading(true)
    console.log("button pressed", textup)
    fetchData()
  }

  const copyToClip = () => {
    navigator.clipboard.writeText(content)
  }

  const buttonPressLogin = () => {
    signIn()
  }

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption)
    console.log(`Option selected:`, selectedOption)
  }

  // When rendering client side don't display anything until loading is complete
  if (typeof window !== "undefined" && loading) return null

  // If no session exists, display access denied message
  if (!session) {
    return (
      <Layout>
        <Head>
          <title>Regex to explanation</title>
          <meta name="description" content="Fix invalid Code" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="robots" content="INDEX" />
          <meta name="robots" content="FOLLOW" />
          <meta property="og:type" content="article" />

          <meta property="og:title" content="TITLE OF YOUR POST OR PAGE" />

          <meta
            property="og:description"
            content="DESCRIPTION OF PAGE CONTENT"
          />

          <meta property="og:url" content="PERMALINK" />

          <meta property="og:site_name" content="SITE NAME" />
        </Head>

        <h1>Regex to explanation:</h1>

        <p>
          <textarea
            value={textup}
            placeholder=" /^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4})$/i;"
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault()
                // add tab to content
                setTextup(textup + "\t")
              }
            }}
            onChange={(e) => {
              setTextup(e.target.value)
              setCount(e.target.value.length)
            }}
          ></textarea>

          {count > 1000 ? (
            <p id="counter">Too much! +{count - 1000}</p>
          ) : (
            <p id="counter">{count}</p>
          )}
          <button onClick={buttonPressLogin}>
            Sign in to use Regex to explanation
          </button>
          {requestloading ? <p>Loading...</p> : <></>}

          <textarea
            placeholder="The Regex is used to match an email address. The email address must start with a lowercase letter or a number, followed by one or more characters (including periods, underscores, and/or hyphens), followed by an @ symbol, followed by one or more lowercase letters or numbers (again, including periods, underscores, and/or hyphens), followed by a period, followed by two to four lowercase letters. The i at the end makes the match case-insensitive."
            value={content}
          ></textarea>
          <button style={{ backgroundColor: "grey" }} onClick={copyToClip}>
            Copy to Clipboard
          </button>
        </p>
        <span>AI Service - Results may vary</span>
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <>
      <Head>
        <title>Regex to explanation</title>
        <meta name="description" content="Generate function from description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="INDEX" />
        <meta name="robots" content="FOLLOW" />
        <meta property="og:type" content="article" />

        <meta property="og:title" content="TITLE OF YOUR POST OR PAGE" />

        <meta property="og:description" content="DESCRIPTION OF PAGE CONTENT" />

        <meta property="og:url" content="PERMALINK" />

        <meta property="og:site_name" content="SITE NAME" />
      </Head>
      <NextSeo
        title="Generate function from description"
        description="Generate function from description"
        canonical="https://aiservice.vercel.app/generate-function"
        openGraph={{
          title: "Generate function from description",
          description: "Generate function from description",
          url: "https://aiservice.vercel.app/generate-function",
          site_name: "Generate function from description",
        }}
      />

      <Layout>
        <h1>Regex to explanation:</h1>

        <p>
          <textarea
            value={textup}
            placeholder=" /^([a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4})$/i;"
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault()
                // add tab to content
                setTextup(textup + "\t")
              }
            }}
            onChange={(e) => {
              setTextup(e.target.value)
              setCount(e.target.value.length)
            }}
          ></textarea>

          {count > 1000 ? (
            <p id="counter">Too much! +{count - 1000}</p>
          ) : (
            <p id="counter">{count}</p>
          )}
          <button onClick={buttonPress}>Get Regex explanation</button>
          {requestloading ? <p>Loading...</p> : <></>}

          <textarea
            placeholder="The Regex is used to match an email address. The email address must start with a lowercase letter or a number, followed by one or more characters (including periods, underscores, and/or hyphens), followed by an @ symbol, followed by one or more lowercase letters or numbers (again, including periods, underscores, and/or hyphens), followed by a period, followed by two to four lowercase letters. The i at the end makes the match case-insensitive."
            value={content}
          ></textarea>
          <button style={{ backgroundColor: "grey" }} onClick={copyToClip}>
            Copy to Clipboard
          </button>
        </p>
        <span>AI Service - Results may vary</span>

        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-8251732556629149"
          data-ad-slot="5616933772"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
      </Layout>
    </>
  )
}