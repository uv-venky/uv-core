import type { UIArtifact } from '@/components/chat/artifact';
export declare const initialArtifactData: UIArtifact;
type Selector<T> = (state: UIArtifact) => T;
export declare function useArtifactSelector<Selected>(selector: Selector<Selected>): Selected;
export declare function useArtifact(): {
    artifact: any;
    setArtifact: (updaterFn: UIArtifact | ((currentArtifact: UIArtifact) => UIArtifact)) => void;
    metadata: any;
    setMetadata: any;
};
export {};
//# sourceMappingURL=use-artifact.d.ts.map