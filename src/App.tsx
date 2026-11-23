import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArchiveFilter,
  CATALOG,
  CartEntry,
  GarmentCategory,
  GarmentProduct,
  GarmentSize,
  HERO_LINEUP_IDS,
  LINE_A,
  LINE_B,
  SortMode,
} from "./data/catalog";
import { AnnouncementBars } from "./components/AnnouncementBars";
import { SiteHeader } from "./components/SiteHeader";
import { HeroSplit } from "./components/HeroSplit";
import { ShowroomRail } from "./components/ShowroomRail";
import { CatalogArchive } from "./components/CatalogArchive";
import { EditorialMatrix } from "./components/EditorialMatrix";
import { HowToStyle } from "./components/HowToStyle";
import { ObsidianFooter } from "./components/ObsidianFooter";
import { ProductModal } from "./components/ProductModal";
import { CartDrawer } from "./components/CartDrawer";

export default function App() {
  const [activeCategory, setActiveCategory] = useState<ArchiveFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("featured");
  const [inspected, setInspected] = useState<{
    product: GarmentProduct;
    swatchIndex: number;
  } | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [bag, setBag] = useState<CartEntry[]>(() => [
    { item: CATALOG[1], size: "M", qty: 1 },
  ]);

  const productsById = useMemo(
    () => new Map(CATALOG.map((p) => [p.id, p])),
    []
  );

  const heroLineup = useMemo(
    () =>
      HERO_LINEUP_IDS.map((id) => productsById.get(id)).filter(
        (p): p is GarmentProduct => Boolean(p)
      ),
    [productsById]
  );

  const lineACount = useMemo(
    () => CATALOG.filter((p) => p.brand === LINE_A).length,
    []
  );
  const lineBCount = useMemo(
    () => CATALOG.filter((p) => p.brand === LINE_B).length,
    []
  );
  const totalBagCount = bag.reduce((sum, entry) => sum + entry.qty, 0);
  const upsellProduct = productsById.get("crimson-washed-boxy-tee");

  useEffect(() => {
    const anyModalOpen = Boolean(inspected) || cartOpen;
    document.body.dataset.modalOpen = anyModalOpen ? "true" : "false";
  }, [inspected, cartOpen]);

  const handleInspect = useCallback(
    (product: GarmentProduct, swatchIndex: number) => {
      setInspected({ product, swatchIndex });
    },
    []
  );

  const handleAddToBag = useCallback(
    (product: GarmentProduct, size: GarmentSize) => {
      setBag((prev) => {
        const existingIdx = prev.findIndex(
          (entry) => entry.item.id === product.id && entry.size === size
        );
        if (existingIdx !== -1) {
          return prev.map((entry, idx) =>
            idx === existingIdx ? { ...entry, qty: entry.qty + 1 } : entry
          );
        }
        return [...prev, { item: product, size, qty: 1 }];
      });
      setCartOpen(true);
    },
    []
  );

  const handleRailQuickAdd = useCallback(
    (product: GarmentProduct, size: GarmentSize, _swatchIndex: number) => {
      handleAddToBag(product, size);
    },
    [handleAddToBag]
  );

  const handleUpdateQty = useCallback((index: number, delta: number) => {
    setBag((prev) =>
      prev
        .map((entry, idx) =>
          idx === index ? { ...entry, qty: entry.qty + delta } : entry
        )
        .filter((entry) => entry.qty > 0)
    );
  }, []);

  const handleRemoveItem = useCallback((index: number) => {
    setBag((prev) => prev.filter((_, idx) => idx !== index));
  }, []);

  const handleJumpCategory = useCallback((category: GarmentCategory) => {
    setActiveCategory(category);
    document
      .getElementById("archive-grid")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <>
      <AnnouncementBars />

      <SiteHeader
        totalCount={CATALOG.length}
        lineACount={lineACount}
        lineBCount={lineBCount}
        bagCount={totalBagCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSelectFilter={setActiveCategory}
        onOpenCart={() => setCartOpen(true)}
      />

      <main>
        <HeroSplit
          lineupProducts={heroLineup}
          totalCatalogCount={CATALOG.length}
          onInspect={handleInspect}
        />

        <ShowroomRail
          products={CATALOG}
          onInspect={handleInspect}
          onQuickAdd={handleRailQuickAdd}
        />

        <CatalogArchive
          products={CATALOG}
          activeCategory={activeCategory}
          searchQuery={searchQuery}
          sortMode={sortMode}
          lineACount={lineACount}
          lineBCount={lineBCount}
          onCategoryChange={setActiveCategory}
          onSearchChange={setSearchQuery}
          onSortChange={setSortMode}
          onInspect={handleInspect}
          onQuickAdd={handleAddToBag}
        />

        <EditorialMatrix onJumpCategory={handleJumpCategory} />

        <HowToStyle productsById={productsById} onInspect={handleInspect} />
      </main>

      <ObsidianFooter />

      <ProductModal
        product={inspected?.product ?? null}
        swatchIndex={inspected?.swatchIndex ?? 0}
        onClose={() => setInspected(null)}
        onAddToBag={handleAddToBag}
      />

      <CartDrawer
        open={cartOpen}
        items={bag}
        upsellProduct={upsellProduct}
        onClose={() => setCartOpen(false)}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onAddUpsell={handleAddToBag}
      />
    </>
  );
}
