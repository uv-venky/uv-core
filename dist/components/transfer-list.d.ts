type Item = {
    id: string;
    name: string;
};
type TransferListProps = {
    availableItems: Item[];
    selectedItems?: Item[];
    onChange: (selected: Item[]) => void;
};
export default function TransferList({ availableItems, selectedItems, onChange }: TransferListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=transfer-list.d.ts.map