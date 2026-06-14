'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Checkbox } from '../components/ui/checkbox';
import { Badge } from '../components/ui/badge';
import { cn } from '../lib/utils';
const ListItem = ({ item, isSelected, onToggle, }) => {
    return (_jsxs("div", { role: "button", className: cn('flex cursor-pointer items-center rounded-lg p-2 text-sm transition-colors hover:bg-accent/50', isSelected && 'bg-accent'), onClick: () => onToggle(item), children: [_jsx(Checkbox, { id: `item-${item.id}`, checked: isSelected, onCheckedChange: () => onToggle(item), className: "mr-2 data-[state=checked]:bg-primary", onClick: (e) => e.stopPropagation() }), _jsx("span", { className: "truncate", children: item.name })] }));
};
const ListContainer = ({ title, items, selectedItemIds, searchTerm, onSearchChange, onToggleItem, filteredItems, }) => {
    return (_jsxs("div", { className: "flex h-full w-full flex-col rounded-xl border bg-card p-4", children: [_jsx("div", { className: "mb-3 flex items-center justify-between", children: _jsxs("h3", { className: "font-medium text-sm", children: [title, ' ', _jsx(Badge, { variant: "secondary", className: "ml-1 font-normal", children: items.length })] }) }), _jsxs("div", { className: "relative mb-3", children: [_jsx("div", { className: "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3", children: _jsx(Search, { className: "h-3.5 w-3.5 text-muted-foreground" }) }), _jsx(Input, { type: "text", className: "h-8 py-1.5 pl-9 text-sm", placeholder: "Search...", value: searchTerm, onChange: (e) => onSearchChange(e.target.value) })] }), _jsxs("div", { className: "flex-grow space-y-0.5 overflow-y-auto", children: [filteredItems.map((item) => (_jsx(ListItem, { item: item, isSelected: selectedItemIds.has(item.id), onToggle: onToggleItem }, item.id))), filteredItems.length === 0 && (_jsx("div", { className: "py-6 text-center text-muted-foreground text-xs", children: "No items found" }))] })] }));
};
export default function TransferList({ availableItems = [], selectedItems = [], onChange }) {
    const [available, setAvailable] = useState(availableItems);
    const [leftSearch, setLeftSearch] = useState('');
    const [rightSearch, setRightSearch] = useState('');
    const [leftSelectedIds, setLeftSelectedIds] = useState(new Set());
    const [rightSelectedIds, setRightSelectedIds] = useState(new Set());
    // Filter items based on search terms
    const filteredAvailableItems = available.filter((item) => item.name.toLowerCase().includes(leftSearch.toLowerCase()));
    const filteredSelectedItems = selectedItems.filter((item) => item.name.toLowerCase().includes(rightSearch.toLowerCase()));
    // Update available items when props change
    useEffect(() => {
        // Filter out items that are already in the selected list
        const selectedIds = new Set(selectedItems.map((item) => item.id));
        const filteredAvailable = availableItems.filter((item) => !selectedIds.has(item.id));
        setAvailable(filteredAvailable);
    }, [availableItems, selectedItems]);
    const handleToggleLeftItem = useCallback((item) => {
        setLeftSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(item.id)) {
                newSet.delete(item.id);
            }
            else {
                newSet.add(item.id);
            }
            return newSet;
        });
    }, []);
    const handleToggleRightItem = useCallback((item) => {
        setRightSelectedIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(item.id)) {
                newSet.delete(item.id);
            }
            else {
                newSet.add(item.id);
            }
            return newSet;
        });
    }, []);
    const moveRight = useCallback(() => {
        if (leftSelectedIds.size === 0)
            return;
        const itemsToMove = available.filter((item) => leftSelectedIds.has(item.id));
        setAvailable((prev) => prev.filter((item) => !leftSelectedIds.has(item.id)));
        setLeftSelectedIds(new Set());
        onChange([...selectedItems, ...itemsToMove]);
    }, [available, leftSelectedIds, selectedItems, onChange]);
    const moveLeft = useCallback(() => {
        if (rightSelectedIds.size === 0)
            return;
        const itemsToMove = selectedItems.filter((item) => rightSelectedIds.has(item.id));
        setAvailable((prev) => [...prev, ...itemsToMove]);
        setRightSelectedIds(new Set());
        onChange(selectedItems.filter((item) => !rightSelectedIds.has(item.id)));
    }, [selectedItems, rightSelectedIds, onChange]);
    const moveAllRight = useCallback(() => {
        // Only move filtered items when search is active
        const itemsToMove = filteredAvailableItems;
        if (itemsToMove.length === 0)
            return;
        setAvailable((prev) => prev.filter((item) => !itemsToMove.some((moveItem) => moveItem.id === item.id)));
        setLeftSelectedIds(new Set());
        onChange([...selectedItems, ...itemsToMove]);
    }, [filteredAvailableItems, selectedItems, onChange]);
    const moveAllLeft = useCallback(() => {
        // Only move filtered items when search is active
        const itemsToMove = filteredSelectedItems;
        if (itemsToMove.length === 0)
            return;
        setAvailable((prev) => [...prev, ...itemsToMove]);
        setRightSelectedIds(new Set());
        onChange(selectedItems.filter((item) => !itemsToMove.some((moveItem) => moveItem.id === item.id)));
    }, [filteredSelectedItems, selectedItems, onChange]);
    return (_jsxs("div", { className: "flex h-[500px] w-full flex-col gap-4 lg:flex-row", children: [_jsx("div", { className: "h-full w-full lg:w-5/12", children: _jsx(ListContainer, { title: "Available Options", items: available, selectedItemIds: leftSelectedIds, searchTerm: leftSearch, onSearchChange: setLeftSearch, onToggleItem: handleToggleLeftItem, filteredItems: filteredAvailableItems }) }), _jsxs("div", { className: "flex items-center justify-center gap-2 py-4 lg:flex-col", children: [_jsxs(Button, { variant: "outline", size: "icon", onClick: moveRight, disabled: leftSelectedIds.size === 0, className: "h-8 w-8", children: [_jsx(ChevronRight, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Move selected to right" })] }), _jsxs(Button, { variant: "outline", size: "icon", onClick: moveAllRight, disabled: filteredAvailableItems.length === 0, className: "h-8 w-8", children: [_jsx(ChevronsRight, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Move all to right" })] }), _jsxs(Button, { variant: "outline", size: "icon", onClick: moveLeft, disabled: rightSelectedIds.size === 0, className: "h-8 w-8", children: [_jsx(ChevronLeft, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Move selected to left" })] }), _jsxs(Button, { variant: "outline", size: "icon", onClick: moveAllLeft, disabled: filteredSelectedItems.length === 0, className: "h-8 w-8", children: [_jsx(ChevronsLeft, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Move all to left" })] })] }), _jsx("div", { className: "h-full w-full lg:w-5/12", children: _jsx(ListContainer, { title: "Selected Options", items: selectedItems, selectedItemIds: rightSelectedIds, searchTerm: rightSearch, onSearchChange: setRightSearch, onToggleItem: handleToggleRightItem, filteredItems: filteredSelectedItems }) })] }));
}
//# sourceMappingURL=transfer-list.js.map