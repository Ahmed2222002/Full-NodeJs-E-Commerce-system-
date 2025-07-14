interface IProduct {
  title: string;
  slug: string;
  description: string;
  quntity: number;
  sold: number;
  price: number;
  priceActerDiscount: number;
  colors: string[];
  imageCover: string;
  images: string[];
  category: string;
  subCategory: string | string[];
  brand: string;
  ratingAverage: number;
  ratingQuantity: number;
}

interface IProductFilters {
  category?: string;
  subCategory?: string;
  brand?: string;
  sold?: string;
  price?: {
    $lte?: number;
    $gte?: number;
  };

  ratingsAverage?:{
    $gte?: number,
    $lte?: number
  }
  
}


export { IProduct, IProductFilters };
