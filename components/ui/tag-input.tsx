"use client";

import { useState, useRef, useEffect } from "react";
import { X, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Tag {
  id?: number;
  name: string;
}

interface TagInputProps {
  existingTags: Tag[];
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

export function TagInput({
  existingTags,
  selectedTags,
  onChange,
  disabled = false,
  className,
  placeholder = "Add tags..."
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<Tag[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  // Filter suggestions based on input value
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = existingTags.filter(
        tag => 
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) && 
          !selectedTags.some(selected => selected.name.toLowerCase() === tag.name.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [inputValue, existingTags, selectedTags]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionRef.current && 
        !suggestionRef.current.contains(event.target as Node) && 
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const addTag = (tag: Tag) => {
    // Check if tag already exists in selectedTags
    if (!selectedTags.some(t => t.name.toLowerCase() === tag.name.toLowerCase())) {
      onChange([...selectedTags, tag]);
    }
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const removeTag = (index: number) => {
    onChange(selectedTags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      e.preventDefault();
      
      // Check if the tag already exists in the suggestions
      const existingTag = existingTags.find(
        tag => tag.name.toLowerCase() === inputValue.toLowerCase()
      );
      
      if (existingTag) {
        addTag(existingTag);
      } else {
        // Create a new tag
        addTag({ name: inputValue.trim() });
      }
    } else if (e.key === "Backspace" && !inputValue && selectedTags.length > 0) {
      removeTag(selectedTags.length - 1);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div 
        className={cn(
          "flex flex-wrap gap-2 p-2 border rounded-md min-h-10",
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white cursor-text",
          "focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-1"
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {selectedTags.map((tag, index) => (
          <div 
            key={tag.id || `new-tag-${index}`} 
            className={cn(
              "flex items-center gap-1 px-2 py-1 text-sm rounded-md bg-indigo-100 text-indigo-800",
              tag.id ? "" : "border border-dashed border-indigo-300"
            )}
          >
            {!tag.id && <Plus className="w-3 h-3 text-indigo-500" />}
            {tag.name}
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                className="text-indigo-500 hover:text-indigo-700"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          disabled={disabled}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder={selectedTags.length === 0 ? placeholder : ""}
          className="flex-grow outline-none text-sm bg-transparent min-w-20"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && !disabled && (
        <div
          ref={suggestionRef}
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          <div className="p-2 text-xs text-gray-500 border-b">
            Existing tags (click to select)
          </div>
          {suggestions.map((tag) => (
            <div
              key={tag.id}
              onClick={() => addTag(tag)}
              className="flex items-center justify-between px-3 py-2 hover:bg-indigo-50 cursor-pointer"
            >
              <span>{tag.name}</span>
              <Check className="w-4 h-4 text-indigo-500 opacity-0 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      )}

      {showSuggestions && inputValue.trim() && suggestions.length === 0 && !disabled && (
        <div 
          ref={suggestionRef}
          className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
        >
          <div
            onClick={() => addTag({ name: inputValue.trim() })}
            className="flex items-center gap-2 px-3 py-2 hover:bg-indigo-50 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-indigo-500" />
            <span>Create new tag "{inputValue}"</span>
          </div>
        </div>
      )}
    </div>
  );
} 