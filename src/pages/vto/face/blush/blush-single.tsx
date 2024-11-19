import clsx from "clsx";
import { Icons } from "../../../../components/icons";
import { ColorPalette } from "../../../../components/color-palette";
import { filterTexturesByValue } from "../../../../api/attributes/texture";
import { useMakeup } from "../../../../context/makeup-context";
import { useBlushContext } from "./blush-context";
import { Product } from "../../../../api/shared";
import { VTOProductCard } from "../../../../components/vto/vto-product-card";
import { extractUniqueCustomAttributes } from "../../../../utils/apiUtils";

export function SingleBlushSelector({ product }: { product: Product }) {
  return (
    <div className="mx-auto w-full divide-y px-4 lg:max-w-xl">
      <div>
        <ColorSelector product={product} />
      </div>
      <TextureSelector product={product} />
      <ShapeSelector />
      <ShadesSelector />
      <ProductList product={product} />
    </div>
  );
}

function ColorSelector({ product }: { product: Product }) {
  const { selectedColors, setSelectedColors, selectedMode } = useBlushContext();
  const { setBlushColor, setShowBlush, showBlush, setBlushMode } = useMakeup();

  const handleClearSelection = () => {
    if (showBlush) {
      setShowBlush(false);
    }
    setSelectedColors([]);
  };

  const handleColorSelection = (color: string) => {
    if (!showBlush) {
      setShowBlush(true);
    }

    if (selectedColors.includes(color)) {
      const newColors = selectedColors.filter((c) => c !== color);
      setSelectedColors(newColors);
      setBlushColor(newColors);
      return;
    }

    let maxColors = 1;
    if (selectedMode === "Dual") maxColors = 2;
    if (selectedMode === "Tri") maxColors = 3;

    setBlushMode(selectedMode);

    const newColors =
      selectedColors.length < maxColors
        ? [...selectedColors, color]
        : [...selectedColors.slice(1), color];

    setSelectedColors(newColors);
    setBlushColor(newColors);
  };

  const extracted_sub_colors = extractUniqueCustomAttributes(
    [product],
    "hexacode",
  ).flatMap((color) => color.split(","));

  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-4 overflow-x-auto no-scrollbar">
        <button
          type="button"
          className="inline-flex size-10 shrink-0 items-center gap-x-2 rounded-full border border-transparent text-white/80"
          onClick={handleClearSelection}
        >
          <Icons.empty className="size-10" />
        </button>
        {extracted_sub_colors.map((color, index) => (
          <button
            type="button"
            key={index}
            onClick={() => handleColorSelection(color)}
          >
            <ColorPalette
              size="large"
              palette={{ color }}
              selected={selectedColors.includes(color)}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function TextureSelector({ product }: { product: Product }) {
  const { selectedTexture, setSelectedTexture } = useBlushContext();
  const { setBlushMaterial } = useMakeup();

  const productTextures = extractUniqueCustomAttributes([product], "texture");
  const textures = filterTexturesByValue(productTextures);

  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
        {textures.map((texture, index) => (
          <button
            key={texture.value}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center gap-x-2 rounded-full border border-white/80 px-3 py-1 text-white/80",
              {
                "border-white/80 bg-gradient-to-r from-[#CA9C43] to-[#473209]":
                  selectedTexture === texture.value,
              },
            )}
            onClick={() => {
              if (selectedTexture === texture.value) {
                setSelectedTexture(null);
              } else {
                setSelectedTexture(texture.value);
                setBlushMaterial(index);
              }
            }}
          >
            <span className="text-sm">{texture.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

const blushes = [
  "/blushes/blusher-1.png",
  "/blushes/blusher-2.png",
  "/blushes/blusher-3.png",
  "/blushes/blusher-4.png",
  "/blushes/blusher-5.png",
];

function ShapeSelector() {
  const { selectedShape, setSelectedShape } = useBlushContext();
  const { setBlushPattern } = useMakeup();

  return (
    <div className="mx-auto w-full py-4 lg:max-w-xl">
      <div className="flex w-full items-center space-x-4 overflow-x-auto no-scrollbar">
        {blushes.map((path, index) => (
          <button
            key={index}
            type="button"
            className={clsx(
              "inline-flex shrink-0 items-center rounded-sm border border-transparent text-white/80",
              {
                "border-white/80": selectedShape === index.toString(),
              },
            )}
            onClick={() => {
              setBlushPattern(index);
              setSelectedShape(index.toString());
            }}
          >
            <img src={path} alt="Blush shape" className="size-12 rounded" />
          </button>
        ))}
      </div>
    </div>
  );
}

const shades = ["One", "Dual", "Tri"] as const;

function ShadesSelector() {
  const { setSelectedMode, selectedMode, setSelectedColors } =
    useBlushContext();
  const { setBlushMode, blushColor, setBlushColor } = useMakeup();

  function setMode(mode: (typeof shades)[number]) {
    setSelectedMode(mode);
    setBlushMode(mode);
  }

  return (
    <div className="mx-auto w-full py-2 lg:max-w-xl">
      <div className="flex w-full items-center space-x-2 overflow-x-auto no-scrollbar">
        {shades.map((shade) => (
          <button
            key={shade}
            type="button"
            className={clsx(
              "relative inline-flex items-center gap-x-2 rounded-full px-3 py-1 text-center text-sm transition-transform",
              {
                "-translate-y-0.5 text-white": selectedMode === shade,
                "text-white/80": selectedMode !== shade,
              },
            )}
            onClick={() => setMode(shade)}
          >
            {selectedMode === shade ? (
              <div className="absolute inset-0 flex items-center justify-center text-white blur-sm backdrop-blur-sm">
                {shade}
              </div>
            ) : null}
            <span className="relative text-sm">{shade}</span>
          </button>
        ))}
        <div className="h-5 border border-r"></div>
      </div>
    </div>
  );
}

function ProductList({ product }: { product: Product }) {
  return (
    <div className="flex w-full gap-4 overflow-x-auto pb-2 pt-4 no-scrollbar active:cursor-grabbing">
      {[product].map((item) => (
        <VTOProductCard key={item.id} product={item} />
      ))}
    </div>
  );
}