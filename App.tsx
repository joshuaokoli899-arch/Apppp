
import React, { useState, useCallback } from 'react';
import { BuildResult, BuildType } from './types';
import { simulateAndroidBuild } from './services/geminiService';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import BuildOptions from './components/BuildOptions';
import Console from './components/Console';
import BuildResults from './components/BuildResults';
import { BuildIcon } from './components/icons';

export default function App() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [buildType, setBuildType] = useState<BuildType>('debug');
    const [buildLog, setBuildLog] = useState<string[]>([]);
    const [buildResult, setBuildResult] = useState<BuildResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (file: File | null) => {
        setSelectedFile(file);
        setBuildLog([]);
        setBuildResult(null);
        setError(null);
    };

    const handleBuildClick = useCallback(async () => {
        if (!selectedFile) {
            setError("Please select a project ZIP file first.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setBuildLog([]);
        setBuildResult(null);

        try {
            await simulateAndroidBuild(
                selectedFile.name,
                buildType,
                (logChunk) => {
                    setBuildLog(prev => [...prev, logChunk]);
                },
                (result) => {
                    setBuildResult(result);
                }
            );
        } catch (err) {
            console.error("Build simulation failed:", err);
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during the build simulation.";
            setError(`Error: ${errorMessage}`);
            setBuildLog(prev => [...prev, `\n--- BUILD FAILED ---`, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedFile, buildType]);

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen font-sans flex flex-col">
            <Header />
            <main className="flex-grow p-4 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto w-full">
                {/* Left Column: Configuration */}
                <div className="flex flex-col gap-8">
                    <section className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-cyan-400">1. Upload Project</h2>
                        <FileUpload onFileChange={handleFileChange} />
                    </section>
                    
                    <section className="bg-gray-800 rounded-lg shadow-lg p-6">
                         <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-cyan-400">2. Configure Build</h2>
                        <BuildOptions buildType={buildType} onBuildTypeChange={setBuildType} />
                    </section>

                    <section className="bg-gray-800 rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-cyan-400">3. Start Build</h2>
                        <button
                            onClick={handleBuildClick}
                            disabled={isLoading || !selectedFile}
                            className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Building...
                                </>
                            ) : (
                                <>
                                    <BuildIcon />
                                    Build Project
                                </>
                            )}
                        </button>
                        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                    </section>
                </div>

                {/* Right Column: Output */}
                <div className="flex flex-col gap-8">
                    <section className="bg-gray-800 rounded-lg shadow-lg p-6 flex-grow flex flex-col min-h-[400px]">
                        <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-cyan-400">Build Output</h2>
                        <Console log={buildLog} />
                    </section>
                    {buildResult && (
                        <section className="bg-gray-800 rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 text-cyan-400">Build Report</h2>
                            <BuildResults result={buildResult} />
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
}
