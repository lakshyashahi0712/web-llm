import { useEffect, useState } from 'react'
import * as webllm from "@mlc-ai/web-llm";
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [input,setInput] = useState("");

  const [messages, setMessages] = useState([{
    role: "system",
    content: "Hello , how can I help you?"
  }
  ])

  const [engine,setEngine] = useState(null);
  useEffect(()=>{
    const selectedModel = "gemma-2-2b-it-q4f32_1-MLC";
    webllm.CreateMLCEngine(selectedModel,{
      initProgressCallback:(initProgress)=>{
        console.log("initProgress",initProgress)
      }
    }).then(engine=>{
      setEngine(engine)
    })
  },[]);

  async function sendMessageToLlm(){
    const tempMessages = [...messages]
    tempMessages.push({
      role:"user",
      content: input
    })
    setMessages(tempMessages)
    setInput("")

   engine.chat.completions.create({
      messages:tempMessages,
    }).then((reply)=>{
      const text = reply.choices[0].message.content
      
      setMessages([...tempMessages,{
        role:"assistant",
        content: text

      }])
    })

    //console.log("reply", reply);

    // const text = reply.choices[0].message.content

    // tempMessages.push({
    //   role:"assistant",
    //   content: text
    // })
    // setMessages(tempMessages)

  }

  return (
    <main>
      <section className='w-full h-screen'>
        <div className="conversation-area h-full w-full flex flex-col items-center relative">
          <div className="messages h-full w-[70%] flex flex-col gap-[0.1em] p-[0.5em] bg-gray-600">
            {
              messages.filter(message=>message.role!=="system").map((message, index) => {
                return (
                  <div
                    className={`message w-fit p-[0.5em] px-[1em] rounded-lg max-w-[75%] ${message.role === 'user'
                        ? 'bg-blue-600 text-white self-end'
                        : 'bg-gray-200 text-black self-start'
                      }`}
                    key={index}
                  >
                    {message.content}
                  </div>
                )
              })
            }
          </div>

          <div className="input-area w-[70%] absolute bg-amber-950 bottom-8 rounded-lg">
            <input
            onChange={(e)=>{
              setInput(e.target.value)
            }}
            value={input}
            onKeyDown={(e)=>{
              if(e.key === "Enter"){
                sendMessageToLlm()
              }
            }}
             className='w-[80%] p-[0.5em] px-[0.7em] outline-none rounded-lg bg-transparent border-none text-shadow-white' type='text' placeholder='Message LLm' />
            <button
            onClick={()=>{
              sendMessageToLlm()
            }}
            className='border-none bg-gray-400 rounded-lg cursor-pointer w-[20%] text-black'>Send</button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default App
