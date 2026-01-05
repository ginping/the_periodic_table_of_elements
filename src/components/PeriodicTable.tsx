import { useMemo } from "react";
import periodicTableData from "@/assets/PeriodicTableJSON.json";
import { cn } from "@/lib/utils";

interface Element {
  name: string;
  number: number;
  symbol: string;
  xpos: number;
  ypos: number;
  wxpos: number;
  wypos: number;
  category: string;
  group: number;
  period: number;
}

interface PeriodicTableProps {
  className?: string;
}

export function PeriodicTable({ className }: PeriodicTableProps) {
  const { mainElements, lanthanides, actinides } = useMemo(() => {
    const elements = periodicTableData.elements as Element[];

    const main: (Element | null)[][] = Array(7)
      .fill(null)
      .map(() => Array(18).fill(null));

    const lanthanideElements: Element[] = [];
    const actinideElements: Element[] = [];

    elements.forEach((element) => {
      const category = element.category.toLowerCase();
      const isLanthanide = category.includes("lanthanide");
      const isActinide = category.includes("actinide");

      if (isLanthanide && element.number !== 57) {
        lanthanideElements.push(element);
        return;
      }

      if (isActinide && element.number !== 89) {
        actinideElements.push(element);
        return;
      }

      if (element.number === 57 || element.number === 89) {
        if (
          element.wypos >= 1 &&
          element.wypos <= 7 &&
          element.wxpos >= 1 &&
          element.wxpos <= 18
        ) {
          main[element.wypos - 1][element.wxpos - 1] = element;
        }
        return;
      }

      let row = element.period;
      let col = element.group;

      if (row < 1 || row > 7 || col < 1 || col > 18) {
        row = element.ypos;
        col = element.xpos;
      }

      if (row < 1 || row > 7 || col < 1 || col > 18) {
        row = element.wypos;
        col = element.wxpos;
      }

      if (row >= 1 && row <= 7 && col >= 1 && col <= 18) {
        const existingElement = main[row - 1][col - 1];
        if (!existingElement || existingElement.number > element.number) {
          main[row - 1][col - 1] = element;
        }
      }
    });

    lanthanideElements.sort((a, b) => a.number - b.number);
    actinideElements.sort((a, b) => a.number - b.number);

    return {
      mainElements: main,
      lanthanides: lanthanideElements,
      actinides: actinideElements,
    };
  }, []);

  const getElementColor = (element: Element | null): string => {
    if (!element) return "bg-[#f3f4f6]";

    const category = element.category.toLowerCase();

    // 双原子非金属
    if (category.includes("diatomic nonmetal")) {
      return "bg-[#a9d5bf]";
    }

    // 惰性气体
    if (category.includes("noble gas")) {
      return "bg-[#f4d3e7]";
    }

    // 碱金属
    if (category.includes("alkali metal")) {
      return "bg-[#f88479]";
    }

    // 碱土金属
    if (category.includes("alkaline earth metal")) {
      return "bg-[#fbc6a1]";
    }

    // 类金属
    if (category.includes("metalloid")) {
      return "bg-[#61d7a1]";
    }

    // 多原子非金属
    if (category.includes("polyatomic nonmetal")) {
      return "bg-[#a2d4d5]";
    }

    // 后过渡金属
    if (category.includes("post-transition metal")) {
      return "bg-[#8eb2e8]";
    }

    // 过渡金属
    if (category.includes("transition metal")) {
      return "bg-[#e9ff07]";
    }

    // 镧系
    if (category.includes("lanthanide")) {
      return "bg-[#cc9bfb]";
    }

    // 锕系
    if (category.includes("actinide")) {
      return "bg-[#ad87bb]";
    }

    return "bg-[#e5e7eb]";
  };

  const ElementCell = ({ element }: { element: Element | null }) => {
    if (!element) {
      return <div className="w-full aspect-[6/5]" />;
    }

    const nameLength = element.name.length;
    const nameSizeClass =
      nameLength > 18
        ? "text-[6px] md:text-[7px]"
        : nameLength > 14
        ? "text-[7px] md:text-[8px]"
        : nameLength > 10
        ? "text-[8px] md:text-[9px]"
        : "text-[9px] md:text-[10px]";

    return (
      <div
        className={cn(
          "w-full aspect-[6/5] border border-black px-0.5 pt-0.5 pb-0.5",
          "flex flex-col justify-between",
          "hover:scale-[1.03] transition-transform cursor-pointer",
          getElementColor(element)
        )}
        title={element.name}
      >
        <div className="text-[8px] leading-none self-start text-gray-700">
          {element.number}
        </div>
        <div className="flex items-center justify-center my-0.5">
          <span className="text-2xl md:text-3xl font-bold leading-none text-gray-900">
            {element.symbol}
          </span>
        </div>
        <div
          className={cn(
            "h-[14px] flex items-center justify-center text-center text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis",
            nameSizeClass
          )}
        >
          {element.name}
        </div>
      </div>
    );
  };

  return (
    <div
      className={cn(
        "w-full min-h-screen bg-background text-foreground flex justify-center py-4",
        className
      )}
    >
      <div className="w-full max-w-7xl">
        <h1 className="text-3xl font-bold mb-6">
          The Periodic Table of Elements
        </h1>

        <div className="mb-8 px-0.5">
          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
          >
            {mainElements.map((row, rowIndex) =>
              row.map((element, colIndex) => (
                <ElementCell
                  key={`${rowIndex}-${colIndex}`}
                  element={element}
                />
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-0 px-0.5">
          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
          >
            {Array(2)
              .fill(null)
              .map((_, i) => (
                <div
                  key={`lanthanide-empty-${i}`}
                  className="w-full aspect-[6/5]"
                />
              ))}
            {lanthanides.map((element) => (
              <ElementCell key={element.number} element={element} />
            ))}
            <div className="w-full aspect-[6/5]" />
          </div>

          <div
            className="grid gap-0"
            style={{ gridTemplateColumns: "repeat(18, minmax(0, 1fr))" }}
          >
            {Array(2)
              .fill(null)
              .map((_, i) => (
                <div
                  key={`actinide-empty-${i}`}
                  className="w-full aspect-[6/5]"
                />
              ))}
            {actinides.map((element) => (
              <ElementCell key={element.number} element={element} />
            ))}
            <div className="w-full aspect-[6/5]" />
          </div>
        </div>
      </div>
    </div>
  );
}
