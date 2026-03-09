import { type EquipmentItem } from "@ahmedrioueche/gympro-client";
import { Minus, Package, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Loading from "../../../components/ui/Loading";
import { useInventory } from "../../../hooks/queries/useInventory";
import { cn } from "../../../utils/helper";

interface SelectedEquipment {
  itemId: string;
  quantity: number;
}

interface EquipmentSelectorProps {
  gymId: string;
  selectedItems: SelectedEquipment[];
  onChange: (items: SelectedEquipment[]) => void;
  title?: string;
}

export function EquipmentSelector({
  gymId,
  selectedItems,
  onChange,
  title,
}: EquipmentSelectorProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { data: inventoryResult, isLoading } = useInventory({
    gymId,
    search: searchQuery,
    enabled: isSearching && searchQuery.length > 0,
    limit: 5,
  });

  const searchResults = inventoryResult?.data || [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearching(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddItem = (item: EquipmentItem) => {
    if (selectedItems.some((si) => si.itemId === item._id)) {
      setIsSearching(false);
      setSearchQuery("");
      return;
    }
    onChange([...selectedItems, { itemId: item._id, quantity: 1 }]);
    setIsSearching(false);
    setSearchQuery("");
  };

  const handleRemoveItem = (itemId: string) => {
    onChange(selectedItems.filter((i) => i.itemId !== itemId));
  };

  const updateQuantity = (itemId: string, delta: number) => {
    onChange(
      selectedItems.map((i) => {
        if (i.itemId === itemId) {
          const newQty = Math.max(1, i.quantity + delta);
          return { ...i, quantity: newQty };
        }
        return i;
      }),
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">
          {title || t("inventory.selector.label", "Required Equipment")}
        </label>
        {selectedItems.length > 0 && (
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
            {selectedItems.length} {t("common.items", "Items")}
          </span>
        )}
      </div>

      <div className="relative" ref={searchRef}>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-secondary group-focus-within:text-primary transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            className="w-full bg-surface border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-white/30"
            placeholder={t(
              "inventory.selector.searchPlaceholder",
              "Search equipment to add...",
            )}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearching(true);
            }}
            onFocus={() => setIsSearching(true)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/40 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearching && searchQuery.length >= 1 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-surface-hover backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <Loading />
              </div>
            ) : searchResults.length > 0 ? (
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {searchResults.map((item) => {
                  const isAlreadySelected = selectedItems.some(
                    (si) => si.itemId === item._id,
                  );
                  return (
                    <button
                      key={item._id}
                      onClick={() => handleAddItem(item)}
                      disabled={isAlreadySelected}
                      className={cn(
                        "w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0",
                        isAlreadySelected && "opacity-50 cursor-not-allowed",
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        {item.images?.[0] ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-5 h-5 text-white/20" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-white/60 uppercase tracking-wider truncate">
                          {item.category} • {item.quantity}{" "}
                          {t("common.available")}
                        </p>
                      </div>
                      {isAlreadySelected ? (
                        <span className="text-[10px] font-bold text-white/20 uppercase">
                          {t("common.added")}
                        </span>
                      ) : (
                        <Plus className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Package className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-xs text-white/60 font-medium">
                  {t("inventory.selector.noResults", "No equipment found")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Items List */}
      {selectedItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {selectedItems.map((selected) => {
            // This is a bit inefficient as it would ideally have the item name/image pre-fetched
            // But for simplicity in the selector, we'll try to get it from the search results if available
            // or we'll just show the ID/Placeholder as we'll fetch full details in the detail modal anyway
            // Better approach: Store name/category in local results cache or parent
            const cachedItem = searchResults.find(
              (i) => i._id === selected.itemId,
            );

            return (
              <div
                key={selected.itemId}
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-white/20 group-hover:text-primary transition-colors" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-white/50 uppercase font-bold tracking-widest mb-0.5">
                    Equipment ID
                  </p>
                  <p className="text-sm font-bold text-white truncate">
                    {cachedItem?.name || "Inventory Item"}
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(selected.itemId, -1)}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-bold text-white min-w-[20px] text-center">
                    {selected.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(selected.itemId, 1)}
                    className="p-1 hover:bg-white/10 rounded-md transition-colors text-white/40 hover:text-white"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveItem(selected.itemId)}
                  className="p-2 text-white/20 hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
