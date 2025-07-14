import React, { useState, useEffect } from 'react';

// Main App component
function App() {
    // --- Global State for Notice Details (shared across pages) ---
    const [currentPage, setCurrentPage] = useState('generate'); // 'generate' or 'edit'

    const [selectedType, setSelectedType] = useState('Legal Notice');
    const [issueDate, setIssueDate] = useState('');
    const [problemDate, setProblemDate] = useState('');
    const [caseDescription, setCaseDescription] = useState('');
    const [noticePeriod, setNoticePeriod] = useState('');
    const [totalAmount, setTotalAmount] = useState('');
    const [senderName, setSenderName] = useState('');
    const [senderAddress, setSenderAddress] = useState('');
    const [senderTitle, setSenderTitle] = useState('');
    const [senderCompany, setSenderCompany] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');
    const [recipientTitle, setRecipientTitle] = useState('');
    const [recipientCompany, setRecipientCompany] = useState('');
    const [signature, setSignature] = useState('');
    const [subject, setSubject] = useState('');
    const [selectedTone, setSelectedTone] = useState('Formal');

    const [generatedNotice, setGeneratedNotice] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [ipcRecommendations, setIpcRecommendations] = useState([]);
    const [isIpcLoading, setIsIpcLoading] = useState(false);
    const [summarizedNotice, setSummarizedNotice] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    // --- LLM Functions ---

    // Function to handle generating the notice using the LLM
    const handleGenerateNotice = async (templateType = null) => {
        // Basic validation for essential fields
        if (!caseDescription || !subject || !issueDate || !senderName || !recipientName) {
            setError('Please fill in all required fields (Case Description, Subject, Issue Date, Sender Name, Recipient Name).');
            return;
        }

        setIsLoading(true);
        setError('');
        setGeneratedNotice(''); // Clear previous notice

        // Use templateType if provided, otherwise use selectedType from state
        const currentNoticeType = templateType || selectedType;

        const prompt = `Generate a ${selectedTone} legal notice of type "${currentNoticeType}" based on the following details:
        Issue Date: ${issueDate}
        Problem Date: ${problemDate}
        Case Description: ${caseDescription}
        Notice Period: ${noticePeriod}
        Total Amount Involved: ${totalAmount}
        Sender Name: ${senderName}
        Sender Address: ${senderAddress}
        Sender Title: ${senderTitle}
        Sender Company: ${senderCompany}
        Recipient Name: ${recipientName}
        Recipient Address: ${recipientAddress}
        Recipient Title: ${recipientTitle}
        Recipient Company: ${recipientCompany}
        Subject: ${subject}
        Signature Line: ${signature || '[Sender Signature]'}

        Please ensure the notice is well-structured, clear, and appropriate for the selected tone, incorporating all provided details naturally.`;

        try {
            const chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };

            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to generate notice from LLM.');
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setGeneratedNotice(text);
                setCurrentPage('edit'); // Navigate to edit page on successful generation
            } else {
                setError('LLM response was empty or malformed for notice generation.');
            }
        } catch (err) {
            console.error('Error generating notice:', err);
            setError(`Error generating notice: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    // Function to handle suggesting IPC sections using the LLM
    const handleSuggestIpcSections = async () => {
        if (!caseDescription) {
            setError('Please provide a Case Description to get IPC section recommendations.');
            return;
        }

        setIsIpcLoading(true);
        setError('');
        setIpcRecommendations([]);

        const prompt = `Based on the following case description, suggest relevant Indian Penal Code (IPC) sections. Provide only the section numbers and a very brief reason (1-2 words) for each, separated by commas. For example: "Section 302 (Murder), Section 378 (Theft)". If no relevant sections are found, state "No relevant IPC sections found."
        Case Description: ${caseDescription}`;

        try {
            const chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };

            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to get IPC recommendations from LLM.');
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                const sections = text.split(',').map(s => s.trim()).filter(s => s !== '');
                setIpcRecommendations(sections);
            } else {
                setError('LLM response was empty or malformed for IPC recommendations.');
            }
        } catch (err) {
            console.error('Error suggesting IPC sections:', err);
            setError(`Error suggesting IPC sections: ${err.message}`);
        } finally {
            setIsIpcLoading(false);
        }
    };

    // Function to handle summarizing the notice using the LLM
    const handleSummarizeNotice = async () => {
        if (!generatedNotice) {
            setError('Please generate a notice first before summarizing.');
            return;
        }

        setIsSummarizing(true);
        setError('');
        setSummarizedNotice('');

        const prompt = `Summarize the following legal notice concisely, in 2-3 sentences:
        ${generatedNotice}`;

        try {
            const chatHistory = [];
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };

            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to summarize notice from LLM.');
            }

            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setSummarizedNotice(text);
            } else {
                setError('LLM response was empty or malformed for summary.');
            }
        } catch (err) {
            console.error('Error summarizing notice:', err);
            setError(`Error summarizing notice: ${err.message}`);
        } finally {
            setIsSummarizing(false);
        }
    };

    // Function to clear all fields and navigate to generate page
    const handleClearAll = () => {
        setSelectedType('Legal Notice');
        setIssueDate('');
        setProblemDate('');
        setCaseDescription('');
        setNoticePeriod('');
        setTotalAmount('');
        setSenderName('');
        setSenderAddress('');
        setSenderTitle('');
        setSenderCompany('');
        setRecipientName('');
        setRecipientAddress('');
        setRecipientTitle('');
        setRecipientCompany('');
        setSignature('');
        setSubject('');
        setSelectedTone('Formal');
        setGeneratedNotice('');
        setIpcRecommendations([]);
        setSummarizedNotice('');
        setError('');
        setCurrentPage('generate'); // Go back to the generate page
    };

    // --- Page Components ---

    const GenerateNoticePage = () => (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl border border-gray-200">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                    <h1 className="text-4xl font-extrabold text-gray-800">
                        <span className="text-blue-600">Notice</span>.io
                    </h1>
                    <div className="space-x-4">
                        <button className="bg-blue-100 text-blue-700 font-semibold py-2 px-5 rounded-lg hover:bg-blue-200 transition duration-200">
                            Login
                        </button>
                        <button className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition duration-200">
                            Signup
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Panel: Input Fields and Templates */}
                    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
                        <h2 className="text-2xl font-semibold text-blue-800 mb-6">Notice Details</h2>

                        <label htmlFor="selectedType" className="block text-gray-700 text-sm font-medium mb-2">
                            Notice Type
                        </label>
                        <select
                            id="selectedType"
                            className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white mb-6"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                        >
                            <option value="Legal Notice">Legal Notice</option>
                            <option value="Demand Letter">Demand Letter</option>
                            <option value="Termination Notice">Termination Notice</option>
                            <option value="Eviction Notice">Eviction Notice</option>
                            <option value="Cease and Desist">Cease and Desist</option>
                        </select>

                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Select Template</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* Template Cards */}
                            <div
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition duration-200"
                                onClick={() => { setSelectedType('Breach of Contract'); handleGenerateNotice('Breach of Contract'); }}
                            >
                                <p className="font-semibold text-gray-800">Breach of Contract</p>
                                <p className="text-sm text-gray-600">Notice for failure to fulfill contractual obligations.</p>
                            </div>
                            <div
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition duration-200"
                                onClick={() => { setSelectedType('Contract Termination'); handleGenerateNotice('Contract Termination'); }}
                            >
                                <p className="font-semibold text-gray-800">Contract Termination</p>
                                <p className="text-sm text-gray-600">Formal notice to end a contract as per its terms.</p>
                            </div>
                            <div
                                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition duration-200"
                                onClick={() => { setSelectedType('Non-Disclosure Agreement'); handleGenerateNotice('Non-Disclosure Agreement'); }}
                            >
                                <p className="font-semibold text-gray-800">Non-Disclosure Agreement (NDA)</p>
                                <p className="text-sm text-gray-600">Notice regarding violation of confidentiality agreement.</p>
                            </div>
                        </div>

                        {/* Input fields */}
                        <div className="space-y-4">
                            <label htmlFor="issueDate" className="block text-gray-700 text-sm font-medium">
                                Issue Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                id="issueDate"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)}
                            />

                            <label htmlFor="problemDate" className="block text-gray-700 text-sm font-medium">
                                Problem Date
                            </label>
                            <input
                                type="date"
                                id="problemDate"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                value={problemDate}
                                onChange={(e) => setProblemDate(e.target.value)}
                            />

                            <label htmlFor="caseDescription" className="block text-gray-700 text-sm font-medium">
                                Case Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="caseDescription"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y min-h-[80px]"
                                rows="3"
                                placeholder="Describe the case in detail..."
                                value={caseDescription}
                                onChange={(e) => setCaseDescription(e.target.value)}
                            ></textarea>
                            <button
                                onClick={handleSuggestIpcSections}
                                className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 flex items-center justify-center w-full"
                                disabled={isIpcLoading || !caseDescription}
                            >
                                {isIpcLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Suggesting...
                                    </>
                                ) : (
                                    <>
                                        ✨ Suggest IPC Sections
                                    </>
                                )}
                            </button>

                            <label htmlFor="noticePeriod" className="block text-gray-700 text-sm font-medium">
                                Notice Period (e.g., "30 days", "7 days")
                            </label>
                            <input
                                type="text"
                                id="noticePeriod"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., 30 days"
                                value={noticePeriod}
                                onChange={(e) => setNoticePeriod(e.target.value)}
                            />

                            <label htmlFor="totalAmount" className="block text-gray-700 text-sm font-medium">
                                Total Amount Involved
                            </label>
                            <input
                                type="text"
                                id="totalAmount"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., $5000"
                                value={totalAmount}
                                onChange={(e) => setTotalAmount(e.target.value)}
                            />

                            <label htmlFor="senderName" className="block text-gray-700 text-sm font-medium">
                                Sender Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="senderName"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., John Doe"
                                value={senderName}
                                onChange={(e) => setSenderName(e.target.value)}
                            />

                            <label htmlFor="senderAddress" className="block text-gray-700 text-sm font-medium">
                                Sender Address
                            </label>
                            <textarea
                                id="senderAddress"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y"
                                rows="2"
                                placeholder="e.g., 123 Main St, Anytown, USA"
                                value={senderAddress}
                                onChange={(e) => setSenderAddress(e.target.value)}
                            ></textarea>

                            <label htmlFor="senderTitle" className="block text-gray-700 text-sm font-medium">
                                Sender Title
                            </label>
                            <input
                                type="text"
                                id="senderTitle"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., Advocate"
                                value={senderTitle}
                                onChange={(e) => setSenderTitle(e.target.value)}
                            />

                            <label htmlFor="senderCompany" className="block text-gray-700 text-sm font-medium">
                                Sender Company
                            </label>
                            <input
                                type="text"
                                id="senderCompany"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., Legal Solutions Inc."
                                value={senderCompany}
                                onChange={(e) => setSenderCompany(e.target.value)}
                            />

                            <label htmlFor="recipientName" className="block text-gray-700 text-sm font-medium">
                                Recipient Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="recipientName"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., Jane Smith"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                            />

                            <label htmlFor="recipientAddress" className="block text-gray-700 text-sm font-medium">
                                Recipient Address
                            </label>
                            <textarea
                                id="recipientAddress"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200 resize-y"
                                rows="2"
                                placeholder="e.g., 456 Oak Ave, Othertown, USA"
                                value={recipientAddress}
                                onChange={(e) => setRecipientAddress(e.target.value)}
                            ></textarea>

                            <label htmlFor="recipientTitle" className="block text-gray-700 text-sm font-medium">
                                Recipient Title
                            </label>
                            <input
                                type="text"
                                id="recipientTitle"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., CEO"
                                value={recipientTitle}
                                onChange={(e) => setRecipientTitle(e.target.value)}
                            />

                            <label htmlFor="recipientCompany" className="block text-gray-700 text-sm font-medium">
                                Recipient Company
                            </label>
                            <input
                                type="text"
                                id="recipientCompany"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., Acme Corp."
                                value={recipientCompany}
                                onChange={(e) => setRecipientCompany(e.target.value)}
                            />

                            <label htmlFor="subject" className="block text-gray-700 text-sm font-medium">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="subject"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., Regarding Breach of Contract"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />

                            <label htmlFor="signature" className="block text-gray-700 text-sm font-medium">
                                Signature Line
                            </label>
                            <input
                                type="text"
                                id="signature"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                placeholder="e.g., [Your Name/Signature]"
                                value={signature}
                                onChange={(e) => setSignature(e.target.value)}
                            />

                            <label htmlFor="tone" className="block text-gray-700 text-sm font-medium">
                                Tone
                            </label>
                            <select
                                id="tone"
                                className="w-full p-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200 bg-white"
                                value={selectedTone}
                                onChange={(e) => setSelectedTone(e.target.value)}
                            >
                                <option value="Formal">Formal</option>
                                <option value="Professional">Professional</option>
                                <option value="Concise">Concise</option>
                                <option value="Assertive">Assertive</option>
                                <option value="Neutral">Neutral</option>
                            </select>
                        </div>

                        {error && (
                            <div className="mt-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-center mt-8 space-x-4">
                            <button
                                onClick={() => handleGenerateNotice()}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 flex items-center justify-center"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Generating...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                        Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Panel: AI Generated Notice Placeholder */}
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-semibold text-gray-800">AI Generated Notice</h2>
                            <button
                                className="bg-blue-500 text-white text-sm font-semibold py-1 px-3 rounded-full hover:bg-blue-600 transition duration-200"
                                onClick={() => {
                                    // Logic to create new notice from scratch (clear fields and navigate to edit)
                                    handleClearAll(); // Clear all fields
                                    setCurrentPage('edit'); // Go to edit mode to start from scratch
                                }}
                            >
                                + New
                            </button>
                        </div>
                        <div className="flex-grow p-4 bg-white border border-gray-300 rounded-md text-gray-700 min-h-[400px] flex items-center justify-center text-center italic">
                            Your AI-generated legal notice will appear here. Please fill in the details on the left and click 'Generate' to draft your notice. The system will use the selected litigation type and template to create a comprehensive and legally sound document. Review the content carefully before editing or downloading.
                        </div>
                        <div className="flex justify-end mt-6 space-x-4">
                            <button
                                onClick={() => setCurrentPage('edit')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                            >
                                Edit
                            </button>
                            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75">
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const EditNoticePage = () => (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-6xl border border-gray-200">
                {/* Header */}
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setCurrentPage('generate')} className="text-gray-600 hover:text-gray-800 transition duration-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        </button>
                        <h1 className="text-4xl font-extrabold text-gray-800">
                            <span className="text-blue-600">Notice</span>.io
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4 text-gray-500">
                        <span>Saving...</span>
                        <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12v1m7-4h.582m-1.582 0a8.001 8.001 0 0015.356 2A8.001 8.001 0 004 12v1"></path></svg>
                        <button className="text-gray-600 hover:text-gray-800 transition duration-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12v1m7-4h.582m-1.582 0a8.001 8.001 0 0015.356 2A8.001 8.001 0 004 12v1"></path></svg>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Panel: IPC Sections, Recommendations, Notes */}
                    <div className="lg:col-span-1 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">IPC Section</h2>
                        {ipcRecommendations.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-700 mb-6">
                                {ipcRecommendations.map((section, index) => (
                                    <li key={index} className="mb-1">{section}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm mb-6">No IPC sections recommended yet. Generate a notice with a case description first.</p>
                        )}

                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Recommendations</h3>
                        <div className="space-y-3 mb-6">
                            <div className="p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded-md text-sm font-medium">
                                Suggestion: Add recipient details for clarity
                            </div>
                            <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-sm font-medium">
                                Alert: Check grammar in paragraph 2
                            </div>
                            <div className="p-3 bg-blue-100 border border-blue-300 text-blue-800 rounded-md text-sm font-medium">
                                Suggestion: Consider adding a timeline of events
                            </div>
                            <div className="p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-md text-sm font-medium">
                                Alert: Verify jurisdiction details
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Notes</h3>
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-md bg-white text-gray-800 resize-y min-h-[100px]"
                            rows="5"
                            placeholder="Add your notes here, e.g., Confirm client address before sending."
                        ></textarea>
                    </div>

                    {/* Right Panel: Notice Editor */}
                    <div className="lg:col-span-2 p-6 bg-white rounded-lg border border-gray-200">
                        <div className="flex flex-wrap items-center text-sm text-gray-600 mb-4 space-x-4">
                            <span>Sender: <span className="font-semibold text-gray-800">{senderName || 'N/A'}</span></span>
                            <span>Recipient: <span className="font-semibold text-gray-800">{recipientName || 'N/A'}</span></span>
                            <span>Case No: <span className="font-semibold text-gray-800">2023-001</span></span> {/* Static for now */}
                            <select className="ml-auto p-1 border border-gray-300 rounded-md bg-white text-gray-700 text-sm">
                                <option value="Eviction Template">Using: {selectedType} Template</option>
                                {/* Add other templates if needed */}
                            </select>
                        </div>

                        {/* Basic Rich Text Editor Controls (Styling only, no actual functionality) */}
                        <div className="flex items-center space-x-2 p-2 border border-gray-300 rounded-t-md bg-gray-50">
                            <button className="p-1 rounded hover:bg-gray-200 font-bold">B</button>
                            <button className="p-1 rounded hover:bg-gray-200 italic">I</button>
                            <button className="p-1 rounded hover:bg-gray-200 underline">U</button>
                            <select className="p-1 rounded border border-gray-300 text-sm">
                                <option>14px</option>
                                <option>12px</option>
                                <option>16px</option>
                            </select>
                            <button className="p-1 rounded hover:bg-gray-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                            </button>
                            <button className="p-1 rounded hover:bg-gray-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14m-5-4v4m-2 0h4"></path></svg>
                            </button>
                            <button className="p-1 rounded hover:bg-gray-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                            </button>
                            <button className="p-1 rounded hover:bg-gray-200">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                            </button>
                        </div>

                        <textarea
                            className="w-full p-4 border border-gray-300 rounded-b-md bg-white text-gray-800 focus:ring-green-500 focus:border-green-500 transition duration-200 resize-y min-h-[400px] flex-grow"
                            rows="20"
                            placeholder="Start drafting your legal notice or apply AI suggestions..."
                            value={generatedNotice}
                            onChange={(e) => setGeneratedNotice(e.target.value)}
                        ></textarea>

                        <div className="flex items-center justify-between mt-6">
                            <div className="flex items-center space-x-2">
                                <label htmlFor="proofreadingMode" className="text-gray-700 text-sm font-medium">Proofreading Mode</label>
                                <input type="checkbox" id="proofreadingMode" className="form-checkbox h-5 w-5 text-blue-600 rounded" />
                            </div>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleSummarizeNotice}
                                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-75 flex items-center justify-center"
                                    disabled={isSummarizing || !generatedNotice}
                                >
                                    {isSummarizing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Summarizing...
                                        </>
                                    ) : (
                                        <>
                                            ✨ Summarize Notice
                                        </>
                                    )}
                                </button>
                                <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200">
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v3a3 3 0 01-3 3z"></path></svg>
                                </button>
                                <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200">
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                </button>
                                <select className="p-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm">
                                    <option>Download As</option>
                                    <option>PDF</option>
                                    <option>DOCX</option>
                                    <option>TXT</option>
                                </select>
                            </div>
                        </div>
                        {summarizedNotice && (
                            <div className="mt-4 p-4 bg-teal-100 border border-teal-400 text-teal-800 rounded-md text-sm">
                                <h3 className="font-semibold mb-2">Summary:</h3>
                                <p>{summarizedNotice}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // Conditional rendering based on currentPage state
    return (
        <>
            {currentPage === 'generate' && <GenerateNoticePage />}
            {currentPage === 'edit' && <EditNoticePage />}
        </>
    );
}

export default App;
