import jsPDF from 'jspdf';

export const exportCourseToPDF = async (course, chapters = null) => {
    if (!course) {
        throw new Error('Course data is required');
    }

    const pdf = new jsPDF();
    let yPosition = 20;
    const pageHeight = pdf.internal.pageSize.height;
    const lineHeight = 8;
    const margin = 20;
    const rightMargin = 190;

    // Helper function to add text with auto page break
    const addText = (text, x, y, options = {}) => {
        if (y > pageHeight - 30) {
            pdf.addPage();
            y = 20;
        }
        pdf.text(text, x, y, options);
        return y + (options.lineHeight || lineHeight);
    };

    // Helper function to wrap long text
    const addWrappedText = (text, x, y, maxWidth = 170) => {
        if (!text) return y;

        const lines = pdf.splitTextToSize(text.toString(), maxWidth);
        lines.forEach(line => {
            y = addText(line, x, y);
        });
        return y;
    };

    // Helper function to add section divider
    const addSectionDivider = (y) => {
        if (y > pageHeight - 40) {
            pdf.addPage();
            y = 20;
        }
        pdf.setDrawColor(100, 100, 100);
        pdf.line(margin, y, rightMargin, y);
        return y + 15;
    };

    // Helper function to add heading with background
    const addHeading = (text, x, y, fontSize = 16) => {
        if (y > pageHeight - 30) {
            pdf.addPage();
            y = 20;
        }

        pdf.setFillColor(41, 128, 185); // Blue background
        pdf.rect(x - 5, y - fontSize + 2, rightMargin - x + 5, fontSize + 4, 'F');

        pdf.setTextColor(255, 255, 255); // White text
        pdf.setFontSize(fontSize);
        pdf.setFont(undefined, 'bold');
        pdf.text(text, x, y, { baseline: 'middle' });

        pdf.setTextColor(0, 0, 0); // Reset to black
        return y + fontSize + 8;
    };

    try {
        // Debug log to see what we're working with
        console.log('Exporting course:', course);
        console.log('Course chapters:', chapters);

        // Fetch detailed chapters if not provided
        if (!chapters && course._id) {
            try {
                const response = await fetch(`http://localhost:3000/api/chapters/course/${course._id}`);
                if (response.ok) {
                    chapters = await response.json();
                }
            } catch (error) {
                console.log('Could not fetch chapters:', error);
            }
        }

        // Header with course title
        pdf.setFillColor(52, 73, 94); // Dark blue header
        pdf.rect(0, 0, 210, 40, 'F');

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(24);
        pdf.setFont(undefined, 'bold');
        const courseTitle = course.name || course.courseName || 'Course';
        yPosition = addText(courseTitle, margin, 25);

        pdf.setFontSize(12);
        pdf.setFont(undefined, 'normal');
        yPosition = addText('Complete Course Content Export', margin, yPosition + 5);

        pdf.setTextColor(0, 0, 0); // Reset to black
        yPosition = 60;

        // Course Description Section
        if (course.courseOutput?.description || course.description || course.courseDescription) {
            yPosition = addHeading('Course Description', margin, yPosition, 14);

            pdf.setFontSize(11);
            pdf.setFont(undefined, 'normal');
            yPosition = addWrappedText(
                course.courseOutput?.description || course.description || course.courseDescription,
                margin, yPosition
            );
            yPosition = addSectionDivider(yPosition);
        }

        // Course Details Section
        yPosition = addHeading('Course Information', margin, yPosition, 14);

        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        yPosition = addText('Category:', margin, yPosition);
        pdf.setFont(undefined, 'normal');
        yPosition = addText(course.category || 'N/A', margin + 50, yPosition - lineHeight);

        pdf.setFont(undefined, 'bold');
        yPosition = addText('Level:', margin, yPosition);
        pdf.setFont(undefined, 'normal');
        yPosition = addText(course.level || course.difficulty || 'N/A', margin + 50, yPosition - lineHeight);

        if (course.courseOutput?.noOfChapters) {
            pdf.setFont(undefined, 'bold');
            yPosition = addText('Chapters:', margin, yPosition);
            pdf.setFont(undefined, 'normal');
            yPosition = addText(`${course.courseOutput.noOfChapters} chapters`, margin + 50, yPosition - lineHeight);
        }

        yPosition = addSectionDivider(yPosition);

        // Course Summary from courseOutput
        if (course.courseOutput?.summary) {
            yPosition = addHeading('Course Summary', margin, yPosition, 14);

            pdf.setFontSize(11);
            pdf.setFont(undefined, 'normal');
            yPosition = addWrappedText(course.courseOutput.summary, margin, yPosition);
            yPosition = addSectionDivider(yPosition);
        }

        // Chapters from courseOutput (overview)
        const courseChapters = course.courseOutput?.chapters || course.chapters || [];
        if (courseChapters.length > 0) {
            yPosition = addHeading('Chapter Overview', margin, yPosition);

            courseChapters.forEach((chapter, index) => {
                // Chapter number with colored background
                pdf.setFillColor(52, 152, 219); // Light blue
                pdf.circle(margin + 5, yPosition - 3, 8, 'F');

                pdf.setTextColor(255, 255, 255);
                pdf.setFontSize(10);
                pdf.setFont(undefined, 'bold');
                pdf.text(`${index + 1}`, margin + 2, yPosition);

                pdf.setTextColor(0, 0, 0);
                pdf.setFontSize(12);
                pdf.setFont(undefined, 'bold');
                yPosition = addText(`${chapter.chapterName || chapter.chapter_name || chapter.name || `Chapter ${index + 1}`}`, margin + 20, yPosition);

                // Chapter description/about
                if (chapter.about || chapter.chapterDescription || chapter.chapter_description || chapter.description) {
                    pdf.setFontSize(10);
                    pdf.setFont(undefined, 'normal');
                    yPosition = addWrappedText(
                        chapter.about || chapter.chapterDescription || chapter.chapter_description || chapter.description,
                        margin + 20, yPosition, 150
                    );
                    yPosition += 3;
                }

                yPosition += 8;
            });
            yPosition = addSectionDivider(yPosition);
        }

        // Generated Chapter Content (from API)
        console.log('Processing chapters for detailed content:', chapters);

        if (chapters && chapters.length > 0) {
            yPosition = addHeading('Detailed Chapter Content', margin, yPosition);

            chapters.forEach((chapterData, index) => {
                console.log(`Processing chapter ${index + 1}:`, chapterData);

                if (chapterData.content) {
                    // Chapter header with number
                    pdf.setFillColor(46, 204, 113); // Green background
                    pdf.rect(margin - 5, yPosition - 5, rightMargin - margin + 10, 20, 'F');

                    pdf.setTextColor(255, 255, 255);
                    pdf.setFontSize(14);
                    pdf.setFont(undefined, 'bold');

                    // Try to get chapter name from content or use index
                    const chapterName = chapterData.content.chapterName ||
                        chapterData.content.chapter_name ||
                        courseChapters[index]?.chapterName ||
                        courseChapters[index]?.name ||
                        `Chapter ${index + 1}`;

                    yPosition = addText(`Chapter ${index + 1}: ${chapterName}`, margin, yPosition + 8);
                    pdf.setTextColor(0, 0, 0);
                    yPosition += 10;

                    // Debug what content we have
                    console.log(`Chapter ${index + 1} content structure:`, chapterData.content);

                    // Try multiple possible content fields
                    let chapterContent = null;
                    let structuredTopics = [];

                    if (chapterData.content.content) {
                        chapterContent = chapterData.content.content;
                    } else if (chapterData.content.chapterContent) {
                        chapterContent = chapterData.content.chapterContent;
                    } else if (typeof chapterData.content === 'string') {
                        chapterContent = chapterData.content;
                    } else if (Array.isArray(chapterData.content)) {
                        // If content is an array of topics - structure it properly
                        structuredTopics = chapterData.content;
                    } else if (chapterData.content.topics && Array.isArray(chapterData.content.topics)) {
                        // If content has topics array
                        structuredTopics = chapterData.content.topics;
                    }

                    console.log(`Extracted content for chapter ${index + 1}:`, chapterContent || structuredTopics);

                    // Add chapter content with proper formatting
                    if (structuredTopics.length > 0) {
                        // Format structured topics properly
                        structuredTopics.forEach((topic, topicIndex) => {
                            // Topic Title
                            pdf.setFillColor(230, 245, 255); // Light blue background for topics
                            pdf.rect(margin + 5, yPosition - 5, rightMargin - margin - 10, 15, 'F');

                            pdf.setFontSize(12);
                            pdf.setFont(undefined, 'bold');
                            pdf.setTextColor(0, 51, 102); // Darker blue text for better readability
                            yPosition = addText(`${topicIndex + 1}. ${topic.title || topic.name || 'Topic'}`, margin + 10, yPosition + 3);
                            pdf.setTextColor(0, 0, 0);
                            yPosition += 8;

                            // Topic Description/Content
                            if (topic.description || topic.desc) {
                                pdf.setFontSize(11); // Slightly larger font
                                pdf.setFont(undefined, 'normal');
                                pdf.setTextColor(33, 37, 41); // Dark gray for better readability
                                yPosition = addWrappedText(topic.description || topic.desc, margin + 15, yPosition, 150);
                                pdf.setTextColor(0, 0, 0);
                                yPosition += 5;
                            }

                            // Code Example Section
                            // Code Example Section
                            // Code Example Section
                            // Code Example Section with syntax highlighting
                            if (topic.codeExample || topic.code) {
                                const codeText = topic.codeExample || topic.code;

                                // Split into original lines
                                const rawLines = codeText.trim().split("\n");

                                const lineHeightCode = 6;
                                let wrappedCodeLines = [];

                                // Wrap each line individually
                                rawLines.forEach(line => {
                                    if (line.trim().length === 0) {
                                        wrappedCodeLines.push(""); // preserve blank lines
                                    } else {
                                        const wrapped = pdf.splitTextToSize(line, rightMargin - margin - 30);
                                        wrappedCodeLines = wrappedCodeLines.concat(wrapped);
                                    }
                                });

                                const boxHeight = wrappedCodeLines.length * lineHeightCode + 10;

                                // Page break check
                                if (yPosition + boxHeight > pageHeight - 30) {
                                    pdf.addPage();
                                    yPosition = 20;
                                }

                                // Background box
                                pdf.setFillColor(245, 245, 245); // light gray
                                pdf.setDrawColor(200, 200, 200); // border
                                pdf.rect(margin + 10, yPosition, rightMargin - margin - 20, boxHeight, "FD");

                                // Monospace font
                                pdf.setFont("courier", "normal");
                                pdf.setFontSize(9);

                                let codeY = yPosition + 8;

                                // Helper to print tokens in different colors
                                const printColoredLine = (line, x, y) => {
                                    // Capture spaces too, so indentation is preserved
                                    const tokens = line.match(
                                        /(\/\/.*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\d+(\.\d+)?\b|\b(?:const|let|var|function|if|else|for|while|return|true|false|null|undefined|class|new|this)\b|[=+\-*/%<>!]+|\s+|\w+|\S)/g
                                    ) || [];

                                    let cursorX = x;

                                    tokens.forEach(token => {
                                        if (/^\s+$/.test(token)) {
                                            // Spaces: just move cursor, no text
                                            cursorX += pdf.getTextWidth(token);
                                            return;
                                        }

                                        if (/^\/\//.test(token)) {
                                            pdf.setTextColor(0, 128, 0); // green comments
                                        } else if (/^['"`].*['"`]$/.test(token)) {
                                            pdf.setTextColor(200, 0, 0); // red strings
                                        } else if (/^\d+(\.\d+)?$/.test(token)) {
                                            pdf.setTextColor(128, 0, 128); // purple numbers
                                        } else if (/^(const|let|var|function|if|else|for|while|return|class|new|this|true|false|null|undefined)$/.test(token)) {
                                            pdf.setTextColor(0, 0, 200); // blue keywords
                                        } else if (/^[=+\-*/%<>!]+$/.test(token)) {
                                            pdf.setTextColor(180, 80, 0); // orange operators
                                        } else {
                                            pdf.setTextColor(30, 30, 30); // normal text
                                        }

                                        pdf.text(token, cursorX, y, { baseline: "top" });
                                        cursorX += pdf.getTextWidth(token);
                                    });
                                };



                                // Print each line with coloring
                                wrappedCodeLines.forEach(line => {
                                    printColoredLine(line, margin + 15, codeY);
                                    codeY += lineHeightCode;
                                });

                                // Reset font
                                yPosition += boxHeight + 10;
                                pdf.setFont("helvetica", "normal");
                                pdf.setTextColor(0, 0, 0);
                            }

                            // Sub-features/Sub-topics
                            if (topic.subFeatures && Array.isArray(topic.subFeatures) && topic.subFeatures.length > 0) {
                                pdf.setFontSize(11);
                                pdf.setFont(undefined, 'bold');
                                pdf.setTextColor(27, 94, 32); // Darker green text for better visibility
                                yPosition = addText('Key Points:', margin + 15, yPosition);
                                pdf.setTextColor(0, 0, 0);
                                yPosition += 3;

                                topic.subFeatures.forEach(sub => {
                                    pdf.setFontSize(10); // Larger font for bullet points
                                    pdf.setFont(undefined, 'normal');
                                    pdf.setTextColor(33, 37, 41); // Dark gray for better readability
                                    yPosition = addText(`• ${sub.title || sub.name || 'Point'}`, margin + 20, yPosition);

                                    if (sub.description || sub.desc) {
                                        pdf.setFontSize(9);
                                        pdf.setTextColor(55, 65, 75); // Darker gray for descriptions
                                        yPosition = addWrappedText(sub.description || sub.desc, margin + 25, yPosition, 140);
                                        pdf.setTextColor(0, 0, 0);
                                        yPosition += 2;
                                    }
                                    yPosition += 4;
                                });
                                yPosition += 5;
                            }

                            // Separator between topics
                            if (topicIndex < structuredTopics.length - 1) {
                                pdf.setDrawColor(200, 200, 200);
                                pdf.line(margin + 10, yPosition, rightMargin - 10, yPosition);
                                yPosition += 8;
                            }
                        });
                    } else if (chapterContent) {
                        // Simple text content
                        pdf.setFontSize(11);
                        pdf.setFont(undefined, 'normal');
                        pdf.setTextColor(33, 37, 41); // Dark gray for better readability
                        yPosition = addWrappedText(chapterContent, margin + 10, yPosition, 160);
                        pdf.setTextColor(0, 0, 0);
                        yPosition += 8;
                    } else {
                        // Show what content structure we couldn't parse
                        pdf.setFillColor(255, 248, 220); // Light yellow background
                        pdf.rect(margin + 5, yPosition - 5, rightMargin - margin - 10, 20, 'F');

                        pdf.setFontSize(10);
                        pdf.setFont(undefined, 'italic');
                        pdf.setTextColor(102, 60, 0); // Dark orange for warning text
                        yPosition = addText('⚠️ Content structure not recognized - check console for details', margin + 10, yPosition + 5);
                        pdf.setTextColor(0, 0, 0);
                        yPosition += 15;
                    }

                    // Video information with icon
                    if (chapterData.videoId) {
                        pdf.setFontSize(10);
                        pdf.setFont(undefined, 'italic');
                        pdf.setTextColor(0, 0, 0); // Black text for video info
                        yPosition = addText(`🎥 Video Available (ID: ${chapterData.videoId})`, margin + 10, yPosition);
                        pdf.setTextColor(0, 0, 0);
                        yPosition += 5;
                    }

                    yPosition = addSectionDivider(yPosition);
                } else {
                    console.log(`Chapter ${index + 1} has no content property`);
                    pdf.setFontSize(12);
                    pdf.setFont(undefined, 'italic');
                    pdf.setTextColor(150, 150, 150);
                    yPosition = addText(`Chapter ${index + 1}: No detailed content available`, margin, yPosition);
                    pdf.setTextColor(0, 0, 0);
                    yPosition += 10;
                }
            });
        } else {
            // If no generated content, add a note
            console.log('No chapters data available');
            pdf.setFillColor(255, 243, 205); // Light yellow background
            pdf.rect(margin - 5, yPosition - 5, rightMargin - margin + 10, 25, 'F');

            pdf.setFontSize(12);
            pdf.setFont(undefined, 'italic');
            yPosition = addText('💡 Detailed chapter content not yet generated.', margin, yPosition + 8);
            yPosition = addText('Use "Generate Course Content" to add detailed content.', margin, yPosition);
            yPosition += 15;
        }

        // Generate filename
        const courseName = (course.name || course.courseName || 'course').replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const filename = `${courseName}_complete_export.pdf`;

        // Save the PDF
        pdf.save(filename);

        return { success: true, filename };

    } catch (error) {
        console.error('Error generating PDF:', error);
        throw new Error('Failed to generate PDF: ' + error.message);
    }
};

// Export Utils object for compatibility
export const ExportUtils = {
    exportCourseToPDF
};
