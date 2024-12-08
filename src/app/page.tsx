'use client'

import { useState } from 'react'

export default function TweetGenerator() {
  const [topic, setTopic] = useState('')
  const [tweet, setTweet] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      setIsLoading(true)
      setError('')
      try {
        const response = await fetch('/api/tweet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ topic }),
        })
        const data = await response.json()
        if (response.ok) {
          setTweet((data as { message: string }).message)
        } else {
          throw new Error((data as { error: string }).error || 'Failed to generate tweet')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg overflow-hidden border border-gray-700">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-center text-orange-500 mb-6 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            Hot Tweet Generator
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Enter a fiery topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-4 py-2 rounded-full bg-gray-700 text-white border-2 border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 outline-none transition duration-300"
            />
            <button 
              type="submit" 
              className={`w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Igniting...
                </span>
              ) : (
                'Generate Hot Tweet 🔥'
              )}
            </button>
          </form>
        </div>
        {(tweet || error) && (
          <div className="p-6 bg-gray-700 border-t border-gray-600">
            {tweet ? (
              <div>
                <div className="flex items-center mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  <span className="font-bold text-orange-500">Sizzling Tweet:</span>
                </div>
                <p className="text-gray-300 italic">{tweet}</p>
              </div>
            ) : (
              <p className="text-red-500 font-semibold">{error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

