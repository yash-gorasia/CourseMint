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
  const chapterName = basicInfo?.chapterName || basicInfo?.chapter_name || content?.title || "Chapter";
  const chapterDescription = content?.description || basicInfo?.description || basicInfo?.chapterDescription || "";  
  const duration = basicInfo?.duration || "";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto p-8">
        {/* Chapter Header - Enhanced */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-10 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100 to-green-200 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
          <div className="relative">
            <div className="flex flex-row justify-between items-start gap-6 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                </div>
                <h1 className="text-4xl font-bold leading-tight mb-4 bg-gradient-to-r from-gray-900 to-green-800 bg-clip-text text-transparent">
                  {chapterName}
                </h1>
              </div>
              {duration && (
                <div className="flex-none">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-3 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold">{duration}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {chapterDescription && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <p className="text-gray-700 text-lg leading-relaxed font-light">
                  {chapterDescription}
                </p>
              </div>
            )}
          </div>
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

                      {/* Sub Features */}
                      {topic.subFeatures && Array.isArray(topic.subFeatures) && topic.subFeatures.length > 0 && (
                        <div className="mt-8">
                          <div className="flex items-center gap-2 mb-6">
                            <span className="text-green-600 text-lg">🔍</span>
                            <h4 className="text-xl font-semibold text-green-900">Deep Dive Topics</h4>
                          </div>
                          <div className="space-y-6">
                            {topic.subFeatures.map((subFeature, subIndex) => (
                              <div key={subIndex} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6 hover:shadow-md transition-all duration-200">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">
                                    {String.fromCharCode(97 + subIndex)}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold  mb-3">
                                      {subFeature.title}
                                    </h5>
                                    <p className=" leading-7 mb-4">
                                      {subFeature.description}
                                    </p>
                                    
                                    {/* Sub Feature Code Example */}
                                    {(subFeature.codeExample || subFeature.code_example) && (
                                      <div className="mt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className=" text-sm">💾</span>
                                          <span className="font-medium text-sm">Example Code</span>
                                        </div>
                                        <div className="bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
                                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border-b border-gray-600">
                                            <div className="flex gap-1">
                                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            </div>
                                            <span className="text-gray-400 text-xs ml-2 font-mono">snippet.js</span>
                                          </div>
                                          <div className="p-4 overflow-x-auto">
                                            <pre className="text-green-300 font-mono text-xs leading-5 whitespace-pre-wrap">
                                              {subFeature.codeExample || subFeature.code_example}
                                            </pre>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
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

                      {/* Sub Features for legacy structure */}
                      {topic.subFeatures && Array.isArray(topic.subFeatures) && topic.subFeatures.length > 0 && (
                        <div className="mt-8">
                          <div className="flex items-center gap-2 mb-6">
                            <span className="text-purple-600 text-lg">🔍</span>
                            <h4 className="text-xl font-semibold text-purple-900">Deep Dive Topics</h4>
                          </div>
                          <div className="space-y-6">
                            {topic.subFeatures.map((subFeature, subIndex) => (
                              <div key={subIndex} className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-200 p-6 hover:shadow-md transition-all duration-200">
                                <div className="flex items-start gap-4">
                                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-lg flex items-center justify-center font-bold text-sm shadow-sm">
                                    {String.fromCharCode(97 + subIndex)}
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-purple-900 mb-3">
                                      {subFeature.title}
                                    </h5>
                                    <p className="text-purple-800 leading-7 mb-4">
                                      {subFeature.description}
                                    </p>
                                    
                                    {/* Sub Feature Code Example */}
                                    {(subFeature.codeExample || subFeature.code_example) && (
                                      <div className="mt-4">
                                        <div className="flex items-center gap-2 mb-2">
                                          <span className="text-purple-600 text-sm">💾</span>
                                          <span className="text-purple-800 font-medium text-sm">Example Code</span>
                                        </div>
                                        <div className="bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
                                          <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 border-b border-gray-600">
                                            <div className="flex gap-1">
                                              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                            </div>
                                            <span className="text-gray-400 text-xs ml-2 font-mono">snippet.js</span>
                                          </div>
                                          <div className="p-4 overflow-x-auto">
                                            <pre className="text-green-300 font-mono text-xs leading-5 whitespace-pre-wrap">
                                              {subFeature.codeExample || subFeature.code_example}
                                            </pre>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
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