import { CheckoutButton } from '@/components/CheckoutButton';
import { Product } from '@/lib/products';
import { Star, Zap } from 'lucide-react';

interface ProductCardCheckoutProps extends Product {
  variant?: 'default' | 'compact';
}

/**
 * Example component showing how to integrate CheckoutButton into a product card
 * This can be used as a reference for updating your existing ProductCard component
 */
export function ProductCardWithCheckout({
  slug,
  name,
  price,
  originalPrice,
  rating,
  reviews,
  image,
  short,
  variant = 'default',
}: ProductCardCheckoutProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <div className="rounded-lg border border-border bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            -{discount}%
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        {/* Title */}
        <h3 className="font-semibold text-base mb-2 line-clamp-2">{name}</h3>

        {/* Description */}
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{short}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">
            {rating} ({reviews} reviews)
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-gray-900">
              {price.toLocaleString('sv-SE')} kr
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {originalPrice.toLocaleString('sv-SE')} kr
              </span>
            )}
          </div>
        </div>

        {/* Checkout Button */}
        <div className="mt-auto">
          <CheckoutButton
            productSlug={slug}
            productName={name}
            className="w-full"
          >
            <Zap className="mr-2 h-4 w-4" />
            Buy Now
          </CheckoutButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Integration Example for existing ProductCard component:
 * 
 * Replace the existing purchase button in ProductCard.tsx with:
 * 
 * ```tsx
 * import { CheckoutButton } from '@/components/CheckoutButton';
 * 
 * // Inside your ProductCard component:
 * <CheckoutButton
 *   productSlug={product.slug}
 *   productName={product.name}
 *   className="w-full"
 * >
 *   Buy Now - {product.price.toLocaleString('sv-SE')} kr
 * </CheckoutButton>
 * ```
 */
