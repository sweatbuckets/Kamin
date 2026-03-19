import { NextRequest, NextResponse } from "next/server";

import { brandCatalog, type BrandKey } from "@/config/menu-catalog";

export async function GET(request: NextRequest) {
  const brand = request.nextUrl.searchParams.get("brand");

  if (!brand || !(brand in brandCatalog)) {
    return NextResponse.json({ message: "Invalid brand" }, { status: 400 });
  }

  const catalog = brandCatalog[brand as BrandKey];

  return NextResponse.json({
    brand: catalog.name,
    market: catalog.market,
    menus: catalog.menus,
  });
}
