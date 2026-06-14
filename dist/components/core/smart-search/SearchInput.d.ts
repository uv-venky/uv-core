interface Props<T extends object> {
    readOnly?: boolean;
    placeholder?: string;
    stickyFilters?: (keyof T)[];
    excludeStickyFilters?: boolean;
}
export declare function SearchInput<T extends object>(props: Props<T>): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SearchInput.d.ts.map