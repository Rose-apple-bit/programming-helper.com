import Link from "next/link"
import { IPost } from "../src/Models/Post"
import { useEffect, useState } from "react"
import Header from "../src/components/Header"
import { SpeakerphoneIcon, XIcon } from "@heroicons/react/outline"
// @ts-ignore
import AdSense from "react-adsense"

export default function Usuarios() {
  const [posts, setPosts] = useState<IPost[]>([])
  useEffect(() => {
    const asyncGetPosts = async () => {
      const { origin } = window.location
      const data = await fetch(origin + "/api/posts")
      const posts = await data.json()
      return posts
    }
    if (window) {
      asyncGetPosts()
        .then((posts) => {
          setPosts(posts)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [])

  const mappedPosts = posts.reverse().map((post, i) => (
    <>
      {post.content.length > 200 ? (
        <></>
      ) : (
        <div className="card m-2  border border-gray-400 rounded-lg hover:shadow-md hover:border-opacity-0 transform hover:-translate-y-1 transition-all duration-200 ">
          <div className="m-3 overflow-hidden">
            <h2 className="text-lg mb-2">
              {" "}
              {post.title}
              <span className="text-sm text-blue-800 font-mono bg-blue-200 inline rounded-full px-2 align-top float-right animate-pulse">
                {post.feature ? post.feature : "Generation"}
              </span>
            </h2>
            <span className="rounded-md bg-indigo-50 p-2 font-light font-mono text-sm text-gray-700 hover:text-gray-900 transition-all duration-200 ">
              {post.content}
            </span>
            {/* 
             <span>{post.date}</span>
        */}
          </div>
        </div>
      )}

      {i % 25 === 0 && i != 0 ? (
        <AdSense.Google
          client="ca-pub-8251732556629149"
          slot="7213960558"
          style={{ margin: "10px" }}
          layout="display"
        />
      ) : (
        <></>
      )}
    </>
  ))

  return (
    <>
      <div className="pb-12">
        <div className="lg:text-center px-4 pb-4">
          <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">
            More from others
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Get some ideas how others used this recently.
          </p>
        </div>

        <div className=" mt-4 mx-auto px-6 2xl:w-1/2">
          <div className=" grid grid-cols-1 sm:grid-cols-2 ">{mappedPosts}</div>
        </div>
      </div>

      <div className="flex justify-center py-4 text-slate-400 space-x-3">
        <a
          className="hover:text-slate-600"
          href="https://homepage-appsplosion.herokuapp.com/privacypolicy"
        >
          Contact
        </a>
        <a
          className="hover:text-slate-600"
          href="https://homepage-appsplosion.herokuapp.com/privacypolicy"
        >
          Privacy Policy
        </a>
        <a
          className="hover:text-slate-600"
          href="https://github.com/ezzcodeezzlife/programming-helper.com"
        >
          GitHub
        </a>
      </div>
    </>
  )
}
