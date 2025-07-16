import React from 'react'

const ChapterContent = ({ chapter, basicInfo }) => {
  console.log('ChapterContent received:', { chapter, basicInfo });

  // If we don't have detailed chapter content, show basic info
  if (!chapter && !basicInfo) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <p className="text-gray-500 text-xl">Select a chapter to view its content</p>
      </div>
    );
  }

  const content = chapter?.content;
  const chapterName = basicInfo?.chapterName || content?.title || "Chapter";
  const chapterDescription = content?.description || basicInfo?.description || "";  
  const duration = basicInfo?.duration || "";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        {/* Chapter Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex flex-row justify-between items-center gap-4 flex-1">
              <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-0">
                {chapterName}
              </h1>
              {duration && (
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-full text-sm font-medium shadow-sm">
                  ⏱️ {duration}
                </span>
              )}
            </div>
          </div>
          {chapterDescription && (
            <div className="prose prose-lg max-w-none mt-2">
              <p className="text-gray-700 text-lg leading-8 font-light">
                {chapterDescription}
              </p>
            </div>
          )}
        </div>
        {chapter?.videoId && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-lg">
                <span className="text-red-600 text-xl">📹</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Video Lesson</h2>
            </div>
            <div className="aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${chapter.videoId}`}
                title="Chapter Video"
                frameBorder="0"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}

        {/* Content Topics - Handle array structure */}
        {content && Array.isArray(content) && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Learning Topics</h2>
            </div>

            {content.map((topic, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-300 to-green-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                        {topic.title}
                      </h3>
                      <div className="prose prose-lg max-w-none mb-6">
                        <p className="text-gray-700 leading-8 font-light">
                          {topic.description}
                        </p>
                      </div>

                      {/* Code Example with IDE-style design */}
                      {(topic.codeExample || topic.code_example) && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-lg">
                              <span className="text-green-400 text-sm">💻</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">Code Example</h4>
                          </div>
                          <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
                            {/* IDE-style header */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                              <div className="flex gap-1.5">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              </div>
                              <span className="text-gray-400 text-sm ml-2 font-mono">example.js</span>
                            </div>
                            {/* Code content */}
                            <div className="p-6 overflow-x-auto">
                              <pre className="text-green-400 font-mono text-sm leading-6 whitespace-pre-wrap">
                                {topic.codeExample || topic.code_example}
                              </pre>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fallback for topics structure (legacy) */}
        {content?.topics && Array.isArray(content.topics) && (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
                <span className="text-blue-600 text-xl">📚</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Learning Topics</h2>
            </div>

            {content.topics.map((topic, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-200">
                <div className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-green-300 to-green-500 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">
                        {topic.title}
                      </h3>
                      <div className="prose prose-lg max-w-none mb-6">
                        <p className="text-gray-700 leading-8 font-light">
                          {topic.description}
                        </p>
                      </div>

                      {/* Code Example with IDE-style design */}
                      {topic.codeExample && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <div className="flex items-center justify-center w-8 h-8 bg-gray-800 rounded-lg">
                              <span className="text-green-400 text-sm">💻</span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-800">Code Example</h4>
                          </div>
                          <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
                            {/* IDE-style header */}
                            <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 border-b border-gray-700">
                              <div className="flex gap-1.5">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                              </div>
                              <span className="text-gray-400 text-sm ml-2 font-mono">example.js</span>
                            </div>
                            {/* Code content */}
                            <pre className="p-6 overflow-x-auto text-sm leading-6">
                              <code className="text-gray-300 font-mono whitespace-pre">
                                {topic.codeExample}
                              </code>
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* Key Points */}
                      {topic.keyPoints && Array.isArray(topic.keyPoints) && (
                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-blue-600 text-lg">🔑</span>
                            <h4 className="text-lg font-semibold text-blue-900">Key Points</h4>
                          </div>
                          <ul className="space-y-3">
                            {topic.keyPoints.map((point, pointIndex) => (
                              <li key={pointIndex} className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-3"></span>
                                <span className="text-blue-800 leading-7 font-medium">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Show basic info if no detailed content */}
        {!content?.topics && basicInfo && !chapter && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-lg">
                <span className="text-yellow-600 text-xl">📖</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Chapter Overview</h2>
            </div>
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
              <p className="text-yellow-800 text-lg font-medium mb-4">
                📚 Detailed content for this chapter is being prepared. Please check back later.
              </p>
              {basicInfo.description && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-8 font-light">
                    {basicInfo.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}


      </div>
    </div>
  );
};


export default ChapterContent