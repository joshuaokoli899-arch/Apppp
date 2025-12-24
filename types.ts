
export type BuildType = 'debug' | 'release';

export interface BuildArtifact {
    name: string;
    size: string;
}

export interface BuildResult {
    success: boolean;
    apk: BuildArtifact | null;
    aab: BuildArtifact | null;
    warnings: string[];
}
