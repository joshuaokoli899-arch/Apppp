
import React from 'react';
import { BuildResult } from '../types';
import { CheckCircleIcon, WarningIcon, DownloadIcon, CrossCircleIcon } from './icons';

interface BuildResultsProps {
    result: BuildResult;
}

const BuildResults: React.FC<BuildResultsProps> = ({ result }) => {
    return (
        <div className="space-y-6">
            <div className={`flex items-center gap-3 p-4 rounded-lg ${result.success ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                {result.success ? <CheckCircleIcon /> : <CrossCircleIcon />}
                <h3 className={`text-lg font-bold ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                    Build {result.success ? 'Succeeded' : 'Failed'}
                </h3>
            </div>

            {result.success && (result.apk || result.aab) && (
                <div>
                    <h4 className="font-semibold mb-2 text-gray-300">Generated Artifacts</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left bg-gray-900/50 rounded-md">
                            <thead className="bg-gray-700/50">
                                <tr>
                                    <th className="p-3">File</th>
                                    <th className="p-3">Size</th>
                                    <th className="p-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.apk && (
                                    <tr className="border-t border-gray-700">
                                        <td className="p-3 font-mono">{result.apk.name}</td>
                                        <td className="p-3">{result.apk.size}</td>
                                        <td className="p-3 text-right">
                                            <button className="flex items-center gap-1 px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors">
                                                <DownloadIcon />
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                )}
                                {result.aab && (
                                     <tr className="border-t border-gray-700">
                                        <td className="p-3 font-mono">{result.aab.name}</td>
                                        <td className="p-3">{result.aab.size}</td>
                                        <td className="p-3 text-right">
                                            <button className="flex items-center gap-1 px-3 py-1 text-sm bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors">
                                                <DownloadIcon />
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {result.warnings && result.warnings.length > 0 && (
                 <div>
                    <h4 className="font-semibold mb-2 text-yellow-400 flex items-center gap-2"><WarningIcon /> Warnings</h4>
                    <ul className="space-y-2 bg-yellow-900/30 p-4 rounded-md list-disc list-inside">
                        {result.warnings.map((warning, index) => (
                            <li key={index} className="text-yellow-300 text-sm font-mono">{warning}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default BuildResults;
