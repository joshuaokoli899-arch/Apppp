
import React from 'react';
import { BuildType } from '../types';

interface BuildOptionsProps {
    buildType: BuildType;
    onBuildTypeChange: (type: BuildType) => void;
}

const BuildOptions: React.FC<BuildOptionsProps> = ({ buildType, onBuildTypeChange }) => {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Build Type</label>
                <div className="grid grid-cols-2 gap-4">
                    <BuildTypeOption
                        label="Debug"
                        value="debug"
                        isSelected={buildType === 'debug'}
                        onSelect={() => onBuildTypeChange('debug')}
                    />
                    <BuildTypeOption
                        label="Release"
                        value="release"
                        isSelected={buildType === 'release'}
                        onSelect={() => onBuildTypeChange('release')}
                    />
                </div>
            </div>
        </div>
    );
};

interface BuildTypeOptionProps {
    label: string;
    value: BuildType;
    isSelected: boolean;
    onSelect: () => void;
}

const BuildTypeOption: React.FC<BuildTypeOptionProps> = ({ label, value, isSelected, onSelect }) => {
    return (
        <label
            className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                isSelected 
                ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg' 
                : 'bg-gray-700 border-gray-600 hover:bg-gray-600 hover:border-gray-500'
            }`}
        >
            <input
                type="radio"
                name="build-type"
                value={value}
                checked={isSelected}
                onChange={onSelect}
                className="sr-only"
            />
            <span className="font-semibold">{label}</span>
        </label>
    );
};


export default BuildOptions;
