import React from 'react'

const Hero = () => {
    return (
        <div>
            <section className="bg-white lg:grid  lg:place-content-center">
                <div className="mx-auto w-screen max-w-screen-xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
                    <div className="mx-auto max-w-prose text-center">
                        <h1 className="text-4xl font-bold sm:text-5xl">
                            <strong className='text-green-500'>AI Course Generator</strong>
                            <p className='text-black'>Custom learning paths, Powered by AI</p>
                        </h1>

                        <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
                            Unlock personalized education with AI-driven course creation. Tailor your learning journey to fit you unique goals and pace.
                        </p>

                        <div className="mt-4 flex justify-center gap-4 sm:mt-6">
                            <a
                                className="inline-block rounded border border-green-600 bg-green-500 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                                href="#"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Hero
