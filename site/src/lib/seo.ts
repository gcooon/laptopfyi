import type { Laptop } from "@/types/laptop";

export interface JsonLdProduct {
  "@context": "https://schema.org";
  "@type": "Product";
  name: string;
  description: string;
  brand: {
    "@type": "Brand";
    name: string;
  };
  image: string;
  offers: {
    "@type": "Offer";
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
    itemCondition: string;
    seller: {
      "@type": "Organization";
      name: string;
    };
    shippingDetails: {
      "@type": "OfferShippingDetails";
      shippingDestination: {
        "@type": "DefinedRegion";
        addressCountry: string;
      };
      deliveryTime: {
        "@type": "ShippingDeliveryTime";
        handlingTime: {
          "@type": "QuantitativeValue";
          minValue: number;
          maxValue: number;
          unitCode: string;
        };
        transitTime: {
          "@type": "QuantitativeValue";
          minValue: number;
          maxValue: number;
          unitCode: string;
        };
      };
    };
    hasMerchantReturnPolicy: {
      "@type": "MerchantReturnPolicy";
      applicableCountry: string;
      returnPolicyCategory: string;
      merchantReturnDays: number;
      returnMethod: string;
      returnFees: string;
    };
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: number;
    reviewCount: number;
    bestRating: number;
    worstRating: number;
  };
}

const DEFAULT_LAPTOP_IMAGE = "https://laptopfyi.com/images/laptop-placeholder.svg";

export function generateProductJsonLd(laptop: Laptop): JsonLdProduct {
  const productUrl = `https://laptopfyi.com/laptops/${laptop.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: laptop.fullName,
    description: laptop.metaDescription,
    brand: {
      "@type": "Brand",
      name: laptop.brand,
    },
    image: laptop.imageUrl || DEFAULT_LAPTOP_IMAGE,
    offers: {
      "@type": "Offer",
      price: laptop.priceKrw,
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock",
      url: laptop.refurlabUrl || productUrl,
      itemCondition: "https://schema.org/UsedCondition",
      seller: {
        "@type": "Organization",
        name: "LaptopFYI",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: {
          "@type": "DefinedRegion",
          addressCountry: "KR",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 3,
            unitCode: "DAY",
          },
          transitTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 5,
            unitCode: "DAY",
          },
        },
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        applicableCountry: "KR",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
  };
}

export interface JsonLdBreadcrumb {
  "@context": "https://schema.org";
  "@type": "BreadcrumbList";
  itemListElement: {
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }[];
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[]
): JsonLdBreadcrumb {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface JsonLdWebSite {
  "@context": "https://schema.org";
  "@type": "WebSite";
  name: string;
  url: string;
  description: string;
  potentialAction: {
    "@type": "SearchAction";
    target: {
      "@type": "EntryPoint";
      urlTemplate: string;
    };
    "query-input": string;
  };
}

export function generateWebSiteJsonLd(): JsonLdWebSite {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LaptopFYI",
    url: "https://laptopfyi.com",
    description:
      "중고 노트북 스펙 비교, 가격 정보, 구매 가이드. 브랜드별, 용도별 최적의 노트북을 찾아보세요.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://laptopfyi.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface JsonLdItemList {
  "@context": "https://schema.org";
  "@type": "ItemList";
  name: string;
  description: string;
  itemListElement: {
    "@type": "ListItem";
    position: number;
    url: string;
    name: string;
  }[];
}

export function generateItemListJsonLd(
  name: string,
  description: string,
  laptops: Laptop[]
): JsonLdItemList {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    itemListElement: laptops.map((laptop, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://laptopfyi.com/laptops/${laptop.slug}`,
      name: laptop.fullName,
    })),
  };
}
