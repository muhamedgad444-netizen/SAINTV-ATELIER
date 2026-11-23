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
import { AdminDashboard } from "./components/AdminDashboard";
import { fetchRemoteCatalog } from "./lib/api";

function isAdminLocation(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.location.pathname.replace(/\/+$/, "") === "/admin" ||
    window.location.hash === "#admin"
  );
}

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(isAdminLocation);
  const [products, setProducts] = useState<GarmentProduct[]>(CATALOG);
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

  useEffect(() => {
    let active = true;
    fetchRemoteCatalog().then((loaded) => {
      if (active && loaded && loaded.length > 0) {
        setProducts(loaded);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const syncRoute = () => setIsAdminRoute(isAdminLocation());
    window.addEventListener("popstate", syncRoute);
    window.addEventListener("hashchange", syncRoute);
    return () => {
      window.removeEventListener("popstate", syncRoute);
      window.removeEventListener("hashchange", syncRoute);
    };
  }, []);

  const handleOpenAdmin = useCallback(() => {
    window.history.pushState(null, "", "/admin");
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const handleExitAdmin = useCallback(() => {
    window.history.pushState(null, "", "/");
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  const productsById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products]
  );

  const heroLineup = useMemo(
    () =>
      HERO_LINEUP_IDS.map((id) => productsById.get(id)).filter(
        (p): p is GarmentProduct => Boolean(p)
      ),
    [productsById]
  );

  const lineACount = useMemo(
    () => products.filter((p) => p.brand === LINE_A).length,
    [products]
  );
  const lineBCount = useMemo(
    () => products.filter((p) => p.brand === LINE_B).length,
    [products]
  );
  const totalBagCount = bag.reduce((sum, entry) => sum + entry.qty, 0);
  const upsellProduct = productsById.get("crimson-washed-boxy-tee");

  const searchMatchCount = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((item) => {
      const matchCat =
        activeCategory === "all" ||
        item.brand === activeCategory ||
        item.category === activeCategory;
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.brandLabel.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      return matchCat && matchSearch;
    }).length;
  }, [products, activeCategory, searchQuery]);

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

  const handleClearBag = useCallback(() => {
    setBag([]);
  }, []);

  const handleCloseModal = useCallback(() => {
    setInspected(null);
  }, []);

  const handleCloseCart = useCallback(() => {
    setCartOpen(false);
  }, []);

  const handleJumpCategory = useCallback((category: GarmentCategory) => {
    setActiveCategory(category);
    document
      .getElementById("archive-grid")
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (isAdminRoute) {
    return (
      <AdminDashboard
        products={products}
        onProductsUpdated={setProducts}
        onExitAdmin={handleExitAdmin}
      />
    );
  }

  return (
    <>
      <AnnouncementBars />

      <SiteHeader
        totalCount={products.length}
        lineACount={lineACount}
        lineBCount={lineBCount}
        bagCount={totalBagCount}
        activeCategory={activeCategory}
        searchQuery={searchQuery}
        matchCount={searchMatchCount}
        onSearchChange={setSearchQuery}
        onSelectFilter={setActiveCategory}
        onOpenCart={() => setCartOpen(true)}
      />

      <main>
        <HeroSplit
          lineupProducts={heroLineup}
          totalCatalogCount={products.length}
          onInspect={handleInspect}
        />

        <ShowroomRail
          products={products}
          onInspect={handleInspect}
          onQuickAdd={handleRailQuickAdd}
        />

        <CatalogArchive
          products={products}
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

      <ObsidianFooter onOpenAdmin={handleOpenAdmin} />

      <ProductModal
        product={inspected?.product ?? null}
        swatchIndex={inspected?.swatchIndex ?? 0}
        onClose={handleCloseModal}
        onAddToBag={handleAddToBag}
      />

      <CartDrawer
        open={cartOpen}
        items={bag}
        upsellProduct={upsellProduct}
        onClose={handleCloseCart}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onAddUpsell={handleAddToBag}
        onClearBag={handleClearBag}
      />
    </>
  );
}
