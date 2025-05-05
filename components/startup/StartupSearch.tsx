"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X, Filter, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Label } from "@/components/ui/label"

interface Tag {
  id: number
  name: string
}

interface StartupSearchProps {
  availableTags: Tag[]
}

export default function StartupSearch({ availableTags }: StartupSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(() => {
    const tagParam = searchParams.get("tags")
    return tagParam ? tagParam.split(",").map(id => parseInt(id, 10)) : []
  })
  const [tagSearchQuery, setTagSearchQuery] = useState("")

  // Get the selected tag objects for displaying tags
  const selectedTags = availableTags.filter(tag => 
    selectedTagIds.includes(tag.id)
  )

  // Filter tags based on search query
  const filteredTags = useMemo(() => {
    if (!tagSearchQuery.trim()) return availableTags
    
    return availableTags.filter(tag => 
      tag.name.toLowerCase().includes(tagSearchQuery.toLowerCase())
    )
  }, [availableTags, tagSearchQuery])

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    // Only add search query if not empty
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim())
    }
    
    // Only add tags if any are selected
    if (selectedTagIds.length > 0) {
      params.set("tags", selectedTagIds.join(","))
    }
    
    // Always reset to page 1 when searching
    params.set("page", "1")
    
    router.push(`/find?${params.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery("")
    setSelectedTagIds([])
    router.push("/find")
  }

  const handleTagToggle = (tagId: number) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const removeTag = (tagId: number) => {
    setSelectedTagIds(prev => prev.filter(id => id !== tagId))
  }

  // Submit on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Поиск по названию стартапа..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 bg-white hover:bg-gray-50 border-gray-200">
                <Filter className="h-4 w-4 text-indigo-500" />
                <span className="text-gray-700">Фильтры</span>
                {selectedTagIds.length > 0 && (
                  <Badge variant="secondary" className="ml-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                    {selectedTagIds.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4 border border-gray-200 shadow-lg" align="end">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-800 pb-2 border-b border-gray-100">Теги</h3>
                
                {/* Tag search input */}
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Поиск тегов..."
                    value={tagSearchQuery}
                    onChange={(e) => setTagSearchQuery(e.target.value)}
                    className="pl-8 text-sm"
                  />
                  <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                  {tagSearchQuery && (
                    <button
                      onClick={() => setTagSearchQuery("")}
                      className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
                
                <div className="max-h-64 overflow-auto pr-2">
                  {filteredTags.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {filteredTags.map(tag => (
                        <div 
                          key={tag.id} 
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                            selectedTagIds.includes(tag.id) 
                              ? 'bg-indigo-50 text-indigo-800' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleTagToggle(tag.id)}
                        >
                          <div 
                            className={`h-4 w-4 rounded flex items-center justify-center border ${
                              selectedTagIds.includes(tag.id)
                                ? 'bg-indigo-600 border-indigo-600' 
                                : 'border-gray-300'
                            }`}
                          >
                            {selectedTagIds.includes(tag.id) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <Label className="cursor-pointer text-sm flex-grow">
                            {tag.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      {tagSearchQuery ? (
                        <>
                          По запросу <span className="font-medium">"{tagSearchQuery}"</span> ничего не найдено
                        </>
                      ) : (
                        <>Нет доступных тегов</>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTagIds([])}
                    className="text-xs text-gray-600 hover:text-gray-900"
                    disabled={selectedTagIds.length === 0}
                  >
                    Очистить все
                  </Button>
                  <Button
                    size="sm" 
                    onClick={() => {
                      handleSearch();
                      document.body.click(); // Close popover
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Применить
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button 
            onClick={handleSearch}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Поиск
          </Button>
        </div>
      </div>

      {/* Display selected tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Badge 
              key={tag.id} 
              variant="secondary"
              className="flex items-center gap-1 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-1"
            >
              {tag.name}
              <button 
                onClick={() => removeTag(tag.id)}
                className="ml-1 hover:bg-indigo-200 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {(selectedTags.length > 0 || searchQuery) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearSearch}
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              Сбросить всё
            </Button>
          )}
        </div>
      )}
    </div>
  )
} 